<?php declare(strict_types=1);

namespace App\GraphQL\Queries;

use App\Models\ExecutorOrder;

final readonly class FullExecutorOrders
{
    /** @param  array{}  $args */
    public function __invoke(null $_, array $args)
    {
        $result = ExecutorOrder::with("executor_order_payments")->with("project_tasks")->with("project_tasks.executor.passport")->where('signed_file_id', '!=', '0')->orderBy('updated_at', 'desc')->get()->map(function ($order) {
            return [
                ...$order->toArray(),
                'executor' => $order->project_tasks[0]->executor,
                'is_project_completed' => $order->isProjectCompleted(),
                'is_tasks_completed' => $order->isTaskCompleted(),
                'payment_file_completed' => $order->getFilesPaymentsTypes(),
                'is_project_prepayment' => $order->isProjectPrepayment(),
                'is_all_tasks_payment' => $order->isAllTasksPayment()

            ];
        });
        return $result;
    }
}
