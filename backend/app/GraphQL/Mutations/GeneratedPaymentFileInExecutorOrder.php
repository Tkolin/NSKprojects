<?php declare(strict_types=1);

namespace App\GraphQL\Mutations;

use App\Models\ExecutorOrder;
use App\Models\ExecutorOrderPayment;
use App\Models\Organization;
use App\Models\Passport;
use App\Models\Person;
use App\Services\FileGenerate\FormatterService;
use Cache;
use Storage;

final readonly class GeneratedPaymentFileInExecutorOrder
{
    /** @param  array{}  $args */
    public function __invoke(null $_, array $args)
    {
        $template = <<<EOD
SIBNIPI_ERP
ВерсияФормата=1.03
Кодировка=Windows
Отправитель=Бухгалтерия предприятия
Получатель=
ДатаСоздания={\$paycheck['creationDate']}
ВремяСоздания={\$paycheck['creationTime']}
ДатаНачала={\$paycheck['startDate']}
ДатаКонца={\$paycheck['endDate']}
РасчСчет={\$payer['account']}
Документ=Платежное поручение
СекцияДокумент=Платежное поручение
Номер={\$paycheck['documentNumber']}
Дата={\$paycheck['documentDate']}
Сумма={\$paycheck['amount']}
ПлательщикСчет={\$payer['account']}
Плательщик=ИНН {\$payer['inn']} {\$payer['name']}
ПлательщикИНН={\$payer['inn']}
Плательщик1={\$payer['name']}
ПлательщикРасчСчет={\$payer['account']}
ПлательщикБанк1={\$payer['bankName']}
ПлательщикБанк2={\$payer['bankCity']}
ПлательщикБИК={\$payer['bik']}
ПлательщикКорсчет={\$payer['corrAccount']}
ПолучательСчет={\$recipient['account']}
Получатель=ИНН {\$recipient['inn']} {\$recipient['name']}
ПолучательИНН={\$recipient['inn']}
Получатель1={\$recipient['name']}
ПолучательРасчСчет={\$recipient['account']}
ПолучательБанк1={\$recipient['bankName']}
ПолучательБанк2={\$recipient['bankCity']}
ПолучательБИК={\$recipient['bik']}
ПолучательКорсчет={\$recipient['corrAccount']}
ВидОплаты={\$paycheck['paymentType']}
Очередность={\$paycheck['paymentOrder']}
НазначениеПлатежа=Оплата по договору {\$project['number']} от {\$custom['formattedDateSinging']} {\$custom['tasksText']} по проекту «{\$project['name']}» Сумма {\$paycheck['amount']} Без налога (НДС)
НазначениеПлатежа1=Оплата по договору {\$project['number']} от {\$custom['formattedDateSinging']} {\$custom['tasksText']} по проекту «{\$project['name']}»
НазначениеПлатежа2=Сумма {\$paycheck['amountFormatted']}
НазначениеПлатежа3=Без налога (НДС)
КонецДокумента
КонецФайла
EOD;

        $order = ExecutorOrder::find($args['executorOrderId']);

        $payment_coefficient = [
            'PREPAYMENT' => 0.3,
            'PAYMENT' => 0.3,
            'POSTPAYMENT' => 0.4,
        ];

        $payment_key = $args["paymentModeKey"];
        $actual_amount = round($order->get_price() * $payment_coefficient[$payment_key], 2);
        $actual_amount = number_format($actual_amount, 2, '.', '');
        $date_insert = date('d.m.Y');
        $time_insert = date('H:i:s');
        $counter = Cache::increment('payment_order_counter', 1);

        $paycheck = [
            'creationDate' => $date_insert,
            'creationTime' => $time_insert,
            'startDate' => $date_insert,
            'endDate' => $date_insert,
            'documentNumber' => $counter,
            'documentDate' => $date_insert,
            'amount' => $actual_amount,
            'amountFormatted' => $actual_amount,
            'paymentType' => '01',
            'paymentOrder' => '1',
        ];

        $my_organization_data = Organization::find(0);
        $payer = [
            'account' => $my_organization_data["payment_account"],
            'inn' => $my_organization_data->INN,
            'name' => $my_organization_data->legal_form->name . " " . $my_organization_data->name,
            'bankName' => $my_organization_data->bik->name,
            'bankCity' => 'г. ' . $my_organization_data->bik->city,
            'bik' => $my_organization_data->bik->BIK,
            'corrAccount' => $my_organization_data->bik->correspondent_account,
        ];
        error_log("sfaf");
        $project = $order->fetchProject();
        $person = $order->get_executor();
        $custom = [
            'formattedDateSinging' => FormatterService::getShortDate($project['date_signing']),
            'tasksText' => ' (' . $order->project_tasks
                ->where("executor_id", "=", $person->id)
                ->pluck('task.name') // Извлекаем названия задач
                ->filter() // Убираем пустые значения, если они есть
                ->implode(', ') // Объединяем в строку через запятую 
                . '), ',
        ];
        $executor_key = $args["executorOrderId"];

        $recipient = [
            'account' => $person->payment_account,
            'inn' => $person->INN,
            'name' => $person->passport['last_name'] . " " . $person->passport['first_name'] . " " . $person->passport['patronymic'],
            'bankName' => $person->bik->name,
            'bankCity' => 'г. ' . $person->bik->city,
            'bik' => $person->bik->BIK,
            'corrAccount' => $person->bik->correspondent_account,
        ];

        $filledTemplate = eval ("return \"$template\";");
        $fileName = "ПлатПоруч_по_" . $order->number . "_для_" . $person->id . "_от_" . $date_insert . ".txt";
        $filePath = storage_path('app/public/temporary/' . $fileName);
        file_put_contents($filePath, $filledTemplate);

        // Публикация файла в хранилище
        $temporaryFilePath = 'temporary/' . $fileName;
        Storage::disk('public')->put($temporaryFilePath, file_get_contents($filePath));

        // Генерация публичной ссылки
        $url = Storage::disk('public')->url($temporaryFilePath);

        return $temporaryFilePath;

    }


}
