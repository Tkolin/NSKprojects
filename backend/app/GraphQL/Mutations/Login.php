<?php

namespace App\GraphQL\Mutations;

use Illuminate\Support\Facades\Auth;
use Nuwave\Lighthouse\Support\Contracts\GraphQLContext;

final class Login
{
    /**
     * Обработчик мутации для входа пользователя.
     *
     * @param  mixed  $_
     * @param  array<string, mixed>  $args
     * @return array<string, mixed>
     */
    public function __invoke($_, array $args, GraphQLContext $context): array
    {
        // Проверяем правильность введенных данных для авторизации
        if (!Auth::attempt(['email' => $args['input']['email'], 'password' => $args['input']['password']])) {
            return [
                'user' => null,
                'roles' => [],
                'permissions' => [],
                'access_token' => null,
                'refresh_token' => null
            ];
        }

        // Получаем текущего авторизованного пользователя
        
        $user = Auth::user();

        // Получаем роли пользователя
        
        $roles = $user->roles->map(function ($role) {
            return [
                'id' => $role->id,
                'name' => $role->name,
                'permissions' => $role->permissions->map(function ($permission) {
                    return $permission->name_key;
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
        
        $permissions = $permissions->map(function ($permission) {
            return ['name_key' => $permission];
        })->toArray();

        // Выводим данные в журнал ошибок для отладки
        
        // error_log('User: ' . print_r($user, true));
        
        // error_log('Roles: ' . print_r($roles, true));

        error_log('Permissions: ' . print_r($permissions,true));
        
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
    }
}
