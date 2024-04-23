<?php declare(strict_types=1);

namespace App\GraphQL\Mutations;

use App\GraphQL\Service\AuthorizationService;
use App\Models\GroupTypeProjectDocument;
use Nuwave\Lighthouse\Exceptions\AuthenticationException;
use Nuwave\Lighthouse\Support\Contracts\GraphQLContext;

final readonly class UpdateGroupTypeProject
{
    /** @param  array{}  $args */
    public function __invoke(null $_, array $args, GraphQLContext $context): GroupTypeProjectDocument
    {
        $allowedRoles = ['admin']; // Роли, которые разрешены
        $accessToken = $context->request()->header('Authorization');
        if (AuthorizationService::checkAuthorization($accessToken, $allowedRoles)) {
            $data = GroupTypeProjectDocument::findOrFail($args['id']);
            $data->update($args);
            return $data;
        } else {
            throw new AuthenticationException('Отказано в доступе');
        }
    }
}
