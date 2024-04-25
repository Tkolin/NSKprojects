<?php declare(strict_types=1);

namespace App\GraphQL\Mutations;

use App\Models\TemplateIrdsTypeProjects;
use App\Models\TemplateStagesTypeProjects;
use Illuminate\Support\Facades\Log;

final readonly class UpdateIrdsTemplate
{
    /** @param  array{}  $args */
    public function __invoke($_, array $args)
    {
        //TODO: УСТАРЕЛО, НУЖНО ОБНОВИТЬ
        Log::warning('UpdateIrdsTemplate УСТАРЕЛО, НУЖНО ОБНОВИТЬ');

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
        // Удаление записей, которых нет в списке
        TemplateIrdsTypeProjects::where('project_type_id', $typeProjectId)
            ->whereNotIn('ird_id', $listIrdsIds)
            ->delete();

        return true;
    }
}
