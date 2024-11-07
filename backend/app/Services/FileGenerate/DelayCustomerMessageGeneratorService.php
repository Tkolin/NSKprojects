<?php

namespace App\Services\FileGenerate;

use App\Models\ProjectFile;
use App\Services\NameCaseLib\NCLNameCaseRu;
use DateTime;
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
        $requiredFields = ['projectData',  'dateOffer', 'delegationOrgData', 'delay'];
        foreach ($requiredFields as $field) {
            if (!isset($data[$field])) {
                throw new Exception("Отсутствует необходимый параметр: $field.");
            }
        }

        // Извлечение данных
        $projectData = $data['projectData'];
         $dateOffer = $data['dateOffer'];
        $delay = $data['delay'];
        $projectStageData = $data['projectStageData'];
        $delegationOrgData = $data['delegationOrgData'];
        $delegation  = $delegationOrgData->director  ;

        // Форматирование даты и номера документа
        $contractNumber = FormatterService::formatWithLeadingZeros(count($projectData->project_kp_history) + 1, 2);
        $fullDate = FormatterService::getFullDate($dateOffer, true);
        $shortDate = FormatterService::getShortDate($dateOffer);
        $myOrg = FormatterService::getMyOrg();

        $delay_type = $delay->delay_type;
        // Подготовка основных данных для вставки в шаблон
        $this->replacements = [
            'myOrg.full_adress' => $myOrg['address_legal'] . ', тел. ' . $myOrg["phone_number"] . ', E-mail: ' . $myOrg["email"],
            'myOrg.full_name' => $myOrg['legal_form']->name . " " . $myOrg['name'],
            'message.full_date' => mb_strtolower($fullDate),
            'message.number' => "№" . $contractNumber,
            'delegate_org.director.positions' => FormatterService::mb_ucfirst(mb_strtolower(inflectName($delegation['position']['name'], 'дательный'))),
            'delegate_org.name' => $delegationOrgData['name'],
            'delegate_org.type_org' => $delegationOrgData['legal_form']->name,
            'project.main_delegation_short_nameDG' => (new NCLNameCaseRu())->q(FormatterService::getFullName($delegation['last_name'], $delegation['first_name'], $delegation['patronymic'], true, true), NCLNameCaseRu::$DATELN),
            'project.main_delegation_full_name' => $delegation['first_name'] . ' ' . $delegation['patronymic'],
            'project.full_name_and_date' => '"' . $projectData['name'] . '"' . ' от ' . FormatterService::getShortDate($projectData['date_signing']),
            'project.number_and_date' => $projectData['number'] . ' от ' . FormatterService::getShortDate($projectData['date_signing']),

            'delegate_org.full_name' => $delegationOrgData['legal_form']->name . " " . $delegationOrgData['name'],
            'mainContentdBlockContent' => "1) " . $delay_type['content'],
        ];

        $this->replaceValues();

        $this->replacements = [

        ];


        if (isset($delay["delay_type_key"])) {
            switch ($delay["delay_type_key"]) {
                case ("CUSTOMER_INCONSISTENT_REQUIREMENTS"):

                    break;
                case ("NO_IRD"):
                    $noIrdText = "";
                    $irdDelayText = "";
                    $noIrdIndex = 1;
                    $irdDelayIndex = 1;
                    $project_irds = $projectData->project_irds;
                    foreach ($project_irds as $key => $ird) {
                        error_log($ird["received_date"]);
                        if ($ird["stage_number"] === $projectStageData["number"] && $ird["received_date"] === null) {
                            $noIrdText .= $noIrdIndex . ") " . $ird->ird["name"] . ".</w:t><w:p/><w:t>";
                            $noIrdIndex++;
                        } else if ($ird["stage_number"] === $projectStageData["number"] && new DateTime($ird["received_date"]) >= new DateTime()) {
                            if ($irdDelayIndex === 1) {
                                $irdDelayText .= " Передана с задержкой: </w:t><w:p/><w:t>";
                            }
                            $irdDelayText .= $irdDelayIndex . ") " . $ird->ird["name"] . " (передана: " . FormatterService::getShortDate($ird["received_date"]) . ")" . ".</w:t><w:p/><w:t> ";
                            $irdDelayIndex++;
                        }
                    }
                    $this->replacements = [
                        'date_generated' => $shortDate,
                        'noIrdContent' => substr($noIrdText, 0, -17),
                        'irdDelayContent' => substr($irdDelayText, 0, -17),
                    ];

                    $this->replaceValues();
                    break;
                case ("NO_PREPAYMENT"):
                    $this->replacements = [
                        // 'project_payment.number_and_date' => $projectData->project_stages[$delayStageIncludes]->payment_invoice_file["document_number"],
                        // 'project_act.number_and_date' => $projectData->project_stages[$delayStageIncludes]->act_rendering_file["document_number"],
                        // 'project.stage_number' => $projectData->project_stages[$delayStageIncludes]->number,
                        // 'project.stage_name' => $projectData->project_stages[$delayStageIncludes]->stage->name,
                    ];

                    $this->replaceValues();
                    break;
                case ("NO_PAYMENT"):
                    $this->replacements = [
                        'project_payment.number_and_date' =>"projectStageData->payment_invoice_file_id",
                        'project_act.number_and_date' => "projectData->project_stages[delayStageIncludes]->act_rendering_file[document_number]",
                        'project.stage_number' =>$projectStageData["number"],
                        'project.stage_name' => $projectStageData->stage["name"],
                    ];

                    $this->replaceValues();
                    break;
                case ("NO_WORK_ACT"):
                $this->replacements = [
                     'project_act.number_and_date' => "projectData->project_stages[delayStageIncludes]->act_rendering_file[document_number]",
                    'project.stage_number' => $projectStageData["number"],
                    'project.stage_name' => $projectStageData->stage["name"] ,
                ];

                $this->replaceValues();
                    break;
                case ("BROKEN_IRD"):
                $irdBrokenText = "";
                $irdBrokenIndex = 1;
                $project_irds = $projectData->project_irds;
                foreach ($project_irds as $key => $ird) {
                    error_log($ird["received_date"]);
                    if ($ird["stage_number"] === $projectStageData["number"] && $ird["is_broken"]) {
                        $irdBrokenText .= $irdBrokenIndex . ") " . $ird->ird["name"] . ".</w:t><w:p/><w:t>";
                        $irdBrokenIndex++;
                    }
                }
                $this->replacements = [
                    'date_generated' => $shortDate,
                    'brokeIrdContainer' => substr($irdBrokenText, 0, -17),
                ];

                $this->replaceValues();
                    break;
            }
        }


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
