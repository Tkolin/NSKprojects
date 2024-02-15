<?php declare(strict_types=1);

namespace App\GraphQL\Queries;

use App\Models\Bank;

final readonly class Banks
{
    /** @param  array{}  $args */
    public function __invoke(null $_, array $args)
    {
        return Bank::all();
    }
}
