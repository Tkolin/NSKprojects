<?php declare(strict_types=1);

namespace App\GraphQL\Mutations;

use App\Models\ProjectTaskExecutor;
use App\Models\ProjectTasks;
use App\Models\ProjectTasksInherited;
use DateTime;

final readonly class CreateTaskToProject
{
    /**
     * Создает задачу для проекта.
     *
     * @param array $args Массив с данными для создания задачи.
     * @throws AuthenticationException Если данные некорректны.
     * @return int 1, если задача успешно создана.
     */
    public function __invoke(null $_, array $args)
    {
        // Получаем необходимые данные из массива $args
        $projectId = $args["data"]["projectId"] ?? null;
        $task_id = $args["data"]["task_id"] ?? null;
        $date_start = isset($args["data"]["date_start"]) ? substr((string)$args["data"]["date_start"], 0, 10) : null;
        $date_end = isset($args["data"]["date_end"]) ? substr((string)$args["data"]["date_end"], 0, 10) : null;
        $inherited_task_ids = $args["data"]["inherited_task_ids"] ?? null;
        $price = $args["data"]["price"] ?? null;
        $executors = $args["data"]["executors"] ?? null;

        // Вычисляем длительность задачи
        $startDate = new DateTime($date_start);
        $endDate = new DateTime($date_end);
        $duration = $startDate->diff($endDate)->days;

        // Создаем задачу
        $projectTasks = ProjectTasks::create([
            'price' => $price ?? null,
            'date_start' => $date_start ?? null,
            'date_end' => $date_end ?? null,
            'project_id' => $projectId ?? null,
            'task_id' => $task_id ?? null,
            'duration' => $duration + 1
        ]);

        // Создаем связи с наследованными задачами
        if (isset($inherited_task_ids)) {
            foreach ($inherited_task_ids as $tasksInheritedId) {
                ProjectTasksInherited::create([
                    'project_task_id' => $projectTasks->id ?? null,
                    'project_inherited_task_id' => $tasksInheritedId ?? null
                ]);
            }
        }

        // Создаем связи с исполнителями
        if (isset($executors)) {
            foreach ($executors as $executor) {
                ProjectTaskExecutor::create([
                    'project_tasks_id' => $projectTasks->id ?? null,
                    'executor_id' => $executor['executor_id'] ?? null,
                    'price' => $executor['price'] ?? null
                ]);
            }
        }

        return 1;
    }
}
