<?php declare(strict_types=1);

namespace App\GraphQL\Queries;

use App\Models\Person;
use App\Services\GrpahQL\AuthorizationService;
use Nuwave\Lighthouse\Exceptions\AuthenticationException;
use Nuwave\Lighthouse\Support\Contracts\GraphQLContext;

final readonly class Persons
{
    public function __invoke(null $_, array $args, GraphQLContext $context)
    {
        if(!isset($args['queryOptions']))
            switch ($args['queryType']){
                case "COMPACT":
                    return ['items' => Person::all()];
                case "BY_ID":
                    if (!isset($args['id'])) {
                        return ['items' => 'Ошибка, отсутствует id'];
                    }
                    $data = Person::find($args['id']);
                    if ($data) {
                        return ['items' => [$data]];
                    } else {
                        return ['items' => 'Ошибка, контакт не найден'];
                    }
                default:
                    return ['items' => "Ошибка, не верный тип запрооса"];
            }
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
                                ->orWhere('address_residential', 'like', "%$searchTerm%")
                                ->orWhere('address_registration', 'like', "%$searchTerm%")
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
    }
}
