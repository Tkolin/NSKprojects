<?php declare(strict_types=1);

namespace App\GraphQL\Mutations;

use App\Models\Person;

final readonly class UpdatePerson
{
    /** @param  array{}  $args */
    public function __invoke(null $_, array $args): Person
    {
        $person = Person::findOrFail($args['id']);
        $person->update($args);
        return $person;
    }
}
