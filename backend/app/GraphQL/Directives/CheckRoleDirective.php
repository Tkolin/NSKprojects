<?php

namespace App\GraphQL\Directives;

use App\GraphQL\Service\AuthorizationService;
use Nuwave\Lighthouse\Exceptions\AuthenticationException;
use Nuwave\Lighthouse\Schema\Directives\BaseDirective;
use Nuwave\Lighthouse\Schema\Values\FieldValue;
use Nuwave\Lighthouse\Support\Contracts\FieldMiddleware;
use Nuwave\Lighthouse\Support\Contracts\GraphQLContext;

class CheckRoleDirective extends BaseDirective implements FieldMiddleware
{
    public static function definition(): string
    {
        return /** @lang GraphQL */ <<<GRAPHQL
            """
            This directive checks the role of the authenticated user and throws an error if the user does not have the required role.
            """
            directive @checkRole(
                """
                The required role.
                """
                roles: [String!]
            ) on FIELD_DEFINITION | OBJECT
        GRAPHQL;
    }

    public function handleField(FieldValue $fieldValue): void
    {
        $allowedRoles = $this->directiveArgValue('roles');

        $fieldValue->wrapResolver(function ($previousResolver) use ($allowedRoles) {
            return function ($root, $args, $context, $resolveInfo) use ($allowedRoles, $previousResolver) {
                if (!AuthorizationService::checkAuthorization($context->request()->header('Authorization'), $allowedRoles)) {
                    throw new AuthenticationException('Отказано в доступе');
                }
                return $previousResolver($root, $args, $context, $resolveInfo);
            };
        });
    }
}
