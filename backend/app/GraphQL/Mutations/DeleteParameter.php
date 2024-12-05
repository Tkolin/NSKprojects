<?php declare(strict_types=1);

namespace App\GraphQL\Mutations;

use App\Models\ParameterModel;

final readonly class DeleteParameter
{
    /** @param  array{}  $args */
    public function __invoke(null $_, array $args)
    {
        ParameterModel::destroy($args['id']);
        return true;
    }
}
