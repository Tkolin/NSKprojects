<?php declare(strict_types=1);

// app/GraphQL/Mutations/AddContact.php

namespace App\GraphQL\Mutations;

use GraphQL\Type\Definition\ResolveInfo;
use Nuwave\Lighthouse\Support\Contracts\GraphQLContext;

class AddContact
{
    public function __invoke($rootValue, array $args, GraphQLContext $context, ResolveInfo $resolveInfo)
    {
        // Обработайте создание контакта здесь
        // Используйте $args для получения переданных данных

        // Возвращайте созданный контакт
        return [
            'id' => 1, // Используйте реальный ID созданного контакта
            'first_name' => $args['first_name'],
            'last_name' => $args['last_name'],
            'mobile_phone' => $args['mobile_phone'],
            'email' => $args['email'],
            'sibnipi_email' => $args['sibnipi_email'],
            'position_id' => $args['position_id'],
            // Другие поля...
        ];
    }
}
