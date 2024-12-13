<?php declare(strict_types=1);

namespace App\GraphQL\Queries;

use App\Models\FacilitySelection;

final readonly class Facilities
{
    public function __invoke(null $_, array $args)
    {
        return FacilitySelection::with('facility_subselection.facility_group.facilities')->get();
    }
}
