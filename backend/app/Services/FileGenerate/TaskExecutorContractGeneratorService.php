<?php

namespace App\Services\FileGenerate;

use App\Models\ExecutorOrder;
use App\Models\File;
use App\Models\Organization;
use App\Services\MonthEnum;
use Illuminate\Support\Facades\Storage;
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

    public static function formatWithLeadingZeros(int $number, int $length): string
    {
        return str_pad((string)$number, $length, '0', STR_PAD_LEFT);
    }

    public static function generate($projectData, $personData, $projectTasksData, $numberOrders)
    {
        // Получение данных об организации
        $myOrg = self::getOrganizationData();


        // Получение пути к шаблону документа
        $templateFilePath = storage_path('app/templates/PersonContractToProject.docx');
        $date = date('Y-m-d');
         // Создание временного файла копии шаблона
        $tempFilePath = tempnam(sys_get_temp_dir(), 'contractToProject');
        copy($templateFilePath, $tempFilePath);

        $contractPrice = 0;

        foreach ($projectTasksData as $projectTask) {
                $contractPrice += $projectTask->price;
        }

        // Загрузка шаблона в PhpWord
        $templateProcessor = new TemplateProcessor($tempFilePath);
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
            $projectTasksNames .= " ".$value['task']['name'] . ",";
            $projectTasksToDateEnd .=  " ".$value['task']['name'] . " (начало работ: ".( (new \DateTime($value['date_start']))->format('d.m.Y') ?? "___")." - окончание работ: ". ( (new \DateTime($value['date_end']))->format('d.m.Y') ?? "___"). "),";
            $projectTasksToPrice .= " ".$value['task']['name'] . " (".($value['price'] ?? "-")."),";
            $sumPrice += $value['price'];
        }
        $projectTasksNames = substr($projectTasksNames,0,-1);
        $projectTasksToDateEnd = substr($projectTasksToDateEnd,0,-1);
        $projectTasksToPrice = substr($projectTasksToPrice,0,-1);

        $orderNumber = self::formatWithLeadingZeros($projectData->id, 3) . "-" . self::formatWithLeadingZeros($personData->id, 3) . "-" . "240" . self::formatWithLeadingZeros($numberOrders, 3);
        $replacements = [
            'day' => $day,
            'month' => $month,
            'year' => $year,
            'id' => $orderNumber,

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
            'person.BIK.bik' => isset($personData['BIK']) ? $personData['BIK']['BIK'] : ' ',
            'person.BIK.correspondent_account' => isset($personData['BIK']) ? $personData['BIK']['correspondent_account'] : ' ',
            'person.payment_account' => $personData['payment_account'],
            'myOrg.director.ShortFullName' => $myOrg['director']['last_name'] . ' ' . substr((string)$myOrg['director']['first_name'], 0, 2) . '.' . substr((string)$myOrg['director']['patronymic'], 0, 2) . '.',
            'person.FullName' => $personData['passport']['lastname'] . ' ' . $personData['passport']['firstname'] . ' ' . $personData['passport']['patronymic'],
            'person.ShortFullName' => $personData['passport']['lastname'] . ' ' . substr((string)$personData['passport']['firstname'], 0, 2) . '.' . substr((string)$personData['passport']['patronymic'], 0, 2) . '.',

            'project_tasks.names' => $projectTasksNames,
            'project_tasks.names_to_date_end' => $projectTasksToDateEnd,
            'project_tasks.names_to_price' => $projectTasksToPrice,

            'project.name' => $projectData->name,

            'total_price' => $sumPrice . ".00 руб.",
        ];

        foreach ($replacements as $key => $value) {
            $templateProcessor->setValue($key, $value);
        }

        $fileName = $orderNumber . '_ДОГОВОР_С_ИСПОЛНИТЕЛЕМ' . '.docx'; // 'Договор_с_исполнителем.docx';

        // Сохраняем отредактированный документ
        $filePath = storage_path('app/' . $fileName);
        $templateProcessor->saveAs($filePath);

        // Чтение содержимого файла
        $fileContents = file_get_contents($filePath);

        // Определяем путь к файлу в сетевой папке
        $storagePath = "/" . $projectData->path_project_folder . "/Договора_с_исполнителями/" . $fileName;

        // Помещение файла в сетевую папку
        Storage::disk('localERPFiles')->put($storagePath, $fileContents);

        // Получение размера файла
        $fileSize = filesize($filePath);

        // Определение MIME-типа файла
        $mimeType = mime_content_type($filePath);

        // Создание записи о файле в базе данных
        $file = File::create([
            'name' => $fileName,
            'path' => $storagePath,
            'size' => $fileSize,
            'mime_type' => $mimeType,
        ]);

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
        unlink($filePath);

        return $fileName;
    }


}
