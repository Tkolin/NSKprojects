<?php declare(strict_types=1);

namespace App\GraphQL\Mutations;

use App\Models\ProjectStage;

final readonly class UpdateStagesToProject
{
    /** @param  array{}  $args */
    public function __invoke($_, array $args)
    {
        $stages = $args['stageToProject'];
        error_log('nen');
        $count = count($stages);
        for ($i = 0; $i < $count; $i++) {
            ProjectStage::updateOrCreate(
                [
                    'project_id' => $stages[$i]["projectId"],
                    'stage_id' => (string)$stages[$i]["stage_id"]
                ],
                [
                    'number' => isset($stages[$i]["stageNumber"]) ? (int)$stages[$i]["stageNumber"] : null,
                    'date_start' => isset($stages[$i]["dateStart"]) ? substr((string) $stages[$i]["dateStart"], 0, 10) : null,
                    'duration' => isset($stages[$i]["duration"]) ? (int)$stages[$i]["duration"] : null,
                    'date_end' => isset($stages[$i]["dateEnd"]) ? substr((string) $stages[$i]["dateEnd"], 0, 10) : null,
                    'percent' => isset($stages[$i]["percent"]) ? (int)$stages[$i]["percent"] : null,
                    'price' => isset($stages[$i]["price"]) ? (int)$stages[$i]["price"] : null,
                ]
            );
        }
        // Удаление записей, которых нет в списке
        ProjectStage::where('project_id', $stages[0]["projectId"])
            ->whereNotIn('stage_id', array_column($stages, 'stage_id'))
            ->delete();
        return true;
    }
}
