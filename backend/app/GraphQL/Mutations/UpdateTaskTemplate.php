<?php declare(strict_types=1);

namespace App\GraphQL\Mutations;

use App\Models\TemplateStagesTypeProjects;
use App\Models\TemplateTasksTypeProject;

final readonly class UpdateTaskTemplate
{
    /** @param  array{}  $args */
    public function __invoke(null $_, array $args)
    {
        $typeProjectId = $args['typeProjectId'];
        $listTasksId = $args['listTasks_id'];
        $listInheritedTasksId = $args['listInheritedTasks_id'];
        $stageNumber = $args['stageNumber'];

        error_log('typeProjectId: ' . $typeProjectId);
        error_log('listTasksId: ' . json_encode($listTasksId));
        error_log('listInheritedTasksId: ' . json_encode($listInheritedTasksId));
        error_log('stageNumber: ' . json_encode($stageNumber));

        if (count($listTasksId) !== count($listInheritedTasksId)) {
            throw new \Exception('Length of lists must be equal');
        }

        $count = count($listTasksId);

        for ($i = 0; $i < $count; $i++) {


            TemplateTasksTypeProject::updateOrCreate(
                [
                    'project_type_id' => $typeProjectId,
                    'task_id' => (string)$listTasksId[$i]
                ],
                [
                    'stage_number' => (int)$stageNumber[$i],
                ]
            );
        }

        for ($i = 0; $i < $count; $i++) {
            $inheritedTaskId = ((int)$listInheritedTasksId[$i] === 0) ? null : (int)$listInheritedTasksId[$i];
            if ($inheritedTaskId !== null) {
                $task = TemplateTasksTypeProject::where('project_type_id', $typeProjectId)
                    ->where('task_id', $listTasksId[$i])
                    ->first();

                if ($task) {
                    $inheritedTask = TemplateTasksTypeProject::where('project_type_id', $typeProjectId)
                        ->where('task_id', $listInheritedTasksId[$i])
                        ->first();

                    if ($inheritedTask) {
                        $task->inherited_task_id = $inheritedTask->id;
                        $task->save();
                    } else {
                        // Создать обработку случая, если запись не найдена
                        throw new \Exception('Record not found for inherited_task_id: ' . $listInheritedTasksId[$i] . ' and project_type_id: ' . $typeProjectId);
                    }
                } else {
                    // Создать обработку случая, если запись не найдена
                    throw new \Exception('Record not found for task_id: ' . $listTasksId[$i] . ' and project_type_id: ' . $typeProjectId);
                }
            }
        }

        // Удаление записей, которых нет в списке
        TemplateTasksTypeProject::where('project_type_id', $typeProjectId)
            ->whereNotIn('task_id', $listTasksId)
            ->delete();

        return true;
    }
}
