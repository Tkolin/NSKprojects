<?php

namespace App\Services\FileGenerate;

use App\Models\ExecutorOrder;
use App\Services\MonthEnum;
use DateTime;
use Exception;

class TaskExecutorContractGeneratorService extends DocumentGeneratorService
{


    public function __construct($isStamp = false)
    {
        $templatePath = storage_path('app/templates/PersonContractToProject.docx');
        parent::__construct($templatePath);
    }


    public function generate(array $data)
    {
        // Проверка, что все ключи существуют
        if (!isset($data['projectData'], $data['personData'], $data['projectTasksData'], $data['numberOrders'], $data['numberOrders'])) {
            throw new Exception('Не все необходимые данные предоставлены.');
        }
        // Извлечение данных

        $projectData = $data['projectData'];
        $personData = $data['personData'];
        $projectTasksData = $data['projectTasksData'];
        $numberOrders = $data['numberOrders'];
        $dateGenerated = $data['dateGenerated'];

        // Добор данных
        $myOrg = FormatterService::getMyOrg();

        $contractPrice = 0;
        foreach ($projectTasksData as $projectTask) {
            $contractPrice += $projectTask->price;
        }
        // Загрузка шаблона в PhpWord

        $dateComponents = explode('-', $dateGenerated);
        $year = $dateComponents[0] ?? "__";
        $month = $dateComponents[1] ? MonthEnum::getMonthName($dateComponents[1]) : "__";
        $day = $dateComponents[2] ?? "__";


        $projectTasksNames = '';
        $projectTasksToDateEnd = '';
        $projectTasksToPrice = '';
        $sumPrice = 0.0;

        foreach ($projectTasksData as $key => $value) {
            $projectTasksNames .= " " . $value['task']['name'] . ",";
            $projectTasksToDateEnd .= " " . $value['task']['name'] . " (начало работ: " . ((new DateTime($value['date_start']))->format('d.m.Y') ?? "___") . " - окончание работ: " . ((new DateTime($value['date_end']))->format('d.m.Y') ?? "___") . "),";
            $projectTasksToPrice .= " " . $value['task']['name'] . " (" . ($value['price'] ?? "-") . "),";
            $sumPrice += $value['price'];
        }
        $projectTasksNames = substr($projectTasksNames, 0, -1);
        $projectTasksToDateEnd = substr($projectTasksToDateEnd, 0, -1);
        $projectTasksToPrice = substr($projectTasksToPrice, 0, -1);

        $orderNumber = FormatterService::formatWithLeadingZeros($projectData->id, 3) . "-" .
            FormatterService::formatWithLeadingZeros($personData->id, 3) . "-" . "240" .
            FormatterService::formatWithLeadingZeros($numberOrders, 3);

        $this->replacements = [
            'day' => $day,
            'month' => $month,
            'year' => $year,
            'id' => $orderNumber,

            'myOrg.name' => $myOrg['name'] ?? null,
            'myOrg.full_name' => $myOrg['full_name'] ?? null,
            'myOrg.director.FullName' => FormatterService::getFullNameInArray($myOrg['director']) ?? null,
            'myOrg.INN' => $myOrg['INN'] ?? null,
            'myOrg.payment_account' => $myOrg['payment_account'] ?? null,
            'myOrg.BIK.name' => $myOrg['BIK']['name'] ?? null,
            'myOrg.BIK.bik' => $myOrg['BIK']['BIK'] ?? null,
            'myOrg.BIK.correspondent_account' => $myOrg['BIK']['correspondent_account'] ?? null,
            'myOrg.address_legal' => $myOrg['address_legal'] ?? null,
            'myOrg.address_mail' => $myOrg['address_mail'] ?? null,
            'myOrg.office_number_legal' => $myOrg['office_number_legal'] ?? null,
            'myOrg.office_number_mail' => $myOrg['office_number_mail'] ?? null,
            'person.passport.serial' => $personData['passport']['serial'] ?? null,
            'person.passport.number' => $personData['passport']['number'] ?? null,
            'person.passport.date' => $personData['passport']['date'] ?? null,
            'person.passport.birth_date' => $personData['passport']['birth_date'] ?? null,
            'person.passport.passport_place_issue.name' => $personData['passport']['passport_place_issue']['name'] ?? "_____",
            'person.passport.address_registration' => $personData['passport']['address_registration'] ?? "_____",
            'person.INN' => $personData['INN'] ?? null,
            'person.SNILS' => $personData['SHILS'] ?? null,
            'person.BIK.name' => isset($personData['BIK']) ? $personData['BIK']['name'] : null,
            'person.BIK.bik' => isset($personData['BIK']) ? $personData['BIK']['BIK'] : null,
            'person.BIK.correspondent_account' => isset($personData['BIK']) ? $personData['BIK']['correspondent_account'] : null,
            'person.payment_account' => $personData['payment_account'] ?? null,
            'myOrg.director.ShortFullName' => FormatterService::getFullNameInArray($myOrg['director'], true) ?? null,
            'person.FullName' => $personData['passport']['first_name'] ?? null . " " . $personData['passport']['last_name'] ?? null . " " . $personData['passport']['patronymic'] ?? null,
//                FormatterService::getFullNameInArray(
//                ['first_name' => $personData['passport']['first_name'] ?? null,
//                    'last_name'=>$personData['passport']['last_name'] ?? null,
//                    'patronymic'=>$personData['passport']['patronymic'] ?? null]) ?? null,
            'person.ShortFullName' => FormatterService::getFullNameInArray($myOrg['director'], true) ?? null,
            'project_tasks.names' => $projectTasksNames ?? null,
            'project_tasks.names_to_date_end' => $projectTasksToDateEnd ?? null,
            'project_tasks.names_to_price' => $projectTasksToPrice ?? null,

            'project.name' => $projectData->name ?? null,
            'total_price' => $sumPrice ? ($sumPrice . ".00 руб.") : null,
        ];
        $this->checkReplacements();
        $this->replaceValues();

        //  Сохранение файла
        $this->saveDocument($orderNumber . '_ДОГОВОР_С_ИСПОЛНИТЕЛЕМ.docx');
        $storagePath = "/" . $projectData->path_project_folder . "/Договора_с_исполнителями/" . $this->fileName;

        $file = $this->saveFileToExecutorOrder($storagePath, $this->filePath, $this->fileName);

        // Создание записи о заказе в базе данных
        $executorOrder = ExecutorOrder::create([
            'number' => $orderNumber,
            'date_generate' => $dateGenerated,
            'date_order' => $dateGenerated,
            'date_attachment' => $dateGenerated,
            'original_file_id' => $file->id,
        ]);
        $taskIds = $projectTasksData->pluck('id')->toArray();
        $executorOrder->project_tasks()->attach($taskIds);
        // Удаление временного файла
        //unlink($filePath);

        return $this->fileName;
    }


}
