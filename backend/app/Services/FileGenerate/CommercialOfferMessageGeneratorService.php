<?php

namespace App\Services\FileGenerate;


use App\Models\ProjectFile;

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
        if (!isset($data['projectData'], $data['delegation'], $data['dateOffer'])) {
            throw new \Exception('Не все необходимые данные предоставлены.');
        }

        // Извлечение данных
        $projectData = $data['projectData'];
        $delegation = $data['delegation'];
        $dateOffer = $data['dateOffer'];

        //  Добор данных
        $myOrg = FormatterService::getMyOrg();
        $full_date = FormatterService::getFullDate($dateOffer, true);
        $stagesNames = $projectData->prepayment . '% (' . $projectData->price / 100 * $projectData->prepayment . ' руб.) - Аванс; ';
        foreach ($projectData->project_stages as $stage) {
            $stagesNames .= $stage->percent - $stage->percent / 100 * $projectData->prepayment . '% (' . $stage->price . ' руб.) - ' . $stage->stage->name . "; ";
        }

        //  Обработка шаблона
        $this->replacements = [
            'myOrg.full_adress' => $myOrg['address_legal'] . ', тел. ' . $myOrg["phone_number"] . ', E-mail: ' . $myOrg["email"],
            'message.full_date' => $full_date,
            'message.number' => " №______",
            'delegate_org.director.positions' => $delegation['position']['name'],
            'delegate_org.name' => $myOrg['name'],
            'project.main_delegation_short_name' => FormatterService::getFullName($delegation['last_name'], $delegation['first_name'], $delegation['patronymic'], true),
            'project.main_delegation_full_name' => FormatterService::getFullName($delegation['last_name'], $delegation['first_name'], $delegation['patronymic']),
            'project.name' => $projectData['name'],
            'project.price' => $projectData['price'],
            'project.price_name' => $projectData['name'],
            'project.duration' => $projectData['duration'],
            'pepa' => "pepa",
            'project.prepayment' => $projectData['prepayment'] . ";\t",
            'stages.persent_price_name' => $stagesNames,
            'myOrg.director.position_name' => $myOrg['director']->position->name,
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
            'number' => 0,
            'date_document' => $dateOffer,
        ]);

        $this->cleanUp($this->te);

        return $file->id;
    }


}
