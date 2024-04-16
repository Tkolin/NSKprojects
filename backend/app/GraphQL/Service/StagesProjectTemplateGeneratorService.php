<?php

namespace App\GraphQL\Service;

use App\GraphQL\Service\NameCaseLib\NCLNameCaseRu;
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
        $templateProcessor = new TemplateProcessor($tempFilePath);
    //    $date = $project["date_create"];

      //  $dateComponents = explode('-', $date);

//        $year = $dateComponents[0];
//        $month = $dateComponents[1];
//        $day = $dateComponents[2];

        $date = $project["date_create"];
        $dateComponents = explode('-', $date);

        $year = $dateComponents[0] ?? "__";
        $month = $dateComponents[1] ? MonthEnum::getMonthRodName($dateComponents[1]) : "__";
        $day = $dateComponents[2] ?? "__";
        $projectStages = $project->project_stages;
        $TranslatorNumberToName = new TranslatorNumberToName();

        // Формируем массив для отображения в таблице
        $table[] =  [
            'projectStages.number' => '',
            "projectStages.stage.name" => 'Аванс',
            "projectStages.stage.duration" => '0',
            "projectStages.stage.price" => number_format(($project["price"] * $project["prepayment"] / 100), 0, ',', ' ')." р.",
            "projectStages.stage.endPrice" => number_format(($project["price"] * $project["prepayment"] / 100), 0, ',', ' ')." р.",
            "projectStages.payDay" =>  "В течение 5 банковских дней с даты подписания договора",
        ];
        $irdNumber = 1;
        # Указываем кодировку.

        header('Content-type: text/html; charset=utf-8');



        foreach ($projectStages as $projectStage) {
            $table[] = [
                'projectStages.number' => $projectStage["number"],
                "projectStages.stage.name" => $projectStage["stage"]["name"],
                "projectStages.stage.duration" => $projectStage["duration"],
                "projectStages.stage.price" => number_format($projectStage["price"], 0, ',', ' ')." р.",
                "projectStages.stage.endPrice" => number_format($projectStage["price_to_paid"], 0, ',', ' ')." р.",
                "projectStages.payDay" =>  "В течение 5 банковских дней с даты подписания акта",
            ];
        }
        $replacements = [
            'project.number' => $project['number'] ?? '(данные отсутвуют)',
            'project.name' => $project['name'] ?? '(данные отсутвуют)',

            'dayCreate' => $day,
            'mountCreate' => $month,
            'yearCreate' => $year,
            //"projectStages.stage.price" => number_format($projectStage["price"], 0, ',', ' ')." р.",

            'projectStages.stage.priceTotal' => number_format($project['price'], 0, ',', ' ')." р." ?? '(данные отсутвуют)',
            'projectStages.stage.endPriceTotal' => number_format($project['price'], 0, ',', ' ')." р." ?? '(данные отсутвуют)',
            'projectStages.stage.priceTotalToName' => $TranslatorNumberToName->num2str($project['price']),
            'projectStages.stage.endPriceTotalToName' => $TranslatorNumberToName->num2str($project['price']),
            'myOrg.director.position' => $myOrg['director']['position']['name'] ?? '(данные отсутвуют)',
            'myOrg.nameOrType' =>$myOrg["legal_form"]['name'] ." ". $myOrg['name']  ,
            'myOrg.director.ShortFullName' => $myOrg['director']['last_name'] . ' ' . substr((string)$myOrg['director']['first_name'], 0,2) . '.' . substr((string)$myOrg['director']['patronymic'], 0,2) . '.',
            'projectOrganization.director.ShortFullName' => isset($project["organization_customer"]['director']) ?
                $project["organization_customer"]['director']['last_name'] . ' ' . substr((string)$project["organization_customer"]['director']['first_name'], 0,2) . '.' . substr((string)$project["organization_customer"]['director']['patronymic'], 0,2) . '.' : '',
            'projectOrganization.nameOrType' =>isset($project["organization_customer"]) ? $project["organization_customer"]["legal_form"]['name'] ." ". $project["organization_customer"]['name'] : "(данные отсутвуют)"  ,
            'projectOrganization.director.position' => $project["organization_customer"]['director']['position']['name'] ?? '(данные отсутвуют)',
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
