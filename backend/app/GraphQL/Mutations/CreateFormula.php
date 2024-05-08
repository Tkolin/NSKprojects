<?php declare(strict_types=1);

namespace App\GraphQL\Mutations;

use App\Models\Formula;
use App\Models\FormulaVariable;
use Nuwave\Lighthouse\Exceptions\AuthenticationException;

final readonly class CreateFormula
{
    /**
     * Создает формулу и связанные с ней переменные.
     *
     * @param array $args Массив с данными для создания формулы.
     * @throws AuthenticationException Если данные некорректны.
     * @return int 1, если формула успешно создана.
     */
    public function __invoke(null $_, array $args)
    {
        // Проверяем, что данные корректны
        if (!isset($args['data']) || !isset($args['data']['variable_data'])) {
            throw new AuthenticationException('Не корректные данные');
        }
        // Создаем формулу
        $name_key = $args['data']['name'];
        $newFormula = Formula::create([
            'original_formula' => $args['data']['original_formula'],
            'rpn_formula' => $args['data']['rpn_formula'] ?? "",
            'name' => $args['data']['name'],
            'latex_formula' => $args['data']['original_formula'],
            'description' => $args['data']['description'],
            'name_key' => $name_key,
        ]);
        // Создаем переменные
        foreach ($args['data']['variable_data'] as $var) {
            FormulaVariable::create([
                'formula_id' => $newFormula['id'],
                'name' => $var['name'],
                'description' => $var['description'],
                'name_key' => $var['name_key'],
            ]);
        }
        return 1;
    }
}
