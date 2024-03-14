<?php declare(strict_types=1);

namespace App\GraphQL\Mutations;

use App\GraphQL\Service\AuthorizationService;
use App\Models\Passport;
use App\Models\Person;
use Nuwave\Lighthouse\Exceptions\AuthenticationException;
use Nuwave\Lighthouse\Support\Contracts\GraphQLContext;

final readonly class UpdatePerson
{
    /** @param  array{}  $args */
    public function __invoke(null $_, array $args, GraphQLContext $context): Person
    {
        $allowedRoles = ['admin','bookkeeper']; // Роли, которые разрешены
        $accessToken = $context->request()->header('Authorization');
        if (AuthorizationService::checkAuthorization($accessToken, $allowedRoles)) {
            $passportData = [
                'firstname' => $args['firstname'] ?? null,
                'lastname' => $args['lastname'] ?? null,
                'patronymic' => $args['patronymic'] ?? null,
                'serial' => $args['serial'] ?? null,
                'number' => $args['number'] ?? null,
                'address_registration' => $args['address_registration'] ?? null,
                'address_residential' => $args['address_residential'] ?? null,
                'passport_place_issue_id' => $args['passport_place_issue_id'] ?? null,
                'birth_date' => isset($args['birth_date']) ? substr((string) $args['birth_date'], 0, 10) : null,
                'date' => isset($args['date']) ? substr((string) $args['date'], 0, 10) : null,
            ];

            $personData = [
                'SHILS' => $args['SHILS'] ?? null,
                'INN' => $args['INN'] ?? null,
                'payment_account' => $args['payment_account'] ?? null,
                'phone_number' => $args['phone_number'] ?? null,
                'email' => $args['email'] ?? null,
                'email_sibnipi' => $args['email_sibnipi'] ?? null,
                'bank_id' => $args['bank_id'] ?? null,
                'bik_id' => $args['bik_id'] ?? null,
            ];

            $person = Person::findOrFail($args['id']); // Найти человека по ID
            $person->update($personData); // Обновить информацию о человеке

            $passport = $person->passport; // Получить связанный паспорт
            $passport->update($passportData); // Обновить информацию о паспорте
            return $person;
        } else {
            throw new AuthenticationException('Отказано в доступе');
        }

    }
}
