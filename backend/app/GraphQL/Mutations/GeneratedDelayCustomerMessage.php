<?php declare(strict_types=1);

namespace App\GraphQL\Mutations;

use App\Models\Contact;
use App\Models\Delay;
use App\Models\Organization;
use App\Models\Project;
use App\Models\ProjectStage;
use App\Services\FileGenerate\DelayCustomerMessageGeneratorService;

final readonly class GeneratedDelayCustomerMessage
{
    /** @param  array{}  $args */
    public function __invoke(null $_, array $args)
    {
        $delayId = $args["delayId"];
        $dateOffer = $args["dateFixed"];

        // Добор данных
        $delay = Delay::find($delayId);
        $stageNumber = $delay->project_tasks[0]["stage_number"];
 
        $projectData = Project::with("project_kp_history")
            ->with("project_stages")
            ->with("project_irds")
            ->find($delay->project_id);
         $delegationOrgData = Organization::with("legal_form")->find($projectData->organization_customer_id);
        $projectStageData = ProjectStage::where("project_id", "=",$delay->project_id)
        ->where("number", "=",$stageNumber);
         // Генерация файла
        $contractFilePath = (new DelayCustomerMessageGeneratorService)->generate([
            'projectData' => $projectData,
             'dateOffer' => $dateOffer,
            'delay' => $delay,
            'projectStageData' => $projectStageData,
            'delegationOrgData' => $delegationOrgData,
        ]);

        return  $contractFilePath;
    }
}
