<?php declare(strict_types=1);

namespace App\GraphQL\Mutations;

use App\GraphQL\Service\AuthorizationService;
use App\Models\Facility;
use App\Models\Formula;
use App\Models\FormulaVariable;
use Nuwave\Lighthouse\Exceptions\AuthenticationException;
use Nuwave\Lighthouse\Support\Contracts\GraphQLContext;

final readonly class AddFormula
{
    /** @param array{} $args */
    public function __invoke(null $_, array $args, GraphQLContext $context): Facility
    {
        $allowedRoles = ['admin']; // Роли, которые разрешены
        $accessToken = $context->request()->header('Authorization');
        if (AuthorizationService::checkAuthorization($accessToken, $allowedRoles)) {
            if (!isset($args['data']) && !isset($args['data']['variable_data']))
                throw new AuthenticationException('Не коректные данные');
            $name_key = $args['data']['name'];
            $newFormula = Formula::create([
                'original_formula' => $args['data']['original_formula'],
                'rpn_formula' => $args['data']['rpn_formula'],
                'name' => $args['data']['name'],
                'description' => $args['data']['description'],
                'name_key' => $name_key,
            ]);

            foreach ($args['data']['variable_data'] as $var) {
                FormulaVariable::create([
                    'formula_id' => $newFormula['id'],
                    'name' => $var['name'],
                    'description' => $var['description'],
                    'name_key' => $var['name_key'],
                ]);
            }

            return 1;
        } else {
            throw new AuthenticationException('Отказано в доступе');
        }

    }
}
