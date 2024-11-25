<?php declare(strict_types=1);

namespace App\GraphQL\Mutations;

use App\GraphQL\Queries\ProjectTask;
use App\Models\ProjectTasks;
use App\Models\Stage;
use App\Models\Task;

final readonly class CreateStage
{
    /** @param  array{}  $args */
    public function __invoke(null $_, array $args)
    {
        if (!isset($args['data']))
            throw new \InvalidArgumentException('data is required.');

        $data = $args['data'];

        // Находим задачу по имени или создаем новую задачу
        $task = Task::firstOrCreate(
            ['name' => $data['name']],
            ['created_at' => now(), 'updated_at' => now()]
        );
        // Создаем новый этап с task_id
        $stage = new Stage();
        $stage->name = $data['name'];
        $stage->task_id = $task->id;
        $stage->save();

        return $stage;
    }
}
