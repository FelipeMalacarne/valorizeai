<?php

use App\Http\Controllers\Api\AccountController;
use App\Http\Controllers\Api\BudgetController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\LoadTestUserTokenController;
use App\Http\Controllers\Api\TransactionController;
use Illuminate\Support\Facades\Route;

Route::post('testing/load-test-user', LoadTestUserTokenController::class)
    ->name('api.testing.load-test-user');

Route::middleware('auth:sanctum')
    ->as('api.')
    ->group(function () {
        Route::apiResource('accounts', AccountController::class);
        Route::apiResource('categories', CategoryController::class);
        Route::apiResource('transactions', TransactionController::class);
        Route::apiResource('budgets', BudgetController::class);
    });
