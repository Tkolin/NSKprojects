<?php declare(strict_types=1);

namespace App\GraphQL\Mutations;

final readonly class CreateEquipmentTypesActivity
{
    /** @param  array{}  $args */
    public function __invoke(null $_, array $args)
    {
        if (!isset($args['data']))
            throw new \InvalidArgumentException('data is required.');

        // TODO implement the resolver
    }
}
