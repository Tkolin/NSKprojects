<?php declare(strict_types=1);

namespace App\GraphQL\Mutations;

use App\GraphQL\Service\AuthorizationService;
use App\GraphQL\Service\FormulaComputeService;
use Nuwave\Lighthouse\Exceptions\AuthenticationException;
use Nuwave\Lighthouse\Support\Contracts\GraphQLContext;
use Symfony\Component\Process\Process;
use Symfony\Component\Process\Exception\ProcessFailedException;
use function Laravel\Prompts\warning;

final readonly class ComputeFormula
{
    /** @param  array{}  $args */
    public function __invoke(null $_, array $args, GraphQLContext $context)
    {
        $allowedRoles = ['admin']; // Роли, которые разрешены
        $accessToken = $context->request()->header('Authorization');
        if (AuthorizationService::checkAuthorization($accessToken, $allowedRoles)) {
            $formula = $args['formula'];
            $venvPythonPath = __DIR__ . '/../../../venv/Scripts/python';
            // Путь к скрипту Python
            $scriptPath = __DIR__ . '/../../../../backend/python/compute_formula.py';

            // Создание процесса для запуска Python скрипта
            $process = new Process([$venvPythonPath, $scriptPath, $formula]);
            $process->run();


// Проверка на ошибки
            if (!$process->isSuccessful()) {
                throw new ProcessFailedException($process);
            }

// Получение вывода (результат вычисления)
            $result = $process->getOutput();

            return $result;
        } else {
            throw new AuthenticationException('Отказано в доступе');
        }
    }
}
