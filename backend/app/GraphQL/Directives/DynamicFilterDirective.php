<?php

namespace App\GraphQL\Directives;

use Closure;
use GraphQL\Language\AST\DirectiveNode;
use Nuwave\Lighthouse\Exceptions\DirectiveException;
use Nuwave\Lighthouse\Schema\AST\ASTHelper;
use Nuwave\Lighthouse\Schema\AST\DocumentAST;
use Nuwave\Lighthouse\Schema\Directives\BaseDirective;
use Nuwave\Lighthouse\Schema\Values\FieldValue;
use Nuwave\Lighthouse\Support\Contracts\FieldMiddleware;
use Nuwave\Lighthouse\Support\Contracts\GraphQLContext;

class DynamicFilterDirective extends BaseDirective implements FieldMiddleware
{
    public static function definition(): string
    {
        return /** @lang GraphQL */ <<<'SDL'
"""
Directive to automatically apply filters based on the requested fields.
"""
directive @dynamicFilter on FIELD_DEFINITION
SDL;
    }

    public function handleField(FieldValue $fieldValue, Closure $next): FieldValue
    {
        $previousResolver = $fieldValue->getResolver();

        $fieldValue->setResolver(
            function ($root, array $args, GraphQLContext $context, $info) use ($previousResolver) {
                $query = $previousResolver($root, $args, $context, $info);

// Получаем список запрошенных полей
                $requestedFields = collect($info->getFieldSelection(5))->keys();

// Применяем фильтрацию к запросу
                foreach ($requestedFields as $field) {
// Пропускаем специальные поля __typename и т.д.
                    if (substr($field, 0, 2) === '__') {
                        continue;
                    }

// Фильтруем по текущему полю
                    $query = $this->applyFilter($query, $field, $args);
                }

                return $query;
            }
        );

        return $next($fieldValue);
    }

    protected function applyFilter($query, $field, array $args)
    {
// Реализуйте здесь логику фильтрации по полю $field
// Например, $query->where($field, $args[$field])

        return $query;
    }
}
