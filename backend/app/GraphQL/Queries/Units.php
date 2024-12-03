<?php declare(strict_types=1);

namespace App\GraphQL\Queries;

use App\Models\Unit;

final readonly class Units
{
    /** @param  array{}  $args */
    public function __invoke(null $_, array $args)
    {
        return ['items' => Unit::all(), 'count' => 99];
    }
}
