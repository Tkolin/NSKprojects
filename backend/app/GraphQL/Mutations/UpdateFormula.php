<?php declare(strict_types=1);

namespace App\GraphQL\Mutations;

use App\Models\_dev\Formula;
use App\Models\FacilityType;

final readonly class UpdateFormula
{
    /** @param  array{}  $args */
    public function __invoke(null $_, array $args): FacilityType
    {
//TODO: Обнвление формулы
        return Formula::create($args);
    }
}
