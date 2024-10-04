<?php declare(strict_types=1);

namespace App\GraphQL\Mutations;
use App\Models\ProjectTasks;

final readonly class ProjectTaskDateSync
{
    /** @param  array{}  $args */
    public function __invoke(null $_, array $args)
    {
        $projectTask = ProjectTasks::findOrFail($args['id']);
        $log = $projectTask->date_start || $projectTask->date_signing; 
        $projectTask->date_start = null;
        $projectTask->update();

        $projectTask->date_start = $log;
        $projectTask->update();
    }
}
