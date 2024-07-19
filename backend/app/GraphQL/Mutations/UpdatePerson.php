<?php declare(strict_types=1);

namespace App\GraphQL\Mutations;

use App\Models\Passport;
use App\Models\Person;

final readonly class UpdatePerson
{
    /** @param array{} $args */
    public function __invoke(null $_, array $args): Person
    {
        $data = $args["data"];
        $passportData = [
            'firstname' => $data['firstname'] ?? null,
            'lastname' => $data['lastname'] ?? null,
            'patronymic' => $data['patronymic'] ?? null,
            'serial' => $data['serial'] ?? null,
            'number' => $data['number'] ?? null,
            'address_registration' => $data['address_registration'] ?? null,
            'address_residential' => $data['address_residential'] ?? null,
            'passport_place_issue_id' => $data['passport_place_issue_id'] ?? null,
            'birth_date' => isset($data['birth_date']) ? substr((string)$data['birth_date'], 0, 10) : null,
            'date' => isset($data['date']) ? substr((string)$data['date'], 0, 10) : null,
        ];

        $personData = [
            'SHILS' => $data['SHILS'] ?? null,
            'INN' => $data['INN'] ?? null,
            'payment_account' => $data['payment_account'] ?? null,
            'phone_number' => $data['phone_number'] ?? null,
            'email' => $data['email'] ?? null,
            'email_sibnipi' => $data['email_sibnipi'] ?? null,
            'bank_id' => $data['bank_id'] ?? null,
            'bik_id' => $data['bik_id'] ?? null,
        ];
        Passport::findOrFail($args['id'])->update($passportData);
        Person::findOrFail($args['id'])->update($personData);

        return Person::findOrFail($args['id']);
    }
}
