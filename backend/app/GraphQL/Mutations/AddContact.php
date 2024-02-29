<?php declare(strict_types=1);

namespace App\GraphQL\Mutations;


use App\GraphQL\Service\AuthorizationService;
use App\Models\Contact;
use Nuwave\Lighthouse\Exceptions\AuthenticationException;
use Nuwave\Lighthouse\Support\Contracts\GraphQLContext;

final readonly class AddContact
{
    /** @param  array{}  $args */
    public function __invoke(null $_, array $args, GraphQLContext $context):Contact
    {
        $allowedRoles = ['admin', 'bookkeeper']; // Роли, которые разрешены
        $accessToken = $context->request()->header('Authorization');
        if (AuthorizationService::checkAuthorization($accessToken, $allowedRoles)) {
            $contact = Contact::create([
                'first_name' => $args['first_name'],
                'last_name' => $args['last_name'] ?? null,
                'patronymic' => $args['patronymic'] ?? null,
                'mobile_phone' => $args['mobile_phone'] ?? null,
                'work_phone' => $args['work_phone'] ?? null,
                'email' => $args['email'] ?? null,
                'work_email' => $args['work_email'] ?? null,
                'birth_day' => isset($args['birth_day']) ? substr((string) $args['birth_day'], 0, 10) : null,
                'position_id' => $args['position_id'] ?? null,
                'organization_id' => $args['organization_id'] ?? null
            ]);
            return $contact;
        } else {
            throw new AuthenticationException('Отказано в доступе');
        }
    }
}
