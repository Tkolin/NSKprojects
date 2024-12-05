<?php declare(strict_types=1);

namespace App\GraphQL\Queries;

use App\Models\Supplier as ModelsSupplier;

final readonly class Supplier
{
    /** @param  array{}  $args */
    public function __invoke(null $_, array $args)
    {
        $id = $args['id'];
        return ModelsSupplier::find($id);
    }
}
