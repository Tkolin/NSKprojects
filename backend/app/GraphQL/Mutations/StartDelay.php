<?php declare(strict_types=1);

namespace App\GraphQL\Mutations;

use App\Models\Delay;
use App\Models\Project;
use App\Models\ProjectTasks;
use App\Models\DelayProjectTask;
use Illuminate\Support\Facades\DB;

final class StartDelay
{
    public function __invoke($_, array $args)
    {
        error_log('StartDelay mutation'. $args['projectId']);
        $project = Project::find($args['projectId']);

        if (!$project) {
            throw new \Exception("Project not found");
        }

        DB::beginTransaction();
        try {
            // Создание новой задержки
            $delay = Delay::create([
                'project_id' => $args['projectId'],
                'date_start' => $args['date_start'],
                'description' => $args['description'],
                'delay_type' => $args['type'],
                'provider' => $args['provider'],
            ]);

            // Получение всех задач проекта
            $allTasks = $project->project_tasks();

            // Получение списка основных задач
            $primaryTaskIds = $args['primaryTaskIds'] ?? [];
            $primaryTasks = ProjectTasks::findMany($primaryTaskIds);

            // Функция для рекурсивного поиска дочерних задач
            $this->findChildTasks($primaryTasks, $allTasks, $primaryTaskIds);

            // Добавление задач с типом primary
            foreach ($primaryTaskIds as $id) {
                $primaryTask = ProjectTasks::find($id);

                switch ($primaryTask->status) {
                    case "WORKING": {
                        DelayProjectTask::create([
                            'project_task_id' => $id,
                            'type' => 'primary',
                            'delay_id' => $delay->id,
                        ]);
                        break;
                    }
                    case "AWAITING": {
                        DelayProjectTask::create([
                            'project_task_id' => $id,
                            'type' => 'primary',
                            'delay_id' => $delay->id,
                        ]);
                        break;
                    }

                }

                if ($primaryTask) {
                    $primaryTask->is_delay = true;
                    $primaryTask->save();
                }

            }

            DB::commit();

        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
        return [ 'project' => $project,
        'delay' => $delay] ;
     }

    /**
     * Рекурсивный поиск всех дочерних задач
     *
     * @param array $tasks текущие задачи для поиска дочерних
     * @param array $allTasks все задачи проекта
     * @param array &$primaryTaskIds ссылка на массив с ID задач
     * @return void
     */
    private function findChildTasks($tasks, $allTasks, &$primaryTaskIds)
    {
        foreach ($tasks as $task) {
            foreach ($allTasks as $globalTask) {
                if ($globalTask->project_task_inherited_id === $task->id && !in_array($globalTask->id, $primaryTaskIds)) {
                    $primaryTaskIds[] = $globalTask->id;
                    $this->findChildTasks([$globalTask], $allTasks, $primaryTaskIds);
                }
            }
        }
    }
}
