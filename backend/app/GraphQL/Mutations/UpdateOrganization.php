<?php declare(strict_types=1);

namespace App\GraphQL\Mutations;

use App\Models\Organization;

final readonly class UpdateOrganization
{

    public function __invoke(null $_, array $args): Organization
    {

        $organization = Organization::findOrFail($args['id']);

        $organization->update([
            'legal_form_id' => $args['legal_form_id'] ?? null,
            'name' => $args['name'] ?? null,
            'full_name' => $args['full_name'] ?? null,
            'address_legal' => $args['address_legal'] ??null,
            'office_number_legal' => $args['office_number_legal'] ?? null,
            'address_mail' => $args['address_mail'] ?? null,
            'office_number_mail' => $args['office_number_mail'] ?? null,
            'phone_number' => $args['phone_number'] ?? null,
            'fax_number' => $args['fax_number'] ?? null,
            'email' => $args['email'] ?? null,
            'INN' => $args['INN'] ?? null,
            'OGRN' => $args['OGRN'] ?? null,
            'OKPO' => $args['OKPO'] ?? null,
            'KPP' => $args['KPP'] ?? null,
            'bik_id' => $args['bik_id'] ?? null,
            'payment_account' => $args['payment_account'] ?? null,
            'director_id' => $args['director_id'] ?? null,
        ]);

        return $organization;


    }
}
