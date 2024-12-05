<?php declare(strict_types=1);

namespace App\GraphQL\Mutations;

use App\Models\Supplier;

final readonly class DeleteSupplier
{
    /** @param  array{}  $args */
    public function __invoke(null $_, array $args)
    {
        Supplier::destroy($args['id']);
        return true;
    }
}
