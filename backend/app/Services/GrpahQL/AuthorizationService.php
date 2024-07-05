<?php

namespace App\Services\GrpahQL;

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
    public static function checkPermisions($accessToken, $allowedRoles)
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
