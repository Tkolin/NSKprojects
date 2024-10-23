<?php declare(strict_types=1);

namespace App\GraphQL\Queries;
use App\Models\ProjectTasks as ModelsProjectTask;

final readonly class ProjectTask
{
    /** @param  array{}  $args */
    public function __invoke(null $_, array $args)
    {
        $projectId = $args['id'];
        return   ModelsProjectTask::find($args['id']);
    }
}
