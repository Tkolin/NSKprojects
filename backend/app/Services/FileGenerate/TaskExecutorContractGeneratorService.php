<?php

namespace App\Services\FileGenerate;

use App\Models\ExecutorOrder;
use App\Models\File;
use App\Models\Organization;
use App\Services\MonthEnum;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use PhpOffice\PhpWord\TemplateProcessor;

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
        if (!isset($data['projectData'], $data['personData'], $data['projectTasksData'], $data['numberOrders'])) {
            throw new \Exception('Не все необходимые данные предоставлены.');
        }
        // Извлечение данных

        $projectData = $data['projectData'];
        $personData = $data['personData'];
        $projectTasksData = $data['projectTasksData'];
        $numberOrders = $data['numberOrders'];

        // Добор данных
        $myOrg = FormatterService::getMyOrg();

        $contractPrice = 0;
        foreach ($projectTasksData as $projectTask) {
            $contractPrice += $projectTask->price;
        }

        // Загрузка шаблона в PhpWord
        $date = date('Y-m-d');

        $dateComponents = explode('-', $date);
        $year = $dateComponents[0] ?? "__";
        $month = $dateComponents[1] ? MonthEnum::getMonthName($dateComponents[1]) : "__";
        $day = $dateComponents[2] ?? "__";


        $projectTasksNames = '';
        $projectTasksToDateEnd = '';
        $projectTasksToPrice = '';
        $sumPrice = 0.0;

        foreach ($projectTasksData as $key => $value) {
            $projectTasksNames .= " " . $value['task']['name'] . ",";
            $projectTasksToDateEnd .= " " . $value['task']['name'] . " (начало работ: " . ((new \DateTime($value['date_start']))->format('d.m.Y') ?? "___") . " - окончание работ: " . ((new \DateTime($value['date_end']))->format('d.m.Y') ?? "___") . "),";
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

            'myOrg.name' => $myOrg['name'],
            'myOrg.full_name' => $myOrg['full_name'],
            'myOrg.director.FullName' => FormatterService::getFullNameInArray($myOrg['director']),
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
            'person.passport.birth_date' => $personData['passport']['birth_date'] ?? null,
            'person.passport.passport_place_issue.name' => $personData['passport']['passport_place_issue']['name'],
            'person.passport.address_registration' => $personData['passport']['address_registration'] ?? null,
            'person.INN' => $personData['INN'],
            'person.SNILS' => $personData['SHILS'],
            'person.BIK.name' => isset($personData['BIK']) ? $personData['BIK']['name'] : null,
            'person.BIK.bik' => isset($personData['BIK']) ? $personData['BIK']['BIK'] : null,
            'person.BIK.correspondent_account' => isset($personData['BIK']) ? $personData['BIK']['correspondent_account'] : ' ',
            'person.payment_account' => $personData['payment_account'],
            'myOrg.director.ShortFullName' => FormatterService::getFullNameInArray($myOrg['director'], true),
            'person.FullName' => FormatterService::getFullNameInArray($personData['passport']),
            'person.ShortFullName' => FormatterService::getFullNameInArray($myOrg['director'], true),
            'project_tasks.names' => $projectTasksNames,
            'project_tasks.names_to_date_end' => $projectTasksToDateEnd,
            'project_tasks.names_to_price' => $projectTasksToPrice,

            'project.name' => $projectData->name,

            'total_price' => $sumPrice . ".00 руб.",
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
            'date_generate' => $date,
            'date_order' => $date,
            'date_attachment' => $date,
            'original_file_id' => $file->id,
        ]);
        $taskIds = $projectTasksData->pluck('id')->toArray();
        $executorOrder->project_tasks()->attach($taskIds);
        // Удаление временного файла
        //unlink($filePath);

        return $this->fileName;
    }


}
