<?php

namespace App\Services\GrpahQL;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Pagination\LengthAwarePaginator;

class QueryService
{
    public function buildQueryOptions(Builder $query, ?array $queryOptions, ?array $searchColumns): Builder
    {
        if (isset($queryOptions['search']) && isset($searchColumns))
            $query = $this->search($query, $queryOptions['search'], $searchColumns);
        if (isset($queryOptions['sortField']) && isset($queryOptions['sortOrder']))
            $query = $this->sort($query, $queryOptions['sortField'], $queryOptions['sortOrder']);
        if (isset($queryOptions['finds']))
            $query = $this->find($query, $queryOptions['finds']); // Массив из стобец = значение
        return $query;
    }
    public function switchQueryType(Builder $query): Builder
    {
        if (isset($queryOptions['search']) && isset($searchColumns))
            $query = $this->search($query, $queryOptions['search'], $searchColumns);
        if (isset($queryOptions['sortField']) && isset($queryOptions['sortOrder']))
            $query = $this->sort($query, $queryOptions['sortField'], $queryOptions['sortOrder']);
        if (isset($queryOptions['finds']))
            $query = $this->find($query, $queryOptions['finds']); // Массив из стобец = значение
        return $query;
    }

    public function find(Builder $query, ?array $finds): Builder
    {
        if ($finds) {
            // Построение поиска
            foreach ($finds as $column) {
                $query->where($column['column'], '=', $column['value']);
            }
        }
        return $query;
    }

    public function search(Builder $query, ?string $searchTerm, ?array $searchColumns): Builder
    {
        if ($searchTerm && !empty($searchColumns)) {
            // Построение поиска
            foreach ($searchColumns as $column) {
                $query->orWhere($column, 'like', "%$searchTerm%");
            }
        }
        return $query;
    }

    public function sort(Builder $query, ?string $sortField, ?string $sortOrder): Builder
    {
        if ($sortField && $sortOrder) {
            // Добавляем условия сортировки в запрос
            $query->orderBy($sortField, $sortOrder);
        }

        return $query;
    }

    public function paginate(Builder $query, ?int $limit, ?int $page, string $mode = "ID"): \Illuminate\Contracts\Pagination\LengthAwarePaginator
    {
        $perPage = $limit ?? 10;
        $currentPage = $page ?? 1;
        if($mode != "NOID")
            $query->orderBy('id', 'desc');

        // Выполняем пагинацию
        $paginator = $query->paginate($perPage, ['*'], 'page', $currentPage);

        return $paginator;
    }
}
