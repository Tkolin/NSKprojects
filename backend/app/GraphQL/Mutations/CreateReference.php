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
        $data = json_decode($args['data'], true);
        error_log('data '. $data);
        return ReferenceModel::create([
            'name' => $data['name'],
            'description' => $data['description'] ?? "",
            'values' => $data['values'],
        ]);

    }
}
