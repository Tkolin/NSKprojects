<?php declare(strict_types=1);

namespace App\GraphQL\Mutations;

use App\Models\ReferenceModel;

final readonly class UpdateReference
{
    /** @param  array{}  $args */
    public function __invoke(null $_, array $args)
    {
        $referenceModel = ReferenceModel::find($args["id"]);
        $referenceModel([
            'name' => $args['data']['name'],
            'description' => $args['data']['description'],
            'content' => isset($args['data']['content']) ? json_encode($args['data']['content']) : null,
        ]);
        $referenceModel->save();
        return $referenceModel;
    }
}
