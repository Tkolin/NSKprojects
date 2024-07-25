<?php

namespace App\Services\FileGenerate;

use App\Models\ExecutorOrder;
use App\Models\File;
use App\Models\Organization;
use App\Services\MonthEnum;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use PhpOffice\PhpWord\TemplateProcessor;

class CommercialOfferMessageGeneratorService
{

    public static function formatWithLeadingZeros(int $number, int $length): string
    {
        return str_pad((string)$number, $length, '0', STR_PAD_LEFT);
    }

    public static function generate($projectData, $dateOffer, $delegation)
    {
        // Получение данных об организации
        $myOrg = Organization
            ::with('legal_form')
            ->with('employees')
            ->with('bik')
            ->find(0);;


        // Получение пути к шаблону документа
        $templateFilePath = storage_path('app/templates/MailKPTemplate.docx');

         // Создание временного файла копии шаблона
        $tempFilePath = tempnam(sys_get_temp_dir(), 'contractToProject');
        copy($templateFilePath, $tempFilePath);

        // Загрузка шаблона в PhpWord
        $templateProcessor = new TemplateProcessor($tempFilePath);

        $dateComponents = explode('-', $dateOffer);
        $year = $dateComponents[0] ?? "__";
        $month = $dateComponents[1] ? MonthEnum::getMonthName($dateComponents[1]) : "__";
        $day = $dateComponents[2] ?? "__";

        $stagesNames = '';
        foreach ($projectData->project_stages as $stage) {
            $stagesNames .= $stage->percent . ' (' . $stage->price . ') - ' . $stage->name . ";\t";
        }


        $orderNumber = self::formatWithLeadingZeros($projectData->id, 3) . "-" . self::formatWithLeadingZeros($personData->id, 3) . "-" . "240" . self::formatWithLeadingZeros($numberOrders, 3);
        $replacements = [

            'myOrg.full_adress' => $myOrg['name'],
            'message.full_date' => $myOrg['name'],
            'message.number' => $myOrg['name'],

            'delegate_org.director.positions' => $myOrg['name'],
            'delegate_org.type_org' => $myOrg['name'],
            'delegate_org.name' => $myOrg['name'],

            'project.main_delegation_short_name' =>  $delegation['last_name'] . ' ' .
                substr((string)$delegation['first_name'], 0,2) . '.' . substr((string)$delegation['patronymic'], 0,2) . '.',

            'project.main_delegation_full_name' =>  $delegation['last_name'] . ' ' .
                $delegation['first_name'] . ' ' . $delegation['patronymic'],


            'project.name' => $projectData['name'],
            'project.price' => $projectData['price'],
            'project.price_name' =>в текст $projectData['name'],
            'project.duration' => $projectData['duration'],

            'project.prepayment' =>  $projectData['prepayment'] . ";\t",
            'stages.persent_price_name' => $stagesNames,

            'myOrg.director.position_name' => $myOrg['director']->position->name,
            'myOrg.director.short_fullname' =>  $myOrg['director']['last_name'] . ' ' .
    substr((string)$myOrg['director']['first_name'], 0,2) . '.' . substr((string)$myOrg['director']['patronymic'], 0,2) . '.',


        ];

        foreach ($replacements as $key => $value) {
            $templateProcessor->setValue($key, $value);
        }

        $fileName = Str::random( 30).'_'.$orderNumber . '_КОМЕРЧЕСКОЕ_ПРЕДЛОЖЕНИЕ' . '.docx'; // 'Договор_с_исполнителем.docx';

        // Сохраняем отредактированный документ
        $filePath = storage_path('app/' . $fileName);
        $templateProcessor->saveAs($filePath);
        $storagePath = "/" . $projectData->path_project_folder . "/Договора_с_исполнителями/" . $fileName;
        $file = FileCreateService::saveFileToProject($storagePath, $filePath, $fileName);

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
