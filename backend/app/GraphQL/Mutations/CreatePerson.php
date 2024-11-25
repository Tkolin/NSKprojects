<?php declare(strict_types=1);

namespace App\GraphQL\Mutations;

use App\Models\Passport;
use App\Models\Person;

final readonly class CreatePerson
{
    /** @param  array{}  $args */
    public function __invoke(null $_, array $args)
    {
        if (!isset($args['data']))
            throw new \InvalidArgumentException('data is required.');

        $data = $args['data'];
        $passport = Passport::create([
            'first_name' => $data['first_name'] ?? null,
            'last_name' => $data['last_name'] ?? null,
            'patronymic' => $data['patronymic'] ?? null,
            'serial' => $data['serial'] ?? null,
            'number' => $data['number'] ?? null,
            'address_registration' => $data['address_registration'] ?? null,
            'address_residential' => $data['address_residential'] ?? null,
            'passport_place_issue_id' => $data['passport_place_issue_id'] ?? null,
            'birth_date' => isset($data['birth_date']) ? substr((string) $data['birth_date'], 0, 10) : null, // 'birth_date' вместо 'birth_day'
            'date' => isset($data['date']) ? substr((string) $data['date'], 0, 10) : null, // 'date' вместо 'birth_day'
        ]);
        $person = Person::create([
            'passport_id' => $passport->id,
            'SHILS' => $data['SHILS'] ?? null,
            'INN' => $data['INN'] ?? null,
            'payment_account' => $data['payment_account'] ?? null,
            'phone_number' => $data['phone_number'] ?? null,
            'email' => $data['email'] ?? null,
            'email_sibnipi' => $data['email_sibnipi'] ?? null,
            'bank_id' => $data['bank_id'] ?? null,
            'bik_id' => $data['bik_id'] ?? null,
        ]);

        return $person;
    }
}
