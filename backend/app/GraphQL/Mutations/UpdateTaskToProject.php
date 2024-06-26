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
        $tasks = $args["data"];
        $projectId = $args["data"][0]["project_id"];
        if (isset($args["type"])) {
            switch ($args["type"]) {
                case "ONLY_DATE":
                    foreach ($tasks as $i => $task) {
                        $projectTask = ProjectTasks::updateOrCreate(
                            [
                                "id" => $task["id"],
                            ],
                            [
                                "date_start" => $task["date_start"],
                                "duration" => $task["duration"] ?? (strtotime($task["date_end"]) - strtotime($task["date_start"])) / (60 * 60 * 24),
                                "date_end" => $task["date_end"],
                            ]
                        );
                    }
                    break;
            }
        } else {
            foreach ($tasks as $i => $task) {
                $projectTask = ProjectTasks::updateOrCreate(
                    [
                        "id" => $task["id"],
                    ],
                    [
                        "description" => $task["description"] ?? null,
                        "date_start" => $task["date_start"],
                        "duration" => $task["duration"] ?? (strtotime($task["date_end"]) - strtotime($task["date_start"])) / (60 * 60 * 24),
                        "date_end" => $task["date_end"],
                        "price" => $task["price"],
                        "executor_id" => $task["executor_id"],

                    ]
                );
            }
        }


        return Project::where('id', $projectId)->first();

    }
}
