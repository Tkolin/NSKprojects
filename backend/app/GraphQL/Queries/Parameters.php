<?php declare(strict_types=1);

namespace App\GraphQL\Queries;

use App\Models\ParameterModel;

final readonly class Parameters
{
    /** @param  array{}  $args */
    public function __invoke(null $_, array $args)
    {
        return ['items' => ParameterModel::all()];
    }
}
