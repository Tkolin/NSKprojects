<?php declare(strict_types=1);

namespace App\GraphQL\Mutations;

use App\Models\Position;

final readonly class DeletePosition
{
    /** @param  array{}  $args */
    public function __invoke(null $_, array $args)
    {
        Position::destroy($args['id']);
        return true;
    }
}
