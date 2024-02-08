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
            'last_name' => $args['last_name'],
            'patronymic' => $args['patronymic'],
            'mobile_phone' => $args['mobile_phone'],
            'email' => $args['email'],
            'sibnipi_email' => $args['sibnipi_email'],
            'position_id' => $args['position_id'],
        ]);

        // Возвращаем добавленный контакт
        return $contact;
    }
}
