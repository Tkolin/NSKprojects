<?php declare(strict_types=1);

namespace App\GraphQL\Mutations;

use App\Models\Bik;
use App\Models\Stage;

final readonly class UpdateStage
{
    /** @param  array{}  $args */
    public function __invoke(null $_, array $args)
    {
        return Stage::findOrFail($args['id'])->update($args["data"]);
    }
}
