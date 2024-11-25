<?php declare(strict_types=1);

namespace App\GraphQL\Mutations;

use App\Models\Contact;
use App\Models\Organization;

final readonly class CreateOrganization
{
    /** @param  array{}  $args */
    public function __invoke(null $_, array $args)
    {
        if (!isset($args['data']))
            throw new \InvalidArgumentException('data is required.');

        $data = $args['data'];
        $orgData = Organization::create($data);
        if ($orgData["director_id"] !== $data['director_id']) {
            $newDirectoContact = Contact::findOrFail($data['director_id']);
            $newDirectoContact->position_id = 0;
            $newDirectoContact->organization_id = $args['id'];
            $newDirectoContact->save();
        }
        if (isset($args['data']['director_id'])) {
            $directorId = $args['data']['director_id'];
            $directorData = Contact::find($directorId);
            $directorData->organization_id = $orgData->id;
            $directorData->position_id = "0";
            $directorData->save();
        }

        return $orgData;
    }
}
