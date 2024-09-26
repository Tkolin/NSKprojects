<?php declare(strict_types=1);

namespace App\GraphQL\Mutations;

use App\Models\TechnicalSpecificationChapter;
use App\Models\TechnicalSpecificationChapterValue;

final readonly class CreateTSChapter
{
    /** @param  array{}  $args */
    public function __invoke(null $_, array $args)
    {
       // Создаем главу технической спецификации
    $technicalSpecification = TechnicalSpecificationChapter::create([
        'name' => $args['data']['name'],
        'content' => $args['data']['content'],
    ]);

    // Проверяем, есть ли переменные в контенте
    if (isset($args['data']['variables_in_content']) && is_array($args['data']['variables_in_content'])) {
        foreach ($args['data']['variables_in_content'] as $variable) {
            // Создаем запись в technical_specification_chapter_values
            $chapterValue = TechnicalSpecificationChapterValue::create([
                'chapter_id' => $technicalSpecification->id,
                'name' => $variable['name'],
                'description' => $variable['description'] ?? null,
                'type' => $variable['type'],
                'defaultValue' => $variable['defaultValue'] ?? null,
            ]);

            // Если тип переменной - 'reference', связываем ее с reference_id
            if ($variable['type'] === 'reference' && isset($variable['reference_key'])) {
                $referenceId = $variable['reference_key'];

                // Добавляем связь в таблицу technical_specification_chapter_value_reference
                $chapterValue->references()->attach($referenceId);
            }
        }
    }

    return $technicalSpecification;
    }
}
