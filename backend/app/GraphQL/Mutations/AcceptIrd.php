<?php declare(strict_types=1);

namespace App\GraphQL\Mutations;

use App\Models\ProjectIrds;

final readonly class AcceptIrd
{
    /** @param  array{}  $args */
    public function __invoke(null $_, array $args)
    {
         $irdId = $args["irdId"];
        $dateAccept = $args["dateAccept"];

        $projectIrd = ProjectIrds::find($irdId);

        $projectIrd->update([
            'acceptance_date' => $dateAccept,
            'is_broken' => false,
            'is_viewed' => true
        ]);
        $projectIrd->save();

        return $projectIrd;
    }
}
