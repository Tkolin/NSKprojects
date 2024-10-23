<?php declare(strict_types=1);

namespace App\GraphQL\Mutations;

use App\Models\Project;
use App\Models\ProjectTasks;
use Exception;

final class ProjectTasksStructureUpdate
{
    /**
     * Обновление структуры задач.
     *
     * @param array $args {
     *     project_id: ID!,
     *     data: [{
     *      task_id: ID!,
     *      local_id: ID!, // Локальный id НЕ ИЗ БАЗЫ задачи_проекта
     *      local_id_inherited: ID!, // Локальный id НЕ ИЗ БАЗЫ задачи_проекта родителя
     *      stage_number: int! // Номер этапа
     *     }]
     * }
     *
     * @return Project|null
     * @throws Exception
     */
    public function __invoke($_, array $args)
    {
        // Валидация входящих данных
        if (!isset($args['project_id']) || !isset($args['data']) || !is_array($args['data'])) {
            throw new Exception('Invalid input');
        }

        $projectId = $args['project_id'];
        $tasks = $args['data'];

         $tasksActual = [];
        $incomingTaskIds = []; // Массив для хранения task_id задач, которые пришли с текущим запросом

         foreach ($tasks as &$task) {
            if (!isset($task['task_id']) || !isset($task['local_id']) || !isset($task['stage_number'])) {
                throw new Exception('Invalid task data');
            }

            $actualProjectTask = ProjectTasks::where('project_id', $projectId)
                ->where('task_id', $task['task_id'])
                ->where('stage_number', $task['stage_number'])
                ->first();

            if ($actualProjectTask) {
                $task['id'] = $actualProjectTask->id;
            } else {
                $newProjectTask = ProjectTasks::create([
                    'project_id' => $projectId,
                    'task_id' => $task['task_id'],
                    'stage_number' => $task['stage_number'],
                ]);
                $task['id'] = $newProjectTask->id;
            }

            $incomingTaskIds[] = $task['id'];
            $tasksActual[$task['local_id']] = $task;
        }
        unset($task);

         foreach ($tasks as $task) {
            $actualProjectTask = ProjectTasks::find($task['id']);
            if ($actualProjectTask) {
                if (isset($task['local_id_inherited']) && isset($tasksActual[$task['local_id_inherited']])) {
                    $actualProjectTask->project_task_inherited_id = $tasksActual[$task['local_id_inherited']]['id'];
                } else {
                    $actualProjectTask->project_task_inherited_id = null;
                }
                $actualProjectTask->save();
            } else {
                throw new Exception('Task not found');
            }
        }
    ProjectTasks::where('project_id', $projectId)
        ->whereNotIn('id', $incomingTaskIds)
        ->delete();
        return Project::with('project_tasks')->find($projectId);
    }
}
