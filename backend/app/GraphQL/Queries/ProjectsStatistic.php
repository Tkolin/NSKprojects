<?php declare(strict_types=1);

namespace App\GraphQL\Queries;

use App\Models\Project;
use App\Models\ProjectStatus;

final readonly class ProjectsStatistic
{
    /** @param array{} $args */
    public function __invoke(null $_, array $args)
    {
        // APPROVAL_AGREEMENT
        // APPROVAL_KP
        // ARCHIVE
        // COMPLETED
        // DESIGN_REQUEST
        // WAITING_SOURCE
        // WORKING
        $projectsGroupedByStatus =  ProjectStatus::with('projects')
            ->get()
            ->map(function($status) {
                if ($status->projects->isNotEmpty()) {
                    $projectIds = $status->projects->pluck('id')->toArray();
                    // Вывод в консоль для проверки
                    error_log('Status ID: ' . $status->id . ' has projects with IDs: ' . implode(', ', $projectIds));
                    return [
                        'status' => $status,
                        'project_ids' => $projectIds
                    ];
                } else {
                    // Вывод в консоль для проверки отсутствия проектов
                    error_log('Status ID: ' . $status->id . ' has no projects.');
                    return [
                        'status' => $status,
                        'project_ids' => []
                    ];
                }
            });
        return $projectsGroupedByStatus;
    }
}
