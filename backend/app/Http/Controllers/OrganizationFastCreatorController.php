<?php

namespace App\Http\Controllers;

use App\Models\Contact;
use App\Models\Organization;
use Http;
use Illuminate\Http\Request;

class OrganizationFastCreatorController extends Controller
{
    public function createByInn($inn)
    {
        // Проверка ИНН в базе
        $existingOrg = Organization::where('INN', $inn)->first();
        if ($existingOrg) {
            return response()->json(['message' => 'Organization already exists', 'organization' => $existingOrg], 200);
        }

        // Запрос внешнего API
        $url = "https://egrul.itsoft.ru/{$inn}.json";
        $response = Http::withOptions(['verify' => false])->get($url);

        if ($response->failed()) {
            return response()->json(['message' => 'Failed to fetch data from external API'], 500);
        }

        $data = $response->json();

        // Парсинг данных организации
        $orgData = $data['СвЮЛ']['СвНаимЮЛ']['@attributes'] ?? [];
        $attributes = $data['СвЮЛ']['@attributes'] ?? [];
        $addressLegal = $data['СвЮЛ']['СвАдресЮЛ']['АдресРФ']['@attributes'] ?? [];
        $opfMapping = [
            '50102' => 1, // ИП
            '12300' => 2, // ООО
            '12200' => 3, // АО
            '20102' => 4, // ПАО
            '70000' => 5, // НКО
            '80000' => 6, // ОП
            '99000' => 7, // Иная
        ];

        // Формирование данных для организации
        $organizationData = [
            'legal_form_id' => $opfMapping[$attributes['КодОПФ']] ?? 7,
            'name' => $orgData['НаимЮЛПолн'] ?? 'Неизвестно',
            'full_name' => $orgData['НаимЮЛПолн'] ?? 'Неизвестно',
            'office_number_legal' => null,
            'office_number_mail' => null,
            'phone_number' => null,
            'fax_number' => null,
            'email' => null,
            'INN' => $attributes['ИНН'] ?? null,
            'OGRN' => $attributes['ОГРН'] ?? null,
            'OKPO' => $attributes['КПП'] ?? null,
            'KPP' => $attributes['КПП'] ?? null,
            'BIK_id' => null,
            'payment_account' => null,
            'director_id' => null,
            'address_legal' => implode(', ', $addressLegal),
            'address_mail' => implode(', ', $addressLegal),
        ];

        // Создание записи организации
        $organization = Organization::create($organizationData);

        // Проверка наличия данных директора
        if (!empty($data['СвЮЛ']['СведДолжнФЛ'][0]['СвФЛ']['@attributes'])) {
            $directorData = $data['СвЮЛ']['СведДолжнФЛ'][0]['СвФЛ']['@attributes'];

            // Поиск или создание директора
            $director = Contact::firstOrCreate(
                [
                    'first_name' => $directorData['Имя'],
                    'last_name' => $directorData['Фамилия'],
                    'patronymic' => $directorData['Отчество'] ?? null,
                ],
                [
                    'organization_id' => $organization->id,
                    'position_id' => 12,
                    'email' => null,
                    'mobile_phone' => null,
                    'work_phone' => null,
                ]
            );

            // Привязка директора к организации
            $organization->update(['director_id' => $director->id]);
        }

        return response()->json([
            'message' => 'Organization created',
            'organization' => $organization,
            'director' => $director ?? null,
        ], 201);
    }

}
