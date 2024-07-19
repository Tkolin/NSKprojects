<?php declare(strict_types=1);

namespace App\GraphQL\Queries;

use App\Models\Project;

final readonly class TestMutata
{
    /** @param  array{}  $args */
    public function __invoke(null $_, array $args)
    {
        $projects = Project::with('project_stages.stage')->first();
        error_log("s".json_encode($projects->project_stages));
        return $projects->project_stages;
    }
}
