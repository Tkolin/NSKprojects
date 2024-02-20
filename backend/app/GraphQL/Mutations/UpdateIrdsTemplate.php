<?php declare(strict_types=1);

namespace App\GraphQL\Mutations;

use App\Models\TemplateIrdsTypeProjects;
use App\Models\TemplateStagesTypeProjects;

final readonly class UpdateIrdsTemplate
{
    /** @param  array{}  $args */
    public function __invoke($_, array $args)
    {
        $typeProjectId = $args['typeProjectId'];
        $listIrdsIds = $args['listIrds_id'];
        $listStageNumbers = $args['listStageNumber'];
        $listAppNumbers = $args['listAppNumber'];

        if (count($listIrdsIds) !== count($listIrdsIds)) {
            throw new \Exception('Length of lists must be equal');
        }

        $count = count($listIrdsIds);
        for ($i = 0; $i < $count; $i++) {
            TemplateIrdsTypeProjects::updateOrCreate(
                [
                    'project_type_id' => $typeProjectId,
                    'ird_id' => (int)$listIrdsIds[$i]
                ],
                [
                    'stage_number' => (int)$listStageNumbers[$i],
                    'application_to_project' => (int)$listAppNumbers[$i]
                ]
            );
        }

        return true;
    }
}
