<?php declare(strict_types=1);

namespace App\GraphQL\Mutations;

use App\Models\FacilityType;

final readonly class UpdateFacility
{
    /** @param array{} $args */
    public function __invoke(null $_, array $args): FacilityType
    {
        return FacilityType::findOrFail($args['id'])->update($args["data"]);
    }
}
