<?php declare(strict_types=1);

namespace App\GraphQL\Mutations;
use App\Models\ReferenceModel;

final readonly class CreateReference
{
    /** @param  array{}  $args */
    public function __invoke(null $_, array $args)
    {
        $numberedContent = isset($args['data']['content']) ? array_map(function($item, $index) {
            return array_merge(['key' => $index + 1], $item); // Добавляем ключ к каждому элементу массива
        }, $args['data']['content'], array_keys($args['data']['content'])) : null;

        $referenceModel = ReferenceModel::create([
            'name' => $args['data']['name'],
            'description' => $args['data']['description'],
            'content' => $numberedContent ? json_encode($numberedContent) : null, // Сериализация контента с номерами ключей
        ]);
        return $referenceModel;
    }
}
