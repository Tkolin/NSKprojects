<?php declare(strict_types=1);

namespace App\GraphQL\Mutations;

use App\Models\ProjectTasks;

final readonly class ProjectTaskDetailUpdate
{
    /**
     * Обновление подробных параметров задачи.
     *
     * @param array{
     *     data: {
     *      id: string,
     *      description?: string,
     *      date_start?: string,
     *      date_end?: string,
     *      duration?: int,
     *      price?: float,
     *      executor_id?: string
     *     }
     * } $args
     *
     * @return ProjectTasks Обновленный параметры задачи.
     */
    public function __invoke(null $_, array $args)
    {
        $data = $args['data'];
        $projectTask = ProjectTasks::findOrFail($data['id']);
        // Обновляем модель с использованием fill и затем вызываем save
        //        $dateStart = $item['date_start'] ?? $task->date_start ?? null;
//        $dateEnd = $item['date_end'] ?? $task->date_end ?? null;
//        $duration = !(isset($dateStart) && isset($dateEnd)) ? $duration : (new \DateTime($dateStart))->diff(new \DateTime($dateEnd))->days;

        $projectTask->update([
            'description' => $data['description'],
            'duration' => $data["duration"],
            'work_hours' => $data["work_hours"],
            'offset' => $data['offset'],
            'price' => $data['price'],
            'executor_id' => $data['executor_id'] ?? null,
        ]);

        $projectTask->save();
        return $projectTask;
    }
}
