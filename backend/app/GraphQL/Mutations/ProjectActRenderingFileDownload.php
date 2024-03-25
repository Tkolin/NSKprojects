<?php declare(strict_types=1);

namespace App\GraphQL\Mutations;

use App\GraphQL\Service\AuthorizationService;
use App\GraphQL\Service\ProjectOrderGeneratorService;
use App\GraphQL\Service\TheActRenderingServicesTemplateGeneratorService;
use App\Models\Project;
use Nuwave\Lighthouse\Exceptions\AuthenticationException;
use Nuwave\Lighthouse\Support\Contracts\GraphQLContext;

final readonly class ProjectActRenderingFileDownload
{
    /** @param  array{}  $args */
    public function __invoke(null $_, array $args, GraphQLContext $context)
    {
        $allowedRoles = ['admin','bookkeeper']; // Роли, которые разрешены
        $accessToken = $context->request()->header('Authorization');
        if (AuthorizationService::checkAuthorization($accessToken, $allowedRoles)) {

            $projectData = Project::with('organization_customer')
                ->with('type_project_document')
                ->with('type_project_document.group')
                ->with('type_project_document.group.technical_specification')

                ->with('project_facilitys')
                ->with('status')
                ->with('project_delegations')
                ->with('project_irds.IRD')
                ->with('project_stages.stage')

                ->find($args["projectId"]);


            if (!$projectData) {
                throw new Exception('Проект не найден');
            }


            $projectGenerator = new TheActRenderingServicesTemplateGeneratorService();
            $contractFilePath = $projectGenerator->generate($projectData, $args["stageNumber"]);

            return ['url' => $contractFilePath];


        } else {
            throw new AuthenticationException('Отказано в доступе');
        }
    }
}
