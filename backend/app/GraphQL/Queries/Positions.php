<?php declare(strict_types=1);

namespace App\GraphQL\Queries;

use App\Models\Position;

final readonly class Positions
{
    /** @param  array{}  $args */
    public function __invoke(null $_, array $args)
    {
        return Position::all();
    }
}
