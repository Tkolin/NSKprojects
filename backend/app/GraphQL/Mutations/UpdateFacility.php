<?php declare(strict_types=1);

namespace App\GraphQL\Mutations;

use App\Models\Facility;

final readonly class UpdateFacility
{
    /** @param array{} $args */
    public function __invoke(null $_, array $args): Facility
    {
        return Facility::findOrFail($args['id'])->update($args["data"]);
    }
}
