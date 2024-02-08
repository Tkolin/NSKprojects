<?php declare(strict_types=1);

namespace App\GraphQL\Mutations;

use App\Models\Organization;

final readonly class AddOrganization
{
    /** @param  array{}  $args */
    public function __invoke(null $_, array $args): Organization
    {
        // Создаем новую организацию
        $organization = Organization::create($args);

        // Возвращаем добавленную организацию
        return $organization;
    }
}
