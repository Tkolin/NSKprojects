<?php declare(strict_types=1);

namespace App\GraphQL\Mutations;

use App\Models\Project;
use App\Models\ProjectStage;

final readonly class UpdateProject
{
    /** @param  array{}  $args */
    public function __invoke(null $_, array $args): Project
    {
        // Находим проект по ID
        $project = Project::findOrFail($args['id']);

        // Обновляем данные проекта
        $project->update($args);

        // Возвращаем обновленный проект
        return $project;
    }
}
