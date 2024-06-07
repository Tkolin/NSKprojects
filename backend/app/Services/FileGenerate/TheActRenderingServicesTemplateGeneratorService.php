<?php

namespace App\Services\FileGenerate;

use App\Services\FileGenerate\GeneratorService;
use App\Services\MonthEnum;
use App\Services\TranslatorNumberToName;
use PhpOffice\PhpWord\TemplateProcessor;

class TheActRenderingServicesTemplateGeneratorService
{

    public static function generate($project, $stageNumber)
    {
        $myOrg = GeneratorService::getOrganizationData();

        $templateFilePath = storage_path('app/templates/TheActRenderingServicesTemplate.docx');
        $tempFilePath = tempnam(sys_get_temp_dir(), 'lolp');
        copy($templateFilePath, $tempFilePath);
        $templateProcessor = new TemplateProcessor($tempFilePath);

        $date = $project["date_create"];
        $dateComponents = explode('-', $date);

        $year = $dateComponents[0] ?? "__";
        $month = $dateComponents[1];
        $monthName = $dateComponents[1] ? MonthEnum::getMonthName($dateComponents[1]) : "__";
        $day = $dateComponents[2] ?? "__";
        $projectStage =   $project->project_stages->where('number', $stageNumber)->first();

        $TranslatorNumberToName = new TranslatorNumberToName();
        $myOrgPhone = $myOrg["phone_number"];
        $formattedPhone = preg_replace('/\+(\d{1,2})?(\d{3})(\d{3})(\d{2})(\d{2})/', '+$1 ($2) $3-$4-$5', $myOrgPhone);

        $replacements = [
            'project.number' => $project['number'] ?? '(данные отсутвуют)',
            'project.name' => $project['name'] ?? '(данные отсутвуют)',


            'dayCreate' => $day,
            'mountCreate' => $month,
            'mountCreateName' => $monthName,
            'yearCreate' => $year,
            'projectStages.stage.priceTotal' => $project['price'] ?? '(данные отсутвуют)',
            'projectStages.stage.endPriceTotal' => $project['price'] ?? '(данные отсутвуют)',

            'myOrg.director.position' => $myOrg['director']['position']['name'] ?? '(данные отсутвуют)',
            'myOrg.nameOrType' => $myOrg["legal_form"]['name'] . " " . $myOrg['name'],
            'myOrg.director.ShortFullName' => $myOrg['director']['last_name'] . ' ' . substr((string)$myOrg['director']['first_name'], 0, 2) . '.' . substr((string)$myOrg['director']['patronymic'], 0, 2) . '.',
            'projectOrganization.director.ShortFullName' => isset($project["organization_customer"]['director']) ?
                $project["organization_customer"]['director']['last_name'] . ' ' . substr((string)$project["organization_customer"]['director']['first_name'], 0, 2) . '.' . substr((string)$project["organization_customer"]['director']['patronymic'], 0, 2) . '.' : '',
            'projectOrganization.nameOrType' => isset($project["organization_customer"]) ? $project["organization_customer"]["legal_form"]['name'] . " " . $project["organization_customer"]['name'] : "(данные отсутвуют)",
            'projectOrganization.director.position' => $project["organization_customer"]['director']['position']['name'] ?? '(данные отсутвуют)',

            'projectStages.stage.finalPrice' =>   number_format($projectStage['price'] ?? 0, 2, ',', ' ') ?? '(данные отсутвуют)',
            'projectStages.stage.name' =>   $projectStage['stage']['name'] ?? '(данные отсутвуют)',
            'projectStages.stage.percent' =>    $projectStage['percent'] ?? '(данные отсутвуют)',

            'projectStages.stage.price' =>   number_format($projectStage['price'] ?? 0, 2, ',', ' ') ?? '(данные отсутвуют)',
            'projectStages.number' =>   $projectStage['number']  ?? '(данные отсутвуют)',
            'projectStages.stage.endPrice' =>   number_format($projectStage['price'] ?? 0, 2, ',', ' ') ?? '(данные отсутвуют)',
            'projectStages.stage.sumEndPrice' =>    number_format($projectStage['price'] ?? 0, 2, ',', ' ') ?? '(данные отсутвуют)',

                 'projectOrganization.payment_account' => $project["organization_customer"]['payment_account'] ?? '(данные отсутвуют)',
                'projectOrganization.BIK.name' => $project["organization_customer"]['bik']['name'] ?? '(данные отсутвуют)',
                'projectOrganization.BIK.bik' => $project["organization_customer"]['bik']['BIK'] ?? '(данные отсутвуют)',
                'projectOrganization.BIK.correspondent_account' => $project["organization_customer"]['BIK']['correspondent_account'] ?? '(данные отсутвуют)',

            'projectOrganization.INN' => $project["organization_customer"]['INN'] ?? '(данные отсутвуют)',
            'projectOrganization.KPP' => $project["organization_customer"]['KPP'] ?? '(данные отсутвуют)',
            'projectOrganization.address_legal' => $project["organization_customer"]['address_legal'] ?? '(данные отсутвуют)',
            'projectStages.stage.finalPriceToString' => isset($projectStage['price']) ? $TranslatorNumberToName->num2str($projectStage['price']) : "",
            'myOrg.INN' => $myOrg['INN'] ?? '(данные отсутвуют)',
            'myOrg.KPP' => $myOrg['KPP'] ?? '(данные отсутвуют)',
            'myOrg.address_legal' => $myOrg['address_legal'] ?? '(данные отсутвуют)',
            'myOrg.styled_phone' => $formattedPhone ?? '(данные отсутвуют)',
            'myOrg.BIK.bik' => $myOrg['bik']['BIK'] ?? '(данные отсутвуют)',
            'myOrg.BIK.name' => $myOrg['bik']['name'] ?? '(данные отсутвуют)',
            'myOrg.BIK.correspondent_account' => $myOrg['BIK']['correspondent_account'] ?? '(данные отсутвуют)',
            'myOrg.payment_account' => $myOrg['payment_account'] ?? '(данные отсутвуют)']

        ;


        foreach ($replacements as $key => $value) {
            $templateProcessor->setValue($key, $value);
        }
        $fileName =  $project['number'].'_АКТ_ВЫПОЛНЕНЫХ_РАБОТ' .("_НОМЕР_".$stageNumber).'.docx';


        $filePath = storage_path('app/' . $fileName);
        $templateProcessor->saveAs($filePath);

        unlink($tempFilePath);

        return $fileName;
    }
}
