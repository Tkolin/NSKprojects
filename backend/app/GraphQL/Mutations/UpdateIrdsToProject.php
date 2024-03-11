<?php declare(strict_types=1);

namespace App\GraphQL\Mutations;

use App\Models\ProjectIrds;
use App\Models\ProjectStage;

final readonly class UpdateIrdsToProject
{
    /** @param array{} $args */
    public function __invoke(null $_, array $args)
    {

        $irds = $args['items'];

        error_log('nen');
        $count = count($irds);
        for ($i = 0; $i < $count; $i++) {
            ProjectIrds::updateOrCreate(
                [
                    'project_id' => $irds[$i]["projectId"],
                    'ird_id' => (string)$irds[$i]["irdId"]
                ],
                [
                    'stageNumber' => isset($irds[$i]["stageNumber"]) ? (int)$irds[$i]["stageNumber"] : null,
                    'applicationProject' => isset($irds[$i]["applicationProject"]) ? (int)$irds[$i]["applicationProject"] : null,
                    'receivedDate' => isset($irds[$i]["receivedDate"]) ? (int)$irds[$i]["receivedDate"] : null,
                ]
            );
        }
        // Удаление записей, которых нет в списке
        ProjectIrds::where('project_id', $irds[0]["projectId"])
            ->whereNotIn('ird_id', array_column($irds, 'irdId'))
            ->delete();
        return true;
    }
}
