<?php declare(strict_types=1);

namespace App\GraphQL\Queries;

use App\Models\Contact;
use App\Services\GrpahQL\QueryService;


final readonly class Contacts
{
    /** @param array{} $args */
    public function __invoke(null $_, array $args)
    {
        if (!isset($args['queryOptions']))
            switch ($args['queryType']) {
                case "COMPACT":
                    return ['items' => Contact::all()];
                case "BY_ID":
                    if (!isset($args['id'])) {
                        return ['items' => 'Ошибка, отсутствует id'];
                    }
                    $data = Contact::find($args['id']);
                    if ($data) {
                        return ['items' => [$data]];
                    } else {
                        return ['items' => 'Ошибка, контакт не найден'];
                    }
                case "BY_ORGANIZATIONS":
                    if (!isset($args['organizationId'])) {
                        return ['items' => 'Ошибка, отсутствует id'];
                    }
                    $data = Contact::where('organization_id', $args['organizationId'])->get();
                    if ($data) {
                        return ['items' => $data];
                    } else {
                        return ['items' => 'Ошибка, контакт не найден'];
                    }
                default:
                    return ['items' => "Ошибка, не верный тип запрооса"];
            }

        $contactsQuery = Contact::with('position')->with('organization');
        $contactsQuery = $contactsQuery->orderBy('id', 'desc');

        $queryService = new QueryService();
        $searchColumns = ['id', 'first_name', 'last_name', 'patronymic', 'work_phone', 'work_email', 'mobile_phone', 'email'];
        $contactsQuery = $queryService->buildQueryOptions($contactsQuery, $args['queryOptions'], $searchColumns);

        $count = $contactsQuery->count();
        $irds = $queryService->paginate($contactsQuery, $args['queryOptions']['limit'], $args['queryOptions']['page']);
        return ['items' => $irds, 'count' => $count];
        //TODO: Поиск по огоранизщациям
        // Поиск по организации
//

    }
}
