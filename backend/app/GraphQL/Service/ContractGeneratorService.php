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

class ContractGeneratorService
{
    private static  function getOrganizationData()
    {
        return Organization
        ::with('legal_form')
        ->with('contacts')
        ->with('bik')
        ->find(0);
    }

    public static function generateContractPerson($personData)
    {
        // Получение данных об организации
        $myOrg = self::getOrganizationData();


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
        $shortFullNameDirector = $myOrg['director']['last_name'] . ' ' . substr((string)$myOrg['director']['first_name'], 0,2) . '.' . substr((string)$myOrg['director']['patronymic'], 0,2) . '.';
        $shortFullNamePerson = $personData['passport']['lastname'] . ' ' . substr((string)$personData['passport']['firstname'], 0, 2) . '.' . substr((string)$personData['passport']['patronymic'], 0, 2) . '.';
        error_log("fad ". $shortFullNameDirector);
        error_log("per ". $shortFullNamePerson);
        $templateProcessor->setValue('id', $id);
        $templateProcessor->setValue('day', $day);
        $templateProcessor->setValue('mount', $mount);
        $templateProcessor->setValue('year', $year);
        $templateProcessor->setValue('myOrg.name', $myOrg['name']);
        $templateProcessor->setValue('myOrg.full_name', $myOrg['full_name']);
        $templateProcessor->setValue('myOrg.director.FullName', $myOrg['director']['last_name'] . ' ' . $myOrg['director']['first_name'] . ' ' . $myOrg['director']['patronymic']);
        $templateProcessor->setValue('myOrg.INN', $myOrg['INN']);
        $templateProcessor->setValue('myOrg.payment_account', $myOrg['payment_account']);
        $templateProcessor->setValue('myOrg.BIK.name', $myOrg['BIK']['name']);
        $templateProcessor->setValue('myOrg.BIK.bik', $myOrg['BIK']['BIK']);
        $templateProcessor->setValue('myOrg.BIK.correspondent_account', $myOrg['BIK']['correspondent_account']);
        $templateProcessor->setValue('myOrg.address_legal', $myOrg['address_legal']);
        $templateProcessor->setValue('myOrg.address_mail', $myOrg['address_mail']);
        $templateProcessor->setValue('myOrg.office_number_legal', $myOrg['office_number_legal']);
        $templateProcessor->setValue('myOrg.office_number_mail', $myOrg['office_number_mail']);
        $templateProcessor->setValue('person.passport.serial', $personData['passport']['serial']);
        $templateProcessor->setValue('person.passport.number', $personData['passport']['number']);
        $templateProcessor->setValue('person.passport.date', $personData['passport']['date']);
        $templateProcessor->setValue('person.passport.birth_date', $personData['passport']['birth_date']);
        $templateProcessor->setValue('person.passport.passport_place_issue.name', $personData['passport']['passport_place_issue']['name']);
        $templateProcessor->setValue('person.passport.address_registration', $personData['passport']['address_registration']);
        $templateProcessor->setValue('person.INN', $personData['INN']);
        $templateProcessor->setValue('person.SNILS', $personData['SHILS']);
        $templateProcessor->setValue('person.BIK.name', $personData['BIK']['name']);
        $templateProcessor->setValue('person.BIK.bik', $personData['BIK']['BIK']);
        $templateProcessor->setValue('person.BIK.correspondent_account', $personData['BIK']['correspondent_account']);
        $templateProcessor->setValue('person.payment_account', $personData['payment_account']);
        $templateProcessor->setValue('myOrg.director.ShortFullName', $shortFullNameDirector );
        $templateProcessor->setValue('person.FullName', $personData['passport']['lastname'] . ' ' . $personData['passport']['firstname'] . ' ' . $personData['passport']['patronymic']);
        $templateProcessor->setValue('person.ShortFullName', $shortFullNamePerson);


        // Сохранение отредактированного документа
        $fileName = 'contract.docx';
        $filePath = storage_path('app/' . $fileName);
        $templateProcessor->saveAs($filePath);

        // Удаление временного файла
        unlink($tempFilePath);

        return $fileName;
    }




}
