<?php declare(strict_types=1);

namespace App\GraphQL\Mutations;

use App\GraphQL\Service\AuthorizationService;
use App\Models\PasspotPlaceIssue;
use App\Models\TypeProjectDocument;
use Nuwave\Lighthouse\Exceptions\AuthenticationException;
use Nuwave\Lighthouse\Support\Contracts\GraphQLContext;

final readonly class UpdateTypeProject
{
    /** @param  array{}  $args */
    public function __invoke(null $_, array $args, GraphQLContext $context): TypeProjectDocument
    {
        $allowedRoles = ['admin','bookkeeper']; // Роли, которые разрешены
        $accessToken = $context->request()->header('Authorization');
        if (AuthorizationService::checkAuthorization($accessToken, $allowedRoles)) {
            $typeProjects = TypeProjectDocument::findOrFail($args['id']);
            $typeProjects->update($args);
            return $typeProjects;
        } else {
            throw new AuthenticationException('Отказано в доступе');
        }
    }
}
