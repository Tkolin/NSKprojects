<?php declare(strict_types=1);

namespace App\GraphQL\Mutations;

use App\Models\Project;

final readonly class ArchivingProjectStatus
{
    /** @param array{} $args */
    public function __invoke(null $_, array $args)
    {
        $id = $args['projectId'];
        $project = Project::find($id);
        $project->status_id = 'ARCHIVE';
        $project->save();
        return $project;
    }
}
