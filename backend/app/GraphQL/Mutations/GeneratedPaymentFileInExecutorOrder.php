<?php declare(strict_types=1);

namespace App\GraphQL\Mutations;

use App\Models\ExecutorOrder;
use App\Models\ExecutorOrderPayment;
use App\Models\Organization;
use App\Models\Person;

final readonly class GeneratedPaymentFileInExecutorOrder
{
    /** @param  array{}  $args */
    public function __invoke(null $_, array $args)
    {
        // TODO implement the resolver
        $executorOrderId = $args["executorOrderId"];
        $paymentModeKey = $args["paymentModeKey"];

        $order = ExecutorOrder::find($executorOrderId);
        $payer = Organization::find(0);
        $recipient = Person::find($order->executor_id);

 

        $link = "sfaf";
        return $link;
            "1CClientBankExchange
            ВерсияФормата=1.03
            Кодировка=Windows
            Отправитель=Бухгалтерия предприятия, редакция 3.0
            Получатель= {$sendler}
            ДатаСоздания=14.01.2025{$sendler}
            ВремяСоздания=21:09:49{$sendler}
            ДатаНачала=14.01.2025{$sendler}
            ДатаКонца=14.01.2025{$sendler}
            РасчСчет=40702810302500128817{$sendler}
            Документ=Платежное поручение{$sendler}
            СекцияДокумент=Платежное поручение{$sendler}
            Номер=11{$sendler}
            Дата=14.01.2025{$sendler}
            Сумма=30000.00{$sendler}
            ПлательщикСчет=40702810302500128817{$sendler}
            Плательщик=ИНН 5402029908 ООО ПО "СИБНИПИ"{$sendler}
            ПлательщикИНН=5402029908{$sendler}
            Плательщик1=ООО ПО "СИБНИПИ"{$sendler}
            ПлательщикРасчСчет=40702810302500128817{$sendler}
            ПлательщикБанк1=ООО "Банк Точка"{$sendler}
            ПлательщикБанк2=г. Москва{$sendler}
            ПлательщикБИК=044525104{$payer->bik_number}
            ПлательщикКорсчет=30101810745374525104{$sendler}
            ПолучательСчет=40817810474002442558{$sendler}
            Получатель=ИНН 753612679378 Серебрякова Наталья Павловна{$sendler}
            ПолучательИНН=753612679378{$sendler}
            Получатель1=Серебрякова Наталья Павловна{$sendler}
            ПолучательРасчСчет=40817810474002442558{$sendler}
            ПолучательБанк1=ЧИТИНСКОЕ ОТДЕЛЕНИЕ  N8600 ПАО СБЕРБАНК{$sendler}
            ПолучательБанк2=г. Чита{$sendler}
            ПолучательБИК=047601637{$recipient->bik_number}
            ПолучательКорсчет=30101810500000000637{$sendler}
            ВидОплаты={$order->type_payment}
            Очередность={$order->iteration}
            НазначениеПлатежа=Оплата по договору 114-004-240001 от 24.09.2024. Разработка экон.части по проекту «Технический проект разработки золоторудного месторождения "Нявленга" Сумма 30000-00 Без налога (НДС){$sendler}
            НазначениеПлатежа1=Оплата по договору 114-004-240001 от 24.09.2024. Разработка экон.части по проекту «Технический проект разработки золоторудного месторождения "Нявленга"{$sendler}
            НазначениеПлатежа2=Сумма {$order->price}-00
            НазначениеПлатежа3=Без налога (НДС)
            КонецДокумента
            КонецФайла"
    }
}
