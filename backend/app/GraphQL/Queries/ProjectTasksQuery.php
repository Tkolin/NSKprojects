<?php declare(strict_types=1);

namespace App\GraphQL\Queries;

use App\Models\ProjectTasks;

final readonly class ProjectTasksQuery
{
    /** @param  array{}  $args */
    public function __invoke(null $_, array $args)
    {
        error_log("тут ");

        $pepa =  ProjectTasks::with('sub_tasks')->with('tasks')->where('project_id', 24)->get();
        error_log("pepa ". $pepa);
        return $pepa;

    }
}
