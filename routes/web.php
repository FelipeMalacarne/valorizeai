<?php

declare(strict_types=1);

use App\Http\Controllers\AccountController;
use App\Http\Controllers\BankController;
use App\Http\Controllers\CategoryController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', fn () => Inertia::render('welcome'))->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', fn () => Inertia::render('dashboard'))->name('dashboard');

    Route::resource('banks', BankController::class)->only(['index']);
    Route::resource('accounts', AccountController::class)->only(['index', 'store', 'show', 'update', 'destroy']);
    Route::resource('categories', CategoryController::class)->only(['index', 'store', 'show', 'update', 'destroy']);
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
