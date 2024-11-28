<?php declare(strict_types=1);

namespace App\GraphQL\Queries;

use App\Models\ExecutorOrder;
use App\Models\Project;

final readonly class ExecutorOrders
{
    /** @param array{} $args */
    public function __invoke(null $_, array $args)
    {
        if (isset($args['projectId'])) {
            $project = Project::find($args['projectId']);
            if (!$project) {
                return [];
            }

            $projectTasks = $project->project_tasks();
            if (isset($args['executorId'])) {
                $projectTasks->where('executor_id', $args['executorId']);
            }
            $projectTasks = $projectTasks->get();

            $taskIds = $projectTasks->pluck('id')->toArray();

            $result = ExecutorOrder::whereHas('project_tasks', function ($query) use ($taskIds) {
                $query->whereIn('id', $taskIds); // Added condition for signed_file_id not null
            })->with("executor_order_payments")->with("project_tasks.executor.passport")->get()->map(function ($order) {
                return [
                    ...$order->toArray(),
                    'executor' => $order->project_tasks[0]->executor,
                    'is_project_completed' => $order->isProjectCompleted(),
                    'is_tasks_completed' => $order->isTaskCompleted(),
                    'payment_file_completed' => $order->getFilesPaymentsTypes()
                ];
            });

            return $result;
        }

        return null; // Return the result if no projectId is specified
    }

}
