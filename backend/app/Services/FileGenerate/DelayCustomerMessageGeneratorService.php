<?php

namespace App\Services\FileGenerate;

use App\Models\ProjectFile;
use App\Services\NameCaseLib\NCLNameCaseRu;
use Exception;
use function morphos\Russian\inflectName;

class DelayCustomerMessageGeneratorService extends DocumentGeneratorService
{
    public function __construct()
    {
        $templatePath = storage_path('app/templates/DelayStageExecutor.docx');
        parent::__construct($templatePath);
    }

    public function generate(array $data)
    {
        // Проверка обязательных данных
        $requiredFields = ['projectData', 'delegationData', 'dateOffer', 'delegationOrgData', 'delay'];
        foreach ($requiredFields as $field) {
            if (!isset($data[$field])) {
                throw new Exception("Отсутствует необходимый параметр: $field.");
            }
        }

        // Извлечение данных
        $projectData = $data['projectData'];
        $delegation = $data['delegationData'];
        $dateOffer = $data['dateOffer'];
        $delay = $data['delay'];
        $delegationOrgData = $data['delegationOrgData'];

        // Форматирование даты и номера документа
        $contractNumber = FormatterService::formatWithLeadingZeros(count($projectData->project_kp_history) + 1, 2);
        $fullDate = FormatterService::getFullDate($dateOffer, true);
        $myOrg = FormatterService::getMyOrg();

        // Подготовка основных данных для вставки в шаблон
        $this->replacements = [
            'myOrg.full_adress' => $myOrg['address_legal'] . ', тел. ' . $myOrg["phone_number"] . ', E-mail: ' . $myOrg["email"],
            'myOrg.full_name' =>   $myOrg['legal_form']->name . " " .  $myOrg['name']  ,
            'message.full_date' => mb_strtolower($fullDate),
            'message.number' => "№" . $contractNumber,
            'delegate_org.director.positions' => FormatterService::mb_ucfirst(mb_strtolower(inflectName($delegation['position']['name'], 'дательный'))),
            'delegate_org.name' => $delegationOrgData['name'],
            'delegate_org.type_org' => $delegationOrgData['legal_form']->name,
            'project.main_delegation_short_nameDG' => (new NCLNameCaseRu())->q(FormatterService::getFullName($delegation['last_name'], $delegation['first_name'], $delegation['patronymic'], true, true), NCLNameCaseRu::$DATELN),
            'project.main_delegation_full_name' => $delegation['first_name'] . ' ' . $delegation['patronymic'],
            'project.full_name_and_date' =>'"'. $projectData['name'] .'"'. ' от ' . FormatterService::getShortDate($projectData['date_signing']),
            'project.number_and_date' =>'"'. $projectData['number'] .'"'. ' от ' . FormatterService::getShortDate($projectData['date_signing']),

            'delegate_org.full_name' => $delegationOrgData['legal_form']->name . " " .  $delegationOrgData['name']  ,
           ];

        $this->replaceValues();

        // Сохранение файла
        $this->saveDocument($projectData['number'] . '_оповещения_о_задержке_на_проекте.docx');
        $storagePath = "/" . $projectData->path_project_folder . "/ОПОВЕЩЕНИЕ_ДЛЯ_ЗАКАЗЧИКА/" . $this->fileName;

        // Фиксация в базе
        $file = $this->saveFileToProject($storagePath, $this->filePath, $this->fileName);
        ProjectFile::create([
            'project_id' => $projectData->id,
            'file_id' => $file->id,
            'type' => "DELAY_MAIL",
            'number' => $contractNumber,
            'date_document' => $dateOffer,
        ]);

        return $file->id;
    }
}
