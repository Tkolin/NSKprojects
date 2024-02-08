<?php declare(strict_types=1);

namespace App\GraphQL\Mutations;

use App\Models\Organization;

final readonly class UpdateOrganization
{
    /** @param  array{}  $args */
    public function __invoke(null $_, array $args): Organization
    {
        // Находим организацию по ID
        $organization = Organization::findOrFail($args['id']);

        // Обновляем данные организации
        $organization->update($args);

        // Возвращаем обновленную организацию
        return $organization;
    }
}
