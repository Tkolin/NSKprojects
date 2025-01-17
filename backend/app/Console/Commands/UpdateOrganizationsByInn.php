<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;

class UpdateOrganizationsByInn extends Command
{
    protected $signature = 'update:organizations-by-inn';
    protected $description = 'Обновление данных организаций по ИНН с сайта egrul.itsoft.ru';


    public function handle()
    {
        $organizations = DB::table('organizations')->whereNotNull('INN')->get(['id', 'INN']);

        foreach ($organizations as $organization) {
            $inn = $organization->INN;
            if (!isset($inn))
                continue;
            $url = "https://egrul.itsoft.ru/{$organization->INN}.xml";

            try {
                $response = Http::withOptions(['verify' => false])->get($url);

                if (!$response->successful()) {
                    $this->error("Не удалось загрузить XML для ИНН {$inn}. URL: {$url}");
                    continue;
                }

                $xml = simplexml_load_string($response->body());

                if (!$xml || !isset($xml->СвЮЛ)) {
                    $this->error("Ошибка обработки XML для ИНН {$inn}. Некорректная структура файла.");
                    continue;
                }

                $data = $this->parseXml($xml->СвЮЛ);

                // Найти организацию по ИНН
                $organization = DB::table('organizations')->where('INN', $inn)->first();

                if ($organization) {
                    $this->updateOrganization($organization->id, $data);
                } else {
                    $this->createOrganization($data);
                }

                $this->info("Обработка данных для ИНН {$inn} завершена.");
            } catch (\Exception $e) {
                $this->error("Ошибка при обработке ИНН {$inn}: {$e->getMessage()}");
            }
        }
    }

    /**
     * Извлекает данные из XML
     *
     * @param \SimpleXMLElement $xml
     * @return array
     */
    private function parseXml($xml): array
    {
        return [
            'full_name' => (string) $xml->СвНаимЮЛ->НаимЮЛПолн ?? null,
            'name' => (string) $xml->СвНаимЮЛ->СвНаимЮЛСокр->НаимСокр ?? null,
            'address_legal' => $this->parseAddress($xml->СвАдресЮЛ->СвАдрЮЛФИАС ?? null),
            'OGRN' => (string) $xml['ОГРН'] ?? null,
            'KPP' => (string) $xml['КПП'] ?? null,
            'OKPO' => null, // Если OKPO отсутствует в XML, оставляем пустым
        ];
    }

    /**
     * Форматирует адрес из XML
     *
     * @param \SimpleXMLElement|null $addressXml
     * @return string|null
     */
    private function parseAddress($addressXml): ?string
    {
        if (!$addressXml) {
            return null;
        }

        $addressParts = [];

        if (isset($addressXml->Регион)) {
            $addressParts[] = (string) $addressXml->Регион;
        }

        if (isset($addressXml->НаимРегион)) {
            $addressParts[] = (string) $addressXml->НаимРегион;
        }

        if (isset($addressXml->ЭлУлДорСети['Наим'])) {
            $addressParts[] = (string) $addressXml->ЭлУлДорСети['Тип'] . ' ' . $addressXml->ЭлУлДорСети['Наим'];
        }

        if (isset($addressXml->Здание['Номер'])) {
            $addressParts[] = 'д. ' . (string) $addressXml->Здание['Номер'];
        }

        if (isset($addressXml->ПомещЗдания['Номер'])) {
            $addressParts[] = 'помещ. ' . (string) $addressXml->ПомещЗдания['Номер'];
        }

        return implode(', ', $addressParts);
    }

    /**
     * Обновляет существующую запись организации
     *
     * @param int $organizationId
     * @param array $data
     * @return void
     */
    private function updateOrganization(int $organizationId, array $data): void
    {
        $filteredData = array_filter($data, function ($value) {
            return $value !== null;
        });

        DB::table('organizations')->where('id', $organizationId)->update($filteredData);
        $this->info("Обновлена запись для ID {$organizationId}.");
    }

    /**
     * Создает новую запись организации
     *
     * @param array $data
     * @return void
     */
    private function createOrganization(array $data): void
    {
        DB::table('organizations')->insert($data);
        $this->info("Создана новая запись для организации.");
    }
}
