<?php declare(strict_types=1);

namespace App\GraphQL\Mutations;

use App\Models\Project;
use App\Models\ProjectTaskExecutor;
use App\Models\ProjectTasks;
use App\Models\ProjectTasksInherited;

final readonly class CreateTasksToProject
{
    /** @param array{} $args */
    public function __invoke(null $_, array $args)
    {
        $tasks = $args["data"];
        $projectId = $args["data"][0]["project_id"];


        foreach ($tasks as $i => $task) {
            $projectTask = ProjectTasks::updateOrCreate(
                [
                    "project_id" => $task["project_id"],
                    "task_id" => $task["task_id"],
                ],
                [
                    "project_id" => $task["project_id"],
                    "task_id" => $task["task_id"],
                    "stage_number" => $task["stage_number"],
                    "date_start" => $task["date_start"],
                    "date_end" => $task["date_end"],
                    "duration" => $task["duration"] ?? (strtotime($task["date_end"]) - strtotime($task["date_start"])) / (60 * 60 * 24),

                    "project_task_inherited_id" => null

                ]
            );
             $tasks[$i]["id"] = $projectTask->id;

        }

        foreach ($tasks as $i => $task) {

            error_log(json_encode($task).  $task["project_task_inherited_id"]);


            if (isset($task["project_task_inherited_id"])) {
                 $inheritedTask = null;
                foreach ($tasks as $row) {
                    if ($row['task_id'] == $task["project_task_inherited_id"]) {
                        $inheritedTask = $row;
                        break;
                    }
                }

                if ($inheritedTask) {
                    $projectTask = ProjectTasks::updateOrCreate(
                        [
                            'id' => $task["id"]
                        ],
                        [
                            'project_task_inherited_id' => $inheritedTask['id']
                        ]
                    );
                } else {
                    error_log("Inherited task with task_id " . $task["project_task_inherited_id"] . " not found.");
                }
            }

        }

        //project_id:"134"
        //task_id:"23"
        //stage_number:1
        //inherited_from_task_ids:"4"

        //project_id:"134"
        //task_id:"1"
        //stage_number:2
        //date_start:"2024-06-01"
        //date_end:"2024-06-20"
        //inherited_from_task_ids:null


        // Отбор задач - этапов

        return  Project::where('id', $projectId)->first();
    }
}
