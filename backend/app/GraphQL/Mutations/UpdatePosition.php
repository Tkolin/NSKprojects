<?php declare(strict_types=1);

namespace App\GraphQL\Mutations;

use App\Models\Position;

final readonly class UpdatePosition
{
    /** @param  array{}  $args */
    public function __invoke(null $_, array $args)
    {
        return Position::findOrFail($args['id'])->update($args["data"]);
    }
}
