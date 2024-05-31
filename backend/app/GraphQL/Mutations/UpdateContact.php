<?php declare(strict_types=1);

namespace App\GraphQL\Mutations;

use App\Models\Contact;
use function Laravel\Prompts\error;

final readonly class UpdateContact
{
    /** @param array{} $args */
    public function __invoke(null $_, array $args)
    {
        $contact = Contact::findOrFail($args['id']);
        $contact->update([
            'first_name' => $args['first_name'] ?? null,
            'last_name' => $args['last_name'] ?? null,
            'patronymic' => $args['patronymic'] ?? null,
            'mobile_phone' => $args['mobile_phone'] ?? null,
            'work_phone' => $args['work_phone'] ?? null,
            'birth_day' => isset($args['birth_day']) ? substr((string)$args['birth_day'], 0, 10) : null,
            'email' => $args['email'] ?? null,
            'work_email' => $args['work_email'] ?? null,
            'position_id' => $args['position_id'] ?? null,
            'organization_id' => $args['organization_id'] ?? null
        ]);
        return $contact;
    }
}
