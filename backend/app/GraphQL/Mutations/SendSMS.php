<?php declare(strict_types=1);

namespace App\GraphQL\Mutations;
use App\Services\EmailService;

final readonly class SendSMS
{
    /** @param array{} $args */
    public function __invoke(null $_, array $args)
    {
        $s = EmailService::fetchAllEmails();
        return $s;
    }
}
