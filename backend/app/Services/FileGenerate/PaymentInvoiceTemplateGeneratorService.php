<?php

namespace App\Services\FileGenerate;

use App\Services\MonthEnum;
use App\Services\TranslatorNumberToName;
use PhpOffice\PhpWord\TemplateProcessor;

class PaymentInvoiceTemplateGeneratorService extends DocumentGeneratorService
{


    public function __construct()
    {

        parent::__construct(storage_path('app/templates/PaymentInvoiceTemplate.docx'));
    }

    public function generate(array $data)
    {
        $project = $data["project"];
        $isPrepayment = $data["isPrepayment"];
        if (!$isPrepayment)
            $stageNumber = $data["stageNumber"];

        $myOrg = FormatterService::getMyOrg();
        $translator = new TranslatorNumberToName();

        function padZeros($input, $length) {
            return str_pad((string)$input, $length, '0', STR_PAD_LEFT);
        }

        //TODO: получить дату согласования


        $year = "__";
        $month = "__";
        $monthName = "__";
        $day = "__";

        $projectStage = $isPrepayment ? [
            'price_to_paid' => $project["price"] * ($project["prepayment"] / 100),
            'stage' => ['name' => 'Аванс', 'id' => 0],
            'percent' => $project['prepayment'],
            'number' => ' '
        ] : $project->project_stages->where('number', $stageNumber)->first();

        $myOrgPhone = $myOrg["phone_number"];
        $formattedPhone = preg_replace('/\+(\d{1,2})?(\d{3})(\d{3})(\d{2})(\d{2})/', '+$1 ($2) $3-$4-$5', $myOrgPhone);

        $this->replacements = [
            'project.number' => $project['number'] ?? '(данные отсутствуют)',
            'project.name' => $project['name'] ?? '(данные отсутствуют)',
            'dayCreate' => $day,
            'mountCreate' => $month,
            'mountName' => $monthName,
            'yearCreate' => $year,
            'projectStages.stage.priceTotal' => $project['price'] ?? '(данные отсутствуют)',
            'projectStages.stage.endPriceTotal' => $project['price'] ?? '(данные отсутствуют)',
            'myOrg.director.position' => $myOrg['director']['position']['name'] ?? '(данные отсутствуют)',
            'myOrg.nameOrType' => $myOrg["legal_form"]['name'] . " " . $myOrg['name'],
            'myOrg.director.ShortFullName' => $myOrg['director']['last_name'] . ' ' .
                substr((string)$myOrg['director']['first_name'], 0, 2) . '.' .
                substr((string)$myOrg['director']['patronymic'], 0, 2) . '.',
            'projectOrganization.director.ShortFullName' => isset($project["organization_customer"]['director']) ?
                $project["organization_customer"]['director']['last_name'] . ' ' .
                substr((string)$project["organization_customer"]['director']['first_name'], 0, 2) . '.' .
                substr((string)$project["organization_customer"]['director']['patronymic'], 0, 2) . '.' : '',
            'projectOrganization.nameOrType' => isset($project["organization_customer"]) ?
                $project["organization_customer"]["legal_form"]['name'] . " " . $project["organization_customer"]['name'] :
                "(данные отсутствуют)",
            'projectOrganization.director.position' => $project["organization_customer"]['director']['position']['name'] ?? '(данные отсутствуют)',
            'projectStages.stage.finalPrice' => number_format($projectStage['price_to_paid'], 2, ',', ' ') ?? '(данные отсутствуют)',
            'projectStages.stage.name' => isset($projectStage['stage']) ? ($projectStage['stage']['id'] == 0 ? $projectStage['stage']['name'] : 'Выполнение работ ') : "(данные отсутствуют)",
            'projectStages.stage.percent' => isset($projectStage['stage']) ? ($projectStage['stage']['id'] == 0 ? $projectStage['percent'] . '% ' : '') : "",
            'projectStages.stage.price' => number_format($projectStage['price_to_paid'], 2, ',', ' ') ?? '(данные отсутствуют)',
            'projectStages.stage.endPrice' => number_format($projectStage['price_to_paid'], 2, ',', ' ') ?? '(данные отсутствуют)',
            'projectStages.stage.sumEndPrice' => number_format($projectStage['price_to_paid'], 2, ',', ' ') ?? '(данные отсутствуют)',
            'projectStages.stage.finalPriceToString' => isset($projectStage['price_to_paid']) ? $translator->num2str($projectStage['price_to_paid']) : "___",
            'projectOrganization.INN' => $project["organization_customer"]['INN'] ?? '(данные отсутствуют)',
            'projectOrganization.KPP' => $project["organization_customer"]['KPP'] ?? '(данные отсутствуют)',
            'projectOrganization.address_legal' => $project["organization_customer"]['address_legal'] ?? '(данные отсутствуют)',
            'myOrg.INN' => $myOrg['INN'] ?? '(данные отсутствуют)',
            'myOrg.KPP' => $myOrg['KPP'] ?? '(данные отсутствуют)',
            'myOrg.address_legal' => $myOrg['address_legal'] ?? '(данные отсутствуют)',
            'myOrg.styled_phone' => $formattedPhone ?? '(данные отсутствуют)',
            'myOrg.BIK.bik' => $myOrg['bik']['BIK'] ?? '(данные отсутствуют)',
            'myOrg.BIK.name' => $myOrg['bik']['name'] ?? '(данные отсутствуют)',
            'myOrg.BIK.correspondent_account' => $myOrg['bik']['correspondent_account'] ?? '(данные отсутствуют)',
            'myOrg.payment_account' => $myOrg['payment_account'] ?? '(данные отсутствуют)',
            'pay.numb' => "Д" . padZeros($project["organization_customer"]['id'], 4) . "-" . padZeros($projectStage['id'] ?? $project['id'], 4),
            'date.new' => date('d.m.Y'),
        ];

        $this->replaceValues();

        $fileName = $project['number'] . '_СЧЕТ_НА_ОПЛАТУ' . ($stageNumber ? ("_НОМЕР_" . $stageNumber) : "_АВАНС") . '.docx';
        $this->saveDocument($fileName);
        $storagePath = "/" . $project->path_project_folder . "/Invoices/" . $this->fileName;

        $file = $this->saveFileToProject($storagePath, $this->filePath, $this->fileName);
//        $this->createProjectFile([
//            'project_id' => $project->id,
//            'file_id' => $file->id,
//            'type_id' => "Invoice",
//            'number' => 0,
//            'date_document' => date('Y-m-d'),
//        ]);

        $this->cleanUp($this->templatePath);

        return $file->id;
    }
}
