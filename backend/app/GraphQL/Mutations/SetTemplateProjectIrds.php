<?php declare(strict_types=1);

namespace App\GraphQL\Mutations;

use App\Models\Project;

final readonly class SetTemplateProjectIrds
{
    /** @param array{} $args */
    public function __invoke(null $_, array $args)
    {
        $projectId = $args['projectId'];
        $templateProjectId = $args['templateProjectId'];
        $currentProject = \App\Models\Project::with("project_stages")->find($projectId);
        $templateProject = \App\Models\Project::with("project_stages")->find($templateProjectId);
        $templateProject->project_stages;

        $stages = array_merge($currentProject->project_irds->toArray() ?? [], $templateProject->project_irds->toArray() ?? []);


        $syncData = [];
        foreach ($stages as $stage) {
            $syncData[(int) $stage["ird_id"]] = [
                'application_project' => $stage["application_project"] ?? null,
                'stage_number' => $stage["stage_number"] ?? null,
            ];
        }

        $currentProject->irds()->sync($syncData);
        $currentProject = Project::with('project_irds.ird', 'project_irds.project')->find($currentProject->id);

        return $currentProject;
    }
}
