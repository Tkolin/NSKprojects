<?php

namespace App\GraphQL\Service;

use App\Models\User;
use Illuminate\Support\Facades\Auth;

class AuthorizationService
{
    public static function checkAuthorization($accessToken, $allowedRoles)
    {
        if ($accessToken) {
            if (Auth::guard('api')->check()) {
                $role = User::with('role')->find(Auth::guard('api')->id())->role->name;
                if (in_array($role, $allowedRoles)) {
                    return true;
                }
            }
        }
        return false;
    }
}
