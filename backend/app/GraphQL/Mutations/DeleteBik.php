<?php declare(strict_types=1);

namespace App\GraphQL\Mutations;

use App\Models\Bik;

final readonly class DeleteBik
{
    /** @param  array{}  $args */
    public function __invoke(null $_, array $args)
    {
        Bik::destroy($args['id']);
        return true;
    }
}
