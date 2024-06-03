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
        $createdTasks = [];

// 1. Создание родительских записей
        foreach ($args['data'] as $taskData) {
            $projectId = $taskData['projectId'];
            $task_id = $taskData['task_id'];
            $date_start = isset($taskData['date_start']) ? substr((string)$taskData['date_start'], 0, 10) : null;
            $date_end = isset($taskData['date_end']) ? substr((string)$taskData['date_end'], 0, 10) : null;
            $price = $taskData['price'] ?? null;
            $description = $taskData['description'] ?? null;
            $stage_number = $taskData['stage_number'] ?? null;

            $startDate = $date_start ? new DateTime($date_start) : null;
            $endDate = $date_end ? new DateTime($date_end) : null;
            $duration = $startDate && $endDate ? $startDate->diff($endDate)->days + 1 : null;

            // Создание родительской записи без зависимых
            $projectTasks = ProjectTasks::updateOrCreate(
                ['project_id' => $projectId, 'task_id' => $task_id],
                [
                    'stage_number' => $stage_number,
                    'price' => $price,
                    'date_start' => $date_start,
                    'date_end' => $date_end,
                    'duration' => $duration,
                    'description' => $description
                ]
            );

            // Сохраняем id только что созданной родительской записи
            $createdTasks[$projectId][$task_id] = $projectTasks->id;
        }
// 2. Создание зависимых записей
        foreach ($args['data'] as $taskData) {
            $projectId = $taskData['projectId'];
            $task_id = $taskData['task_id'];
            $inherited_task_ids = $taskData['inherited_task_ids'] ?? [];
            $executors = $taskData['executors'] ?? [];

            // Привязка зависимых записей к родительским
            foreach ($inherited_task_ids as $inheritedTaskId) {
                $main_task_id = $createdTasks[$projectId][$inheritedTaskId] ?? null;

                if ($main_task_id) {
                    ProjectTasksInherited::updateOrCreate(
                        ['project_task_id' => $createdTasks[$projectId][$task_id], 'project_inherited_task_id' => $main_task_id],
                        ['project_task_id' => $createdTasks[$projectId][$task_id], 'project_inherited_task_id' => $main_task_id]
                    );
                } else {
                    // Log or handle the error if the inherited task does not exist
                    error_log("Inherited task ID {$inheritedTaskId} does not exist in created tasks.");
                }
            }


            // Создание или обновление исполнителей
            foreach ($executors as $executor) {
                ProjectTaskExecutor::updateOrCreate(
                    ['project_tasks_id' => $createdTasks[$projectId][$task_id], 'executor_id' => $executor['executor_id']],
                    ['price' => $executor['price'] ?? null]
                );
            }

            // Удаление записей исполнителей, которых нет в списке executors
            if (isset($executors)) {
                $executorIdsToDelete = array_column($executors, 'executor_id');
                ProjectTaskExecutor::where('project_tasks_id', $createdTasks[$projectId][$task_id])
                    ->whereNotIn('executor_id', $executorIdsToDelete)
                    ->delete();
            }

            // Удаление записей inherited_task_ids, которых нет в списке inherited_task_ids
            if (isset($inherited_task_ids)) {
                ProjectTasksInherited::where('project_task_id', $createdTasks[$projectId][$task_id])
                    ->whereNotIn('project_inherited_task_id', $inherited_task_ids)
                    ->delete();
            }
        }

        return ProjectTasks::where('project_id', $args[0]['projectId'])->get();

    }
}
