<?php declare(strict_types=1);

namespace App\GraphQL\Mutations;

use App\Models\ProjectTaskExecutor;

final readonly class UpdateExecutorToTasks
{
    /** @param array{} $args */
    public function __invoke(null $_, array $args)
    {
        $tasksExecutors = $args["data"];

        $count = count($tasksExecutors);

        for ($i = 0; $i < $count; $i++) {

            ProjectTaskExecutor::updateOrCreate(
                [
                    "project_tasks_id" => $tasksExecutors[$i]["project_tasks_id"],
                    "executor_id" => $tasksExecutors[$i]["executor_id"],
                ],
                [
                    "date_start" => $tasksExecutors[$i]["date_start"]  ?? null,
                    "duration" => $tasksExecutors[$i]["duration"] ? (float)$tasksExecutors[$i]["duration"]  : null,
                    "description" =>  $tasksExecutors[$i]["description"] ?? null,
                    "date_end" => $tasksExecutors[$i]["date_end"]  ?? null,
                    "price" => $tasksExecutors[$i]["price"] ? (int)$tasksExecutors[$i]["price"]  : null
                ]
            );
        }

    }
}
