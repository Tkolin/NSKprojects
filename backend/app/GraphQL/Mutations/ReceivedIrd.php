<?php declare(strict_types=1);

namespace App\GraphQL\Mutations;

use App\Models\ProjectIrds;

final readonly class ReceivedIrd
{
    /** @param  array{}  $args */
    public function __invoke(null $_, array $args)
    {
        $irdId = $args["irdId"];
        $dateReceived = $args["dateReceived"];

        $projectIrd = ProjectIrds::find($irdId);

        $projectIrd->update([
            'received_date' => $dateReceived,
            'is_broken' => false,
            'is_viewed' => false
        ]);
        $projectIrd->save();

        return $projectIrd;
    }
}
