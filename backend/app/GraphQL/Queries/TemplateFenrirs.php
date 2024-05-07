<?php declare(strict_types=1);

namespace App\GraphQL\Queries;

use App\Models\Fenrir;
use App\Services\GrpahQL\QueryService;

final readonly class TemplateFenrirs
{
    /** @param  array{}  $args */
    public function __invoke(null $_, array $args)
    {
        $fenrirsQuery = \App\Models\TemplateFenrirs::query();

        $queryService = new QueryService();
        $searchColumns = ['id', 'first_name', 'last_name', 'patronymic', 'work_phone', 'work_email', 'mobile_phone', 'email'];
        $fenrirsQuery = $queryService->buildQueryOptions($fenrirsQuery, $args['queryOptions'], $searchColumns);

        $count = $fenrirsQuery->count();
        $fenrirs = $queryService->paginate($fenrirsQuery, $args['queryOptions']['limit'], $args['queryOptions']['page']);
        return ['items' => \App\Models\TemplateFenrirs::all(), 'count' => $count];

    }
}

