<?php declare(strict_types=1);

namespace App\GraphQL\Queries;

use App\Models\Formula;

final readonly class FormulaByKey
{
    /** @param  array{}  $args */
    public function __invoke(null $_, array $args)
    {
        $formula = Formula::all();
        return ['items' => $formula, 'count' => 1];

    }
}
