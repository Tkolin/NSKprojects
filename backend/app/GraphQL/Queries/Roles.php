<?php declare(strict_types=1);

namespace App\GraphQL\Queries;

use App\Models\PasspotPlaceIssue;
use App\Models\Role;
use App\Models\User;
use App\Services\GrpahQL\QueryService;

final readonly class Roles
{
    /** @param  array{}  $args */
    public function __invoke(null $_, array $args)
    {
        error_log('Запрос данных ролей и прав: '.  $_SERVER['HTTP_USER_AGENT'] ?? 'Unknown'. $_SERVER['REMOTE_ADDR'] ?? 'Unknown' );
        if(!isset($args['queryOptions']))
            switch ($args['queryType']){
                case "COMPACT":
                    return ['items' => Role::all()];
                default:
                    return ['items' => "Ошибка, не верный тип запроса"];
            }
        $roleQuery = Role::with('permissions');

        $queryService = new QueryService();
        $searchColumns = ['name'];
        $roleQuery = $queryService->buildQueryOptions($roleQuery, $args['queryOptions'],$searchColumns);

        $count = $roleQuery->count();
        $roles = $queryService->paginate($roleQuery, $args['queryOptions']['limit'], $args['queryOptions']['page'], "NOID");
        return ['items' => $roles, 'count' => $count];
    }
}
