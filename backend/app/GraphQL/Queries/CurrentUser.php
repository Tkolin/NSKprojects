<?php

namespace App\GraphQL\Queries;

use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Nuwave\Lighthouse\Support\Contracts\GraphQLContext;

class CurrentUser
{
    public function __invoke($rootValue, array $args, GraphQLContext $context)
    {
        error_log('Зашёл в проверку токена');
        // Получаем токен доступа из заголовка запроса
        $accessToken = $context->request()->header('Authorization');
        // Выводим полученный токен в логи или на экран
        //$accessToken = 'Bearer ' + $accessToken;
        error_log('Received access token: ' . $accessToken); // Запись в логи
        //return  User::first();
        // Проверяем, передан ли токен доступа
        if ($accessToken) {
            // Попытка аутентификации пользователя по токену
            if (Auth::guard('api')->check()) {
                // Возвращаем текущего аутентифицированного пользователя
                return Auth::guard('api')->user();
            } else {
                error_log('Not accaunt');

                // Если пользователь не аутентифицирован, выбрасываем исключение Unauthorized
                throw new \Exception('Not accaunt.');
            }
        } else {
            // Если токен доступа отсутствует, выбрасываем исключение Unauthorized
            throw new \Exception('Not tocken.');
        }
    }
}
