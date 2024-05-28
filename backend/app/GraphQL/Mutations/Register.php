<?php declare(strict_types=1);

namespace App\GraphQL\Mutations;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Nuwave\Lighthouse\Support\Contracts\GraphQLContext;

final readonly class Register
{
    /** @param  array{}  $args */
    public function __invoke(null $_, array $args, GraphQLContext $context)
    {
        error_log('Зашёл в регистр');
        $user = User::create([
            'name' => $args['input']['name'] ?? null,
            'email' => $args['input']['email'] ?? null,
            'password' => Hash::make($args['input']['password']),
            'role_id' => 0, // Устанавливаем роль пользователя
        ]);

        $accessToken = $user->createToken('authToken')->accessToken;
        error_log($accessToken);
        return [
            'user' => $user,
            'access_token' => $accessToken,
        ];
    }
}
