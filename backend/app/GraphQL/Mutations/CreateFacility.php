<?php declare(strict_types=1);

namespace App\GraphQL\Mutations;

use App\Models\Facility;

final readonly class CreateFacility
{
    /** @param  array{}  $args */
    public function __invoke(null $_, array $args)
    {
        if (!isset($args['data']))
            throw new \InvalidArgumentException('data is required.');

        $data = $args['data'];
        return Facility::create($data);
    }
}
