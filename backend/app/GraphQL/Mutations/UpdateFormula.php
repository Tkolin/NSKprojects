<?php declare(strict_types=1);

namespace App\GraphQL\Mutations;

use App\Models\Facility;
use App\Models\Formula;

final readonly class UpdateFormula
{
    /** @param  array{}  $args */
    public function __invoke(null $_, array $args): Facility
    {
//TODO: Обнвление формулы
        return Formula::create($args);
    }
}
