<?php

namespace App\Services\FileGenerate;

use App\Models\ProjectFile;
use App\Services\NameCaseLib\NCL\NCL;
use App\Services\NameCaseLib\NCLNameCaseRu;
use Exception;

class ProjectContractGeneratorService extends DocumentGeneratorService
{
    protected $isStamp;

    public function __construct($isStamp = false)
    {
        $this->isStamp = $isStamp;
        parent::__construct(storage_path('app/templates/ProjectTemplate' . ($isStamp ? 'Stamp' : '') . '.docx'));
    }

    public function getTypeName($key)
    {
        error_log("log" . $key);
        switch ($key) {
            case "DESIGN_ASSIGNMENT":
                return "Техническое задание";
            case "GEOLOGICAL_ASSIGNEMNT":
                return "Геологическое задание";
            case "TERMS_REFERENCE":
                return "Задание на проектирование";
        }
        return null;
    }
    public function generate(array $data)
    {
        // Проверка, что все ключи существуют
        if (!isset($data['projectData'], $data['dateCreateContract'])) {
            throw new Exception('Не все необходимые данные предоставлены.');
        }


        // Извлечение данных
        $projectData = $data['projectData'];
        $dateCreateContract = $data['dateCreateContract'];
        $contractNumber = $data['contractNumber'];


        //  Добор данных
        $date_create_full = FormatterService::getFullDate($dateCreateContract, true);
        $date_create_short = FormatterService::getShortDate($dateCreateContract);


        $myOrg = FormatterService::getMyOrg();


        $nclNameCaseRu = new NCLNameCaseRu();


        $formattedPhone = preg_replace('/\+(\d{1,2})?(\d{3})(\d{3})(\d{2})(\d{2})/', '+$1 ($2) $3-$4-$5', $myOrg["phone_number"]);


        // Формируем массив для отображения в таблице
        $table = [];
        $irdNumber = 1;
        foreach ($projectData->project_irds as $projectIrd) {
            $table[] = [
                'project_irds.number' => $irdNumber++,
                'project_irds.ird.name' => $projectIrd->ird->name,
            ];
        }
        $this->templateProcessor->cloneRowAndSetValues('project_irds.number', $table);
«${actual_day}» ${month_name_lower}

        // Формируем массив для отображения в таблице
        $tableStage = [];
        $tableStage[] = [
            'projectStages.number' => '',
            "projectStages.stage.name" => 'Аванс ' . $projectData["prepayment"] . "%",
            "projectStages.stage.duration" => '',
            "projectStages.stage.price" => "",
            "projectStages.stage.endPrice" => number_format(($projectData["price"] * $projectData["prepayment"] / 100), 0, ',', ' ') . " р.",
            "projectStages.payDay" => "В течение 5 банковских дней с даты подписания договора",
        ];
        foreach ($projectData->project_stages as $projectStage) {
            $tableStage[] = [
                'projectStages.number' => $projectStage["number"],
                "projectStages.stage.name" => $projectStage["stage"]["name"],
                "projectStages.stage.duration" => $projectStage["duration"],
                "projectStages.stage.price" => number_format($projectStage["price"], 0, ',', ' ') . " р.",
                "projectStages.stage.endPrice" => number_format($projectStage["price_to_paid"], 0, ',', ' ') . " р.",
                "projectStages.payDay" => "В течение 5 банковских дней с даты подписания акта",
            ];
        }
        $this->templateProcessor->cloneRowAndSetValues('projectStages.number', $tableStage);
        if (!isset($projectData["organization_customer"]['director'])) {
            throw new Exception("Ошибка данных заказчика");
        }
        $nclNameCaseRu = new NCLNameCaseRu();
 
        $this->replacements = [
            'year' => date("Y"),
            'date_create_full' => $date_create_full ? mb_strtolower($date_create_full) : null,
            'date_create_short' => $date_create_short ? mb_strtolower($date_create_short) : null,
            'projectStages.stage.priceTotal' => isset($projectData['price']) ? number_format($projectData['price'], 0, ',', ' ') : null,
            'projectStages.stage.endPriceTotal' => isset($projectData['price']) ? number_format($projectData['price'], 0, ',', ' ') : null,
            'projectStages.stage.priceTotalToName' => FormatterService::convertNumbToStringr($projectData['price']) . " р." ?? null,
            'projectStages.stage.endPriceTotalToName' => FormatterService::convertNumbToStringr($projectData['price']) ?? null,
            'myOrg.full_name' => $myOrg['full_name'] ?? null,
            'myOrg.nameOrType' => $myOrg["legal_form"]['name'] . " " . $myOrg['name'] ?? null,
            'myOrg.director.full_name' => $nclNameCaseRu->q($myOrg['director']['last_name'] . ' ' . $myOrg['director']['first_name'] . ' ' . $myOrg['director']['patronymic'], NCL::$VINITELN) ?? '' ?? null,
            'myOrg.director.position.name' => $myOrg['director']['position']['name'] ?? null,
            'project.name' => $projectData['name'] ?? '' ?? null,
            'myOrg.INN' => $myOrg['INN'] ?? null,
            'myOrg.KPP' => $myOrg['KPP'] ?? null,
            'myOrg.address_legal' => $myOrg['address_legal'] ?? null,
            'myOrg.OGRN' => $myOrg['OGRN'] ?? null,
            'myOrg.legal_form' => $myOrg['legal_form']['name'] ?? null,
            'myOrg.email' => $myOrg['email'] ?? null,
            'myOrg.styled_phone' => $formattedPhone ?? null,
            'myOrg.BIK.bik' => $myOrg['bik']['BIK'] ?? null,
            'myOrg.BIK.name' => $myOrg['bik']['name'] ?? null,
            'myOrg.BIK.correspondent_account' => $myOrg['bik']['correspondent_account'] ?? null,
            'myOrg.payment_account' => $myOrg['payment_account'] ?? null,
            'project.avansPecent' => $projectData['prepayment'] ?? null,
            'project.price' => $projectData['price'] ?? null,
            'project.duration' => $projectData['duration'] ?? null,
            'project.number' => $projectData['number'] ?? null,
            "project.typeProject.Specification" => $this->getTypeName($projectData["type_project_document"]["group"]["technical_specification"]) ?? null,
            'projectOrganization.director.full_name' => $nclNameCaseRu->q($projectData["organization_customer"]['director']['last_name'] . ' ' .
                $projectData["organization_customer"]['director']['first_name'] . ' ' .
                $projectData["organization_customer"]['director']['patronymic'] ?? null, NCL::$VINITELN),
            'projectOrganization.director.positionRG' => strtolower($nclNameCaseRu->q($projectData["organization_customer"]['director']['position']['name'] ?? null, NCL::$RODITLN)),
            'projectOrganization.director.position' => $projectData["organization_customer"]['director']['position']['name'] ?? null,
            'projectOrganization.INN' => $projectData["organization_customer"]['INN'] ?? null,
            'projectOrganization.full_name' => $projectData["organization_customer"]['full_name'] ?? null,
            'projectOrganization.nameOrType' => $projectData["organization_customer"]["legal_form"]['name'] . " " . $projectData["organization_customer"]['name'] ?? null,
            'projectOrganization.KPP' => $projectData["organization_customer"]['KPP'] ?? null,
            'projectOrganization.address_legal' => $projectData["organization_customer"]['address_legal'] ?? null,
            'projectOrganization.OGRN' => $projectData["organization_customer"]['OGRN'] ?? '' ?? null,
            'projectOrganization.payment_account' => $projectData["organization_customer"]['payment_account'] ?? null,
            'projectOrganization.BIK.bik' => $projectData["organization_customer"]['bik']['BIK'] ?? null,
            'projectOrganization.BIK.name' => $projectData["organization_customer"]['bik']['name'] ?? null,
            'projectOrganization.BIK.correspondent_account' => $projectData["organization_customer"]['bik']['correspondent_account'] ?? null,
            'projectOrganization.director.ShortFullName' =>
                FormatterService::getFullName(
                    $projectData["organization_customer"]['director']['last_name'] ?? null,
                    $projectData["organization_customer"]['director']['first_name'],
                    $projectData["organization_customer"]['director']['patronymic'],
                    true
                ),
            'myOrg.director.ShortFullName' =>
                FormatterService::getFullName($myOrg['director']['last_name'], $myOrg['director']['first_name'], $myOrg['director']['patronymic'], true),
        ];
        $this->checkReplacements();
        $this->replaceValues();

        //  Сохранение файла
        $this->saveDocument($projectData['number'] . '_ДОГОВОР.docx');
        $storagePath = "/" . $projectData->path_project_folder . "/Договора/" . $this->fileName;

        //  Фиксация в базе
        $file = $this->saveFileToProject($storagePath, $this->filePath, $this->fileName);


        ProjectFile::create([
            'project_id' => $projectData->id,
            'file_id' => $file->id,
            'type' => $this->isStamp ? "CONTRACT_STAMP" : "CONTRACT",
            'number' => $contractNumber,
            'date_document' => $dateCreateContract,
        ]);

        //$this->cleanUp($this->tempFilePath);

        return $file->id;
    }
}
