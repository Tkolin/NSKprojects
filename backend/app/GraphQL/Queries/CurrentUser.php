<?php

namespace App\GraphQL\Queries;

use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Nuwave\Lighthouse\Support\Contracts\GraphQLContext;
use Nuwave\Lighthouse\Exceptions\AuthenticationException;
class CurrentUser
{
    public function __invoke($rootValue, array $args, GraphQLContext $context)
    {
        // Получаем токен из заголовка Authorization
        $accessToken = $context->request()->header('Authorization');
         if ($accessToken) {
            // Проверяем токен и получаем пользователя
            $user = Auth::guard('api')->user();

            // Получаем роли пользователя
            $roles = $user->roles->map(function ($role) {
                return [
                    'id' => $role->id,
                    'name' => $role->name,
                    'name_key' => $role->name_key,
                    'permissions' => $role->permissions->map(function ($permission) {
                        return ['name' => $permission->name, 'name_key' => $permission->name_key];
                    })->toArray()
                ];
            });

            // Получаем права доступа для всех ролей пользователя
            $permissions = $roles->flatMap(function ($role) {
                return $role['permissions'];
            })->unique()->values();

            // Создаем токен доступа
            $accessToken = $user->createToken('authToken')->accessToken;
            // Преобразуем массив строк в массив объектов
//            $permissions = $permissions->map(function ($permission) {
//                return ['name' => $permission, 'name_key' => $permission];
//            })->toArray();
            // Выводим данные в журнал ошибок для отладки
            // error_log('User: ' . print_r($user, true));
            // error_log('Roles: ' . print_r($roles, true));
            //     error_log('Permissions: ' . print_r($permissions,true));
            //  error_log('Access Token: ' . $accessToken);

            return [
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                ],
                'roles' => $roles,
                'permissions' => $permissions,
                'access_token' => $accessToken,
                'refresh_token' => null
            ];
        } else {
            throw new AuthenticationException('Not token found');
        }
    }
}
