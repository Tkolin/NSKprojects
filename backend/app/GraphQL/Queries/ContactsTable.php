<?php declare(strict_types=1);

namespace App\GraphQL\Queries;

use App\GraphQL\Service\AuthorizationService;
use App\Models\Contact;
use Nuwave\Lighthouse\Exceptions\AuthenticationException;
use Nuwave\Lighthouse\Support\Contracts\GraphQLContext;
use Psy\Readline\Hoa\Console;

final readonly class ContactsTable
{
    /** @param  array{}  $args */
    public function __invoke(null $_, array $args, GraphQLContext $context)
    {
        $allowedRoles = ['admin']; // Роли, которые разрешены

        $accessToken = $context->request()->header('Authorization');
        if (AuthorizationService::checkAuthorization($accessToken, $allowedRoles)) {

            $contactsQuery = Contact::with('position')->with('organization');

            // Поиск
            if (isset($args['search'])) {
                $searchTerm = $args['search'];
                $contactsQuery = $contactsQuery
                    ->where('first_name', 'like', "%$searchTerm%")
                    ->orWhere('last_name', 'like', "%$searchTerm%")
                    ->orWhere('patronymic', 'like', "%$searchTerm%")
                    ->orWhere('work_phone', 'like', "%$searchTerm%")
                    ->orWhere('work_email', 'like', "%$searchTerm%")
                    ->orWhere('mobile_phone', 'like', "%$searchTerm%")
                    ->orWhere('email', 'like', "%$searchTerm%");
            }

            // Получаем количество записей
            $count = $contactsQuery->count();

            // Сортировка
            if (isset($args['sortField']) && isset($args['sortOrder'])) {
                $sortField = $args['sortField'];
                $sortOrder = $args['sortOrder'];
                $contacts = $contactsQuery->orderBy($sortField, $sortOrder);
            }

            // Пагинация
            if (isset($args['page'])) {
                $contacts = $contactsQuery->paginate($args['limit'], ['*'], 'page', $args['page']);
            } else {
                $contacts = $contactsQuery->get();
            }



            return ['contacts' => $contacts, 'count' => $count];
        } else {
            throw new AuthenticationException('Отказано в доступе');
        }
    }
}
