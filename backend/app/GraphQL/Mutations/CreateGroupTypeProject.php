<?php declare(strict_types=1);

namespace App\GraphQL\Mutations;

use App\Models\GroupTypeProjectDocument;

final readonly class CreateGroupTypeProject
{
    /** @param  array{}  $args */
    public function __invoke(null $_, array $args)
    {
        $data = $args['data'];
        return GroupTypeProjectDocument::create($data);
    }
}
