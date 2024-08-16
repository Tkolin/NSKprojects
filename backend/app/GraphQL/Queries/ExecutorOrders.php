<?php declare(strict_types=1);

namespace App\GraphQL\Queries;

use App\Models\ExecutorOrder;
use App\Models\PasspotPlaceIssue;
use App\Models\Project;
use App\Services\GrpahQL\QueryService;

final readonly class ExecutorOrders
{
    /** @param array{} $args */
    public function __invoke(null $_, array $args)
    {
        //TODOЖ: dev
        $result = ExecutorOrder::with("executor_order_payments")->with("project_tasks")->get()->map(function ($order) {
            return [
                ...$order->toArray(),
                'is_project_completed' => $order->isProjectCompleted(),
                'is_tasks_completed' => $order->isTaskCompleted(), // добавляем статус выполнения задач
                'payment_file_completed' => $order->getFilesPaymentsTypes() // добавляем статус выполнения задач
            ];
        });
        if (isset($args['projectId'])) {
            // Найти проект
            $project = Project::find($args['projectId']);
            if (!$project) {
                return [];
                // Найти все задачи проекта с указанным исполнителем
                $projectTasks = $project->project_tasks();
                if ($args['executorId'])
                    $projectTasks->where('executor_id', $args['executorId']);
                $projectTasks->get();
                // Собрать все id задач
                $taskIds = $projectTasks->pluck('id')->toArray();
                // Найти все приказы, связанные с этими задачами
                $result = ExecutorOrder::whereHas('project_tasks', function ($query) use ($taskIds) {
                    $query->whereIn('id', $taskIds);
                })->with("project_tasks")->get();
            }
            return $result;

        }
        return ExecutorOrder::with("executor_order_payments")->get();
    }
}
