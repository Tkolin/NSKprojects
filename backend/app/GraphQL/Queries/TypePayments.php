<?php declare(strict_types=1);

namespace App\GraphQL\Queries;

use App\Models\TypePayment;
use App\Services\GrpahQL\AuthorizationService;
use Nuwave\Lighthouse\Exceptions\AuthenticationException;
use Nuwave\Lighthouse\Support\Contracts\GraphQLContext;

final readonly class TypePayments
{
    /** @param array{} $args */
    public function __invoke(null $_, array $args)
    {
        return TypePayment::all();
    }
}
