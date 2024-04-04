<?php declare(strict_types=1);

namespace App\GraphQL\Queries;

use App\Models\ProjectTasks;
use App\Models\ProjectTasksInherited;

final readonly class ProjectTasksQuery
{
    /** @param  array{}  $args */
    public function __invoke(null $_, array $args)
    {
        error_log("тут ProjectTasksQuery");

         $projectTasks = ProjectTasks::with('task')
            ->with('executors.executor')
             ->with('inherited_task_ids')
            ->where('project_id', 24)
            ->get();

//        error_log("inheritedTaskIds ". $inheritedTaskIds);
        error_log("projectTasks ". $projectTasks);
        return $projectTasks;

    }
}
