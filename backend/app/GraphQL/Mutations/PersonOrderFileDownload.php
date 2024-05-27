<?php declare(strict_types=1);

namespace App\GraphQL\Mutations;

use App\Models\Person;
use App\Services\FileGenerate\ContractGeneratorService;
use App\Services\GrpahQL\AuthorizationService;
use Exception;
use Nuwave\Lighthouse\Exceptions\AuthenticationException;
use Nuwave\Lighthouse\Support\Contracts\GraphQLContext;

final readonly class PersonOrderFileDownload
{
    /** @param  array{}  $args */
    public function __invoke(null $_, array $args, GraphQLContext $context)
    {

        $personData = Person::with(['passport', 'passport.passport_place_issue'])
            ->with('bank')
            ->with('BIK')
            ->find($args["personId"]);

        if (!$personData) {
            throw new Exception('Сотрудник не найден');
        }

        $contractGenerator = new ContractGeneratorService();
        $contractFilePath = $contractGenerator->generate($personData);

        return ['url' => $contractFilePath];


    }
}
