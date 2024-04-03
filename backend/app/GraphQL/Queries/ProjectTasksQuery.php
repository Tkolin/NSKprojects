<?php declare(strict_types=1);

namespace App\GraphQL\Queries;

use App\Models\ProjectTasks;

final readonly class ProjectTasksQuery
{
    /** @param  array{}  $args */
    public function __invoke(null $_, array $args)
    {
        error_log("тут ProjectTasksQuery");

        $pepa =  ProjectTasks::
            with('task')
            ->with('executors.executor')
            ->with('project_inherited_tasks')
            ->where('project_id', 24)->get();
        error_log("pepa ". $pepa);
        return $pepa;

    }
}
