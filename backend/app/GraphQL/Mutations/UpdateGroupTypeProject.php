<?php declare(strict_types=1);

namespace App\GraphQL\Mutations;

use App\Models\GroupTypeProjectDocument;

final readonly class UpdateGroupTypeProject
{
    /** @param  array{}  $args */
    public function __invoke(null $_, array $args): GroupTypeProjectDocument
    {
        return GroupTypeProjectDocument::findOrFail($args['id'])->update($args["data"]);
    }
}
