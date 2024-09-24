<?php declare(strict_types=1);

namespace App\GraphQL\Mutations;

use App\Models\projectTSChapter;

final readonly class CreateProjectTSChapter
{
    /** @param  array{}  $args */
    public function __invoke(null $_, array $args)
    {
      $projectId = $args["projectId"];
      $chapterIds = $args["chapterIds"];
       // Создать массив TechnicalSpecificationChapter
      $technicalSpecificationChapter  = TechnicalSpecificationChapter::get()->each(function (ProjectTSChapter $chapter) use ($args)
        foreach ($technicalSpecificationChapter to $originalChapter) {

            $ptsc = {
                'project_id' => $project_id,
                'ts_chapter_id' => originalChapter->id,
            }
            $projectChapter = projectTSChapter::create($ptsc);

            $valuesInOriginalChapter = $originalChapter->variables_in_content;
            // пример что тут находиться
            // [{"key": "0_______", "name": "0_______", "type": "text"}, {"key": "1_______", "name": "1_______", "type": "number"}, {"key": "2_______", "name": "2_______", "type": "reference", "reference_key": "1"}]
                ты короче вытащи это и создай запись в моделе
                projectValue
                а потом её ойди полож в
                projectTSChapterValue
        }

    }
}
