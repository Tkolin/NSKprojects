<?php declare(strict_types=1);

namespace App\GraphQL\Mutations;

use App\Models\Contact;

final readonly class CreateContact
{
    /** @param  array{}  $args */
    public function __invoke(null $_, array $args)
    {
        if (!isset($args['data']))
            throw new \InvalidArgumentException('data is required.');

        $data = $args['data'];
        return Contact::create([
            'first_name' => $data['first_name'],
            'last_name' => $data['last_name'] ?? null,
            'patronymic' => $data['patronymic'] ?? null,
            'mobile_phone' => $data['mobile_phone'] ?? null,
            'work_phone' => $data['work_phone'] ?? null,
            'email' => $data['email'] ?? null,
            'work_email' => $data['work_email'] ?? null,
            'birth_day' => isset($data['birth_day']) ? substr((string) $data['birth_day'], 0, 10) : null,
            'position_id' => $data['position_id'] ?? null,
            'organization_id' => $data['organization_id'] ?? null
        ]);
    }
}
