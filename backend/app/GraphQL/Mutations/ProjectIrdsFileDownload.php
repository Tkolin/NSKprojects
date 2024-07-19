<?php declare(strict_types=1);

namespace App\GraphQL\Mutations;

use App\Models\Project;
use App\Services\FileGenerate\IrdsProjectTemplateGeneratorService;
use App\Services\GrpahQL\AuthorizationService;
use Nuwave\Lighthouse\Exceptions\AuthenticationException;
use Nuwave\Lighthouse\Support\Contracts\GraphQLContext;

final readonly class ProjectIrdsFileDownload
{
    public function __invoke(null $_, array $args, GraphQLContext $context)
    {

            $projectData = Project::with('organization_customer')
                ->with('type_project_document')
                ->with('project_facilitys')
                ->with('status')
                ->with('project_delegations')
                ->with('project_irds.ird')
                ->with('project_stages.stage')
                ->find($args["projectId"]);

            if (!$projectData) {
                throw new Exception('Проект не найден');
            }

            $irdGenerator = new IrdsProjectTemplateGeneratorService();
            $contractFilePath = $irdGenerator->generate($projectData);

            return ['url' => $contractFilePath];



    }
}
