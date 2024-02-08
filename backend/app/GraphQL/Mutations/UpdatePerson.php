<?php declare(strict_types=1);

namespace App\GraphQL\Mutations;

use App\Models\Person;

final readonly class UpdatePerson
{
    /** @param  array{}  $args */
    public function __invoke(null $_, array $args): Person
    {
        // Находим персону по ID
        $person = Person::findOrFail($args['id']);

        // Обновляем данные персоны
        $person->update($args);

        // Возвращаем обновленную персону
        return $person;
    }
}
