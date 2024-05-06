<?php declare(strict_types=1);

namespace App\GraphQL\Mutations;

use Symfony\Component\Process\Exception\ProcessFailedException;
use Symfony\Component\Process\Process;

final readonly class ComputeFormulas
{
    /** @param  array{}  $args */
    public function __invoke(null $_, array $args)
    {
        $formulas = $args['formulas'];
        $formulaString = implode(';', $formulas);

        $venvPythonPath = __DIR__ . '/../../../venv/Scripts/python';
        $scriptPath = __DIR__ . '/../../../../backend/python/compute_formula.py';

        $process = new Process([$venvPythonPath, $scriptPath, $formulaString]);
        $process->run();

        if (!$process->isSuccessful()) {
            throw new ProcessFailedException($process);
        }

        $results = json_decode($process->getOutput());
        error_log('results'. $results);

        return $results;
    }
}
