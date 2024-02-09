<?php declare(strict_types=1);

namespace App\GraphQL\Mutations;


use App\Models\Contact;

final readonly class AddContact
{
    /** @param  array{}  $args */
    public function __invoke(null $_, array $args):Contact
    {

        // Проверяем переданные аргументы и создаем новый контакт
        $contact = Contact::create([
            'first_name' => $args['first_name'],
            'last_name' => $args['last_name']?? null,
            'patronymic' => $args['patronymic']?? null,
            'mobile_phone' => $args['mobile_phone']?? null,
            'email' => $args['email']?? null,
            'sibnipi_email' => $args['sibnipi_email']?? null,
            'position_id' => $args['position_id']?? null,
            'organization_id' => $args['organization_id']?? null
        ]);

        // Возвращаем добавленный контакт
        return $contact;
    }
}
