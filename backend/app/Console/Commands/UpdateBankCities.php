<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Cache;

class UpdateBankCities extends Command
{
    protected $signature = 'update:bank-cities';
    protected $description = 'Обновляет города для банков на основе БИК через Dadata API';

    private $apiKey;
    private $url;

    public function __construct()
    {
        parent::__construct();
        $this->apiKey = env('DADATA_API_KEY');
        $this->url = "https://suggestions.dadata.ru/suggestions/api/4_1/rs/findById/bank";
    }

    public function handle()
    {
        if (!$this->apiKey) {
            $this->error("DADATA_API_KEY не настроен в .env");
            return;
        }

        // Проверка количества запросов в день
        $dailyRequests = Cache::get('dadata_daily_requests', 0);
        $maxRequestsPerDay = 5000; // Настроить в соответствии с вашим тарифным планом

        if ($dailyRequests >= $maxRequestsPerDay) {
            $this->error("Достигнут лимит запросов в день: {$dailyRequests}/{$maxRequestsPerDay}");
            return;
        }

        // Получаем записи из базы
        $banks = DB::table('biks')->whereNull('city')->get(); // Обновляем 

        foreach ($banks as $bank) {
            try {
                // Ограничение длины query
                $query = substr($bank->BIK, 0, 300);

                // Выполняем запрос к Dadata API
                $response = Http::withOptions(['verify' => false])
                    ->withHeaders([
                        'Content-Type' => 'application/json',
                        'Accept' => 'application/json',
                        'Authorization' => "Token {$this->apiKey}",
                    ])->post($this->url, [
                            'query' => $query,
                        ]);

                // Проверка успешности ответа
                if ($response->successful()) {
                    $result = $response->json();

                    if (!empty($result['suggestions'][0]['data']['address']['data']['city'])) {
                        $city = $result['suggestions'][0]['data']['address']['data']['city'];

                        // Обновляем запись в базе данных
                        DB::table('biks')->where('id', $bank->id)->update(['city' => $city]);
                        $this->info("Обновлен город для БИК {$bank->BIK}: {$city}");
                    } else {
                        $this->warn("Город не найден для БИК {$bank->BIK}");
                    }
                } else {
                    $this->error("Ошибка запроса к Dadata для БИК {$bank->BIK}: " . $response->body());
                }

                // Увеличиваем счетчик запросов
                $dailyRequests++;
                Cache::put('dadata_daily_requests', $dailyRequests, now()->addDay());

                // Задержка между запросами
                usleep(1000000 / 30); // 30 запросов в секунду
            } catch (\Exception $e) {
                $this->warn("Ошибка при обработке БИК {$bank->BIK}: {$e->getMessage()} (игнорируется)");
            }
        }

        $this->info("Обновление городов завершено. Использовано запросов сегодня: {$dailyRequests}/{$maxRequestsPerDay}");
    }
}
