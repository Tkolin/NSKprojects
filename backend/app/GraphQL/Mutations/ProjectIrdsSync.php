<?php declare(strict_types=1);

namespace App\GraphQL\Mutations;

use App\Models\Project;

final readonly class ProjectIrdsSync
{
    /** @param  array{}  $args */
    public function __invoke($_, array $args)
    {
        $stages = $args['items'];
        $project = Project::find($stages[0]["project_id"]);

        $syncData = [];
        foreach ($stages as $stage) {
            $syncData[(int)$stage["ird_id"]] = [
                'received_date' =>   $stage["received_date"] ?? null,
                'application_project' =>   $stage["application_project"] ?? null,
                'stage_number' =>  $stage["stage_number"] ?? null,
            ];
        }

        $project->irds()->sync($syncData);
        $project = Project::with('project_irds.ird','project_irds.project')->find($project->id);

        return $project;

    }
}
