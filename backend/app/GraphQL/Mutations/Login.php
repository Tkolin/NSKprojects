<?php

namespace App\GraphQL\Mutations;

use Illuminate\Support\Facades\Auth;

final class Login
{
    /**
     * Обработчик мутации для входа пользователя.
     *
     * @param  mixed  $_
     * @param  array<string, mixed>  $args
     * @return array<string, mixed>
     */
    public function __invoke($_, array $args): array
    {
        if (!Auth::attempt(['email' => $args['input']['email'], 'password' => $args['input']['password']])) {
            return [
                'user' => null,
                'role' => null,
                'access_token' => null,
                'refresh_token' => null // Refresh token будет установлен в httpOnly куку на фронтенде
            ];
        }

        $user = Auth::user();
        $role = $user->role;
        $accessToken = $user->createToken('authToken')->accessToken;

        return [
            'user' => $user,
            'role' => $role,
            'access_token' => $accessToken,
            'refresh_token' => null

        ];
    }
}
