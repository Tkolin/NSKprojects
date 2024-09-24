<?php declare(strict_types=1);

namespace App\GraphQL\Queries;

use App\Models\ExecutorOrder;
use App\Models\Project;

final readonly class ExecutorOrders
{
    /** @param array{} $args */
    public function __invoke(null $_, array $args)
    {
        // Retrieve all executor orders with related payments and project tasks
//        $result = ExecutorOrder::with("executor_order_payments", "project_tasks")->get()->map(function ($order) {
//            return [
//                ...$order->toArray(),
//                'is_project_completed' => $order->isProjectCompleted(),
//                'is_tasks_completed' => $order->isTaskCompleted(), // Add task completion status
//                'payment_file_completed' => $order->getFilesPaymentsTypes() // Add payment file completion status
//            ];
//        });

        if (isset($args['projectId'])) {
            // Find the project
            $project = Project::find($args['projectId']);
            if (!$project) {
                return []; // Return an empty array if the project is not found
            }

            // Find all project tasks with the specified executor
            $projectTasks = $project->project_tasks();
            if (isset($args['executorId'])) {
                $projectTasks->where('executor_id', $args['executorId']);
            }
            $projectTasks = $projectTasks->get();

            // Collect all task IDs
            $taskIds = $projectTasks->pluck('id')->toArray();

            // Find all orders associated with these tasks
            $result = ExecutorOrder::whereHas('project_tasks', function ($query) use ($taskIds) {
                $query->whereIn('id', $taskIds); // Added condition for signed_file_id not null
            })->with("project_tasks")->get()->map(function ($order) {
                return [
                    ...$order->toArray(),
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
