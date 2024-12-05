<?php declare(strict_types=1);

namespace App\GraphQL\Mutations;

use App\Models\Unit;

final readonly class UpdateUnit
{
    /** @param  array{}  $args */
    public function __invoke(null $_, array $args)
    {
        return Unit::findOrFail($args['id'])->update($args["data"]);
    }
}
