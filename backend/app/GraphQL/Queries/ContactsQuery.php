<?php

// app/GraphQL/Queries/ContactsQuery.php

namespace App\GraphQL\Queries;

use App\Models\Contact;
use GraphQL\Type\Definition\Type;
use Rebing\GraphQL\Support\Facades\GraphQL;
use Rebing\GraphQL\Support\Query;

class ContactsQuery extends Query
{
    protected $attributes = [
        'name' => 'contacts',
    ];

    public function type(): Type
    {
        return Type::listOf(GraphQL::type('Contact'));
    }

    public function resolve()
    {
        return Contact::all();
    }
}
