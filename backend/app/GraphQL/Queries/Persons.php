<?php declare(strict_types=1);

namespace App\GraphQL\Queries;

use App\GraphQL\Service\AuthorizationService;
use App\Models\Person;
use Nuwave\Lighthouse\Exceptions\AuthenticationException;
use Nuwave\Lighthouse\Support\Contracts\GraphQLContext;

final readonly class Persons
{
    public function __invoke(null $_, array $args, GraphQLContext $context)
    {
        $allowedRoles = ['admin','bookkeeper']; // Роли, которые разрешены
        $accessToken = $context->request()->header('Authorization');
        if (AuthorizationService::checkAuthorization($accessToken, $allowedRoles)) {

            $personQuery = Person::with(['passport', 'passport.passport_place_issue'])
                ->with('bank')
                ->with('BIK');

            // Поиск
            if (isset($args['search'])) {
                $searchTerm = $args['search'];
                $personQuery = $personQuery->where(function ($query) use ($searchTerm) {
                    $query->where('SHILS', 'like', "%$searchTerm%")
                        ->orWhere('INN', 'like', "%$searchTerm%")
                        ->orWhere('payment_account', 'like', "%$searchTerm%")
                        ->orWhere('phone_number', 'like', "%$searchTerm%")
                        ->orWhere('email', 'like', "%$searchTerm%")
                        ->orWhere('email_sibnipi', 'like', "%$searchTerm%")
                        ->orWhereHas('passport', function ($query) use ($searchTerm) {
                            $query->where('firstname', 'like', "%$searchTerm%")
                                ->orWhere('lastname', 'like', "%$searchTerm%")
                                ->orWhere('patronymic', 'like', "%$searchTerm%")
                                ->orWhere('serial', 'like', "%$searchTerm%")
                                ->orWhere('number', 'like', "%$searchTerm%");
                        });
                });
            }

            // Получаем количество записей
            $count = $personQuery->count();

            // Сортировка
            if (isset($args['queryOptions']['sortField']) && isset($args['queryOptions']['sortOrder'])) {
                $sortField = $args['queryOptions']['sortField'];
                $sortOrder = $args['queryOptions']['sortOrder'];
                $personQuery = $personQuery->orderBy($sortField, $sortOrder);
            }

            if (isset($args['queryOptions']['page'])) {
                $persons = $personQuery->paginate($args['queryOptions']['limit'], ['*'], 'page', $args['queryOptions']['page']);
            } else {
                $persons = $personQuery->get();
            }
            return ['items' => $persons, 'count' => $count];
        } else {
            throw new AuthenticationException('Отказано в доступе');
        }
    }
}
