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

class IrdsProjectTemplate
{
    public static function generate($projectIrds)
    {
        // Получение данных об организации
        $myOrg = GeneratorService::getOrganizationData();
        $projectData = $projectIrds["project"];
        $projectDirector = $projectData['organization']['director'];
        // Получение пути к шаблону документа
        $templateFilePath = storage_path('app/templates/PersonContract.docx');
        // Создание временного файла копии шаблона
        $tempFilePath = tempnam(sys_get_temp_dir(), 'contract');
        copy($templateFilePath, $tempFilePath);
        // Загрузка шаблона в PhpWord
        $templateProcessor = new TemplateProcessor($tempFilePath);
        $id = "___";
        $day = "__";
        $mount = "__";
        $year = "____";
        $replacements = [
            'day' => $day,
            'mount' => $mount,
            'year' => $year,
            'project.number' => $projectData['number'],
            'project.date_create' => $projectData['date_create'],
            'project.name' => $projectData['name'],
            'myOrg.nameOrType'=> $myOrg['name'],
            'myOrg.name'=> $myOrg['name'],
            'myOrg.director.short_full_name'=> $myOrg['name'],
            'project.organization.director.short_full_name' => $projectDirector['last_name'] . ' ' . substr((string)$projectDirector['first_name'], 0,2) . '.' . substr((string)$projectDirector['patronymic'], 0,2) . '.',
            'project.organization.nameOrType' => $projectData['name']['name'],
            'project.organization.name' => $projectData['name']['name'],
            'project_irds.ird.name' => $projectIrds['ird']['name'],
            'project_irds.number' => $projectIrds['number'],
            'myOrg.director.position.name' => $myOrg['director']['position']['name'],
            'project.organization.director.position.name' => $projectDirector['position']['name'],
        ];

        foreach ($replacements as $key => $value) {
            $templateProcessor->setValue($key, $value);
        }

        // Сохранение отредактированного документа
        $fileName = 'contract.docx';
        $filePath = storage_path('app/' . $fileName);
        $templateProcessor->saveAs($filePath);

        // Удаление временного файла
        unlink($tempFilePath);

        return $fileName;
    }




}
