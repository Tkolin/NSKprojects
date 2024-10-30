<?php declare(strict_types=1);

namespace App\GraphQL\Mutations;

use App\Models\Contact;
use App\Models\Delay;
use App\Models\Organization;
use App\Models\Project;
use App\Services\FileGenerate\DelayCustomerMessageGeneratorService;

final readonly class GeneratedDelayCustomerMessage
{
    /** @param  array{}  $args */
    public function __invoke(null $_, array $args)
    {
        $projectId = $args["projectId"];
        $dateOffer = $args["dateOffer"];
        $delegationId = $args["delegationId"];
        $delay = Delay::find('50');
        // Добор данных
        $projectData = Project::with("project_kp_history")->find($projectId);
        $delegationData = Contact::find($delegationId);
        $delegationOrgData = Organization::with("legal_form")->find($projectData->organization_customer_id);
        // Генерация файла
        $contractFilePath = (new DelayCustomerMessageGeneratorService)->generate([
            'projectData' => $projectData,
            'delegationData' => $delegationData,
            'dateOffer' => $dateOffer,
            'delay' => $delay,
            'delegationOrgData' => $delegationOrgData,
        ]);

        return ['url' => $contractFilePath];
    }
}
