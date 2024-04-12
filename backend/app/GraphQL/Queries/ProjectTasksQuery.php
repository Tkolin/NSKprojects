<?php declare(strict_types=1);

namespace App\GraphQL\Queries;

use App\Models\ProjectTasks;
use App\Models\ProjectTasksInherited;

final readonly class ProjectTasksQuery
{
    /** @param  array{}  $args */
    public function __invoke(null $_, array $args)
    {

         $projectTasks = ProjectTasks::with('task')
            ->with('executors.executor')
             ->with('inherited_task_ids')
            ->where('project_id', $args['projectId'])
            ->get();

         error_log('ProjectTasksQuery');
         return $projectTasks;

    }
}
