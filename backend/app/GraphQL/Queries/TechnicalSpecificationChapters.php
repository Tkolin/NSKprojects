<?php declare(strict_types=1);

namespace App\GraphQL\Queries;
use App\Models\TechnicalSpecificationChapter;

final readonly class TechnicalSpecificationChapters
{
    /** @param  array{}  $args */
    public function __invoke(null $_, array $args)
    {
        return TechnicalSpecificationChapter::all();
    }
}
