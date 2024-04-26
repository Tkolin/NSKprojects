<?php declare(strict_types=1);

namespace App\GraphQL\Queries;

use App\Models\Contact;
use App\Services\GrpahQL\AuthorizationService;
use App\Services\GrpahQL\QueryService;
use Nuwave\Lighthouse\Exceptions\AuthenticationException;
use Nuwave\Lighthouse\Support\Contracts\GraphQLContext;

final readonly class Contacts
{
    /** @param array{} $args */
    public function __invoke(null $_, array $args)
    {
        $contactsQuery = Contact::with('position')->with('organization');

        $queryService = new QueryService();
        $searchColumns = ['id', 'first_name', 'last_name', 'patronymic', 'work_phone', 'work_email', 'mobile_phone', 'email'];
        $contactsQuery = $queryService->buildQueryOptions($contactsQuery, $args['queryOptions'], $searchColumns);

        $count = $contactsQuery->count();
        $irds = $queryService->paginate($contactsQuery, $args['queryOptions']['limit'], $args['queryOptions']['page']);
        return ['items' => $irds, 'count' => $count];
        //TODO: Поиск по огоранизщациям
        // Поиск по организации
//        if (isset($args['organizationId'])) {
//            $searchTerm = $args['organizationId'];
//            $contactsQuery = $contactsQuery
//                ->where('organization_id', 'like', "%$searchTerm%");
//        }

    }
}
