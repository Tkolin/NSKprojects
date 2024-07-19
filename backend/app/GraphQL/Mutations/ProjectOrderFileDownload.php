<?php declare(strict_types=1);

namespace App\GraphQL\Mutations;

use App\Models\Project;
use App\Services\FileGenerate\ProjectOrderGeneratorService;
use App\Services\GrpahQL\AuthorizationService;
use Nuwave\Lighthouse\Exceptions\AuthenticationException;
use Nuwave\Lighthouse\Support\Contracts\GraphQLContext;
use Exception;

final readonly class ProjectOrderFileDownload
{
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
                throw new AuthenticationException('Проект не найден');
            }
        if( !isset($projectData["organization_customer"])){
            throw new AuthenticationException('Не указан закачзик');
         }

            $projectGenerator = new ProjectOrderGeneratorService();

            $contractFilePath = $projectGenerator->generate($projectData);

            return ['url' => $contractFilePath];



    }
}
