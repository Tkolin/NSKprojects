<?php

namespace App\Services\FileGenerate;

use App\Models\Organization;
use App\Services\MonthEnum;
use Icewind\SMB\ServerFactory;
use League\Flysystem\Filesystem;
use League\Flysystem\UnixVisibility\PortableVisibilityConverter;
use League\Flysystem\SMB\SMBAdapter;
use Icewind\SMB\Server;
use Icewind\SMB\BasicAuth;
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
    private static function addLeadingZeros(int $number, int $length)
    {
        return str_pad((string)$number, $length, '0', STR_PAD_LEFT);
    }

    public static function generate($projectData, $personData, $projectTasksData)
    {

        $serverFactory = new ServerFactory();
        $auth = new BasicAuth('sys_LaravelFileManager', 'SIBNIPI', 'NX2AaF&B)8::&nlzc*g7#D9)m0s\e3');
        $server = $serverFactory->createServer('192.168.2.125', $auth);

        // Получение данных об организации
        $myOrg = self::getOrganizationData();


        // Получение пути к шаблону документа
        $templateFilePath = storage_path('app/templates/PersonContractToProject.docx');
        $date = date('Y-m-d');
        error_log("Сегодняшняя дата: " . $date);

        // Создание временного файла копии шаблона
        $tempFilePath = tempnam(sys_get_temp_dir(), 'contractToProject');
        copy($templateFilePath, $tempFilePath);


        // Загрузка шаблона в PhpWord
        $templateProcessor = new TemplateProcessor($tempFilePath);

        error_log($projectData->id.'$projectData');

        // заполнение данных
        $id = self::addLeadingZeros($projectData->id, 3) . '-' . self::addLeadingZeros($personData['id'], 3).'-' . date('ymd');

        $date = date('Y-m-d');
        error_log("Сегодняшняя дата: " . $date);

        $dateComponents = explode('-', $date);
        $year = $dateComponents[0];
        $month = MonthEnum::getMonthName($dateComponents[1]);
        $day = $dateComponents[2];


        $projectTasksNames = '';
        $projectTasksToDateEnd = '';
        $projectTasksToPrice = '';
        $sumPrice = 0.0;

        foreach ($projectTasksData as $key => $value) {
            $projectTasksNames .= " ".$value['task']['name'] . ",";
            $projectTasksToDateEnd .=  " ".$value['task']['name'] . " (".( (new \DateTime($value['date_end']))->format('d.m.Y') ?? "-")."),";
            $projectTasksToPrice .= " ".$value['task']['name'] . " (".($value['price'] ?? "-")."),";
            $sumPrice += $value['price'];
        }
        $projectTasksNames = substr($projectTasksNames,0,-1);
        $projectTasksToDateEnd = substr($projectTasksToDateEnd,0,-1);
        $projectTasksToPrice = substr($projectTasksToPrice,0,-1);
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
            'myOrg.director.ShortFullName' => $myOrg['director']['last_name'] . ' ' . substr((string)$myOrg['director']['first_name'], 0, 2) . '.' . substr((string)$myOrg['director']['patronymic'], 0, 2) . '.',

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
            'person.FullName' => $personData['passport']['lastname'] . ' ' . $personData['passport']['firstname'] . ' ' . $personData['passport']['patronymic'],
            'person.ShortFullName' => $personData['passport']['lastname'] . ' ' . substr((string)$personData['passport']['firstname'], 0, 2) . '.' . substr((string)$personData['passport']['patronymic'], 0, 2) . '.',

            'project_tasks.names' => $projectTasksNames,
            'project_tasks.names_to_date_end' => $projectTasksToDateEnd,
            'project_tasks.names_to_price' => $projectTasksToPrice,


            'total_price' => $sumPrice . ".00 руб.",
        ];

        foreach ($replacements as $key => $value) {
            $templateProcessor->setValue($key, $value);
        }

        foreach ($replacements as $key => $value) {
            $templateProcessor->setValue($key, $value);
        }

        $fileName = 'Договор_с_исполнителем.docx';
        $localFilePath = storage_path('app/' . $fileName);
        $templateProcessor->saveAs($localFilePath);

        // Путь к сетевой папке (UNC path)
        $smbPath = '\\\\192.168.2.125\serverdatа\ERP_FILES' . $fileName;
        if (copy($localFilePath, $smbPath)) {
            // Удаление временного файла
            unlink($localFilePath);

            return response()->json(['message' => 'File saved successfully', 'file_path' => $smbPath]);
        } else {
            throw new \Exception('Error saving file to SMB path.');
        }
    }

}
