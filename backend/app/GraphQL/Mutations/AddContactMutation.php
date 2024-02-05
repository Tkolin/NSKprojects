<?php

// app/GraphQL/Mutations/AddContactMutation.php

namespace App\GraphQL\Mutations;

use App\Models\Contact;
use GraphQL\Type\Definition\Type;
use Rebing\GraphQL\Support\Facades\GraphQL;
use Rebing\GraphQL\Support\Mutation;

class AddContactMutation extends Mutation
{
    protected $attributes = [
        'name' => 'addContact',
    ];

    public function type(): Type
    {
        return GraphQL::type('Contact');
    }

    public function args(): array
    {
        return [
            'first_name' => ['name' => 'first_name', 'type' => Type::nonNull(Type::string())],
            'last_name' => ['name' => 'last_name', 'type' => Type::nonNull(Type::string())],
            'mobile_phone' => ['name' => 'mobile_phone', 'type' => Type::nonNull(Type::string())],
            'email' => ['name' => 'email', 'type' => Type::nonNull(Type::string())],
            'sibnipi_email' => ['name' => 'sibnipi_email', 'type' => Type::nonNull(Type::string())],
            'position_id' => ['name' => 'position_id', 'type' => Type::nonNull(Type::id())],
        ];
    }

    public function resolve($root, $args)
    {
        return Contact::create($args);
    }
}
