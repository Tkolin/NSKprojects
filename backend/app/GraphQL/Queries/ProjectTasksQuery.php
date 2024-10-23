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
            ->with('executor')
            ->orderBy('stage_number') // Используем orderBy
            ->where('project_id', $args['projectId'])
            ->get();

        return ['items' => $projectTasks];
    }
}
