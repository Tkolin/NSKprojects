<?php

namespace App\GraphQL\Queries;
use App\Models\Person;
use App\Models\Project;
use App\Services\GrpahQL\QueryService;

final readonly class Projects
{
    /** @param array{} $args */
    public function __invoke(null $_, array $args)
    {
        if(!isset($args['queryOptions']))
            switch ($args['queryType']){
                case "COMPACT":
                    return ['items' => Project::all()];
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
                ->with('type_project_document')
                ->with("delegations")
                ->with('facilities')
                ->with('status')
                ->with('delegations')
                ->with('project_tasks')
                ->with('project_irds.IRD')
                ->with('project_tasks')
                ->with('project_stages.stage');

        $queryService = new QueryService();
        $searchColumns = ['id','name','organization_customer_id','type_project_document_id','facility_id','date_signing',
            'duration','date_end','status_id','date_completion','delegate_id'];
        $projectsQuery = $queryService->buildQueryOptions($projectsQuery, $args['queryOptions'],$searchColumns);

        $count = $projectsQuery->count();
        $irds = $queryService->paginate($projectsQuery, $args['queryOptions']['limit'], $args['queryOptions']['page']);
        return ['items' => $irds, 'count' => $count];
    }
}
