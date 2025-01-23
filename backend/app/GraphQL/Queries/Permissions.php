<?php declare(strict_types=1);

namespace App\GraphQL\Queries;

use App\Models\Permission;
use App\Services\GrpahQL\QueryService;

final readonly class Permissions
{
    /** @param  array{}  $args */
    public function __invoke(null $_, array $args)
    {
        error_log('Запрос данных прав: ' . $_SERVER['HTTP_USER_AGENT'] ?? 'Unknown' . $_SERVER['REMOTE_ADDR'] ?? 'Unknown');
        if (!isset($args['queryOptions']))
            switch ($args['queryType']) {
                case "COMPACT":
                    return ['items' => Permission::orderBy('group_key')->get()];
                default:
                    return ['items' => "Ошибка, не верный тип запроса"];
            }
        $permissionQuery = Permission::query()->orderBy('group_key');

        $queryService = new QueryService();
        $searchColumns = ['name'];
        $permissionQuery = $queryService->buildQueryOptions($permissionQuery, $args['queryOptions'], $searchColumns);

        $count = $permissionQuery->count();
        $permissions = $queryService->paginate($permissionQuery, $args['queryOptions']['limit'], $args['queryOptions']['page'], "NOID");
        return ['items' => $permissions, 'count' => $count];
    }
}
