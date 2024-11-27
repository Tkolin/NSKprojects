<?php declare(strict_types=1);

namespace App\GraphQL\Queries;

use App\Models\ProjectTasks as ModelsProjectTasks;

final readonly class ProjectTasks
{
    /** @param  array{}  $args */
    public function __invoke(null $_, array $args)
    {
        if (!isset($args['projectId']))
            throw new \Exception("The 'projectId' argument is required.");

        $projectTasks = ModelsProjectTasks::with('task')
            ->with('executor')
            ->orderBy('stage_number') // Используем orderBy
            ->where('project_id', $args['projectId'])
            ->get();

        return $projectTasks;
    }
}
