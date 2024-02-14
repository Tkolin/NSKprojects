<?php declare(strict_types=1);

namespace App\GraphQL\Mutations;

use App\Models\Facility;

final readonly class AddFacility
{
    /** @param  array{}  $args */
    public function __invoke(null $_, array $args): Facility
    {
        $facility = Facility::create($args);
        return $facility;
    }
}
