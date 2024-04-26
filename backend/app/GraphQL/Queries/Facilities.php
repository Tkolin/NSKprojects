<?php declare(strict_types=1);

namespace App\GraphQL\Queries;

use App\Models\SelectionFacility;

final readonly class Facilities
{
    public function __invoke(null $_, array $args)
    {
        return SelectionFacility::with('subselection_facility.group_facility.facilities')->get();
    }
}
