<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Laravel\Passport\Passport;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        parent::register();

        // Журналирование запросов GraphQL
        app('events')->listen(RequestWasReceived::class, function (RequestWasReceived $event) {
            Log::debug('GraphQL Request', [
                'query' => $event->request->input('query'),
                'variables' => $event->request->input('variables'),
                'context' => $event->request->input('context'),
            ]);
        });

        // Журналирование ошибок выполнения GraphQL
        app('events')->listen(ExecutionError::class, function (ExecutionError $error) {
            Log::error('GraphQL Execution Error', [
                'message' => $error->exception->getMessage(),
                'code' => $error->exception->getCode(),
                'file' => $error->exception->getFile(),
                'line' => $error->exception->getLine(),
                'trace' => $error->exception->getTraceAsString(),
            ]);
        });
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {

    }
}
