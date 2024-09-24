<?php declare(strict_types=1);

namespace App\GraphQL\Mutations;

use App\Models\ProjectTSChapter;
use App\Models\TechnicalSpecificationChapter;
use App\Models\ProjectValue;
use App\Models\ProjectTSChapterValue;
use App\Models\Reference;
use GraphQL\Type\Definition\ResolveInfo;
use Nuwave\Lighthouse\Support\Contracts\GraphQLContext;

final readonly class CreateProjectTSChapter
{
    /** @param  array{}  $args */
    public function __invoke(null $_, array $args)
    {
        $projectId = $args["projectId"];
        $chapterIds = $args["chapterIds"];

        // Получить все TechnicalSpecificationChapters по chapterIds
        $technicalSpecificationChapters = TechnicalSpecificationChapter::whereIn('id', $chapterIds)->get();

        foreach ($technicalSpecificationChapters as $originalChapter) {
            // Создать запись в ProjectTSChapter
            $ptsc = [
                'project_id' => $projectId,
                'ts_chapter_id' => $originalChapter->id,
            ];
            $projectChapter = ProjectTSChapter::create($ptsc);

            $variablesInOriginalChapter = json_decode($originalChapter->variables_in_content, true) ?? [];

            // Обработать variables_in_content
            $processedVariables = $this->processVariablesInContent($variablesInOriginalChapter);

            foreach ($processedVariables as $variable) {
                // Создать запись в ProjectValue
                $projectValue = ProjectValue::create([
                    'key' => $variable['key'],
                    'name' => $variable['name'],
                    'type' => $variable['type'],
                    'value' => $variable['type'] !== 'references' ? ($variable['value'] ?? null) : null,
                ]);

                if ($variable['type'] === 'references' && isset($variable['reference_key'])) {
                    // Найти справочник по reference_key
                    $reference = Reference::find($variable['reference_key']);
                    if ($reference) {
                        // Получить значения из справочника
                        $values = json_decode($reference->content, true) ?: [];

                        // Создать записи в ProjectTSChapterValue с reference values
                        foreach ($values as $value) {
                            ProjectTSChapterValue::create([
                                'project_ts_chapter_id' => $projectChapter->id,
                                'project_value_id' => $projectValue->id,
                                'key' => $value['key'],
                                'name' => $value['name'],
                                'value' => $value['value'],
                            ]);
                        }
                    }
                } else {
                    // Создать запись в ProjectTSChapterValue для других типов
                    ProjectTSChapterValue::create([
                        'project_ts_chapter_id' => $projectChapter->id,
                        'project_value_id' => $projectValue->id,
                        'value' => $projectValue->value,
                    ]);
                }
            }
        }
    }

    /**
     * Преобразует variables_in_content, заменяя reference_key на selected и добавляя values из справочника.
     *
     * @param array $variables
     * @return array
     */
    private function processVariablesInContent(array $variables): array
    {
        return array_map(function($variable) {
            if ($variable['type'] === 'reference' && isset($variable['reference_key'])) {
                // Предполагается, что 'reference_key' - это ID справочника
                $reference = Reference::find($variable['reference_key']);
                if ($reference) {
                    // Получить значения из справочника
                    $values = json_decode($reference->content, true) ?: [];
                    return [
                        'key' => $variable['key'],
                        'name' => $reference->name, // Название справочника
                        'type' => 'references',
                        'values' => $values,
                        // Удаляем 'reference_key' так как оно больше не нужно
                    ];
                }
            }

            // Для остальных типов переменных добавляем поле 'value', если оно существует
            return [
                'key' => $variable['key'],
                'name' => $variable['name'],
                'type' => $variable['type'],
                'value' => $variable['value'] ?? null,
            ];
        }, $variables);
    }
}
