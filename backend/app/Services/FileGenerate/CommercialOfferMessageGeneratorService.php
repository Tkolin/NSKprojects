<?php

namespace App\Services\FileGenerate;


use App\Models\ProjectFile;
use Exception;

class CommercialOfferMessageGeneratorService extends DocumentGeneratorService
{


    public function __construct()
    {
        $templatePath = storage_path('app/templates/MailKPTemplate.docx');
        parent::__construct($templatePath);
    }

    public function generate(array $data)
    {
        // Проверка, что все ключи существуют
        if (!isset($data['projectData'])) {
            throw new Exception('Отсутствуют данные проекта.');
        }
        if (!isset($data['delegationData'])) {
            throw new Exception('Отсутствует контактное лицо организации.');
        }
        if (!isset($data['dateOffer'])) {
            throw new Exception('Отсутствует дата документа для генерации.');
        }
        if (!isset($data['delegationOrgData'])) {
            throw new Exception('Отсутствует дата документа для генерации.');
        }


        // Извлечение данных
        $contractNumber = FormatterService::formatWithLeadingZeros($data['projectData']->id, 3) . FormatterService::formatWithLeadingZeros(count($data['projectData']->project_kp_history) + 1, 2);
        $projectData = $data['projectData'];
        $delegation = $data['delegationData'];
        $dateOffer = $data['dateOffer'];
        $delegationOrgData = $data['delegationOrgData'];


        //  Добор данных
        $myOrg = FormatterService::getMyOrg();
        $full_date = FormatterService::getFullDate($dateOffer, true);
        $stagesNames = [
            ['blockContent' => $projectData->prepayment . '% Аванс (' . FormatterService::convertToMany($projectData->price / 100 * $projectData->prepayment, false) . ' руб.) ;']
        ];

// Добавление остальных этапов в массив
        foreach ($projectData->project_stages as $stage) {
            $stagesNames[] = ['blockContent' => $stage->percent . "% " . $stage->stage->name . ' (' . FormatterService::convertToMany($stage->price, false) . ' руб.)'];
        }
        $this->templateProcessor->cloneBlock("stagesBlock", 0, true, false, $stagesNames);

        //  Обработка шаблона
        $this->replacements = [
            'myOrg.full_adress' => $myOrg['address_legal'] . ', тел. ' . $myOrg["phone_number"] . ', E-mail: ' . $myOrg["email"],
            'message.full_date' => $full_date,
            'message.number' => "№" . $contractNumber,
            'delegate_org.director.positions' => $delegation['position']['name'],
            'delegate_org.name' => $delegationOrgData['name'],
            'delegate_org.type_org' => $delegationOrgData['legal_form']->name,
            'project.main_delegation_short_name' => FormatterService::getFullName($delegation['last_name'], $delegation['first_name'], $delegation['patronymic'], true),
            'project.main_delegation_full_name' => $delegation['first_name'] . " " . $delegation['patronymic'],
            'project.name' => $projectData['name'],
            'project.price' => FormatterService::convertToMany($projectData['price'], false),
            'project.price_name' => FormatterService::convertNumbToStringr($projectData['price']),
            'project.duration' => $projectData['duration'],
            'pepa' => "pepa",
            'project.prepayment' => $projectData['prepayment'] . "; </w:r><w:r>",
            // 'stages.persent_price_name' => $stagesNames,
            'myOrg.director.position_name' => "Техническй директор",
            'myOrg.director.short_fullname' => FormatterService::getFullName($myOrg['director']['last_name'], $myOrg['director']['first_name'], $myOrg['director']['patronymic'], true),
        ];
        $this->replaceValues();
        //  Сохранение файла
        $this->saveDocument($projectData['number'] . '_КОМЕРЧЕСКОЕ_ПРЕДЛОЖЕНИЕ.docx');
        $storagePath = "/" . $projectData->path_project_folder . "/КП/" . $this->fileName;

        //  Фиксация в базе
        $file = $this->saveFileToProject($storagePath, $this->filePath, $this->fileName);
        ProjectFile::create([
            'project_id' => $projectData->id,
            'file_id' => $file->id,
            'type' => "KP",
            'number' => $contractNumber,
            'date_document' => $dateOffer,
        ]);

        //  $this->cleanUp($this->te);

        return $file->id;
    }


}
