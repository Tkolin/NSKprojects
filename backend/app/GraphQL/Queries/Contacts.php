<?php declare(strict_types=1);

namespace App\GraphQL\Queries;

use App\Models\Contact;

final readonly class Contacts
{
    /** @param  array{}  $args */
    public function __invoke(null $_, array $args)
    {
        return Contact::with('position')
            ->with('organization')
            ->get();
    }
}
