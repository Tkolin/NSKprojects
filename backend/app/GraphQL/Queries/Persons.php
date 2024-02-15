<?php declare(strict_types=1);

namespace App\GraphQL\Queries;

use App\Models\Person;

final readonly class Persons
{
    /** @param  array{}  $args */
    public function __invoke(null $_, array $args)
    {
        return Person
            ::with('passport')
            ->with('bank')
            ->with('BIK')
            ->get();
    }
}
