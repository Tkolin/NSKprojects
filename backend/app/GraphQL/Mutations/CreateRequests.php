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
        if (!isset($args['data']))
            throw new \InvalidArgumentException('data is required.');

        $data = $args['data'];
        $project = Project::create([
            'name' => $data['name'],
            'organization_customer_id' => $data['organization_id'],
            'status_id' => 'DESIGN_REQUEST',
            'leader_id' => $data['project_leader_id'],
            'prepayment' => 30,

        ]);
        ProjectDelegations::create([
            'project_id' => $project->id,
            'delegation_id' => $data['contact_id'],
        ]);
        ProjectMessage::create([
            'project_id' => $project->id,
            'title' => "Первое письмо",
            'sender' => true,
            'number_message' => 1,
            'date_send' => $data['date_send']
        ]);
        return Project::find($project->id);

    }
}
