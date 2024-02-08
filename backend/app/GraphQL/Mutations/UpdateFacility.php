<?php declare(strict_types=1);

namespace App\GraphQL\Mutations;

use App\Models\Facility;

final readonly class UpdateFacility
{
    /** @param  array{}  $args */
    public function __invoke(null $_, array $args): Facility
    {
        // Находим объект по ID
        $facility = Facility::findOrFail($args['id']);

        // Обновляем данные объекта
        $facility->update($args);

        // Возвращаем обновленный объект
        return $facility;
    }
}
