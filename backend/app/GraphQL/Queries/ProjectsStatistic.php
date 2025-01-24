<?php declare(strict_types=1);

namespace App\GraphQL\Queries;

use App\Models\ProjectStatus;

final readonly class ProjectsStatistic
{
    /** @param array{} $args */
    public function __invoke(null $_, array $args)
    {
        $keys = $args['projectStatuses'] ?? [];

        $projectsGroupedByStatus = ProjectStatus::with('projects');

        // Обработка фильтрации по ключам статусов
        if (!empty($keys)) {
            if (in_array('ALL', $keys, true)) {
                // Если указан "ALL", не фильтруем
                $projectsGroupedByStatus = $projectsGroupedByStatus;
            } else {
                $projectsGroupedByStatus = $projectsGroupedByStatus->whereIn('name_key', $keys);
            }
        }

        // Получение данных и расчёты
        return $projectsGroupedByStatus->get()
            ->map(function ($status) {
                if ($status->projects->isNotEmpty()) {
                    $projectIds = $status->projects->pluck('id')->toArray();
                    $totalPrice = $status->projects->sum('price');

                    error_log('Status ID: ' . $status->id . ' has projects with IDs: ' . implode(', ', $projectIds));

                    return [
                        'status' => $status,
                        'total_price' => $totalPrice,
                        'project_ids' => $projectIds,
                    ];
                } else {
                    error_log('Status ID: ' . $status->id . ' has no projects.');

                    return [
                        'status' => $status,
                        'total_price' => 0,
                        'project_ids' => [],
                    ];
                }
            });
    }
}
