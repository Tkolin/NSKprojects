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
    public function __invoke(null $_, array $args, GraphQLContext $context): Facility
    {
        $allowedRoles = ['admin']; // Роли, которые разрешены
        $accessToken = $context->request()->header('Authorization');
        if (AuthorizationService::checkAuthorization($accessToken, $allowedRoles)) {
            $facility = Formula::create($args);
            return $facility;
        } else {
            throw new AuthenticationException('Отказано в доступе');
        }

    }
}
