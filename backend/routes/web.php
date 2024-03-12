<?php

use App\Http\Controllers\ContractController;
use Illuminate\Support\Facades\Route;
use Nuwave\Lighthouse\GraphQL;

Route::get('/he', function () {
    return view('welcome');
});
Route::get('/download-contract/{filename}', [ContractController::class, 'download']);
