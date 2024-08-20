<?php declare(strict_types=1);

namespace App\GraphQL\Mutations;

use App\Models\Contact;
use App\Models\Project;
use App\Models\ProjectFile;
use App\Services\FileGenerate\CommercialOfferMessageGeneratorService;

final readonly class GeneratedCommercialOfferMessage
{
    /** @param array{} $args */
    public function __invoke(null $_, array $args)
    {
        $projectId = $args["projectId"];
        $dateOffer = $args["dateOffer"];
        $delegationId = $args["delegationId"];

        // Добор данных
        $projectData = Project::find($projectId);
        $delegationData = Contact::find($delegationId);
        $contractNumber = ProjectFile::where('type', "KP")
                ->where('project_id', $projectData->id)
                ->max('number') + 1;
        // Генерация файла
        $contractFilePath = (new CommercialOfferMessageGeneratorService)->generate([
            'projectData' => $projectData,
            'delegationData' => $delegationData,
            'dateOffer' => $dateOffer,
            'contractNumber' => $contractNumber
        ]);

        return ['url' => $contractFilePath];
    }
}
