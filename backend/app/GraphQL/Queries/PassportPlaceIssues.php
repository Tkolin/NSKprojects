<?php declare(strict_types=1);

namespace App\GraphQL\Queries;

use App\Models\PasspotPlaceIssue;

final readonly class PassportPlaceIssues
{
    /** @param  array{}  $args */
    public function __invoke(null $_, array $args)
    {
        return PasspotPlaceIssue::all();
    }
}
