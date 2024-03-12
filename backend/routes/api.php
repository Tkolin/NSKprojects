<?php

use App\Http\Controllers\ContractController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Nuwave\Lighthouse\GraphQL;

Route::get('/download-contract/{filename}', [ContractController::class, 'download']);
