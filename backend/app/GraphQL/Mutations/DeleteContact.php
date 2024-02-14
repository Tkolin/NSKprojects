<?php declare(strict_types=1);

namespace App\GraphQL\Mutations;

use App\Models\Contact;

final readonly class DeleteContact
{
    public function __invoke($_, array $args)
    {
        $contact = Contact::destroy($args['id']);
    }
}
