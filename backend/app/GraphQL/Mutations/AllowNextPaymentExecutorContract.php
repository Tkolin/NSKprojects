<?php declare(strict_types=1);

namespace App\GraphQL\Mutations;

use App\Models\ExecutorOrder;
use InvalidArgumentException;

final readonly class AllowNextPaymentExecutorContract
{
    /**
     * @param null $_
     * @param array{} $args
     * @throws InvalidArgumentException
     */
    public function __invoke(null $_, array $args): void
    {
        if (!isset($args["orderId"])) {
            throw new InvalidArgumentException('orderId is required.');
        }

        $orderId = $args["orderId"];
        $order = ExecutorOrder::find($orderId);

        if (!$order) {
            throw new InvalidArgumentException("Order with ID $orderId not found.");
        }

        if ($order->is_possible_mainpayment) {
            $order->is_possible_postpayment = true;
        } else {
            $order->is_possible_mainpayment = true;
        }

        $order->save();
    }
}
