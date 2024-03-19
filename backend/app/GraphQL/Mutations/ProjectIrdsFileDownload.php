<?php declare(strict_types=1);

namespace App\GraphQL\Mutations;

use App\GraphQL\Service\AuthorizationService;
use App\GraphQL\Service\ContractGeneratorService;
use App\Models\Person;
use App\Models\Project;
use Nuwave\Lighthouse\Exceptions\AuthenticationException;
use Nuwave\Lighthouse\Support\Contracts\GraphQLContext;

final readonly class ProjectIrdsFileDownload
{
    public function __invoke(null $_, array $args, GraphQLContext $context)
    {
        $allowedRoles = ['admin','bookkeeper']; // Роли, которые разрешены
        $accessToken = $context->request()->header('Authorization');
        if (AuthorizationService::checkAuthorization($accessToken, $allowedRoles)) {

            $projectData = Project::with('organization_customer')
                ->with('type_project_document')
                ->with('project_facilitys')
                ->with('status')
                ->with('project_delegations')
                ->with('project_irds.IRD')
                ->with('project_stage.stage')
                ->find($args["projectId"]);

            if (!$projectData) {
                throw new Exception('Сотрудник не найден');
            }

            $irdGenerator = new ProjectIrdsFileDownload();
            $contractFilePath = $irdGenerator->generate($projectData);

            return ['url' => $contractFilePath];


        } else {
            throw new AuthenticationException('Отказано в доступе');
        }
    }
}
