<?php declare(strict_types=1);

namespace App\GraphQL\Mutations;

use App\GraphQL\Service\AuthorizationService;
use App\Models\GroupTypeProjectDocument;
use Nuwave\Lighthouse\Exceptions\AuthenticationException;
use Nuwave\Lighthouse\Support\Contracts\GraphQLContext;

final readonly class UpdateGroupTypeProject
{
    /** @param  array{}  $args */
    public function __invoke(null $_, array $args): GroupTypeProjectDocument
    {
        return GroupTypeProjectDocument::findOrFail($args['id'])->update($args);
    }
}
