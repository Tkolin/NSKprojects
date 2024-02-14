<?php declare(strict_types=1);

namespace App\GraphQL\Mutations;

use App\Models\Project;
use App\Models\ProjectStage;

final readonly class UpdateProject
{
    /** @param  array{}  $args */
    public function __invoke(null $_, array $args): Project
    {
        $project = Project::findOrFail($args['id']);
        $project->update($args);
        return $project;
    }
}
