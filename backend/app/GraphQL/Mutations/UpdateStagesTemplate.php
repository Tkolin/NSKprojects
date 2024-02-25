<?php declare(strict_types=1);

namespace App\GraphQL\Mutations;

use App\Models\TemplateIrdsTypeProjects;
use App\Models\TemplateStagesTypeProjects;
use Illuminate\Support\Facades\Log;

final readonly class UpdateStagesTemplate
{
    /** @param  array{}  $args */
    public function __invoke($_, array $args)
    {
        $typeProjectId = $args['typeProjectId'];
        $listStagesId = $args['listStages_id'];
        $listPercent = $args['listPercent'];

        if (count($listStagesId) !== count($listPercent)) {
            throw new \Exception('Length of lists must be equal');
        }

        $count = count($listStagesId);
        for ($i = 0; $i < $count; $i++) {
            TemplateStagesTypeProjects::updateOrCreate(
                [
                    'project_type_id' => $typeProjectId,
                    'stage_id' => (string)$listStagesId[$i]
                ],
                [
                    'percentage' => (int)$listPercent[$i]
                ]
            );
        }
        // Удаление записей, которых нет в списке
        TemplateStagesTypeProjects::where('project_type_id', $typeProjectId)
            ->whereNotIn('stage_id', $listStagesId)
            ->delete();
        return true;
    }

}
