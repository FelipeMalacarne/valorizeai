<?php

declare(strict_types=1);

use App\Http\Controllers\AccountController;
use App\Http\Controllers\BankController;
use App\Http\Controllers\BudgetController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ImportController;
use App\Http\Controllers\TransactionController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', fn () => Inertia::render('welcome'))->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', fn () => Inertia::render('dashboard'))->name('dashboard');

    Route::resource('banks', BankController::class)->only(['index']);
    Route::resource('accounts', AccountController::class);
    Route::resource('transactions', TransactionController::class);
    Route::resource('categories', CategoryController::class)->only(['index', 'store', 'show', 'update', 'destroy']);
    Route::resource('budgets', BudgetController::class)->only(['index', 'store', 'update', 'destroy']);
    Route::post('budgets/monthly-income', [BudgetController::class, 'updateMonthlyIncome'])->name('budgets.monthly-income');
    Route::post('budgets/allocate', [BudgetController::class, 'allocate'])->name('budgets.allocate');
    Route::post('budgets/move', [BudgetController::class, 'move'])->name('budgets.move');

    Route::resource('imports', ImportController::class)->only(['store']);
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
