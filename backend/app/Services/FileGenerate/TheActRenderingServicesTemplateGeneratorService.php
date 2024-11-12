<?php

namespace App\Services\FileGenerate;

use App\Models\ProjectFile;
use App\Models\ProjectStage;

class TheActRenderingServicesTemplateGeneratorService extends DocumentGeneratorService
{
    public function __construct()
    {
        $templatePath = storage_path('app/templates/TheActRenderingServicesTemplate.docx');
        parent::__construct($templatePath);
    }

    public function generate(array $data)
    {
        // Проверка, что все ключи существуют
        if (!isset($data['projectData'], $data['stageNumber'], $data['dateCreated'])) {
            throw new Exception('Не все необходимые данные предоставлены.');
        }

        // Извлечение данных
        $projectData = $data['projectData'];
        $stageNumber = $data['stageNumber'];
        $dateCreated = $data['dateCreated'];

        // Добор данных
        $myOrg = FormatterService::getMyOrg();
        $date_generated_full = FormatterService::getFullDate($dateCreated, true);
        $date_generated_short = FormatterService::getShortDate($dateCreated);

        $date_create_full = FormatterService::getFullDate($projectData["date_signing"], true);
        $date_create_short = FormatterService::getShortDate($projectData["date_signing"]);
        $orderNumber = "А" . FormatterService::formatWithLeadingZeros($projectData["organization_customer"]['id'], 4) . "-" .
            FormatterService::formatWithLeadingZeros($projectStage['id'] ?? $projectData['id'], 4)
            . rand(100, 999);

        // Загрузка шаблона в PhpWord

        $projectStage = $projectData->project_stages->where('number', $stageNumber)->first();

        $formattedPhone = preg_replace('/\+(\d{1,2})?(\d{3})(\d{3})(\d{2})(\d{2})/', '+$1 ($2) $3-$4-$5', $myOrg["phone_number"]);

        $this->replacements = [
            'date_create_full' => $date_create_full ? mb_strtolower($date_create_full) : null,
            'date_create_short' => $date_create_short ? mb_strtolower($date_create_short) : null,

            'date_generated_full' => $date_generated_full ? mb_strtolower($date_generated_full) : null,
            'date_generated_short' => $date_generated_short ? mb_strtolower($date_generated_short) : null,

            'project.number' => $projectData['number'] ?? null,
            'project.name' => $projectData['name'] ?? null,
            'projectStages.name' => $projectStage['stage']['name'] ?? null,
            'projectStages.stage.priceTotal' => $projectData['price'] ?? null,
            'projectStages.stage.endPriceTotal' => $projectData['price'] ?? null,
            'por.director.position' => $projectData["organization_customer"]['director']['position']['name'] ?? null,
            'myOrg.director.position' => $myOrg['director']['position']['name'] ?? null,
            'myOrg.nameOrType' => $myOrg["legal_form"]['name'] . " " . $myOrg['name'],
            'myOrg.director.ShortFullName' => FormatterService::getFullName($myOrg['director']['last_name'],
                $myOrg['director']['first_name'],
                $myOrg['director']['patronymic'], true),

            'projectOrganization.director.ShortFullName' => FormatterService::getFullName($projectData["organization_customer"]['director']['last_name'],
                $projectData["organization_customer"]['director']['first_name'],
                $projectData["organization_customer"]['director']['patronymic'], true) ?? null,

            'projectOrganization.nameOrType' => isset($projectData["organization_customer"]) ? $projectData["organization_customer"]["legal_form"]['name'] . " " . $projectData["organization_customer"]['name'] : "(данные отсутвуют)",
            'projectOrganization.director.position' => $projectData["organization_customer"]['director']['position']['name'] ?? null,

            'projectStages.stage.finalPrice' => number_format($projectStage['price'] ?? 0, 2, ',', ' ') ?? null,
            'projectStages.stage.name' => $projectStage['stage']['name'],
            'projectStages.stage.percent' => $projectStage['percent'],

            'projectStages.stage.price' => number_format($projectStage['price'] ?? 0, 2, ',', ' '),
            'projectStages.number' => $projectStage['number'] ?? null,
            'projectStages.stage.endPrice' => number_format($projectStage['price'] ?? 0, 2, ',', ' '),
            'projectStages.stage.sumEndPrice' => number_format($projectStage['price'] ?? 0, 2, ',', ' '),

            'projectOrganization.payment_account' => $projectData["organization_customer"]['payment_account'] ?? null,
            'projectOrganization.BIK.name' => $projectData["organization_customer"]['bik']['name'] ?? null,
            'projectOrganization.BIK.bik' => $projectData["organization_customer"]['bik']['BIK'] ?? null,
            'projectOrganization.BIK.correspondent_account' => $projectData["organization_customer"]['BIK']['correspondent_account'] ?? null,

            'projectOrganization.INN' => $projectData["organization_customer"]['INN'] ?? null,
            'projectOrganization.KPP' => $projectData["organization_customer"]['KPP'] ?? null,
            'projectOrganization.address_legal' => $projectData["organization_customer"]['address_legal'] ?? null,
            'projectStages.stage.finalPriceToString' => isset($projectStage['price']) ? FormatterService::convertNumbToStringr($projectStage['price']) : "",
            'myOrg.INN' => $myOrg['INN'] ?? null,
            'myOrg.KPP' => $myOrg['KPP'] ?? null,
            'myOrg.address_legal' => $myOrg['address_legal'] ?? null,
            'myOrg.styled_phone' => $formattedPhone ?? null,
            'myOrg.BIK.bik' => $myOrg['bik']['BIK'] ?? null,
            'myOrg.BIK.name' => $myOrg['bik']['name'] ?? null,
            'myOrg.BIK.correspondent_account' => $myOrg['BIK']['correspondent_account'] ?? null,
            'myOrg.payment_account' => $myOrg['payment_account'] ?? null,
            'act.numb' => $orderNumber

        ];


        $this->checkReplacements();
        $this->replaceValues();
        //  Сохранение файла
        $this->saveDocument($projectData['number'] . '_АКТ_ВЫПОЛНЕНЫХ_РАБОТ' . ("_НОМЕР_" . $stageNumber) . '.docx');
        $storagePath = "/" . $projectData->path_project_folder . "/ЭТАПЫ/АКТЫ" . $this->fileName;
        //  Фиксация в базе
        $file = $this->saveFileToProject($storagePath, $this->filePath, $this->fileName);


        $projectFile = ProjectFile::create([
            'project_id' => $projectData->id,
            'file_id' => $file->id,
            'type' => "ACT_RENDERING",
            'number' => 0,
            'date_document' => $dateCreated,
            'document_number' => $orderNumber,
        ]);
        ProjectStage::where("project_id","=",$projectData["id"])->where("number", "=", $stageNumber)
        ->update(["work_act_file_id"=> $projectFile->file_id ]) ;
 
        return $file->id;
    }

}
