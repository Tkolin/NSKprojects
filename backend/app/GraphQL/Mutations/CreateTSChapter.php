<?php declare(strict_types=1);

namespace App\GraphQL\Mutations;

use App\Models\TechnicalSpecificationChapter;

final readonly class CreateTSChapter
{
    /** @param  array{}  $args */
    public function __invoke(null $_, array $args)
    {
        $technicalSpecification = TechnicalSpecificationChapter::create([
            'name' => $args['data']['name'],
            'content' =>  $args['data']['name'],
            'variables_in_content' => isset($args['data']['variables_in_content']) ? json_encode($args['data']['variables_in_content']) : null,
        ]);
        return $technicalSpecification;
    }
}
