<?php declare(strict_types=1);

namespace App\GraphQL\Mutations;

use App\GraphQL\Service\AuthorizationService;
use App\Models\PasspotPlaceIssue;
use App\Models\TypeProjectDocument;
use Nuwave\Lighthouse\Exceptions\AuthenticationException;
use Nuwave\Lighthouse\Support\Contracts\GraphQLContext;

final readonly class AddTypeProject
{
    /** @param  array{}  $args */
    public function __invoke(null $_, array $args, GraphQLContext $context)
    {
        $allowedRoles = ['admin','bookkeeper']; // Роли, которые разрешены
        $accessToken = $context->request()->header('Authorization');
        if (AuthorizationService::checkAuthorization($accessToken, $allowedRoles)) {
            return TypeProjectDocument::create($args);
        } else {
            throw new AuthenticationException('Отказано в доступе');
        }
    }
}
