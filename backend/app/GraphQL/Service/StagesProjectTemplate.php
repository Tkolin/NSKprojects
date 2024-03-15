<?php

namespace App\GraphQL\Service;

use App\Models\Organization;
use App\Models\Person;
use App\Models\TemplateFile;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use PhpOffice\PhpWord\IOFactory;
use PhpOffice\PhpWord\PhpWord;
use PhpOffice\PhpWord\TemplateProcessor;

class StagesProjectTemplate
{
    public static function generate($personData)
    {
        // Получение данных об организации
        $myOrg = GeneratorService::getOrganizationData();
        // Получение пути к шаблону документа
        $templateFilePath = storage_path('app/templates/PersonContract.docx');
        // Создание временного файла копии шаблона
        $tempFilePath = tempnam(sys_get_temp_dir(), 'contract');
        copy($templateFilePath, $tempFilePath);
        // Загрузка шаблона в PhpWord
        $templateProcessor = new TemplateProcessor($tempFilePath);
        $id = "___";
        $day = "__";
        $mount = "__";
        $year = "____";
        $replacements = [
            'id' => $id,
            'day' => $day,
            'mount' => $mount,
            'year' => $year,
            'myOrg.name' => $myOrg['name'],
            'myOrg.full_name' => $myOrg['full_name'],
            'myOrg.director.FullName' => $myOrg['director']['last_name'] . ' ' . $myOrg['director']['first_name'] . ' ' . $myOrg['director']['patronymic'],
            'myOrg.INN' => $myOrg['INN'],
            'myOrg.payment_account' => $myOrg['payment_account'],
            'myOrg.BIK.name' => $myOrg['BIK']['name'],
            'myOrg.BIK.bik' => $myOrg['BIK']['BIK'],
            'myOrg.BIK.correspondent_account' => $myOrg['BIK']['correspondent_account'],
            'myOrg.address_legal' => $myOrg['address_legal'],
            'myOrg.address_mail' => $myOrg['address_mail'],
            'myOrg.office_number_legal' => $myOrg['office_number_legal'],
            'myOrg.office_number_mail' => $myOrg['office_number_mail'],
            'person.passport.serial' => $personData['passport']['serial'],
            'person.passport.number' => $personData['passport']['number'],
            'person.passport.date' => $personData['passport']['date'],
            'person.passport.birth_date' => $personData['passport']['birth_date'],
            'person.passport.passport_place_issue.name' => $personData['passport']['passport_place_issue']['name'],
            'person.passport.address_registration' => $personData['passport']['address_registration'],
            'person.INN' => $personData['INN'],
            'person.SNILS' => $personData['SHILS'],
            'person.BIK.name' => $personData['BIK']['name'],
            'person.BIK.bik' => $personData['BIK']['BIK'],
            'person.BIK.correspondent_account' => $personData['BIK']['correspondent_account'],
            'person.payment_account' => $personData['payment_account'],
            'myOrg.director.ShortFullName' => $myOrg['director']['last_name'] . ' ' . substr((string)$myOrg['director']['first_name'], 0,2) . '.' . substr((string)$myOrg['director']['patronymic'], 0,2) . '.',
            'person.FullName' => $personData['passport']['lastname'] . ' ' . $personData['passport']['firstname'] . ' ' . $personData['passport']['patronymic'],
            'person.ShortFullName' => $personData['passport']['lastname'] . ' ' . substr((string)$personData['passport']['firstname'], 0, 2) . '.' . substr((string)$personData['passport']['patronymic'], 0, 2) . '.'
        ];

        foreach ($replacements as $key => $value) {
            $templateProcessor->setValue($key, $value);
        }

        // Сохранение отредактированного документа
        $fileName = 'contract.docx';
        $filePath = storage_path('app/' . $fileName);
        $templateProcessor->saveAs($filePath);

        // Удаление временного файла
        unlink($tempFilePath);

        return $fileName;
    }




}
