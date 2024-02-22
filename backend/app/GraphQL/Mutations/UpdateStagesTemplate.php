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
        error_log("Type Project ID: " . $typeProjectId);
        error_log("List Stages ID: " . json_encode($listStagesId));
        error_log("List Percent: " . json_encode($listPercent));
        if (count($listStagesId) !== count($listPercent)) {
            throw new \Exception('Length of lists must be equal');
        }

        $count = count($listStagesId);
        for ($i = 0; $i < $count; $i++) {
            error_log("тут");
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

        return true;
    }

}
