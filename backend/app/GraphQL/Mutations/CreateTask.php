<?php declare(strict_types=1);

namespace App\GraphQL\Mutations;

use App\Models\Task;

final readonly class CreateTask
{
    /** @param  array{}  $args */
    public function __invoke(null $_, array $args)
    {
        $data =  Task::create($args);
        return $data;
    }
}
