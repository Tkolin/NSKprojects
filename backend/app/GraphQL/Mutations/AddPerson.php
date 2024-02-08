<?php declare(strict_types=1);

namespace App\GraphQL\Mutations;

final readonly class AddPerson
{
    /** @param  array{}  $args */
    public function __invoke(null $_, array $args): Person
    {
        // Создаем новую персону
        $person = Person::create($args);

        // Возвращаем добавленную персону
        return $person;
    }
}
