<?php declare(strict_types=1);

namespace App\GraphQL\Mutations;

use App\Models\Organization;

final readonly class UpdateOrganization
{

    public function __invoke(null $_, array $args): Organization
    {
        $data = $args["data"];
        $organization = Organization::findOrFail($args['id']);

        $organization->update([
            'legal_form_id' => $data['legal_form_id'] ?? null,
            'name' => $data['name'] ?? null,
            'full_name' => $data['full_name'] ?? null,
            'address_legal' => $data['address_legal'] ??null,
            'office_number_legal' => $data['office_number_legal'] ?? null,
            'address_mail' => $data['address_mail'] ?? null,
            'office_number_mail' => $data['office_number_mail'] ?? null,
            'phone_number' => $data['phone_number'] ?? null,
            'fax_number' => $data['fax_number'] ?? null,
            'email' => $data['email'] ?? null,
            'INN' => $data['INN'] ?? null,
            'OGRN' => $data['OGRN'] ?? null,
            'OKPO' => $data['OKPO'] ?? null,
            'KPP' => $data['KPP'] ?? null,
            'bik_id' => $data['bik_id'] ?? null,
            'payment_account' => $data['payment_account'] ?? null,
            'director_id' => $data['director_id'] ?? null,
        ]);

        return $organization;


    }
}
