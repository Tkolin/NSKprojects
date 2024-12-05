<?php declare(strict_types=1);

namespace App\GraphQL\Mutations;

use App\Models\ParameterGroup;

final readonly class DeleteParameterGroup
{
    /** @param  array{}  $args */
    public function __invoke(null $_, array $args)
    {
        ParameterGroup::destroy($args['id']);
        return true;
    }
}
