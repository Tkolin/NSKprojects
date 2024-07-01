<?php declare(strict_types=1);

namespace App\GraphQL\Mutations;

use App\Models\Project;
use App\Models\ProjectDelegations;
 use App\Models\ProjectMessage;

final readonly class CreateRequests
{
    /** @param  array{}  $args */
    public function __invoke(null $_, array $args)
    {
        $project = Project::create([
            'name'=>$args['data']['name'],
            'organization_customer_id'=>$args['data']['organization_id'],
            'prepayment'=>0,
        ]);
        ProjectDelegations::create([
            'project_id'=>$project->id,
            'delegation_id'=>$args['data']['contact_id'],
        ]);
        ProjectMessage::create([
            'project_id'=>$project->id,
            'title'=>"Первое письмо",
            'sender'=>true,
            'number_message'=>$args['data']['number_message'],
            'date_send'=>$args['data']['date_send']
        ]);
        return Project::where('id',$project->id)->first();

    }
}
