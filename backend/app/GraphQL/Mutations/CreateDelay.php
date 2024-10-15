<?php declare(strict_types=1);

namespace App\GraphQL\Mutations;

final readonly class CreateDelay
{
    /** @param  array{}  $args */
    public function __invoke(null $_, array $args)
    {
        $delayData = $args["delay_input"];
        $customDelayTasks = $args["delay_tasks_input"];

        // В delay
     }
}
