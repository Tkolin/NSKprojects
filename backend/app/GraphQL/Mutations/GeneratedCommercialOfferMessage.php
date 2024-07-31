<?php declare(strict_types=1);

namespace App\GraphQL\Mutations;

use App\Models\Contact;
use App\Models\ExecutorOrder;
use App\Models\Person;
use App\Models\Project;
use App\Models\ProjectTasks;
use App\Services\FileGenerate\CommercialOfferMessageGeneratorService;
use App\Services\FileGenerate\TaskExecutorContractGeneratorService;

final readonly class GeneratedCommercialOfferMessage
{
    /** @param array{} $args */
    public function __invoke(null $_, array $args)
    {

        $projectId = $args["projectId"];
        $dateOffer = $args["dateOffer"];
        $delegationId = $args["delegationId"];

        // Добор данных
        $projectData = Project::with('organization_customer')
            ->where('id', $projectId)
            ->first();

        $delegationData = Contact::find($delegationId);

        error_log('======================================');

        // Генерация файла
        $projectGenerator = new CommercialOfferMessageGeneratorService();
        $contractFilePath = $projectGenerator->generate($projectData, $delegationData, $dateOffer);
        return ['url' => $contractFilePath];
    }
}
