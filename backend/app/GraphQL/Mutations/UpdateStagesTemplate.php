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
        $stages = $args['items'];

        $count = count($stages);
        for ($i = 0; $i < $count; $i++) {
            TemplateStagesTypeProjects::updateOrCreate(
                [
                    'project_type_id' => $stages[$i]["project_type_id"],
                    'stage_id' => (string)$stages[$i]["stage_id"]
                ],
                [
                   'duration' => $stages[$i]["duration"],
                   'number' => $stages[$i]["stage_number"],
                   'percentage' => isset($stages[$i]["percentage"]) ? (int)$stages[$i]["percentage"] : null,
               ]
            );
        }
        // Удаление записей, которых нет в списке
        TemplateStagesTypeProjects::where('project_type_id', $stages[0]["project_type_id"])
            ->whereNotIn('stage_id', array_column($stages, 'stage_id'))
            ->delete();
        return true;
    }

}
