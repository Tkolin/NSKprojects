<?php declare(strict_types=1);

namespace App\GraphQL\Mutations;

use App\GraphQL\Service\AuthorizationService;
use App\GraphQL\Service\ContractGeneratorService;
use App\Models\Person;
use Exception;
use Nuwave\Lighthouse\Exceptions\AuthenticationException;
use Nuwave\Lighthouse\Support\Contracts\GraphQLContext;

final readonly class PersonOrderFileDownload
{
    /** @param  array{}  $args */
    public function __invoke(null $_, array $args, GraphQLContext $context)
    {
        $allowedRoles = ['admin','bookkeeper']; // Роли, которые разрешены
        $accessToken = $context->request()->header('Authorization');
        if (AuthorizationService::checkAuthorization($accessToken, $allowedRoles)) {

            $personData = Person::with(['passport', 'passport.passport_place_issue'])
                ->with('bank')
                ->with('BIK')
                ->find($args["personId"]);

            if (!$personData) {
                throw new Exception('Сотрудник не найден');
            }

            $contractGenerator = new ContractGeneratorService();
            $contractFilePath = $contractGenerator->generateContractPerson($personData);

            return ['url' => $contractFilePath];


        } else {
            throw new AuthenticationException('Отказано в доступе');
        }
    }
}
