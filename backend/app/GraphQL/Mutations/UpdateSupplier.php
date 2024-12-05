<?php declare(strict_types=1);

namespace App\GraphQL\Mutations;

use App\Models\Supplier;

final readonly class UpdateSupplier
{
    /** @param  array{}  $args */
    public function __invoke(null $_, array $args)
    {
        return Supplier::findOrFail($args['id'])->update($args["data"]);
    }
}
