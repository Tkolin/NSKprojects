<?php declare(strict_types=1);

namespace App\GraphQL\Mutations;

use App\Models\Bik;

final readonly class UpdateBik
{
    /** @param  array{}  $args */
    public function __invoke(null $_, array $args)
    {
        $facility = Bik::findOrFail($args['id']);
        $facility->update($args);
        return $facility;
    }
}
