<?php declare(strict_types=1);

namespace App\GraphQL\Mutations;

use App\Models\ParameterModel;
use Illuminate\Database\Eloquent\ModelNotFoundException;

final readonly class UpdateParameter
{
    /** @param  array{}  $args */
    public function __invoke(null $_, array $args)
    {
        // Проверка обязательных аргументов
        if (!isset($args['data'])) {
            throw new \InvalidArgumentException('The "data" field is required.');
        }

        if (!isset($args['id'])) {
            throw new \InvalidArgumentException('The "id" field is required.');
        }

        // Поиск параметра по ID
        $object = ParameterModel::find($args['id']);

        if (!$object) {
            throw new ModelNotFoundException('Parameter not found.');
        }

        // Обновление данных
        $object->update($args['data']);

        // Возвращение обновлённого объекта
        return $object;
    }
}
