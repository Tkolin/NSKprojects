<?php

namespace App\Services\FileGenerate;

use App\Models\ProjectFile;
use App\Services\NameCaseLib\NCL\NCL;
use App\Services\NameCaseLib\NCLNameCaseRu;
use Exception;

class ProjectTechSpecGeneratorService extends DocumentGeneratorService
{
    protected $isStamp;

    public function __construct($isStamp = false)
    {
        $this->isStamp = $isStamp;
        parent::__construct(storage_path('app/templates/ProjectTechSpecGeneratorService.docx'));
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
        // $date_create_short = FormatterService::getShortDate($dateCreateContract);

        $myOrg = FormatterService::getMyOrg();

        // Формируем массив для отображения в таблице
        $projecTechChaps = [];
        $projecTechChapsTable = [];
        $tableNumb = 0;
        foreach ($projecTechChaps as $key => $value) {
            $tableNumb++;
            $projecTechChapsTable[] = [
                "projecTechChap.Numb" => $tableNumb,
                'projecTechChap.Name' => $value["name"],
                "projecTechChap.Content" => $value["contetn"],
            ];
        }
        $this->templateProcessor->cloneRowAndSetValues('projecTechChap.Numb', $projecTechChapsTable);

        $this->replacements = [
            //  Шляпка
            'project.number' => $projectData['number'] ?? null,
            'date_create_full' => $date_create_full ? mb_strtolower($date_create_full) : null,
            // 'date_create_short' => $date_create_short ? mb_strtolower($date_create_short) : null,
            'myOrg.director.position.name' => $myOrg['director']['position']['name'] ?? null,
            'myOrg.nameOrType' => $myOrg["legal_form"]['name'] . " " . $myOrg['name'] ?? null,
            'projectOrganization.director.position' => $projectData["organization_customer"]['director']['position']['name'] ?? null,
            'projectOrganization.nameOrType' => $projectData["organization_customer"]["legal_form"]['name'] . " " . $projectData["organization_customer"]['name'] ?? null,
            'projectOrganization.director.ShortFullName' =>
                FormatterService::getFullName(
                    $projectData["organization_customer"]['director']['last_name'] ?? null,
                    $projectData["organization_customer"]['director']['first_name'],
                    $projectData["organization_customer"]['director']['patronymic'],
                    true
                ),
            // Загаловка
            'project.name' => $projectData['name'] ?? '' ?? null,
            // Траблица
            'projectTechSpec.plasment.pos' => "___",//$projecTechSpec["plasment"]["pos_name"],
            'projectTechSpec.plasment.name' => "___",//$projecTechSpec["plasment"]["name"],
            'projectTechSpec.stage.name' => "___",//$projecTechSpec["plasment"]["name"],
            'projectTechSpec.base.name' => "___",//$projecTechSpec["plasment"]["name"],
            'projectTechSpec.base.name1' => "___",//$projecTechSpec["plasment"]["name"],
            'projectTechSpec.payment.name' => "___",//$projecTechSpec["plasment"]["name"],

            'projectOrganization.facility.name' => "___",//$projecTechSpec["plasment"]["name"],
        ];
        $this->checkReplacements();
        $this->replaceValues();

        //  Сохранение файла
        $this->saveDocument($projectData['number'] . '_ТЗ.docx');
        $storagePath = "/" . $projectData->path_project_folder . "/ТЗ/" . $this->fileName;

        //  Фиксация в базе
        $file = $this->saveFileToProject($storagePath, $this->filePath, $this->fileName);


        ProjectFile::create([
            'project_id' => $projectData->id,
            'file_id' => $file->id,
            'type' => "TECH_SPEC",
            'number' => $contractNumber,
            'date_document' => $dateCreateContract,
        ]);

        //$this->cleanUp($this->tempFilePath);

        return $file->id;
    }
}
