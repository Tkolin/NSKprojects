<?php

namespace App\Services\FileGenerate;

use App\Services\FileGenerate\GeneratorService;
use App\Services\MonthEnum;
use App\Services\TranslatorNumberToName;
use PhpOffice\PhpWord\TemplateProcessor;

class PaymentInvoiceTemplateGeneratorService
{


    public static function generate($project, $stageNumber, $isPrepayment)
    {
        $myOrg = GeneratorService::getOrganizationData();
        function padZeros($input, $length) {
            // Преобразуем входное значение в строку, если оно не является строкой
            $str = (string)$input;

            // Добавляем нули в начало строки до указанной длины
            while (strlen($str) < $length) {
                $str = '0' . $str;
            }

            return $str;
        }
        $templateFilePath = storage_path('app/templates/PaymentInvoiceTemplate.docx');
        $tempFilePath = tempnam(sys_get_temp_dir(), 'lolp');
        copy($templateFilePath, $tempFilePath);
        error_log("Этапы " . $isPrepayment . $stageNumber);
        $templateProcessor = new TemplateProcessor($tempFilePath);


        $date = $project["date_create"];
        $dateComponents = explode('-', $date);

        $year = $dateComponents[0] ?? "__";
        $month = $dateComponents[1];
        $monthName = $dateComponents[1] ? MonthEnum::getMonthName($dateComponents[1]) : "__";
        $day = $dateComponents[2] ?? "__";
        $TranslatorNumberToName = new TranslatorNumberToName();
        $projectStage = $isPrepayment  ?
        [
                'price_to_paid' => $project["price"] * ($project["prepayment"] / 100),
                'stage' => ['name' => 'Аванс', 'id' => 0],
                'percent' => $project['prepayment'],
                'number' => ' '
            ]
            :
            $project->project_stages->where('number', $stageNumber)->first();
        $myOrgPhone = $myOrg["phone_number"];
        $formattedPhone = preg_replace('/\+(\d{1,2})?(\d{3})(\d{3})(\d{2})(\d{2})/', '+$1 ($2) $3-$4-$5', $myOrgPhone);

        $replacements = [

            'createNewProject.number' => $project['number'] ?? '(данные отсутвуют)',
            'createNewProject.name' => $project['name'] ?? '(данные отсутвуют)',


            'dayCreate' => $day,
            'mountCreate' => $month,
            'mountName' => $monthName,
            'yearCreate' => $year,
            'projectStages.stage.priceTotal' => $project['price'] ?? '(данные отсутвуют)',
            'projectStages.stage.endPriceTotal' => $project['price'] ?? '(данные отсутвуют)',

            'myOrg.director.position' => $myOrg['director']['position']['name'] ?? '(данные отсутвуют)',
            'myOrg.nameOrType' => $myOrg["legal_form"]['name'] . " " . $myOrg['name'],
            'myOrg.director.ShortFullName' => $myOrg['director']['last_name'] . ' ' . substr((string)$myOrg['director']['first_name'], 0, 2) . '.' . substr((string)$myOrg['director']['patronymic'], 0, 2) . '.',
            'projectOrganization.director.ShortFullName' => isset($project["organization_customer"]['director']) ?
                $project["organization_customer"]['director']['last_name'] . ' ' . substr((string)$project["organization_customer"]['director']['first_name'], 0, 2) . '.' . substr((string)$project["organization_customer"]['director']['patronymic'], 0, 2) . '.' : '',
            'projectOrganization.nameOrType' => isset($project["organization_customer"]) ? $project["organization_customer"]["legal_form"]['name'] . " " . $project["organization_customer"]['name'] : "(данные отсутвуют)",
            'projectOrganization.director.position' => $project["organization_customer"]['director']['position']['name'] ?? '(данные отсутвуют)',

            'projectStages.stage.finalPrice' => number_format($projectStage['price_to_paid'], 2, ',', ' ') ?? '(данные отсутвуют)',

            'projectStages.stage.name' => isset($projectStage['stage']) ? ($projectStage['stage']['id'] == 0) ? $projectStage['stage']['name'] : 'Выполнение работ ' : "'(данные отсутвуют)",
            'projectStages.stage.percent' => isset($projectStage['stage']) ? ($projectStage['stage']['id'] == 0) ? $projectStage['percent'] . '% ' : '' : "",

            'projectStages.stage.price' => number_format($projectStage['price_to_paid']  , 2, ',', ' ') ?? '(данные отсутвуют)',
            'projectStages.stage.endPrice' => number_format($projectStage['price_to_paid']  , 2, ',', ' ') ?? '(данные отсутвуют)',
            'projectStages.stage.sumEndPrice' => number_format($projectStage['price_to_paid'] , 2, ',', ' ') ?? '(данные отсутвуют)',

            'projectStages.stage.finalPriceToString' => isset($projectStage['price_to_paid']) ? $TranslatorNumberToName->num2str($projectStage['price_to_paid']) : "___",


            'projectOrganization.INN' => $project["organization_customer"]['INN'] ?? '(данные отсутвуют)',
            'projectOrganization.KPP' => $project["organization_customer"]['KPP'] ?? '(данные отсутвуют)',
            'projectOrganization.address_legal' => $project["organization_customer"]['address_legal'] ?? '(данные отсутвуют)',


            'myOrg.INN' => $myOrg['INN'] ?? '(данные отсутвуют)',
            'myOrg.KPP' => $myOrg['KPP'] ?? '(данные отсутвуют)',
            'myOrg.address_legal' => $myOrg['address_legal'] ?? '(данные отсутвуют)',
            'myOrg.styled_phone' => $formattedPhone ?? '(данные отсутвуют)',
            'myOrg.BIK.bik' => $myOrg['bik']['BIK'] ?? '(данные отсутвуют)',
            'myOrg.BIK.name' => $myOrg['bik']['name'] ?? '(данные отсутвуют)',
            'myOrg.BIK.correspondent_account' => $myOrg['BIK']['correspondent_account'] ?? '(данные отсутвуют)',
            'myOrg.payment_account' => $myOrg['payment_account'] ?? '(данные отсутвуют)',

            'pay.numb' => "Д".padZeros($project["organization_customer"]['id'],4)."-".padZeros($projectStage['id'] ?? $project['id'],4),
            'date.new' => date('d.m.Y'),
        ];

        foreach ($replacements as $key => $value) {
            $templateProcessor->setValue($key, $value);
        }

        //        $templateProcessor->cloneRowAndSetValues('projectStages.number' , $table);
        $currentDate = date('Ymd');

        $fileName = $project['number'] . '_СЧЕТ_НА_ОПЛАТУ' . ($stageNumber ? ("_НОМЕР_" . $stageNumber) : "_АВАНС") . '.docx';

        $filePath = storage_path('app/' . $fileName);
        $templateProcessor->saveAs($filePath);

        // Удаление временного файла
        unlink($tempFilePath);

        return $fileName;
    }


}
