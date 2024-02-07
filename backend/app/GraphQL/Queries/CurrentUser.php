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
        error_log('Зашёл в проверку юзера');
        $accessToken = $context->request()->header('Authorization');
        error_log('Received access token: ' . $accessToken);

        if ($accessToken) {
            if (Auth::guard('api')->check()) {
                return User::with('role')->find(Auth::guard('api')->id());
            } else {
                throw new AuthenticationException('Unauthorized');
            }
        } else {
            throw new AuthenticationException('Unauthorized');
        }
    }
}
