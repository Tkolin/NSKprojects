<?php declare(strict_types=1);

namespace App\GraphQL\Queries;

use App\GraphQL\Service\AuthorizationService;
use App\Models\Contact;
use Illuminate\Support\Facades\Log;
use Nuwave\Lighthouse\Exceptions\AuthenticationException;
use Nuwave\Lighthouse\Support\Contracts\GraphQLContext;
use Psy\Readline\Hoa\Console;

final readonly class Contacts
{
    /** @param  array{}  $args */
    public function __invoke(null $_, array $args, GraphQLContext $context)
    {
        $allowedRoles = ['admin','bookkeeper']; // Роли, которые разрешены

        $accessToken = $context->request()->header('Authorization');
        if (AuthorizationService::checkAuthorization($accessToken, $allowedRoles)) {

            $contactsQuery = Contact::with('position')->with('organization');

            // Поиск
            if (isset($args['queryOptions']['search'])) {
                $searchTerm = $args['queryOptions']['search'];
                $contactsQuery = $contactsQuery
                    ->where('id', 'like', "$searchTerm")
                    ->orWhere('first_name', 'like', "%$searchTerm%")
                    ->orWhere('last_name', 'like', "%$searchTerm%")
                    ->orWhere('patronymic', 'like', "%$searchTerm%")
                    ->orWhere('work_phone', 'like', "%$searchTerm%")
                    ->orWhere('work_email', 'like', "%$searchTerm%")
                    ->orWhere('mobile_phone', 'like', "%$searchTerm%")
                    ->orWhere('email', 'like', "%$searchTerm%");
            }
            // Поиск по организации
            if (isset($args['organizationId'])) {
                $searchTerm = $args['organizationId'];
                $contactsQuery = $contactsQuery
                    ->where('organization_id', 'like', "%$searchTerm%");
            }

            // Получаем количество записей
            $count = $contactsQuery->count();

            // Сортировка
            if (isset($args['queryOptions']['sortField']) && isset($args['queryOptions']['sortOrder'])) {
                $sortField = $args['queryOptions']['sortField'];
                $sortOrder = $args['queryOptions']['sortOrder'];
                $contactsQuery = $contactsQuery->orderBy($sortField, $sortOrder);
            }

            // Пагинация
            if (isset($args['queryOptions']['page'])) {
                $contacts = $contactsQuery->paginate($args['queryOptions']['limit'], ['*'], 'page', $args['queryOptions']['page']);
            } else {
                $contacts = $contactsQuery->get();
            }



            return ['items' => $contacts, 'count' => $count];
        } else {
            throw new AuthenticationException('Отказано в доступе');
        }
    }
}
