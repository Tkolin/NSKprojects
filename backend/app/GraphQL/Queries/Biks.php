<?php declare(strict_types=1);

namespace App\GraphQL\Queries;

use App\Models\Bik;

final readonly class Biks
{
    /** @param  array{}  $args */
    public function __invoke(null $_, array $args)
    {
        return Bik::all();
    }
}
