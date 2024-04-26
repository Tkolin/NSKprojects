<?php declare(strict_types=1);

namespace App\GraphQL\Mutations;

use App\Models\ProjectTaskExecutor;
use App\Models\ProjectTasks;
use App\Models\ProjectTasksInherited;
use DateTime;

final readonly class UpdateTaskToProject
{
    /** @param array{} $args */
    public function __invoke(null $_, array $args)
    {

        $id = $args["data"]["id"];
        $projectId = $args["data"]["projectId"];
        $task_id = $args["data"]["task_id"];
        $date_start = isset($args["data"]["date_start"]) ? substr((string)$args["data"]["date_start"], 0, 10) : null;
        $date_end = isset($args["data"]["date_end"]) ? substr((string)$args["data"]["date_end"], 0, 10) : null;
        $inherited_task_ids = $args["data"]["inherited_task_ids"];
        $price = $args["data"]["price"];
        $executors = $args["data"]["executors"];
        //$description = $args["data"]["description"];
        $startDate = new DateTime($date_start);
        $endDate = new DateTime($date_end);
        $duration = $startDate->diff($endDate)->days;
        // Update ProjectTasks
        $projectTasks = ProjectTasks::where('id', $id)
            ->update([
                'price' => $price ?? null,
                'date_start' => $date_start ?? null,
                'date_end' => $date_end ?? null,
                'duration' => $duration + 1,
                'task_id' => $task_id
            ]);
        error_log("projectTasks " . $projectTasks);

        // Update or create ProjectTasksInherited
        if (isset($inherited_task_ids))
            foreach ($inherited_task_ids as $j) {
                ProjectTasksInherited::updateOrCreate(
                    ['project_task_id' => $id, 'project_inherited_task_id' => $j],
                    ['project_task_id' => $id ?? null, 'project_inherited_task_id' => $j ?? null]
                );
            }
        // Update or create ProjectTaskExecutor for each executor
        if (isset($executors))
            foreach ($executors as $executor) {
                ProjectTaskExecutor::updateOrCreate(
                    ['project_tasks_id' => $id, 'executor_id' => $executor['executor_id']],
                    ['price' => $executor['price'] ?? null]
                );
            }

        // Удаление записей, которых нет в списке
        ProjectTasksInherited::where('project_task_id', $id)
            ->whereNotIn('project_inherited_task_id', $inherited_task_ids)
            ->delete();

        // Удаление записей, которых нет в списке
        $executorIdsToDelete = array_column($executors, 'executor_id');
        ProjectTaskExecutor::where('project_tasks_id', $id)
            ->whereNotIn('executor_id', $executorIdsToDelete)
            ->delete();

        return 1;
    }
}
