<?php declare(strict_types=1);

namespace App\GraphQL\Queries;

use App\Models\ProjectStage;

final readonly class ProjectStages
{
    /** @param array{} $args */
    public function __invoke(null $_, array $args)
    {
        $projectsQuery = ProjectStage::with('createNewProject:id,name')
            ->with('stage');

        if (isset($args['projectId'])) {
            $searchTerm = $args['projectId'];
            $projectsQuery = $projectsQuery
                ->where('project_id', $searchTerm);
        } else
            return null;

        return $projectsQuery->get();
    }
}
