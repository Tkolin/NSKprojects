<?php declare(strict_types=1);

namespace App\GraphQL\Queries;

use App\Models\ParameterGroup;

final readonly class ParameterGroups
{
    /** @param  array{}  $args */
    public function __invoke(null $_, array $args)
    {
        return ['items' => ParameterGroup::all(), 'count' => 10];
    }
}
