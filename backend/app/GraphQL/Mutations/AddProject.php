<?php declare(strict_types=1);

namespace App\GraphQL\Mutations;

use App\Models\Project;

final readonly class AddProject
{
    /** @param  array{}  $args */
    public function __invoke(null $_, array $args): Project
    {
        // Создаем новый проект
        $project = Project::create($args);

        // Возвращаем добавленный проект
        return $project;
    }
}
