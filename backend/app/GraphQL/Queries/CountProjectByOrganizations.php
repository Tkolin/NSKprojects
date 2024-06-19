<?php declare(strict_types=1);

namespace App\GraphQL\Queries;

use App\Models\Organization;

final readonly class CountProjectByOrganizations
{
    /** @param  array{}  $args */
    public function __invoke(null $_, array $args)
    {

        // Получаем organizationId из аргументов
        $organizationId = $args['organizationId'] ?? null;

        // Если organizationId передан, получаем одну организацию с количеством проектов
        if ($organizationId) {
            $organization = Organization::withCount('createNewProject')->find($organizationId);
            if (!$organization) {
                throw new \Exception("Organization not found");
            }

            // Формируем объект с данными об организации
            $result = [
                'organization_id' => $organization->id,
                'count_project' => $organization->project_count,
            ];

            return ['items' => [$result]];
        }

        // Если organizationId не передан, возвращаем список всех организаций с количеством проектов
        $organizations = Organization::withCount('createNewProject')->get();

        // Формируем список в требуемом формате
        $result = $organizations->map(function ($organization) {
            return [
                'organization_id' => $organization->id,
                'count_project' => $organization->project_count,
            ];
        });

        return ['items' => $result];
    }
}
