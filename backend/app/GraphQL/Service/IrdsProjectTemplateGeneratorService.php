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

class IrdsProjectTemplateGeneratorService
{
    public static function generate($project)
    {
        $myOrg = GeneratorService::getOrganizationData();



        // Получение пути к шаблону документа
        $templateFilePath = storage_path('app/templates/IrdsProjectTemplate.docx');

        // Создание временного файла копии шаблона
        $tempFilePath = tempnam(sys_get_temp_dir(), 'contract');
        copy($templateFilePath, $tempFilePath);
        $templateProcessor = new TemplateProcessor($tempFilePath);

        //   $dateComponents = explode('-', $date);
        //   $year = $dateComponents[0];
        //   $month = $dateComponents[1];
        //   $day = $dateComponents[2];
        $date = $project["date_create"];
        $dateComponents = explode('-', $date);

        $year = $dateComponents[0] ?? "__";
        $month = $dateComponents[1] ? MonthEnum::getMonthName($dateComponents[1]) : "__";
        $day = $dateComponents[2] ?? "__";

        $projectIrds = $project->project_irds;

        // Формируем массив для отображения в таблице
        $table = [];
        $irdNumber = 1;
        foreach ($projectIrds as $projectIrd) {
            $table[] = [
                'project_irds.number' => $irdNumber++,
                'project_irds.ird.name' => $projectIrd->ird->name,
            ];
        }
        $replacements = [
            'project.number' => $project['number'] ?? '(данные отсутвуют)',
            'project.name' => $project['name'] ?? '(данные отсутвуют)',


            'dayCreate' => $day,
            'mountCreate' => $month,
            'yearCreate' => $year,

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
        $templateProcessor->cloneRowAndSetValues('project_irds.number' , $table);

        // Сохранение отредактированного документа
        $fileName = 'Список_ИРД.docx';
        $filePath = storage_path('app/' . $fileName);
        $templateProcessor->saveAs($filePath);

        // Удаление временного файла
        unlink($tempFilePath);

        return $fileName;
    }




}
