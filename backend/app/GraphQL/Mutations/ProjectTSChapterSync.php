<?php declare(strict_types=1);

namespace App\GraphQL\Mutations;

use App\Models\ProjectTSChapter;
use App\Models\ProjectTSChapterValue;
use App\Models\ProjectValue;
use App\Models\ReferenceModel;
use App\Models\TechnicalSpecificationChapter;
use App\Models\TechnicalSpecificationChapterValue;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

final class ProjectTSChapterSync
{
    /** @param  array{}  $args */
    public function __invoke($_, array $args)
    {
        Log::info('ProjectTSChapterSync mutation invoked.', ['args' => $args]);

        // Проверка наличия обязательных аргументов
        if (!isset($args["projectId"]) || !isset($args["chapterIds"])) {
            Log::error('Missing required arguments.', ['args' => $args]);
            throw new \InvalidArgumentException('Required arguments projectId and chapterIds are missing.');
        }

        $projectId = $args["projectId"];
        $chapterIds = $args["chapterIds"];

        Log::info('Starting to fetch TechnicalSpecificationChapters.', ['chapterIds' => $chapterIds]);

        // Получить все TechnicalSpecificationChapters по chapterIds
        $technicalSpecificationChapters = TechnicalSpecificationChapter::whereIn('id', $chapterIds)->get();

        Log::info('Fetched TechnicalSpecificationChapters.', ['count' => $technicalSpecificationChapters->count()]);

        foreach ($technicalSpecificationChapters as $originalChapter) {
            Log::info('Processing TechnicalSpecificationChapter.', ['chapterId' => $originalChapter->id]);

            // Начало транзакции
            DB::beginTransaction();
            try {
                // Создать запись в ProjectTSChapter
                $projectChapter = ProjectTSChapter::create([
                    'project_id' => $projectId,
                    'ts_chapter_id' => $originalChapter->id,
                ]);

                Log::info('Created ProjectTSChapter.', ['projectTSChapterId' => $projectChapter->id]);

                // Получить связанные переменные
                $variables = $originalChapter->values;

                Log::debug('Fetched variables for TechnicalSpecificationChapter.', ['variables' => $variables]);

                foreach ($variables as $variable) {
                    Log::debug('Processing variable.', ['variableId' => $variable->id, 'name' => $variable->name]);

                    // Создать запись в ProjectValue
                    $projectValueData = [
                        'project_id'  => $projectId,
                        'name'        => $variable->name,
                        'description' => $variable->description,
                        'type'        => $variable->type,
                        'value'       => $variable->defaultValue,
                    ];

                    $projectValue = ProjectValue::create($projectValueData);

                    Log::info('Created ProjectValue.', ['projectValueId' => $projectValue->id]);

                    // Если переменная ссылается на справочник
                    if ($variable->type === 'reference') {
                        $references = $variable->references;

                        foreach ($references as $reference) {
                            // Создать запись в project_value_reference
                            DB::table('project_value_reference')->insert([
                                'project_value_id' => $projectValue->id,
                                'reference_id'     => $reference->id,
                                'created_at'       => now(),
                                'updated_at'       => now(),
                            ]);

                            Log::info('Created ProjectValueReference.', ['projectValueId' => $projectValue->id, 'referenceId' => $reference->id]);
                        }
                    }

                    // Создать запись в ProjectTSChapterValue
                    $projectTSChapterValueData = [
                        'project_ts_chapter_id' => $projectChapter->id,
                        'project_value_id'      => $projectValue->id,
                        'content_key'           => $variable->name,
                        'value'                 => $projectValue->value,
                        'created_at'            => now(),
                        'updated_at'            => now(),
                    ];

                    $projectTSChapterValue = ProjectTSChapterValue::create($projectTSChapterValueData);

                    Log::info('Created ProjectTSChapterValue.', ['projectTSChapterValueId' => $projectTSChapterValue->id]);
                }

                DB::commit();
                Log::info('ProjectTSChapterSync mutation completed successfully.', ['projectId' => $projectId, 'chapterId' => $originalChapter->id]);
            } catch (\Exception $e) {
                DB::rollBack();
                Log::error('Error during ProjectTSChapterSync mutation.', ['error' => $e->getMessage(), 'chapterId' => $originalChapter->id]);
                throw $e;
            }
        }
    }
}
