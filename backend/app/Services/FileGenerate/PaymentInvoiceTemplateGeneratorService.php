<?php

namespace App\Services\FileGenerate;

use App\Models\ProjectFile;
use Exception;

class PaymentInvoiceTemplateGeneratorService extends DocumentGeneratorService
{


    public function __construct()
    {

        parent::__construct(storage_path('app/templates/PaymentInvoiceTemplate.docx'));
    }

    public function generate(array $data)
    {
        // Проверка, что все ключи существуют
        $isPrepayment = false;
        (isset($data['stageNumber']) && $data['stageNumber'] <= -1 || !isset($data['stageNumber'])) ?
            $isPrepayment = true : $isPrepayment = false;
        error_log($isPrepayment . $data['stageNumber']);

        if ($isPrepayment) {
            if (!isset($data['projectData'])) {
                throw new Exception('Не все необходимые данные предоставлены.');
            }
        } else {
            if (!isset($data['projectData'], $data['dateGenerated'])) {
                throw new Exception('Не все необходимые данные предоставлены.');
            }
        }


        // Извлечение данных
        $projectData = $data['projectData'];
        $stageNumber = !$isPrepayment ? $data['stageNumber'] : null;
        $dateCreated = $data['dateGenerated'];

        // Добор данных
        $myOrg = FormatterService::getMyOrg();
        $date_generated_full = FormatterService::getFullDate($dateCreated, true);
        $date_generated_short = FormatterService::getShortDate($dateCreated);

        $date_create_full = FormatterService::getFullDate($projectData["date_signing"], true);
        $date_create_short = FormatterService::getShortDate($projectData["date_signing"]);

        $projectStage = $isPrepayment ? [
            'price_to_paid' => $projectData["price"] * ($projectData["prepayment"] / 100),
            'stage' => ['name' => 'Аванс', 'id' => 0],
            'percent' => $projectData['prepayment'],
            'number' => ' '
        ] : $projectData->project_stages->where('number', $stageNumber)->first();

        $formattedPhone = FormatterService::formattedPhone($myOrg["phone_number"]);
        $orderNumber = "Д" . FormatterService::formatWithLeadingZeros($projectData["organization_customer"]['id'], 4) . "-" .
            FormatterService::formatWithLeadingZeros($projectStage['id'] ?? $projectData['id'], 4) . rand(100, 999);

        $this->replacements = [
            'project.number' => $projectData['number'] ?? null,
            'project.name' => $projectData['name'] ?? null,
            'date_create_full' => $date_create_full ? mb_strtolower($date_create_full) : null,
            'date_create_short' => $date_create_short ? mb_strtolower($date_create_short) : null,

            'date_generated_full' => $date_generated_full ? mb_strtolower($date_generated_full) : null,
            'date_generated_short' => $date_generated_short ? mb_strtolower($date_generated_short) : null,

            'projectStages.stage.priceTotal' => $projectData['price'] ?? null,
            'projectStages.stage.endPriceTotal' => $projectData['price'] ?? null,
            'myOrg.director.position' => $myOrg['director']['position']['name'] ?? null,
            'myOrg.nameOrType' => $myOrg["legal_form"]['name'] . " " . $myOrg['name'],
            'myOrg.director.ShortFullName' => $myOrg['director']['last_name'] . ' ' .
                substr((string)$myOrg['director']['first_name'], 0, 2) . '.' .
                substr((string)$myOrg['director']['patronymic'], 0, 2) . '.',
            'projectOrganization.director.ShortFullName' => isset($projectData["organization_customer"]['director']) ?
                $projectData["organization_customer"]['director']['last_name'] . ' ' .
                substr((string)$projectData["organization_customer"]['director']['first_name'], 0, 2) . '.' .
                substr((string)$projectData["organization_customer"]['director']['patronymic'], 0, 2) . '.' : '',
            'projectOrganization.nameOrType' => isset($projectData["organization_customer"]) ?
                $projectData["organization_customer"]["legal_form"]['name'] . " " . $projectData["organization_customer"]['name'] :
                "(данные отсутствуют)",
            'projectOrganization.director.position' => $projectData["organization_customer"]['director']['position']['name'] ?? null,
            'projectStages.stage.finalPrice' => number_format($projectStage['price_to_paid'], 2, ',', ' ') ?? null,
            'projectStages.stage.name' => isset($projectStage['stage']) ? ($projectStage['stage']['id'] == 0 ? $projectStage['stage']['name'] : 'Выполнение работ по этапу "' . $projectStage['stage']['name']) . "\" " : null,
            'projectStages.stage.percent' => isset($projectStage['stage']) ? ($projectStage['stage']['id'] == 0 ? $projectStage['percent'] . '% ' : '') : "",
            'projectStages.stage.price' => number_format($projectStage['price_to_paid'], 2, ',', ' ') ?? null,
            'projectStages.stage.endPrice' => number_format($projectStage['price_to_paid'], 2, ',', ' ') ?? null,
            'projectStages.stage.sumEndPrice' => number_format($projectStage['price_to_paid'], 2, ',', ' ') ?? null,
            'projectStages.stage.finalPriceToString' => isset($projectStage['price_to_paid']) ? FormatterService::convertNumbToStringr($projectStage['price_to_paid']) : "___",
            'projectOrganization.INN' => $projectData["organization_customer"]['INN'] ?? null,
            'projectOrganization.KPP' => $projectData["organization_customer"]['KPP'] ?? null,
            'projectOrganization.address_legal' => $projectData["organization_customer"]['address_legal'] ?? null,
            'myOrg.INN' => $myOrg['INN'] ?? null,
            'myOrg.KPP' => $myOrg['KPP'] ?? null,
            'myOrg.address_legal' => $myOrg['address_legal'] ?? null,
            'myOrg.styled_phone' => $formattedPhone ?? null,
            'myOrg.BIK.bik' => $myOrg['bik']['BIK'] ?? null,
            'myOrg.BIK.name' => $myOrg['bik']['name'] ?? null,
            'myOrg.BIK.correspondent_account' => $myOrg['bik']['correspondent_account'] ?? null,
            'myOrg.payment_account' => $myOrg['payment_account'] ?? null,
            'pay.numb' => $orderNumber
        ];
        $this->checkReplacements();
        $this->replaceValues();

        $fileName = $projectData['number'] . '_СЧЕТ_НА_ОПЛАТУ' . ($stageNumber ? ("_НОМЕР_" . $stageNumber) : "_АВАНС") . '.docx';
        $this->saveDocument($fileName);
        $storagePath = "/" . $projectData->path_project_folder . "/Invoices/" . $this->fileName;

        $file = $this->saveFileToProject($storagePath, $this->filePath, $this->fileName);
        ProjectFile::create([
            'project_id' => $projectData->id,
            'file_id' => $file->id,
            'type_id' => "PAYMENT_INVOICE",
            'number' => 0,
            'date_document' => $dateCreated,
        ]);


        return $file->id;
    }
}
