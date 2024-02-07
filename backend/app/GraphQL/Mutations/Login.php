<?php declare(strict_types=1);

namespace App\GraphQL\Mutations;

use Illuminate\Support\Facades\Auth;

final class Login
{
    /**
     * @param  mixed  $_
     * @param  array<string, mixed>  $args
     * @return array<string, mixed>
     */
    public function __invoke($_, array $args): array
    {
        error_log('Зашёл в логин');
        if (Auth::attempt(['email' => $args['input']['email'], 'password' => $args['input']['password']])) {
            $user = Auth::user();
            $accessToken = $user->createToken('authToken')->accessToken;

            return [
                'user' => $user,
                'access_token' => $accessToken,
            ];
        }

        return [
            'user' => null,
            'access_token' => null,
        ];
    }
}
