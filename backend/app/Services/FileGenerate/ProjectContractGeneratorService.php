<?php

namespace App\Services\FileGenerate;

use App\Models\Project;
use App\Models\ProjectContractHistory;
use App\Models\ProjectFile;
use App\Services\FileGenerate\GeneratorService;
use App\Services\MonthEnum;
use App\Services\NameCaseLib\NCL\NCL;
use App\Services\NameCaseLib\NCLNameCaseRu;
use App\Services\TranslatorNumberToName;
use Dompdf\Dompdf;
use Dompdf\Options;
use Illuminate\Support\Str;
use PhpOffice\PhpWord\IOFactory;
use PhpOffice\PhpWord\TemplateProcessor;

class ProjectContractGeneratorService
{

    public static function generate($projectData, $dateCreateContract, $isStamp = false)
    {
        $myOrg = GeneratorService::getOrganizationData();

        $templateFilePath = $isStamp ? storage_path('app/templates/ProjectTemplateStamp.docx') : storage_path('app/templates/ProjectTemplate.docx') ;

        $tempFilePath = tempnam(sys_get_temp_dir(), 'projectContract');
        copy($templateFilePath, $tempFilePath);

        $templateProcessor = new TemplateProcessor($tempFilePath);

        $dateComponents = explode('-', $dateCreateContract);


        // Склонение имени
        $NCLNameCaseRu = new NCLNameCaseRu();

        $formattedPhone = preg_replace('/\+(\d{1,2})?(\d{3})(\d{3})(\d{2})(\d{2})/', '+$1 ($2) $3-$4-$5', $myOrg["phone_number"]);
        $contractNumber = ProjectFile::where('type_id', "CONTRACT")->where('project_id', $projectData->id)->max('number') + 1;

        //  П 2
        // Формируем массив для отображения в таблице

        $table = [];
        $irdNumber = 1;
        foreach ($projectData->project_irds as $projectIrd) {
            $table[] = [
                'project_irds.number' => $irdNumber++,
                'project_irds.ird.name' => $projectIrd->ird->name,
            ];
        }
        $templateProcessor->cloneRowAndSetValues('project_irds.number' , $table);
        //  П 3
        // Формируем массив для отображения в таблице
        $tableStage[] =  [
            'projectStages.number' => '',
            "projectStages.stage.name" => 'Аванс ' . $projectData["prepayment"] . "%",
            "projectStages.stage.duration" => '',
            "projectStages.stage.price" => "",
            "projectStages.stage.endPrice" => number_format(($projectData["price"] * $projectData["prepayment"] / 100), 0, ',', ' ')." р.",
            "projectStages.payDay" =>  "В течение 5 банковских дней с даты подписания договора",
        ];
        $irdNumber = 1;
        # Указываем кодировку.
        header('Content-type: text/html; charset=utf-8');
        foreach ($projectData->project_stages as $projectStage) {
            $tableStage[] = [
                'projectStages.number' => $projectStage["number"],
                "projectStages.stage.name" => $projectStage["stage"]["name"],
                "projectStages.stage.duration" => $projectStage["duration"],
                "projectStages.stage.price" => number_format($projectStage["price"], 0, ',', ' ')." р.",
                "projectStages.stage.endPrice" => number_format($projectStage["price_to_paid"], 0, ',', ' ')." р.",
                "projectStages.payDay" =>  "В течение 5 банковских дней с даты подписания акта",
            ];
        }
        $templateProcessor->cloneRowAndSetValues('projectStages.number' , $tableStage);
        $TranslatorNumberToName = new TranslatorNumberToName();

        $replacements = [
            'date_create_full' => "«" . $dateComponents[0] . "»" . MonthEnum::getMonthName($dateComponents[1]) . " " . $dateComponents[2] . " г.",
            'date_create_short' => $dateComponents[0] . "." . $dateComponents[1] . "." . $dateComponents[2],

            'projectStages.stage.priceTotal' => number_format($projectData['price'], 0, ',', ' ')." р." ?? '(данные отсутвуют)',
            'projectStages.stage.endPriceTotal' => number_format($projectData['price'], 0, ',', ' ')." р." ?? '(данные отсутвуют)',
            'projectStages.stage.priceTotalToName' => $TranslatorNumberToName->num2str($projectData['price']),
            'projectStages.stage.endPriceTotalToName' => $TranslatorNumberToName->num2str($projectData['price']),

            'myOrg.full_name' => $myOrg['full_name'] ?? '(данные отсутвуют)',
            'myOrg.nameOrType' => $myOrg["legal_form"]['name'] . " " . $myOrg['name'],
            'myOrg.director.full_name' => $NCLNameCaseRu->q($myOrg['director']['last_name'] . ' ' . $myOrg['director']['first_name'] . ' ' . $myOrg['director']['patronymic'], NCL::$VINITELN) ?? '',
            'myOrg.director.position.name' => $myOrg['director']['position']['name'] ?? '(данные отсутвуют)', 'project.name' => $projectData['name'] ?? '',
            'myOrg.INN' => $myOrg['INN'] ?? '(данные отсутвуют)',
            'myOrg.KPP' => $myOrg['KPP'] ?? '(данные отсутвуют)',
            'myOrg.address_legal' => $myOrg['address_legal'] ?? '(данные отсутвуют)',
            'myOrg.OGRN' => $myOrg['OGRN'] ?? '(данные отсутвуют)',
            'myOrg.legal_form' => $myOrg['legal_form']['group']['specification'] ?? '(данные отсутвуют)',

            'myOrg.email' => $myOrg['email'] ?? '(данные отсутвуют)',
            'myOrg.styled_phone' => $formattedPhone ?? '(данные отсутвуют)',
            'myOrg.BIK.bik' => $myOrg['bik']['BIK'] ?? '(данные отсутвуют)',
            'myOrg.BIK.name' => $myOrg['bik']['name'] ?? '(данные отсутвуют)',
            'myOrg.BIK.correspondent_account' => $myOrg['BIK']['correspondent_account'] ?? '(данные отсутвуют)',
            'myOrg.payment_account' => $myOrg['payment_account'] ?? '(данные отсутвуют)',

            'project.avansPecent' => $projectData['prepayment'],

            'project.price' => $projectData['price'] ?? '(данные отсутвуют)',
            'project.number' => $projectData['number'] ?? '(данные отсутвуют)',

            "project.typeProject.Specification" => $projectData["type_project_document"]["group"]["technical_specification"]['name'] ?? '(данные отсутвуют)',
            'projectOrganization.director.full_name' => isset($projectData["organization_customer"]['director']) ?
                $NCLNameCaseRu->q($projectData["organization_customer"]['director']['last_name'] . ' ' .
                    $projectData["organization_customer"]['director']['first_name'] . ' ' .
                    $projectData["organization_customer"]['director']['patronymic'], NCL::$VINITELN) : '',
            'projectOrganization.director.position' => $projectData["organization_customer"]['director']['position']['name'] ?? '(данные отсутвуют)',
            'projectOrganization.INN' => $projectData["organization_customer"]['INN'] ?? '(данные отсутвуют)',
            'projectOrganization.full_name' => $projectData["organization_customer"]['full_name'] ?? '(данные отсутвуют)',
            'projectOrganization.nameOrType' => $projectData["organization_customer"]["legal_form"]['name'] . " " . $projectData["organization_customer"]['name'],
            'projectOrganization.KPP' => $projectData["organization_customer"]['KPP'] ?? '(данные отсутвуют)',
            'projectOrganization.address_legal' => $projectData["organization_customer"]['address_legal'] ?? '(данные отсутвуют)',
            'projectOrganization.OGRN' => $projectData["organization_customer"]['OGRN'] ?? '',
            'projectOrganization.payment_account' => $projectData["organization_customer"]['payment_account'] ?? '(данные отсутвуют)',
            'projectOrganization.BIK.bik' => $projectData["organization_customer"]['bik']['BIK'] ?? '(данные отсутвуют)',
            'projectOrganization.BIK.name' => $projectData["organization_customer"]['bik']['name'] ?? '(данные отсутвуют)',
            'projectOrganization.BIK.correspondent_account' => $projectData["organization_customer"]['BIK']['correspondent_account'] ?? '(данные отсутвуют)',
            'projectOrganization.director.ShortFullName' => isset($projectData["organization_customer"]['director']) ?
                $projectData["organization_customer"]['director']['last_name'] . ' ' .
                substr((string)$projectData["organization_customer"]['director']['first_name'], 0, 2) . '.' .
                substr((string)$projectData["organization_customer"]['director']['patronymic'], 0, 2) . '.'
                : '',
            'myOrg.director.ShortFullName' => $myOrg['director']['last_name'] . ' ' .
                substr((string)$myOrg['director']['first_name'], 0, 2) . '.' .
                substr((string)$myOrg['director']['patronymic'], 0, 2) . '.',

        ];

        foreach ($replacements as $key => $value) {
            $templateProcessor->setValue($key, $value);
        }

        $fileName = Str::random(30) . "_" . $projectData['number'] . '_ДОГОВОР_ПОДРЯДА';

        $filePath = storage_path('app/' . $fileName . '.docx');
        $templateProcessor->saveAs($filePath);

        //$command = 'soffice --headless --convert-to pdf ' . escapeshellarg($filePath);
        //exec($command, $output, $returnVar);

        $storagePath = "/" . $projectData->path_project_folder . "/Договора_с_заказчиком/" . $fileName. '.docx';
        $file = FileCreateService::saveFileToProject($storagePath, $filePath, $fileName. '.docx');
        ProjectFile::create([
            'project_id' => $projectData->id,
            'file_id' => $file->id,
            'type_id' => "CONTRACT",
            'number' => $contractNumber,
            'date_document' => $dateCreateContract,
        ]);

        unlink($tempFilePath);

        return $file->id;
    }


}
