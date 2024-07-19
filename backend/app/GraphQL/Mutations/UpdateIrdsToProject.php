<?php declare(strict_types=1);

namespace App\GraphQL\Mutations;

use App\Models\ProjectIrds;
use App\Models\ProjectStage;
use Illuminate\Support\Facades\Log;

final readonly class UpdateIrdsToProject
{
    /** @param array{} $args */
    public function __invoke(null $_, array $args)
    {
        $irds = $args['items'];

        error_log('nen');
        $count = count($irds);
        for ($i = 0; $i < $count; $i++) {
            error_log($irds[$i]["received_date"] . ' fadfgad');
            ProjectIrds::updateOrCreate(
                [
                    'project_id' => $irds[$i]["project_id"],
                    'ird_id' => (string)$irds[$i]["ird_id"]
                ],
                [
                    'stage_number' => isset($irds[$i]["stage_number"]) ? (int)$irds[$i]["stage_number"] : null,
                    'application_project' => isset($irds[$i]["application_project"]) ? (int)$irds[$i]["application_project"] : null,
                    'received_date' => isset($irds[$i]["received_date"]) ? $irds[$i]["received_date"] : null,

                ]
            );
        }
        // Удаление записей, которых нет в списке
        ProjectIrds::where('project_id', $irds[0]["project_id"])
            ->whereNotIn('ird_id', array_column($irds, 'ird_id'))
            ->delete();
        return ProjectIrds::where('project_id', $irds[0]["project_id"])->get();
    }
}
