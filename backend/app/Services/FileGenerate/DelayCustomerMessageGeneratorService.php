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
        $requiredFields = ['projectData', 'dateOffer', 'delegationOrgData', 'delay'];
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
        $delegation = $delegationOrgData->director;

        // Форматирование даты и номера документа
        $contractNumber = FormatterService::formatWithLeadingZeros(count($projectData->project_kp_history) + 1, 2);
        $fullDate = FormatterService::getFullDate($dateOffer, true);
        $shortDate = FormatterService::getShortDate(date: $dateOffer);
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
            'mainContentdBlockContent' => "1. " . $delay_type['content'],
        ];

        $this->replaceValues();

        if (isset($delay["delay_type_key"])) {
            switch ($delay["delay_type_key"]) {
                case "BROKEN_IRD":
                    $irdsTextContent = "";
                    $index = 0;
                    $actualProjectIrds = $projectData->project_irds;
                    foreach ($actualProjectIrds as $key => $pIrd) {
                        error_log("pIrd" . $pIrd);
                        if ($pIrd->stage_number === $projectStageData->number && $pIrd->is_broken === 1 && isset($pIrd["received_date"])) {
                            $index++;
                            $irdsTextContent .= $index . ". " . $pIrd->ird["name"] . " (от " . FormatterService::getShortDate($pIrd["received_date"]) . ");</w:t><w:p/><w:t>";
                        }
                    }
                    if ($index === 0)
                        throw new \Exception('Отсутвует забракованное ИРД.');
                    $this->replacements = [
                        'brokeIrdContainer' => $irdsTextContent,
                        'date_generated' => FormatterService::getShortDate($dateOffer)
                    ];
                    $this->replaceValues();

                    break;
                case "CUSTOMER_INCONSISTENT_REQUIREMENTS":
                    $this->replacements = [];
                    $this->replaceValues();
                    break;
                case "NO_IRD":
                    $noIrdContent = "";
                    $index = 0;

                    // Получаем коллекцию
                    $actualProjectIrds = $projectData->project_irds;

                    if (!$actualProjectIrds || $actualProjectIrds->isEmpty()) {
                        throw new \Exception('Нет данных для обработки ИРД.');
                    }

                    foreach ($actualProjectIrds as $pIrd) {
                        if ($pIrd->stage_number === $projectStageData["number"] && is_null($pIrd->received_date)) {
                            $index++;
                            $noIrdContent .= $index . ". " . $pIrd->ird->name . ";</w:t><w:p/><w:t>";
                        }
                    }

                    if ($index === 0) {
                        throw new \Exception('Отсутствуют недостающие ИРД.');
                    }

                    $this->replacements = [
                        'noIrdContent' => $noIrdContent,
                        'date_generated' => FormatterService::getShortDate($dateOffer)
                    ];
                    $this->replaceValues();
                    break;

                case "NO_PAYMENT":
                    //Согласно пунктам 5.4., 5.5., 5.10., если оплата выполненных работ со стороны Заказчика с задержкой большей чем предусмотрено в договоре, 
                    //работы по проекту останавливаются до полного погашения задолженности, должна проводиться в течении 5 рабочих дней. Счет ${project_payment.number_and_date},
                    //    по этапу № ${project.stage_number} «${project.stage_name}»
                    $projectStageData["dateStart"];
                    // TODO: if (isset($projectStageData["payment_date"]))
                    //     throw new \Exception('Счёт уплачен.');
                    error_log("projectStageData" . $projectStageData);
                    $this->replacements = [
                        'project.stage_number' => $projectStageData["number"],
                        'project.stage_name' => $projectStageData->stage["name"],
                        'project_payment.number_and_date' => $projectStageData->payment_file->document_number . " (от " . FormatterService::getShortDate($projectStageData->payment_file["date_document"]) . " )",
                        'project_act.number_and_date' => $projectStageData->work_act_file["document_number"] . " (от " . FormatterService::getShortDate(date: $projectStageData->work_act_file["date_document"]) . " )",

                    ];
                    $this->replaceValues();
                    break;
                case "NO_PREPAYMENT":
                    //Согласно пунктам 5.4., 5.5., 5.10., если оплата выполненных работ со стороны Заказчика с задержкой большей 
                    //чем предусмотрено в договоре, работы по проекту останавливаются до полного погашения задолженности, должна 
                    //проводиться в течении 5 рабочих дней. Счет ${project_payment.number_and_date}, Акт ${project_act.number_and_date},
                    //  по этапу № ${project.stage_number} «${project.stage_name}»
                    if (isset($projectData["prepayment_date"]))
                        throw new \Exception('Счёт уплачен.');


                    break;
                case "NO_SINGING_ADDITIONAL_AGREEMENT":
                    //Согласно пункту 3.2., изменения требований и спецификаций проекта отличные от технического задания со 
                    //стороны Заказчика должны оформляться дополнительным соглашением.

                    $this->replacements = [
                        "project.typeProject.Specification" => $projectData["type_project_document"]["group"]["technical_specification"],
                    ];
                    $this->replaceValues();
                    break;
                case "NO_WORK_ACT":
                    //Согласно пункту 4.2., подписание акта сдачи-приемки выполненных работ со стороны Заказчика должна проводиться
                    // в течении 10 дней. </w:t><w:p/><w:t>Не подписаный акт:  ${project_act.number_and_date}  
                    //по этапу  №${project.stage_number}  «${project.stage_name}»
                    if (isset($projectStageData["work_act_singing_date"]))
                        throw new \Exception('Акт подписан уплачен.');

                    $this->replacements = [
                        'project.stage_number' => $projectStageData["number"],
                        'project.stage_name' => $projectStageData->stage["name"],
                        'project_act.number_and_date' => $projectStageData->work_act_file["document_number"] . " (от " . FormatterService::getShortDate($projectStageData->payment_file["date_document"]) . " )",

                    ];
                    $this->replaceValues();
                    break;
                case "OTHER_PROBLEM":
                    throw new \Exception('По иным проблемам уведомление не создаёться.');

                    break;

            }
        }


        // Сохранение файла
        error_log("check" . $projectData->number);
        $this->saveDocument($projectData->number . '_ОПОВЕЩЕНИЕ_О_ЗАДЕРЕЖКЕ_НА_ПРОЕКТЕ.docx');
        $storagePath = "/" . $projectData->path_project_folder . "/Уведомления о задержках/" . $this->fileName;

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
