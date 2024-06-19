<?php declare(strict_types=1);

namespace App\GraphQL\Mutations;

use App\Models\Project;
use App\Models\ProjectTaskExecutor;
use App\Models\ProjectTasks;
use App\Models\ProjectTasksInherited;
use DateTime;
use phpseclib3\Math\BigInteger\Engines\PHP\Reductions\PowerOfTwo;

final readonly class UpdateTaskToProject
{
    /** @param array{} $args */
    public function __invoke(null $_, array $args)
    {
        error_log("args".json_encode($args, JSON_PRETTY_PRINT));
        $tasks = $args["data"];

        $count = count($tasks);

        for ($i = 0; $i < $count; $i++) {
            $ProjectTask = ProjectTasks::findOrFail($tasks[$i]['id']);
            $ProjectTask->update($tasks[$i]);
        }
        return Project::where('id', $tasks[0]['projectId'])->first();

//        $createdTasks = [];
//        $projectId = 0;
//
//        // 1. Создание родительских записей
//        foreach ($args['data'] as $taskData) {
//            $projectId = $taskData['projectId'];
//            $task_id = $taskData['task_id'];
//            $date_start = isset($taskData['date_start']) ? substr((string)$taskData['date_start'], 0, 10) : null;
//            $date_end = isset($taskData['date_end']) ? substr((string)$taskData['date_end'], 0, 10) : null;
//            $price = $taskData['price'] ?? null;
//            $description = $taskData['description'] ?? null;
//            $stage_number = $taskData['stage_number'] ?? null;
//
//            $startDate = $date_start ? new DateTime($date_start) : null;
//            $endDate = $date_end ? new DateTime($date_end) : null;
//            $duration = $startDate && $endDate ? $startDate->diff($endDate)->days + 1 : null;
//
//            // Создание родительской записи без зависимых
//            $distributionTasksByProject = ProjectTasks::updateOrCreate(
//                ['project_id' => $projectId, 'task_id' => $task_id],
//                [
//                    'stage_number' => $stage_number,
//                    'price' => $price,
//                    'date_start' => $date_start,
//                    'date_end' => $date_end,
//                    'duration' => $duration,
//                    'description' => $description
//                ]
//            );
//
//            // Сохраняем id только что созданной родительской записи
//            $createdTasks[$projectId][$task_id] = $distributionTasksByProject->id;
//        }
//
//        // 2. Создание зависимых записей
//        foreach ($args['data'] as $taskData) {
//            $projectId = $taskData['projectId'];
//            $task_id = $taskData['task_id'];
//            $inherited_task_ids = $taskData['inherited_task_ids'] ?? [];
//            $inherited_ids = [];
//            $executors = $taskData['executors'] ?? [];
//
//            if (isset($inherited_task_ids)) {
//                // Привязка зависимых записей к родительским
//                foreach ($inherited_task_ids as $inheritedTaskId) {
//                    $main_task_id = $createdTasks[$projectId][$inheritedTaskId] ?? null;
//                    if ($main_task_id) {
//                        $its = ProjectTasksInherited::updateOrCreate(
//                            ['project_task_id' => $createdTasks[$projectId][$task_id], 'project_inherited_task_id' => $main_task_id],
//                            ['project_task_id' => $createdTasks[$projectId][$task_id], 'project_inherited_task_id' => $main_task_id]
//                        );
//                        error_log("эй" . $its);
//
//                        if (isset($its))
//                            $inherited_ids[] = $its->id;
//
//                    } else {
//                        // Log or handle the error if the inherited task does not exist
//                        error_log("Inherited task ID {$inheritedTaskId} does not exist in created tasks.");
//                    }
//                }
//
//                 // Удаление записей inherited_task_ids, которых нет в списке inherited_task_ids
//                if (isset($inherited_ids) && isset($args["rules"]) && ($args["rules"] == "delete_all" || $args["rules"] == "delete_inherited")) {
//                    error_log("Ты чё сука?" . $createdTasks[$projectId][$task_id]);
//
//                    $deletePTI = ProjectTasksInherited::where('project_task_id', $createdTasks[$projectId][$task_id])
//                        ->whereNotIn('id', $inherited_ids)->delete();
//                    //error_log("Ты чё сука? ". );
//                    error_log("ТЫ? " . $deletePTI);
//
//                }
//            }
//
//            // Создание или обновление исполнителей
//            if (isset($executors)) {
//                foreach ($executors as $executor) {
//                    ProjectTaskExecutor::updateOrCreate(
//                        ['project_tasks_id' => $createdTasks[$projectId][$task_id], 'executor_id' => $executor['executor_id']],
//                        ['price' => $executor['price'] ?? null]
//                    );
//                }
//
//                // Удаление записей исполнителей, которых нет в списке executor
//                if (isset($args["rules"]) && $args["rules"] == "delete_all" || $args["rules"] == "not_delete_executors") {
//                    $executorIdsToDelete = array_column($executors, 'executor_id');
//                    ProjectTaskExecutor::where('project_tasks_id', $createdTasks[$projectId][$task_id])
//                        ->whereNotIn('executor_id', $executorIdsToDelete)
//                        ->delete();
//                }
//            }
//        }
//
//        // Fetch the updated ProjectTasks with the relationships loaded
//        $distributionTasksByProject = ProjectTasks::where('project_id', $projectId)->with('executors', 'inherited_task_ids', 'task')->get();
//
//        // Transform the data into the desired format
//        $tasksArray = $distributionTasksByProject->map(function ($task) {
//            return [
//                'id' => $task->id,
//                'description' => $task->description,
//                'inherited_task_ids' => $task->inherited_task_ids->toArray(),
//                'price' => $task->price,
//                'task' => [
//                    'id' => $task->task->id,
//                    'name' => $task->task->name // Assuming there's a 'name' attribute in your Task model
//                ],
//                'date_start' => $task->date_start,
//                'duration' => $task->duration,
//                'date_end' => $task->date_end,
//                'executors' => $task->executors->map(function ($executor) {
//                    return [
//                        'id' => $executor->id,
//                        'price' => $executor->price,
//                        'executor' => [
//                            'id' => $executor->executor_id,
//                            'passport' => [
//                                'id' => $executor->executor->passport->id,
//                                'firstname' => $executor->executor->passport->firstname,
//                                'lastname' => $executor->executor->passport->lastname,
//                                'patronymic' => $executor->executor->passport->patronymic,
//                            ],
//                            'payment_account' => $executor->executor->payment_account
//                        ]
//                    ];
//                })
//            ];
//        });
//
//        // Return the transformed array
//        return $tasksArray->toArray();

    }
}
