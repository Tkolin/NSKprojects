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

class StagesProjectTemplateGeneratorService
{

    public static function generate($project)
    {
        // Получение данных об организации
        $myOrg = GeneratorService::getOrganizationData();
        // Получение пути к шаблону документа


        $templateFilePath = storage_path('app/templates/StagesProjectTemplate.docx');
        // Создание временного файла копии шаблона
        $tempFilePath = tempnam(sys_get_temp_dir(), 'lolp');
        copy($templateFilePath, $tempFilePath);
        // Загрузка шаблона в PhpWord
        error_log("Этапы");
        $templateProcessor = new TemplateProcessor($tempFilePath);
    //    $date = $project["date_create"];

      //  $dateComponents = explode('-', $date);

//        $year = $dateComponents[0];
//        $month = $dateComponents[1];
//        $day = $dateComponents[2];

        $date = $project["date_create"];
        $dateComponents = explode('-', $date);

        $year = $dateComponents[0] ?? "__";
        $month = $dateComponents[1] ? MonthEnum::getMonthName($dateComponents[1]) : "__";
        $day = $dateComponents[2] ?? "__";
        $projectStages = $project->project_stages;

        // Формируем массив для отображения в таблице
        $table = [];
        $irdNumber = 1;
        error_log("fadf ". $projectStages);

        //TODO: Ошибка мол пустое
        foreach ($projectStages as $projectStage) {
            $table[] = [
                'projectStages.number' => $projectStage["number"],
                "projectStages.stage.name" => $projectStage["stage"]["name"],
                "projectStages.stage.duration" => $projectStage["duration"],
                "projectStages.stage.price" => $projectStage["price"]."р.",
                "projectStages.stage.endPrice" => $projectStage["price"]."р.",
                "projectStages.payDay" =>  "В течение 5 банковских дней с даты подписания договора",

            ];
        }
        $replacements = [
            'project.number' => $project['number'] ?? '(данные отсутвуют)',
            'project.name' => $project['name'] ?? '(данные отсутвуют)',


            'dayCreate' => $day,
            'mountCreate' => $month,
            'yearCreate' => $year,
            'projectStages.stage.priceTotal' => $project['price'] ?? '(данные отсутвуют)',
            'projectStages.stage.endPriceTotal' => $project['price'] ?? '(данные отсутвуют)',

            'myOrg.director.position' => $myOrg['director']['position']['name'] ?? '(данные отсутвуют)',
            'myOrg.nameOrType' =>$myOrg["legal_form"]['name'] ." ". $myOrg['name']  ,
            'myOrg.director.ShortFullName' => $myOrg['director']['last_name'] . ' ' . substr((string)$myOrg['director']['first_name'], 0,2) . '.' . substr((string)$myOrg['director']['patronymic'], 0,2) . '.',
            'projectOrganization.director.ShortFullName' => isset($project["organization_customer"]['director']) ?
                $project["organization_customer"]['director']['last_name'] . ' ' . substr((string)$project["organization_customer"]['director']['first_name'], 0,2) . '.' . substr((string)$project["organization_customer"]['director']['patronymic'], 0,2) . '.' : '',
            'projectOrganization.nameOrType' =>isset($project["organization_customer"]) ? $project["organization_customer"]["legal_form"]['name'] ." ". $project["organization_customer"]['name'] : "(данные отсутвуют)"  ,
            'projectOrganization.director.position' => $project["organization_customer"]['director']['position']['name'] ?? '(данные отсутвуют)',
//=======
//        $templateFilePath = storage_path('app/templates/PersonContract.docx');
//        // Создание временного файла копии шаблона
//        $tempFilePath = tempnam(sys_get_temp_dir(), 'contract');
//        copy($templateFilePath, $tempFilePath);
//        // Загрузка шаблона в PhpWord
//        $templateProcessor = new TemplateProcessor($tempFilePath);
//        $id = "___";
//        $day = "__";
//        $mount = "__";
//        $year = "____";
//        $replacements = [
//            'id' => $id,
//            'day' => $day,
//            'mount' => $mount,
//            'year' => $year,
//            'myOrg.name' => $myOrg['name'],
//            'myOrg.full_name' => $myOrg['full_name'],
//            'myOrg.director.FullName' => $myOrg['director']['last_name'] . ' ' . $myOrg['director']['first_name'] . ' ' . $myOrg['director']['patronymic'],
//            'myOrg.INN' => $myOrg['INN'],
//            'myOrg.payment_account' => $myOrg['payment_account'],
//            'myOrg.BIK.name' => $myOrg['BIK']['name'],
//            'myOrg.BIK.bik' => $myOrg['BIK']['BIK'],
//            'myOrg.BIK.correspondent_account' => $myOrg['BIK']['correspondent_account'],
//            'myOrg.address_legal' => $myOrg['address_legal'],
//            'myOrg.address_mail' => $myOrg['address_mail'],
//            'myOrg.office_number_legal' => $myOrg['office_number_legal'],
//            'myOrg.office_number_mail' => $myOrg['office_number_mail'],
//            'person.passport.serial' => $personData['passport']['serial'],
//            'person.passport.number' => $personData['passport']['number'],
//            'person.passport.date' => $personData['passport']['date'],
//            'person.passport.birth_date' => $personData['passport']['birth_date'],
//            'person.passport.passport_place_issue.name' => $personData['passport']['passport_place_issue']['name'],
//            'person.passport.address_registration' => $personData['passport']['address_registration'],
//            'person.INN' => $personData['INN'],
//            'person.SNILS' => $personData['SHILS'],
//            'person.BIK.name' => $personData['BIK']['name'],
//            'person.BIK.bik' => $personData['BIK']['BIK'],
//            'person.BIK.correspondent_account' => $personData['BIK']['correspondent_account'],
//            'person.payment_account' => $personData['payment_account'],
//            'myOrg.director.ShortFullName' => $myOrg['director']['last_name'] . ' ' . substr((string)$myOrg['director']['first_name'], 0,2) . '.' . substr((string)$myOrg['director']['patronymic'], 0,2) . '.',
//            'person.FullName' => $personData['passport']['lastname'] . ' ' . $personData['passport']['firstname'] . ' ' . $personData['passport']['patronymic'],
//            'person.ShortFullName' => $personData['passport']['lastname'] . ' ' . substr((string)$personData['passport']['firstname'], 0, 2) . '.' . substr((string)$personData['passport']['patronymic'], 0, 2) . '.'
//>>>>>>> origin/master
        ];

        foreach ($replacements as $key => $value) {
            $templateProcessor->setValue($key, $value);
        }

        $templateProcessor->cloneRowAndSetValues('projectStages.number' , $table);
        // Сохранение отредактированного документа
        $fileName = 'График_работ.docx';



        $filePath = storage_path('app/' . $fileName);
        $templateProcessor->saveAs($filePath);

        // Удаление временного файла
        unlink($tempFilePath);

        return $fileName;
    }




}
