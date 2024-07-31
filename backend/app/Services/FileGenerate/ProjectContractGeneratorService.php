<?php

namespace App\Services\FileGenerate;

use App\Models\Project;
use App\Models\ProjectContractHistory;
use App\Models\ProjectFile;
use App\Services\FileGenerate\GeneratorService;
use App\Services\MonthEnum;
use App\Services\NameCaseLib\NCL\NCL;
use App\Services\NameCaseLib\NCLNameCaseRu;
use Illuminate\Support\Str;
use PhpOffice\PhpWord\TemplateProcessor;

class ProjectContractGeneratorService
{

    public static function generate($projectData, $dateCreateContract)
    {
        $myOrg = GeneratorService::getOrganizationData();

        $templateFilePath = storage_path('app/templates/ProjectTemplate.docx');

        $tempFilePath = tempnam(sys_get_temp_dir(), 'projectContract');
        copy($templateFilePath, $tempFilePath);

        $templateProcessor = new TemplateProcessor($tempFilePath);

        $dateComponents = explode('-', $dateCreateContract);

        $year = $dateComponents[0] ?? "__";
        $month = $dateComponents[1] ? MonthEnum::getMonthName($dateComponents[1]) : "__";
        $day = $dateComponents[2] ?? "__";
        error_log("Договор");

        // Склонение имени
        $NCLNameCaseRu = new NCLNameCaseRu();

        $formattedPhone = preg_replace('/\+(\d{1,2})?(\d{3})(\d{3})(\d{2})(\d{2})/', '+$1 ($2) $3-$4-$5', $myOrg["phone_number"]);
        $contractNumber = ProjectFile::where('type_id', "CONTRACT")->where('project_id', $projectData->id)->max('number') + 1;


        $replacements = [
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
            'dayCreate' => $day,
            'mountCreate' => $month,
            'yearCreate' => $year,
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
                $projectData["organization_customer"]['director']['last_name'] . ' ' . substr((string)$projectData["organization_customer"]['director']['first_name'], 0, 2) . '.' . substr((string)$projectData["organization_customer"]['director']['patronymic'], 0, 2) . '.' : '',
            'myOrg.director.ShortFullName' => $myOrg['director']['last_name'] . ' ' . substr((string)$myOrg['director']['first_name'], 0, 2) . '.' . substr((string)$myOrg['director']['patronymic'], 0, 2) . '.',

        ];


        foreach ($replacements as $key => $value) {
            $templateProcessor->setValue($key, $value);
        }

        $fileName = Str::random( 30)."_". $projectData['number'] . '_ДОГОВОР_ПОДРЯДА.docx';

        $filePath = storage_path('app/' . $fileName);
        $templateProcessor->saveAs($filePath);

        $storagePath = "/" . $projectData->path_project_folder . "/Договора_с_заказчиком/" . $fileName;
        $file = FileCreateService::saveFileToProject($storagePath, $filePath, $fileName);
        ProjectFile::create([
            'project_id' => $projectData->id,
            'file_id'=> $file->id,
            'type_id'=>"CONTRACT",
            'number'=> $contractNumber,
            'date_document'=> $dateCreateContract,
        ]);

        unlink($tempFilePath);

        return $file->id;
    }


}
