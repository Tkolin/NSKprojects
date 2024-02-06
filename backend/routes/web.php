<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ContactController;


Route::get('/{path}', function () {
    return view('index');
})->where('path', '.*');

// Добавьте маршрут для мутации создания контакта
Route::post('/contacts/add', [ContactController::class, 'addContact']);

// Добавьте маршрут для мутации редактирования контакта
Route::put('/contacts/update/{id}', [ContactController::class, 'updateContact']);

Route::resource('contacts', ContactController::class);

Auth::routes();

Route::get('/home', [App\Http\Controllers\HomeController::class, 'index'])->name('home');
