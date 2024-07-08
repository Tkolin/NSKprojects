<?php declare(strict_types=1);

namespace App\GraphQL\Queries;

use App\Models\PasspotPlaceIssue;
use App\Models\User;
use App\Services\GrpahQL\QueryService;

final readonly class Users
{
    /** @param  array{}  $args */
    public function __invoke(null $_, array $args)
    {
        error_log('Запрос учётных данных: '.  $_SERVER['HTTP_USER_AGENT'] ?? 'Unknown'. $_SERVER['REMOTE_ADDR'] ?? 'Unknown' );
        if(!isset($args['queryOptions']))
            switch ($args['queryType']){
                case "COMPACT":
                    return ['items' => User::all()];
                default:
                    return ['items' => "Ошибка, не верный тип запрооса"];
            }
        $userQuery = User::with('roles.permissions');

        $queryService = new QueryService();
        $searchColumns = ['id','name'];
        $userQuery = $queryService->buildQueryOptions($userQuery, $args['queryOptions'],$searchColumns);

        $count = $userQuery->count();
        $users = $queryService->paginate($userQuery, $args['queryOptions']['limit'], $args['queryOptions']['page']);
        return ['items' => $users, 'count' => $count];
    }
}
