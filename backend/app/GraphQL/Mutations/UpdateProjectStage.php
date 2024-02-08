<?php declare(strict_types=1);

namespace App\GraphQL\Mutations;

use App\Models\ProjectStage;

final readonly class UpdateProjectStage
{
    /** @param  array{}  $args */
    public function __invoke(null $_, array $args): ProjectStage
    {
        // Находим этап проекта по ID
        $projectStage = ProjectStage::findOrFail($args['id']);

        // Обновляем данные этапа проекта
        $projectStage->update($args);

        // Возвращаем обновленный этап проекта
        return $projectStage;
    }
}
