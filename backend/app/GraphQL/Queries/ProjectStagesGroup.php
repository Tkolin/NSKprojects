<?php declare(strict_types=1);

namespace App\GraphQL\Queries;

use App\Models\Project;
use App\Models\Stage;

final readonly class ProjectStagesGroup
{
    /** @param  array{}  $args */
    public function __invoke(null $_, array $args)
    {
        $projects = Project::with('stages')->get();

        $projectStagesGroups = [];

        foreach ($projects as $project) {
            $stages = [];

            foreach ($project->stages as $stage) {
                $stages[] = [
                    'id' => $stage->id,
                    'stage_name' => $stage->name,
                    'progress' => $stage->progress,
                    'date_start' => $stage->date_start,
                    'duration' => $stage->duration,
                ];
            }

            $projectStagesGroups[] = [
                'id' => $project->id,
                'name' => $project->name,
                'stages' => $stages,
            ];
        }

        return $projectStagesGroups;
    }
}
