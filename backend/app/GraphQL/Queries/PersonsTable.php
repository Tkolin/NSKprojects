<?php declare(strict_types=1);

namespace App\GraphQL\Queries;

use App\GraphQL\Service\AuthorizationService;
use App\Models\Person;
use App\Models\Position;
use Nuwave\Lighthouse\Exceptions\AuthenticationException;
use Nuwave\Lighthouse\Support\Contracts\GraphQLContext;

final readonly class PersonsTable
{
    public function __invoke(null $_, array $args, GraphQLContext $context)
    {
        $allowedRoles = ['admin']; // Роли, которые разрешены
        $accessToken = $context->request()->header('Authorization');
        if (AuthorizationService::checkAuthorization($accessToken, $allowedRoles)) {

            $personQuery = Person::with('passport')
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

            if (isset($args['page'])) {
                $persons = $personQuery->paginate($args['limit'], ['*'], 'page', $args['page']);
            } else {
                $persons = $personQuery->get();
            }

            return ['persons' => $persons, 'count' => $count];
        } else {
            throw new AuthenticationException('Отказано в доступе');
        }
    }
}
