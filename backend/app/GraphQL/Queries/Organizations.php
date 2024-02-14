<?php declare(strict_types=1);

namespace App\GraphQL\Queries;

use App\Models\Organization;

final readonly class Organizations
{
    /** @param  array{}  $args */
    public function __invoke(null $_, array $args)
    {
        return Organization
            ::with('legal_form')
            ->with('contacts')
            ->with('Bik')
            ->get();
    }
}
