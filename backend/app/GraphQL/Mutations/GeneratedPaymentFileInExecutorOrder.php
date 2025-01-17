<?php declare(strict_types=1);

namespace App\GraphQL\Mutations;

use App\Models\ExecutorOrder;
use App\Models\ExecutorOrderPayment;
use App\Models\Organization;
use App\Models\Passport;
use App\Models\Person;
use App\Services\FileGenerate\FormatterService;
use Cache;

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
НазначениеПлатежа=Оплата по договору {\$order['contractNumber']} от {\$order['contractDate']}. Разработка экон.части по проекту «{\$order['projectName']}» Сумма {\$order['amountFormatted']}-00 Без налога (НДС)
НазначениеПлатежа1=Оплата по договору {\$order['contractNumber']} от {\$order['contractDate']}. Разработка экон.части по проекту «{\$order['projectName']}»
НазначениеПлатежа2=Сумма {\$paycheck['amountFormatted']}-00
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
            'paymentType' => 'Перевод',
            'paymentOrder' => '1',
        ];
        $my_organization_data = Organization::find(0);
        $payer = [
            'account' => $my_organization_data["payment_account"],
            'inn' => $my_organization_data->INN,
            'name' => $my_organization_data->name,
            'bankName' => $my_organization_data->bik->name,
            'bankCity' => $my_organization_data->bik->city,
            'bik' => $my_organization_data->bik->BIK,
            'corrAccount' => $my_organization_data->bik->correspondent_account,
        ];
        $executor_key = $args["executorOrderId"];

        $person = $order->get_executor();
        error_log("sfaf" . $person->id);
        $recipient = [
            'account' => $person->payment_account,
            'inn' => $person->INN,
            'name' => FormatterService::getFullName($person->passport['last_name'], $person->passport['first_name'], $person->passport['patronymic'], true, true),
            'bankName' => $person->bik->name,
            'bankCity' => 'г. ' . $person->bik->city,
            'bik' => $person->bik->BIK,
            'corrAccount' => $person->bik->correspondent_account,
        ];

        $filledTemplate = eval ("return \"$template\";");

        $filePath = storage_path('app/public/payment_order.txt');
        file_put_contents($filePath, $filledTemplate);
        asset('storage/payment_order.txt');
        return
            "sss"
        ;
    }
}
