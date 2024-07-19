<?php declare(strict_types=1);

namespace App\GraphQL\Mutations;

use App\Models\Project;

final readonly class ProjectStagesSync
{
    /** @param  array{}  $args */
    public function __invoke($_, array $args)
    {
        $stages = $args['items'];
        $project = Project::find($stages[0]["project_id"]);

        $projectPrice = (float)$project->price;
        $projectPrepayment = (int)$project->prepayment;

        $syncData = [];
        foreach ($stages as $stage) {
            $percent = (int)$stage["percent"];
            $price = ($projectPrice / 100) * $percent;
            $priceToPaid = $price - ($price / 100) * $projectPrepayment;

            $syncData[(int)$stage["stage_id"]] = [
                'number' => $stage["number"] ?? null,
                'date_start' => isset($stage["date_start"]) ? substr((string)$stage["date_start"], 0, 10) : null,
                'duration' => $stage["duration"] ?? null,
                'date_end' => isset($stage["date_end"]) ? substr((string)$stage["date_end"], 0, 10) : null,
                'percent' => $percent,
                'price' => $price,
                'price_to_paid' => $priceToPaid,
            ];
        }

        $project->stages()->sync($syncData);
        $project = Project::with('project_stages')->find($project->id);

        return $project;
    }
}
