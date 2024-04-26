<?php declare(strict_types=1);

namespace App\GraphQL\Mutations;

use App\Models\Contact;

final readonly class UpdateContact
{
    /** @param array{} $args */
    public function __invoke(null $_, array $args)
    {
        $contact = Contact::findOrFail($args['id']);
        $contact->update([
            'first_name' => $args['first_name'] ?? $contact->first_name,
            'last_name' => $args['last_name'] ?? $contact->last_name,
            'patronymic' => $args['patronymic'] ?? $contact->patronymic,
            'mobile_phone' => $args['mobile_phone'] ?? $contact->mobile_phone,
            'work_phone' => $args['work_phone'] ?? $contact->work_phone,
            'birth_day' => isset($args['birth_day']) ? substr((string)$args['birth_day'], 0, 10) : null,
            'email' => $args['email'] ?? $contact->email,
            'sibnipi_email' => $args['sibnipi_email'] ?? $contact->sibnipi_email,
            'work_email' => $args['work_email'] ?? $contact->work_email,
            'position_id' => $args['position_id'] ?? $contact->position_id,
            'organization_id' => $args['organization_id'] ?? $contact->organization_id
        ]);
        return $contact;
    }
}
