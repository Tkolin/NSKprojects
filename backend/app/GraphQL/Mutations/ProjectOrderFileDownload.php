<?php declare(strict_types=1);

namespace App\GraphQL\Mutations;

use App\GraphQL\Service\AuthorizationService;
use App\GraphQL\Service\ContractGeneratorService;
<<<<<<< HEAD
use App\GraphQL\Service\ProjectGeneratorService;
=======
>>>>>>> origin/master
use App\Models\Person;
use App\Models\Project;
use Nuwave\Lighthouse\Exceptions\AuthenticationException;
use Nuwave\Lighthouse\Support\Contracts\GraphQLContext;

final readonly class ProjectOrderFileDownload
{
    public function __invoke(null $_, array $args, GraphQLContext $context)
    {
        $allowedRoles = ['admin','bookkeeper']; // Роли, которые разрешены
        $accessToken = $context->request()->header('Authorization');
        if (AuthorizationService::checkAuthorization($accessToken, $allowedRoles)) {
<<<<<<< HEAD
             $projectData = Project::with('organization_customer')
                ->with('type_project_document')
                ->with('type_project_document.group')
                ->with('type_project_document.group.technical_specification')
=======

            $projectData = Project::with('organization_customer')
                ->with('type_project_document')
>>>>>>> origin/master
                ->with('project_facilitys')
                ->with('status')
                ->with('project_delegations')
                ->with('project_irds.IRD')
                ->with('project_stage.stage')
<<<<<<< HEAD
                ->find($args["projectId"]);
=======
                ->find($args["personId"]);
>>>>>>> origin/master

            if (!$projectData) {
                throw new Exception('Сотрудник не найден');
            }

<<<<<<< HEAD
            $projectGenerator = new ProjectGeneratorService();
=======
            $projectGenerator = new ContractGeneratorService();
>>>>>>> origin/master
            $contractFilePath = $projectGenerator->generate($projectData);

            return ['url' => $contractFilePath];


        } else {
            throw new AuthenticationException('Отказано в доступе');
        }
    }
}
