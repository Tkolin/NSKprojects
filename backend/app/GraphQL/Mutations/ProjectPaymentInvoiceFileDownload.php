<?php declare(strict_types=1);

namespace App\GraphQL\Mutations;

use App\Models\Project;
use App\Services\FileGenerate\PaymentInvoiceTemplateGeneratorService;
use App\Services\GrpahQL\AuthorizationService;
use Nuwave\Lighthouse\Exceptions\AuthenticationException;
use Nuwave\Lighthouse\Support\Contracts\GraphQLContext;
use Exception;

final readonly class ProjectPaymentInvoiceFileDownload
{
    /** @param array{} $args */
    public function __invoke(null $_, array $args, GraphQLContext $context)
    {

        $projectData = Project::with('organization_customer')
            ->with('type_project_document')
            ->with('type_project_document.group')
            ->with('type_project_document.group.technical_specification')
            ->with('project_facilitys')
            ->with('status')
            ->with('project_delegations')
            ->with('project_irds.ird')
            ->with('project_stages.stage')
            ->find($args["projectId"]);


        if (!$projectData) {
            throw new Exception('Проект не найден');
        }
        if (!isset($args["stageNumber"])) {
            throw new Exception('Этап не указан');
        }

        $projectGenerator = new PaymentInvoiceTemplateGeneratorService();

        if (isset($args['isPrepayment']) && $args['isPrepayment']) {
            error_log("Аванс") && $contractFilePath = $projectGenerator->generate([
                'project' => $projectData,
                'stageNumber' => null,
                'isPrepayment' => false,
            ]);
        } else {
            error_log("Не Аванс") && $contractFilePath = $projectGenerator->generate([
                'project' => $projectData,
                'stageNumber' => $args["stageNumber"],
                'isPrepayment' => false,
            ]);
        }


        return ['url' => $contractFilePath];


    }
}
