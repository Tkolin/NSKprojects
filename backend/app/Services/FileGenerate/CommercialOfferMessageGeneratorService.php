<?php

namespace App\Services\FileGenerate;

use App\Models\ExecutorOrder;
use App\Models\File;
use App\Models\Organization;
use App\Models\ProjectFile;
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

    public static function generate($projectData, $delegation, $dateOffer)
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
        $tempFilePath = tempnam(sys_get_temp_dir(), 'mailKP');
        copy($templateFilePath, $tempFilePath);

        // Загрузка шаблона в PhpWord
        $templateProcessor = new TemplateProcessor($tempFilePath);

        $dateComponents = explode('-', $dateOffer);
        $year = $dateComponents[0] ?? "__";
        $month = $dateComponents[1] ? MonthEnum::getMonthName($dateComponents[1]) : "__";
        $day = $dateComponents[2] ?? "__";

        $stagesNames = $projectData->prepayment .'%'. ' (' . $projectData->price/100*$projectData->prepayment . ' руб.) - ' . 'Аванс' . "; ".'</w:t><w:br/><w:t xml:space="preserve">';
         foreach ($projectData->project_stages as $stage) {
            $stagesNames .= $stage->percent - $stage->percent/100*$projectData->prepayment .'%'. ' (' . $stage->price . ' руб.) - ' . $stage->stage->name . "; ".'</w:t><w:br/><w:t xml:space="preserve">';
        }

        $replacements = [

            'myOrg.full_adress' => $myOrg['name'],
            'message.full_date' => $myOrg['name'],
            'message.number' => $myOrg['name'],

            'delegate_org.director.positions' => $myOrg['name'],
            'delegate_org.type_org' => $myOrg['name'],
            'delegate_org.name' => $myOrg['name'],

            'project.main_delegation_short_name' =>
                (string)$delegation['last_name'] . ' ' .
                substr((string)$delegation['first_name'], 0, 2) . '.'
                . substr((string)$delegation['patronymic'], 0, 2) . '.',

            'project.main_delegation_full_name' => $delegation['last_name'] . ' ' .
                $delegation['first_name'] . ' ' . $delegation['patronymic'],


            'project.name' => $projectData['name'],
            'project.price' => $projectData['price'],
            'project.price_name' => $projectData['name'],
            'project.duration' => $projectData['duration'],
            'pepa' => "pepa",
            'project.prepayment' => $projectData['prepayment'] . ";\t",
            'stages.persent_price_name' => $stagesNames,

            'myOrg.director.position_name' => $myOrg['director']->position->name,
            'myOrg.director.short_fullname' => $myOrg['director']['last_name'] . ' ' .
                substr((string)$myOrg['director']['first_name'], 0, 2) . '.' . substr((string)$myOrg['director']['patronymic'], 0, 2) . '.',


        ];

        foreach ($replacements as $key => $value) {
            $templateProcessor->setValue($key, $value);
        }

        $fileName = Str::random(30) . "_" . $projectData['number'] . '_КОМЕРЧЕСКОЕ_ПРЕДЛОЖЕНИЕ.docx';

        $filePath = storage_path('app/' . $fileName);
        $templateProcessor->saveAs($filePath);

        $storagePath = "/" . $projectData->path_project_folder . "/КП/" . $fileName;
        $file = FileCreateService::saveFileToProject($storagePath, $filePath, $fileName);
        ProjectFile::create([
            'project_id' => $projectData->id,
            'file_id' => $file->id,
            'type_id' => "KP",
            'number' => 0,
            'date_document' => $dateOffer,
        ]);

        unlink($tempFilePath);

        return $file->id;
    }


}
