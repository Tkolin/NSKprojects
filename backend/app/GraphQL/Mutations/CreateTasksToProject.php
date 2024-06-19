<?php declare(strict_types=1);

namespace App\GraphQL\Mutations;

use App\Models\Project;
use App\Models\ProjectTaskExecutor;
use App\Models\ProjectTasks;
use App\Models\ProjectTasksInherited;

final readonly class CreateTasksToProject
{
    /** @param array{} $args */
    public function __invoke(null $_, array $args)
    {
        $projectId = $args['data'][0]['project_id'];
        $newTaskIds = [];
        $newStageNumbers = [];

        // Массив для хранения соответствий task_id и их ID в таблице project_tasks
        $taskIdsMap = [];
        // Массив для отслеживания новых связей
        $newInheritedTasks = [];

        // Обновляем или создаем записи для каждой задачи
        foreach ($args['data'] as $taskData) {
            $projectTask = ProjectTasks::updateOrCreate([
                'project_id' => $taskData['project_id'],
                'task_id' => $taskData['task_id'],
                'stage_number' => $taskData['stage_number']
            ],
                [
                    'project_id' => $taskData['project_id'] ?? null,
                    'task_id' => $taskData['task_id'] ?? null,
                    'stage_number' => $taskData['stage_number'] ?? null,
                    'date_start' => $taskData['date_start'] ?? null,
                    'date_end' => $taskData['date_end'] ?? null,
                ]);

            // Сохраняем ID созданной или обновленной записи
            $taskIdsMap[$taskData['task_id']] = $projectTask->id;

            // Сохраняем task_id и stage_number для дальнейшей проверки
            $newTaskIds[] = $taskData['task_id'];
            $newStageNumbers[] = $taskData['stage_number'];
        }

        // Получаем список всех существующих записей для данного проекта
        $existingTasks = ProjectTasks::where('project_id', $projectId)->get();

        // Удаляем записи из project_tasks_inherited, которые не присутствуют в новых данных
        $existingInheritedTasks = ProjectTasksInherited::whereIn('project_task_id', $existingTasks->pluck('id'))
            ->orWhereIn('project_inherited_task_id', $existingTasks->pluck('id'))
            ->get();

        foreach ($existingInheritedTasks as $existingInheritedTask) {
            $existsInNew = false;
            foreach ($args['data'] as $taskData) {
                if (isset($taskData['inherited_from_task_id'])) {
                    $inheritedFromTaskId = $taskData['inherited_from_task_id'];
                    if (isset($taskIdsMap[$inheritedFromTaskId])) {
                        $projectTaskId = $taskIdsMap[$taskData['task_id']];
                        $projectInheritedTaskId = $taskIdsMap[$inheritedFromTaskId];

                        if ($existingInheritedTask->project_task_id == $projectTaskId &&
                            $existingInheritedTask->project_inherited_task_id == $projectInheritedTaskId) {
                            $existsInNew = true;
                            break;
                        }
                    }
                }
            }
            if (!$existsInNew) {
                $existingInheritedTask->delete();
            }
        }

        // Удаляем записи из project_tasks, которые не присутствуют в новых данных
        foreach ($existingTasks as $existingTask) {
            if (!in_array($existingTask->task_id, $newTaskIds) || !in_array($existingTask->stage_number, $newStageNumbers)) {
                $existingTask->delete();
            }
        }

        // Обновляем таблицу project_tasks_inherited
        foreach ($args['data'] as $taskData) {
            if (isset($taskData['inherited_from_task_id'])) {
                $inheritedFromTaskId = $taskData['inherited_from_task_id'];

                if (isset($taskIdsMap[$inheritedFromTaskId])) {
                    $projectTaskId = $taskIdsMap[$taskData['task_id']];
                    $projectInheritedTaskId = $taskIdsMap[$inheritedFromTaskId];

                    ProjectTasksInherited::updateOrCreate([
                        'project_task_id' => $projectTaskId,
                        'project_inherited_task_id' => $projectInheritedTaskId
                    ]);
                }
            }
        }

        return Project::where('id', $projectId)->first();
    }
}
