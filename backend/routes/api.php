<?php

use App\Http\Controllers\ContractController;
use App\Http\Controllers\ProjectController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Nuwave\Lighthouse\GraphQL;

Route::get('/download-contract/{filename}', [ContractController::class, 'download']);
Route::get('/download-project/{filename}', [ProjectController::class, 'download']);

