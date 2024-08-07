<?php declare(strict_types=1);

namespace App\GraphQL\Mutations;

use App\Models\Project;
use App\Models\ProjectTasks;
use Cassandra\Date;

final readonly class ProjectTasksStructureUpdate
{
    /**
     * Обновление структуры задач.
     *
     * @param array{
     *     data: [{
     *      task_id: ID
     *      project_id: ID
     *      inherited_task_id: ID
     *      date_start: String
     *      date_end: String
     *      duration: Int
     *      stage_number: Int
     *     }]
     * } $args
     *
     */

    public function __invoke(null $_, array $args)
    {
        $data = $args['data'];
        $projectId = $data[0]['project_id'];
        $taskIds = array_column($data, 'task_id');
        $tasks = ProjectTasks::whereIn('task_id', $taskIds)
            ->where('project_id', $projectId)
            ->get()
            ->keyBy('task_id');
        $actualTasks = [];

        foreach ($data as $item) {
            $task = $tasks->get($item['task_id']);
            if (!$task) {
                $task = [
                    'task_id' => $item['task_id'],
                    'project_id' => $projectId,
                ];
            }
//            $duration =$item['duration'] ?? 0;
//            $dateStart = $item['date_start'] ?? $task->date_start ?? null;
//            $dateEnd = $item['date_end'] ?? $task->date_end ?? null;
//            $duration = !(isset($dateStart) && isset($dateEnd)) ? $duration : (new \DateTime($dateStart))->diff(new \DateTime($dateEnd))->days;
             $task = ProjectTasks::updateOrCreate(
                [
                    'task_id' => $task['task_id'],
                    'project_id' => $projectId,
                ],
                [
                'project_task_inherited_id' => null,
              //  'date_start' => $dateStart,
               // 'date_end' => $dateEnd,
                'duration' => $item["duration"] ?? null,
                'offset' => $item["offset"] ?? null,
                'stage_number' => $item['stage_number'] ?? $task->stage_number  ?? null,
            ]);

            $actualTasks[$task->task_id] = $task;
        }

        // Добавление вложенных задач
        foreach ($data as $item) {
            $task = $actualTasks[$item['task_id']];
            if ($item['inherited_task_id']) {
                $task->project_task_inherited_id = $actualTasks[$item['inherited_task_id']]->id; // получить id записи;
                $task->save();
            }
        }

        // Удаление задач, которые не присутствуют в новом списке
        $actualIds = array_column($actualTasks, 'id');
        if($actualIds) {
            ProjectTasks::query()->where('project_id',$projectId)->whereNotIn('id',$actualIds)->delete();
        }

        return Project::with('project_tasks')->find($projectId);
    }
}
