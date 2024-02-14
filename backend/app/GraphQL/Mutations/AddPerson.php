<?php declare(strict_types=1);

namespace App\GraphQL\Mutations;

final readonly class AddPerson
{
    /** @param  array{}  $args */
    public function __invoke(null $_, array $args): Person
    {
        $person = Person::create($args);
        return $person;
    }
}
