<?php declare(strict_types=1);

namespace App\GraphQL\Mutations;

use App\GraphQL\Service\AuthorizationService;
use App\Models\Facility;
use App\Models\Formula;
use Nuwave\Lighthouse\Exceptions\AuthenticationException;
use Nuwave\Lighthouse\Support\Contracts\GraphQLContext;

final readonly class UpdateFormula
{
    /** @param  array{}  $args */
    public function __invoke(null $_, array $args): Facility
    {
//TODO: Обнвление формулы
        return Formula::create($args);
    }
}
