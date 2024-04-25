<?php

namespace App\GraphQL\Service;

use App\Models\User;
use Illuminate\Support\Facades\Auth;

class AuthorizationService
{
    public static function checkAuthorization($accessToken, $allowedRoles)
    {
        if ($accessToken) {
            $user = Auth::guard('api')->user();

            if ($user && in_array($user->role->name, $allowedRoles)) {
                return true;
            }
        }

        return false;
    }
}
