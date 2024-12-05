<?php declare(strict_types=1);

namespace App\GraphQL\Queries;

use App\Models\ParameterGroup as ModelsParameterGroup;

final readonly class ParameterGroup
{
    /** @param  array{}  $args */
    public function __invoke(null $_, array $args)
    {
        if (!isset($args['id']))
            throw new \InvalidArgumentException('id is required.');

        $id = $args['id'];
        return ModelsParameterGroup::find($id);
    }
}
