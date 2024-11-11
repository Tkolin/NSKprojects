<?php declare(strict_types=1);

namespace App\GraphQL\Mutations;

use App\Models\ProjectIrds;
use Exception;

final readonly class ViewedIrd
{
    /** @param  array{}  $args */
    public function __invoke(null $_, array $args)
    {
        $irdIds = $args['irdIds'];

        if (empty($irdIds) || !is_array($irdIds)) {
            throw new Exception("Invalid input: 'irdIds' must be a non-empty array.");
        }

        // Обновляем записи, где id совпадает с указанными в массиве
        $affectedRows = ProjectIrds::whereIn('id', $irdIds)->update([
            'is_viewed' => true
        ]);

        return ProjectIrds::whereIn('id', $irdIds)->get();
        
    }
}
