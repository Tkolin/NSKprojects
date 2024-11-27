<?php


use App\Http\Controllers\ExecutorContractController;
use App\Http\Controllers\FileController;
use App\Http\Controllers\FileUpload\ProjectExecutor;
use App\Http\Controllers\FileUpload\ProjectMain;
use App\Http\Controllers\FileUpload\ProjectStage;
use App\Http\Controllers\FileUploadController;
use App\Http\Controllers\ProjectController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});
