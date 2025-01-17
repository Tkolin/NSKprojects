<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;

class UpdateBiksFromBikInfo extends Command
{
    protected $signature = 'update:biks-from-bik-info';
    protected $description = 'Обновление базы БИК из XML файла с сайта bik-info.ru';

    public function handle()
    {
        $url = "https://bik-info.ru/base/base.xml";

        try {
            // Загружаем XML файл
            $response = Http::withOptions(['verify' => false])->get($url);

            if (!$response->successful()) {
                $this->error("Ошибка загрузки XML файла: " . $response->status());
                return;
            }

            $xml = simplexml_load_string($response->body());

            if (!$xml) {
                $this->error("Ошибка парсинга XML файла.");
                return;
            }

            $this->info("Обработка данных началась...");

            foreach ($xml->bik as $bik) {
                $data = [
                    'BIK' => (string) $bik['bik'],
                    'correspondent_account' => (string) $bik['ks'],
                    'name' => (string) $bik['name'],
                    'namemini' => (string) $bik['namemini'],
                    'city' => (string) $bik['city'],
                    'address' => (string) $bik['address'],
                    'phone' => (string) $bik['phone'],
                    'okato' => (string) $bik['okato'],
                    'okpo' => (string) $bik['okpo'],
                    'regnum' => (string) $bik['regnum'],
                    'srok' => (string) $bik['srok'],
                    'dateadd' => (string) $bik['dateadd'] ?: null,
                    'datechange' => (string) $bik['datechange'] ?: null,
                    'updated_at' => now(),
                ];

                $existingBik = DB::table('biks')->where('BIK', $data['BIK'])->first();

                if ($existingBik) {
                    // Дополняем недостающие данные
                    $updateData = [];
                    foreach ($data as $key => $value) {
                        if (empty($existingBik->$key) && !empty($value)) {
                            $updateData[$key] = $value;
                        }
                    }

                    if (!empty($updateData)) {
                        DB::table('biks')->where('BIK', $data['BIK'])->update($updateData);
                        $this->info("Дополнены данные для БИК {$data['BIK']}.");
                    } else {
                        $this->info("Данные для БИК {$data['BIK']} уже актуальны.");
                    }
                } else {
                    // Добавляем новую запись
                    $data['created_at'] = now();
                    DB::table('biks')->insert($data);
                    $this->info("Добавлен новый БИК {$data['BIK']}.");
                }
            }

            $this->info("Обработка данных завершена.");
        } catch (\Exception $e) {
            $this->error("Ошибка: {$e->getMessage()}");
        }
    }
}
