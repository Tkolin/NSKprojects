<?php

namespace App\Services\FileGenerate;

use App\Models\Organization;
use App\Services\MonthEnum;
use PhpOffice\PhpWord\TemplateProcessor;

class TaskExecutorContractGeneratorService
{
    private static function getOrganizationData()
    {
        return Organization
            ::with('legal_form')
            ->with('employees')
            ->with('bik')
            ->find(0);
    }

    public static function generate($projectData,$personData, $executorId)
    {
        // Получение данных об организации
        $myOrg = self::getOrganizationData();


        // Получение пути к шаблону документа
        $templateFilePath = storage_path('app/templates/PersonContractToProject.docx');
        $date = date('Y-m-d');
        error_log("Сегодняшняя дата: " . $date);
        // Создание временного файла копии шаблона
        $tempFilePath = tempnam(sys_get_temp_dir(), 'contractToProject');
        copy($templateFilePath, $tempFilePath);
//        'task_id',
//        'id',
//        'project_id',
//        'stage_number',
//        'price',
//        'date_start',
//        'date_end',
//        'duration',
//
//        "id",
//        "project_tasks_id",
//        "executor_id",
//        "price"
        $contractPrice = 0;
//        $contractDateStart = new \DateTime();
//        $contractDateEnd = new \DateTime();
        foreach ($projectData->project_tasks as $projectTask) {
            if (isset($projectTask->executors)) {
                foreach ($projectTask->executors as $executorToTask) {
                    if ($executorToTask->executor_id != $executorId)
                        break;

                    $contractPrice += $executorToTask->price;
                }
//                if (isset($projectTask->date_start) && $projectTask->date_start <= $contractDateStart){
//                    $contractDateStart = $projectTask->date_start;
//                }
//                if (isset($projectTask->date_end) && $projectTask->date_end >= $contractDateEnd){
//                    $contractDateEnd = $projectTask->date_end;
//                }
            }
        }
        //$contractDuration = $contractDateEnd->diff($contractDateStart)->days;
        error_log('$personData' . $personData['passport']);

        // Загрузка шаблона в PhpWord
        $templateProcessor = new TemplateProcessor($tempFilePath);
        $id = "___";
        $date = date('Y-m-d');
        error_log("Сегодняшняя дата: " . $date);
//        $date = $project["date_create"];
        $dateComponents = explode('-', $date);
        $year = $dateComponents[0] ?? "__";
        $month = $dateComponents[1] ? MonthEnum::getMonthName($dateComponents[1]) : "__";
        $day = $dateComponents[2] ?? "__";
        $replacements = [
            'id' => $id,
            'day' => $day,
            'month' => $month,
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
            'person.passport.serial' => $personData['passport']['serial'] ?? ' ',
            'person.passport.number' => $personData['passport']['number'] ?? ' ',
            'person.passport.date' => $personData['passport']['date'] ?? ' ',
            'person.passport.birth_date' => $personData['passport']['birth_date'] ?? ' ',
            'person.passport.passport_place_issue.name' => $personData['passport']['passport_place_issue']['name'] ?? ' ',
            'person.passport.address_registration' => $personData['passport']['address_registration'] ?? ' ',
            'person.INN' => $personData['INN'],
            'person.SNILS' => $personData['SHILS'],
            'person.BIK.name' => isset($personData['BIK']) ? $personData['BIK']['name'] : ' ',
            'person.BIK.bik' => isset($personData['BIK'])? $personData['BIK']['BIK']  : ' ',
            'person.BIK.correspondent_account' => isset($personData['BIK']) ? $personData['BIK']['correspondent_account'] : ' ',
            'person.payment_account' => $personData['payment_account'],
            'myOrg.director.ShortFullName' => $myOrg['director']['last_name'] . ' ' . substr((string)$myOrg['director']['first_name'], 0, 2) . '.' . substr((string)$myOrg['director']['patronymic'], 0, 2) . '.',
            'person.FullName' => $personData['passport']['lastname'] . ' ' . $personData['passport']['firstname'] . ' ' . $personData['passport']['patronymic'],
            'person.ShortFullName' => $personData['passport']['lastname'] . ' ' . substr((string)$personData['passport']['firstname'], 0, 2) . '.' . substr((string)$personData['passport']['patronymic'], 0, 2) . '.',

            'contract.price' => $contractPrice,
        ];

        foreach ($replacements as $key => $value) {
            $templateProcessor->setValue($key, $value);
        }

        // Сохранение отредактированного документа
        $fileName = 'Договор_с_исполнителем.docx';
        $filePath = storage_path('app/' . $fileName);
        $templateProcessor->saveAs($filePath);

        // Удаление временного файла
        unlink($tempFilePath);

        return $fileName;
    }


}
