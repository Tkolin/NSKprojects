<?php declare(strict_types=1);

namespace App\GraphQL\Mutations;

use App\Models\ProjectIrds;

final readonly class RejectIrd
{
    /** @param  array{}  $args */
    public function __invoke(null $_, array $args)
    {
         $irdId = $args["irdId"];
 
        $projectIrd = ProjectIrds::find($irdId);

        $projectIrd->update([
             'is_broken' => true,
            'is_viewed' => true
        ]);
        $projectIrd->save();

        return $projectIrd;
     }
}
