<?php

namespace App\GraphQL\Directives;

use App\Services\GrpahQL\AuthorizationService;
use Illuminate\Support\Facades\Auth;
use Nuwave\Lighthouse\Exceptions\AuthenticationException;
use Nuwave\Lighthouse\Schema\Directives\BaseDirective;
use Nuwave\Lighthouse\Schema\Values\FieldValue;
use Nuwave\Lighthouse\Support\Contracts\FieldMiddleware;

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
                permission: [String!]
            ) on FIELD_DEFINITION | OBJECT
        GRAPHQL;
    }

    public function handleField(FieldValue $fieldValue): void
    {
        $allowedPermissions = $this->directiveArgValue('permission');

        // Обертываем существующий резолвер
        $fieldValue->wrapResolver(function ($previousResolver) use ($allowedPermissions) {
            return function ($root, $args, $context, $resolveInfo) use ($allowedPermissions, $previousResolver) {
                $accessToken = $context->request()->header('Authorization');

                if ($accessToken) {
                    // Проверяем, авторизован ли пользователь
                    if (Auth::guard('api')->check()) {
                        $user = Auth::guard('api')->user();
                         $roles = $user->roles->map(function ($role) {
                            return [
                                'permissions' => $role->permissions->map(function ($permission) {
                                    return $permission->name_key;
                                })->toArray()
                            ];
                        });
                        $userPermissions = $roles->flatMap(function ($role) {
                            return $role['permissions'];
                        })->unique()->values()->toArray();

                        // Проверяем, есть ли у пользователя хотя бы одно из необходимых разрешений
                        foreach ($allowedPermissions as $permission) {
                            if (in_array($permission, $userPermissions)) {
                                return $previousResolver($root, $args, $context, $resolveInfo, $userPermissions);
                            }
                        }

                        // Если ни одно из разрешений не найдено, выбрасываем исключение
                        throw new AuthenticationException('Отказано в доступе');
                    } else {
                        throw new AuthenticationException('Unauthorized');
                    }
                } else {
                    throw new AuthenticationException('Unauthorized');
                }
            };
        });
    }
}
