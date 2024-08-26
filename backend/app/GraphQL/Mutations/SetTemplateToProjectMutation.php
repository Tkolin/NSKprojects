<?php declare(strict_types=1);

namespace App\GraphQL\Mutations;

use App\Models\Project;

final readonly class SetTemplateToProjectMutation
{
    /** @param array{} $args */
    public function __invoke(null $_, array $args)
    {
        $projectId = $args['projectId'];
        $templateProjectId = $args['templateProjectId'];
        $currentProject = \App\Models\Project::with("project_stages")->find($projectId);
        $templateProject = \App\Models\Project::with("project_stages")->find($templateProjectId);
        $templateProject->project_stages;

        $stages = array_merge($currentProject->project_stages->toArray() ?? [], $templateProject->project_stages->toArray() ?? []);

        $projectPrice = (float)$currentProject->price;
        $projectPrepayment = (int)$currentProject->prepayment;

        $syncData = [];
        foreach ($stages as $stage) {
            $percent = (int)$stage["percent"];
            $price = ($projectPrice / 100) * $percent;
            $priceToPaid = $price - ($price / 100) * $projectPrepayment;
            $number = 1;
            $syncData[(int)$stage["stage_id"]] = [
                'number' => $number++,
//                'date_start' => isset($stage["date_start"]) ? substr((string)$stage["date_start"], 0, 10) : null,
                'duration' => $stage["duration"] ?? null,
//                'date_end' => isset($stage["date_end"]) ? substr((string)$stage["date_end"], 0, 10) : null,
                'percent' => $percent,
                'offset' => $stage["offset"] ?? null,
                'price' => $price,
                'price_to_paid' => $priceToPaid,
            ];
        }

        $currentProject->stages()->sync($syncData);
        $currentProject = Project::with('project_stages')->find($currentProject->id);

        return $currentProject;
    }
}
