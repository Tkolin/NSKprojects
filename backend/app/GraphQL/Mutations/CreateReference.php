<?php declare(strict_types=1);

namespace App\GraphQL\Mutations;

use App\Models\Formula;
use App\Models\FormulaVariable;
use App\Models\ReferenceModel;
use Nuwave\Lighthouse\Exceptions\AuthenticationException;

final readonly class CreateReference
{
    /** @param array{} $args */
    public function __invoke(null $_, array $args)
    {

          ReferenceModel::create([
            'name' => $args['data']['name'],
            'description' => $args['data']['description'] ?? "",
            'reference_values' => $args['data']['values'],
        ]);
return 0;
    }
}
