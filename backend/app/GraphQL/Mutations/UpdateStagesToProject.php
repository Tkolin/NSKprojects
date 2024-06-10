<?php declare(strict_types=1);

namespace App\GraphQL\Mutations;

use App\Models\ProjectStage;

final readonly class UpdateStagesToProject
{
    /** @param  array{}  $args */
    public function __invoke($_, array $args)
    {
        $stages = $args['items'];
        error_log('этапы'. $args['items'][0]["price"]);
        $count = count($stages);
        for ($i = 0; $i < $count; $i++) {
            ProjectStage::updateOrCreate(
                [
                    'project_id' => $stages[$i]["project_id"],
                    'stage_id' => (string)$stages[$i]["stage_id"]
                ],
                [
                    'number' => isset($stages[$i]["number"]) ? (int)$stages[$i]["number"] : null,
                    'date_start' => isset($stages[$i]["date_start"]) ? substr((string) $stages[$i]["date_start"], 0, 10) : null,
                    'duration' => isset($stages[$i]["duration"]) ? (int)$stages[$i]["duration"] : null,
                    'date_end' => isset($stages[$i]["date_end"]) ? substr((string) $stages[$i]["date_end"], 0, 10) : null,
                    'percent' => isset($stages[$i]["percent"]) ? (int)$stages[$i]["percent"] : null,
                    'price' => isset($stages[$i]["price"]) ? (float)$stages[$i]["price"] : null,
                    'price_to_paid' => isset($stages[$i]["price"]) ? (float)$stages[$i]["price_to_paid"] : null,
                ]
            );
        }
        // Удаление записей, которых нет в списке
        ProjectStage::where('project_id', $stages[0]["project_id"])
            ->whereNotIn('stage_id', array_column($stages, 'stage_id'))
            ->delete();

        return ProjectStage::where('project_id', $stages[0]["project_id"])->get();
    }
}
