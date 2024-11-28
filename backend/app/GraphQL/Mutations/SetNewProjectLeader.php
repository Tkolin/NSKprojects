<?php declare(strict_types=1);

namespace App\GraphQL\Mutations;

use App\Models\Project;

final readonly class SetNewProjectLeader
{
    /** @param  array{}  $args */
    public function __invoke(null $_, array $args)
    {
        $project = Project::find($args['projectId']);

        if ($project) {
            $project->update(['leader_id' => $args['personId']]);
        }

        return $project;
    }
}
