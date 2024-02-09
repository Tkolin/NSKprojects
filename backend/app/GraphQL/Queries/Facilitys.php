<?php declare(strict_types=1);

namespace App\GraphQL\Queries;

use App\Models\Facility;

final readonly class Facilitys
{
    /** @param  array{}  $args */
    public function __invoke(null $_, array $args)
    {
        return Facility::all();
    }
}
