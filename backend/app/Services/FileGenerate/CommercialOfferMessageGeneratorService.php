<?php

namespace App\Services\FileGenerate;


use App\Models\ProjectFile;
use App\Services\NameCaseLib\NCLNameCaseRu;
use Exception;
use function morphos\Russian\inflectName;

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
        // $contractNumber =  FormatterService::formatWithLeadingZeros(count($data['projectData']->project_kp_history) + 1, 2);
        $contractNumber = ProjectFile::getCountKP();
        $projectData = $data['projectData'];
        $delegation = $data['delegationData'];
        $dateOffer = $data['dateOffer'];
        $delegationOrgData = $data['delegationOrgData'];
        $nclNameCaseRu = new NCLNameCaseRu();


        //  Добор данных
        $myOrg = FormatterService::getMyOrg();
        $full_date = FormatterService::getFullDate($dateOffer, true);
        $stagesNames = [
            ['blockContent' => $projectData->prepayment . '% Аванс (' . number_format($projectData->price / 100 * $projectData->prepayment, 0, ',', ' ') . ' руб.);']
        ];

        // Добавление остальных этапов в массив
        foreach ($projectData->project_stages as $stage) {
            $_price = $stage->price / 100 * (100 - $projectData->prepayment);
            $stagesNames[] = ['blockContent' => $stage->percent . "% " . $stage->stage->name . ' (' . number_format($_price, 0, ',', ' ') . ' руб.);'];
        }
        $this->templateProcessor->cloneBlock("stagesBlock", 0, true, false, $stagesNames);
        //  Обработка шаблона
        $this->replacements = [
            'myOrg.full_adress' => $myOrg['address_legal'] . ', тел. ' . $myOrg["phone_number"] . ', E-mail: ' . $myOrg["email"],
            'message.full_date' => mb_strtolower($full_date),
            'message.number' => "№" . $contractNumber,
            "myOrg.director.position_name" => $myOrg['director']['position']['name'],
            'delegate_org.director.positions' => FormatterService::mb_ucfirst(ucfirst(mb_strtolower(inflectName($delegation['position']['name'], 'дательный')))),
            'delegate_org.name' => $delegationOrgData['name'],
            'delegate_org.type_org' => $delegationOrgData['legal_form']->name,
            'project.main_delegation_short_name' => FormatterService::getFullName($delegation['last_name'], $delegation['first_name'], $delegation['patronymic'], true, true),
            'project.main_delegation_short_nameDG' => $nclNameCaseRu->q(FormatterService::getFullName(
                $delegation['last_name'],
                $delegation['first_name'],
                $delegation['patronymic'],
                true,
                true
            ), NCLNameCaseRu::$DATELN),

            'project.main_delegation_full_name' => $delegation['first_name'] . " " . $delegation['patronymic'],
            'project.name' => $projectData['name'],
            'project.price' => number_format($projectData['price'], 0, ',', ' '),
            'project.price_name' => FormatterService::convertNumbToStringr($projectData['price']),
            'project.durationMark' => FormatterService::formatDuration($projectData['duration']) . " ",
            'project.prepayment' => $projectData['prepayment'] . "; </w:r><w:r>",
            'myOrg.director.short_fullname' => FormatterService::getFullName($myOrg['director']['last_name'], $myOrg['director']['first_name'], $myOrg['director']['patronymic'], true),
        ];
        $this->replaceValues();
        //  Сохранение файла
        error_log("НОМЕР " . $projectData['number']);
        $this->saveDocument($projectData['number'] . '_КОМЕРЧЕСКОЕ_ПРЕДЛОЖЕНИЕ.docx');
        $storagePath = "/" . $projectData->path_project_folder . "/Коммерческие предложения/" . $this->fileName;

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
