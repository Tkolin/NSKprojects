<?php

namespace App\GraphQL\Service;

use App\Models\Organization;
use App\Models\Person;
use App\Models\TemplateFile;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use PhpOffice\PhpWord\IOFactory;
use PhpOffice\PhpWord\PhpWord;
use PhpOffice\PhpWord\TemplateProcessor;

class ProjectGeneratorService
{

    public static function generate($project)
    {
        $myOrg = GeneratorService::getOrganizationData();

        $templateFilePath = storage_path('app/templates/ProjectTemplate.docx');

        $tempFilePath = tempnam(sys_get_temp_dir(), 'projectContract');
        copy($templateFilePath, $tempFilePath);

        $templateProcessor = new TemplateProcessor($tempFilePath);

        $date = $project["date_create"];

        $dateComponents = explode('-', $date);

        $year = $dateComponents[0];
        $month = $dateComponents[1];
        $day = $dateComponents[2];

        $myOrgPhone = $myOrg["phone_number"];
        $formattedPhone = preg_replace('/\+(\d{1,2})?(\d{3})(\d{3})(\d{2})(\d{2})/', '+$1 ($2) $3-$4-$5', $myOrgPhone);


        $replacements = [
            'myOrg.full_name' => $myOrg['full_name'] ?? '(данные отсутвуют)',
            'myOrg.nameOrType' =>$myOrg["legal_form"]['name'] ." ". $myOrg['name']  ,
            'myOrg.director.full_name' => $myOrg['director']['last_name'] . ' ' . $myOrg['director']['first_name'] . ' ' . $myOrg['director']['patronymic'] ?? '',
            'myOrg.director.position.name' => $myOrg['director']['position']['name'] ?? '(данные отсутвуют)','project.name' => $project['name'] ?? '',
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



            'project.price' => $project['price'] ?? '(данные отсутвуют)',
            'project.number' => $project['number'] ?? '(данные отсутвуют)',
            'dayCreate' => $day,
            'mountCreate' => $month,
            'yearCreate' => $year,
            "project.typeProject.Specification" => $project["type_project_document"]["group"]["technical_specification"]['name'] ?? '(данные отсутвуют)',
            'projectOrganization.director.full_name' => isset($project["organization_customer"]['director']) ?
                ($project["organization_customer"]['director']['last_name'] . ' ' .
                    $project["organization_customer"]['director']['first_name'] . ' ' .
                    $project["organization_customer"]['director']['patronymic']) : '',
            'projectOrganization.director.position' => $project["organization_customer"]['director']['position']['name'] ?? '(данные отсутвуют)',
            'projectOrganization.INN' => $project["organization_customer"]['INN'] ?? '(данные отсутвуют)',
            'projectOrganization.full_name' => $project["organization_customer"]['full_name'] ?? '(данные отсутвуют)',
            'projectOrganization.nameOrType' =>$project["organization_customer"]["legal_form"]['name'] ." ". $project["organization_customer"]['name']  ,
            'projectOrganization.KPP' => $project["organization_customer"]['KPP'] ?? '(данные отсутвуют)',
            'projectOrganization.address_legal' => $project["organization_customer"]['address_legal'] ?? '(данные отсутвуют)',
            'projectOrganization.OGRN' => $project["organization_customer"]['OGRN'] ?? '',
            'projectOrganization.payment_account' => $project["organization_customer"]['payment_account'] ?? '(данные отсутвуют)',
            'projectOrganization.BIK.bik' => $project["organization_customer"]['bik']['BIK'] ?? '(данные отсутвуют)',
            'projectOrganization.BIK.name' => $project["organization_customer"]['bik']['name'] ?? '(данные отсутвуют)',
            'projectOrganization.BIK.correspondent_account' => $project["organization_customer"]['BIK']['correspondent_account'] ?? '(данные отсутвуют)'
        ];

//=======
//        $day = "__";
//        $mount = "__";
//        $year = "____";
//        $replacements = [
//            'id' => $id,
//            'day' => $day,
//            'mount' => $mount,
//            'year' => $year,
//            'myOrg.name' => $myOrg['name'],
//            'myOrg.full_name' => $myOrg['full_name'],
//            'myOrg.director.FullName' => $myOrg['director']['last_name'] . ' ' . $myOrg['director']['first_name'] . ' ' . $myOrg['director']['patronymic'],
//            'myOrg.INN' => $myOrg['INN'],
//            'myOrg.payment_account' => $myOrg['payment_account'],
//            'myOrg.BIK.name' => $myOrg['BIK']['name'],
//            'myOrg.BIK.bik' => $myOrg['BIK']['BIK'],
//            'myOrg.BIK.correspondent_account' => $myOrg['BIK']['correspondent_account'],
//            'myOrg.address_legal' => $myOrg['address_legal'],
//            'myOrg.address_mail' => $myOrg['address_mail'],
//            'myOrg.office_number_legal' => $myOrg['office_number_legal'],
//            'myOrg.office_number_mail' => $myOrg['office_number_mail'],
//            'person.passport.serial' => $personData['passport']['serial'],
//            'person.passport.number' => $personData['passport']['number'],
//            'person.passport.date' => $personData['passport']['date'],
//            'person.passport.birth_date' => $personData['passport']['birth_date'],
//            'person.passport.passport_place_issue.name' => $personData['passport']['passport_place_issue']['name'],
//            'person.passport.address_registration' => $personData['passport']['address_registration'],
//            'person.INN' => $personData['INN'],
//            'person.SNILS' => $personData['SHILS'],
//            'person.BIK.name' => $personData['BIK']['name'],
//            'person.BIK.bik' => $personData['BIK']['BIK'],
//            'person.BIK.correspondent_account' => $personData['BIK']['correspondent_account'],
//            'person.payment_account' => $personData['payment_account'],
//            'myOrg.director.ShortFullName' => $myOrg['director']['last_name'] . ' ' . substr((string)$myOrg['director']['first_name'], 0,2) . '.' . substr((string)$myOrg['director']['patronymic'], 0,2) . '.',
//            'person.FullName' => $personData['passport']['lastname'] . ' ' . $personData['passport']['firstname'] . ' ' . $personData['passport']['patronymic'],
//            'person.ShortFullName' => $personData['passport']['lastname'] . ' ' . substr((string)$personData['passport']['firstname'], 0, 2) . '.' . substr((string)$personData['passport']['patronymic'], 0, 2) . '.'


        foreach ($replacements as $key => $value) {
            $templateProcessor->setValue($key, $value);
        }

        $fileName = 'project.docx';

        $filePath = storage_path('app/' . $fileName);
        $templateProcessor->saveAs($filePath);

        // Удаление временного файла
        unlink($tempFilePath);

        return $fileName;
    }




}
