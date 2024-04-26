<?php declare(strict_types=1);

namespace App\GraphQL\Mutations;

use App\Models\Task;

final readonly class UpdateTask
{
    /** @param array{} $args */
    public function __invoke(null $_, array $args)
    {
        // Проверка входных данных
        if (empty($args['names'])) {
            throw new \InvalidArgumentException('Names cannot be empty');
        }
        // Обновление или создание задач по массиву имен
        $affectedTasks = collect($args['names'])->map(function ($name) {
            $task = Task::updateOrCreate(
                ['name' => $name],
                ['name' => $name]
            );
            // Возвращаем массив с идентификатором и именем задачи, если задача существует
            return $task ? ['id' => $task->id, 'name' => $task->name] : null;
        })->filter(); // Фильтруем null значения
        return $affectedTasks->all();
    }
}
