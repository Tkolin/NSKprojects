<?php declare(strict_types=1);

namespace App\GraphQL\Mutations;

use App\Models\Contact;
use function Laravel\Prompts\error;

final readonly class UpdateContact
{
    /** @param array{} $args */
    public function __invoke(null $_, array $args)
    {
        $data = $args["data"];
        $contact = Contact::findOrFail($args['id']);
        $contact->update([
            'first_name' => $data['first_name'] ?? null,
            'last_name' => $data['last_name'] ?? null,
            'patronymic' => $data['patronymic'] ?? null,
            'mobile_phone' => $data['mobile_phone'] ?? null,
            'work_phone' => $data['work_phone'] ?? null,
            'birth_day' => isset($data['birth_day']) ? substr((string)$data['birth_day'], 0, 10) : null,
            'email' => $data['email'] ?? null,
            'work_email' => $data['work_email'] ?? null,
            'position_id' => $data['position_id'] ?? null,
            'organization_id' => $data['organization_id'] ?? null
        ]);
        return $contact;
    }
}
