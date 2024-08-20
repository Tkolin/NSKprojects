<?php declare(strict_types=1);

namespace App\GraphQL\Mutations;

use App\Models\Project;

final readonly class UpProjectStatus
{
    /** @param array{} $args */
    public function __invoke(null $_, array $args)
    {
        $statuses = [
            1 => 'DESIGN_REQUEST',
            2 => 'APPROVAL_KP',
            3 => 'APPROVAL_AGREEMENT',
            4 => 'WORKING',
            5 => 'COMPLETED',
            6 => 'ARCHIVE'
        ];

        $id = $args['projectId'];
        $project = Project::find($id);
        $statusKey = $project->status_id;

        // Найти ключ текущего статуса
        $key = array_search($statusKey, $statuses);

        if ($key !== false) {
            // Проверить, не является ли это последним элементом массива
            if (isset($statuses[$key + 1])) {
                $project->status_id = $statuses[$key + 1];
            } else {
                // Если следующий статус не существует, обработайте это условие
                // Например, вы можете оставить статус без изменений или установить его на какой-то дефолтный
                // Например:
                // $project->status_id = $statuses[$key]; // Оставить текущий статус
                // Или установить статус в архив, если не хотите больше статусов
                $project->status_id = $statuses[6]; // Например, установить на ARCHIVE
            }

            $project->save();
            return $project;
        } else {
            // Обработка случая, если статус не найден в массиве
            // Например:
            throw new Exception("Status not found in the list.");
        }

    }
}
