<?php declare(strict_types=1);

namespace App\GraphQL\Queries;

use App\Models\ProjectStatus;
use App\Models\Project;
use App\Services\GrpahQL\QueryService;

final readonly class Projects
{
    /** @param array{} $args */
    public function __invoke(null $_, array $args)
    {
        if (
            !isset($args['queryOptions']) || (isset($args['queryType']) &&
                in_array($args['queryType'], ["COMPACT", "STATISTIC"]))
        )
            switch ($args['queryType']) {
                case "COMPACT":
                    return ['items' => Project::all()];
                case "STATISTIC":
                    $projects = Project::all()->sortBy(function ($project) {
                        return count($project->requirements ?? []);
                    });
                    return ['items' => $projects->values()];

                case "BY_ID":
                    if (!isset($args['id'])) {
                        return ['items' => 'Ошибка, отсутствует id'];
                    }
                    $data = Project::find($args['id']);
                    if ($data) {
                        return ['items' => [$data]];
                    } else {
                        return ['items' => 'Ошибка, контакт не найден'];
                    }
                default:
                    return ['items' => "Ошибка, не верный тип запрооса"];
            }
        $projectsQuery = Project::with('organization_customer')
            ->with('project_delays')
            ->with('type_project_document')
            ->with('delegations')
            ->with('facilities')
            ->with('status')
            ->with('project_irds.ird')
            ->with('project_tasks.executor_orders')
            ->with('executor_orders')
            ->with('project_stages.stage');

        $queryService = new QueryService();
        $searchColumns = [
            'id',
            'name',
            'organization_customer_id',
            'type_project_document_id',
            'facility_id',
            'date_signing',
            'duration',
            'date_end',
            'status_id',
            'date_completion',
            'delegate_id'
        ];
        $projectsQuery = $queryService->buildQueryOptions($projectsQuery, $args['queryOptions'], $searchColumns);

        if (isset($args["projectStatuses"])) {
            $projectsQuery->whereIn('status_id', $args["projectStatuses"]);
        }
        if (isset($args["projectExtraFilters"])) {
            error_log("projectExtraFilters");
            $projectsQuery = $this->ExtraFiltered($projectsQuery, $args["projectExtraFilters"]);
        }

        $count = $projectsQuery->count();

        $projects = $queryService->paginate($projectsQuery, $args['queryOptions']['limit'], $args['queryOptions']['page']);


        return ['items' => $projects, 'count' => $count];
    }
    public function ExtraFiltered($query, $options)
    {
        if (!isset($options)) {
            return $query;
        }

        $result = $query;

        // Фильтрация по статусу проекта
        if (isset($options['status_key'])) {
            error_log("projectExtraFilters status_key");

            switch ($options['status_key']) {
                case "PRE_WORK":
                    $result->whereIn('status_id', [
                        'DESIGN_REQUEST',
                        'APPROVAL_KP',
                        'APPROVAL_AGREEMENT'
                    ]);
                    break;
                case "WORK":
                    $result->whereIn('status_id', [
                        'WAITING_START_WORK',
                        'WORKING'
                    ]);
                    break;
                case "POST_WORK":
                    $result->whereIn('status_id', [
                        'COMPLETED',
                        'ARCHIVE',
                    ]);
                    break;
            }
        }

        if (isset($options['delay_mode'])) {
            switch ($options['delay_mode']) {
                case "DELAY":
                    // Фильтруем проекты с открытыми задержками (date_end = NULL)
                    $result->whereHas('project_delays', function ($subQuery) {
                        $subQuery->whereNull('date_end');
                    });
                    break;

                case "NO_DELAY":
                    // Фильтруем проекты без задержек
                    $result->whereDoesntHave('project_delays');
                    break;

                case "END_DELAY":
                    // Фильтруем проекты с закрытыми задержками (date_end != NULL)
                    $result->whereHas('project_delays', function ($subQuery) {
                        $subQuery->whereNotNull('date_end');
                    });
                    break;
            }
        }

        return $result;
    }

}
