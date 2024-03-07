<?php declare(strict_types=1);

namespace App\GraphQL\Mutations;

use App\Models\ProjectIrds;
use App\Models\ProjectStage;

final readonly class UpdateIrdsToProject
{
    /** @param array{} $args */
    public function __invoke(null $_, array $args)
    {

        $stages = $args['irdToProject'];

        error_log('nen');
        $count = count($stages);
        for ($i = 0; $i < $count; $i++) {
            ProjectIrds::updateOrCreate(
                [
                    'project_id' => $stages[$i]["projectId"],
                    'ird_id' => (string)$stages[$i]["irdId"]
                ],
                [
                    'stageNumber' => isset($stages[$i]["stageNumber"]) ? (int)$stages[$i]["stageNumber"] : null,
                    'applicationProject' => isset($stages[$i]["applicationProject"]) ? (int)$stages[$i]["applicationProject"] : null,
                    'receivedDate' => isset($stages[$i]["receivedDate"]) ? (int)$stages[$i]["receivedDate"] : null,
                ]
            );
        }
        // Удаление записей, которых нет в списке
        ProjectIrds::where('project_id', $stages[0]["projectId"])
            ->whereNotIn('ird_id', array_column($stages, 'irdId'))
            ->delete();
        return true;
    }
}
