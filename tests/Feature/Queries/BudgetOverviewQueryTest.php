<?php

declare(strict_types=1);

use App\Enums\Currency;
use App\Enums\TransactionType;
use App\Models\Account;
use App\Models\Budget;
use App\Models\BudgetAllocation;
use App\Models\Category;
use App\Models\Transaction;
use App\Models\TransactionSplit;
use App\Models\User;
use App\Queries\Budget\BudgetOverviewQuery;
use App\ValueObjects\Money;
use Carbon\CarbonImmutable;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('it aggregates allocations, spending and rollover for the selected month', function () {
    $user = User::factory()->create([
        'preferred_currency' => Currency::BRL->value,
    ]);

    $category = Category::factory()->for($user)->create();

    $budget = Budget::factory()
        ->for($user)
        ->for($category)
        ->create([
            'currency' => Currency::BRL,
        ]);

    $currentMonth = CarbonImmutable::parse('2025-05-01');
    $previousMonth = $currentMonth->subMonth();

    BudgetAllocation::factory()->for($budget)->create([
        'month'           => $previousMonth->startOfMonth(),
        'budgeted_amount' => 100_000, // R$1.000,00
    ]);

    BudgetAllocation::factory()->for($budget)->create([
        'month'           => $currentMonth->startOfMonth(),
        'budgeted_amount' => 50_000, // R$500,00
    ]);

    $account = Account::factory()->for($user)->create([
        'currency' => Currency::BRL,
    ]);

    // Previous month spending (R$300,00)
    Transaction::factory()->for($account)->for($category)->create([
        'type'   => TransactionType::DEBIT,
        'date'   => $previousMonth->startOfMonth()->addDays(5),
        'amount' => new Money(-30_000, Currency::BRL),
    ]);

    // Current month spending (R$200,00)
    Transaction::factory()->for($account)->for($category)->create([
        'type'   => TransactionType::DEBIT,
        'date'   => $currentMonth->startOfMonth()->addDays(3),
        'amount' => new Money(-20_000, Currency::BRL),
    ]);

    // Current month split spending (R$150,00)
    $splitTransaction = Transaction::factory()->for($account)->create([
        'type'        => TransactionType::DEBIT,
        'date'        => $currentMonth->startOfMonth()->addDays(10),
        'category_id' => null,
        'amount'      => new Money(-15_000, Currency::BRL),
    ]);

    TransactionSplit::factory()->for($splitTransaction)->for($category)->create([
        'amount' => new Money(15_000, Currency::BRL),
    ]);

    $query = app(BudgetOverviewQuery::class);

    $result = $query->resource($user, $currentMonth);

    expect($result)->toHaveCount(1);

    /** @var \App\Http\Resources\BudgetOverviewResource $summary */
    $summary = $result->first();

    expect($summary->budgeted_amount->value)->toBe(50_000)
        ->and($summary->rollover_amount->value)->toBe(70_000)
        ->and($summary->spent_amount->value)->toBe(35_000)
        ->and($summary->remaining_amount->value)->toBe(85_000);
});
