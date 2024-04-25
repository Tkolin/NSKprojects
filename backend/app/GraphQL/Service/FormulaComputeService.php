<?php

namespace App\GraphQL\Service;

use App\Models\Organization;
use App\Models\Person;
use App\Models\TemplateFile;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use PhpOffice\PhpWord\IOFactory;
use PhpOffice\PhpWord\PhpWord;
use PhpOffice\PhpWord\TemplateProcessor;
use function Laravel\Prompts\warning;

class FormulaComputeService
{
    public function compute($formula)
    {
        $stack = [];
        $tokens = explode(" ", $formula);
         foreach ($tokens as $token) {
            if (is_numeric($token)) {
                array_push($stack, $token);
            } else {
                $b = array_pop($stack);
                $a = array_pop($stack);
                error_log('d'.$b);

                switch ($token) {
                    case '+':
                        array_push($stack, $a + $b);
                        break;
                    case '-':
                        array_push($stack, $a - $b);
                        break;
                    case '*':
                        array_push($stack, $a * $b);
                        break;
                    case '/':
                        array_push($stack, $a / $b);
                        break;
                }
            }
        }
        return array_pop($stack);
    }

}
