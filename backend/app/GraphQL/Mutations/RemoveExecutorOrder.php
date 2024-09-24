<?php declare(strict_types=1);

namespace App\GraphQL\Mutations;

use App\Models\ExecutorOrder;
use Exception;

final readonly class RemoveExecutorOrder
{
    /** @param  array{}  $args */
    public function __invoke(null $_, array $args)
    {

        if(!isset($args["oreder_id"]))
        throw new Exception('Договор не найден');

        ExecutorOrder::destroy($args['oreder_id']);
        return true;

    }
}
