<?php

declare(strict_types=1);

use App\Actions\Budget\AllocateBudget;
use App\Enums\Currency;
use App\Exceptions\BudgetAllocationLimitExceeded;
use App\Http\Requests\Budget\AllocateBudgetRequest;
use App\Models\Budget;
use App\Models\User;
use App\ValueObjects\Money;
use Carbon\CarbonImmutable;
use Illuminate\Foundation\Testing\RefreshDatabase;
use App\Models\BudgetMonthlyConfig;
use App\Models\BudgetAllocation;

uses(RefreshDatabase::class);

test('it creates or updates budget allocations for the selected month', function () {
    $user = User::factory()->create([
        'preferred_currency' => Currency::BRL->value,
    ]);

    $budget = Budget::factory()->for($user)->create([
        'currency' => Currency::BRL,
    ]);

    $action = app(AllocateBudget::class);

    $request = new AllocateBudgetRequest(
        budget_id: $budget->id,
        month: '2025-05',
        amount: new Money(25_000, Currency::BRL),
    );

    $allocation = $action->handle($request, $user);

    expect($allocation->budgeted_amount)->toBe(25_000)
        ->and($allocation->month->isSameDay(CarbonImmutable::parse('2025-05-01')))->toBeTrue();

    $updated = $action->handle(
        new AllocateBudgetRequest(
            budget_id: $budget->id,
            month: '2025-05',
            amount: new Money(40_000, Currency::BRL),
        ),
        $user,
    );

    expect($updated->is($allocation))->toBeTrue()
        ->and($updated->budgeted_amount)->toBe(40_000);
});

test('it validates currency compatibility when allocating budget', function () {
    $user = User::factory()->create([
        'preferred_currency' => Currency::BRL->value,
    ]);

    $budget = Budget::factory()->for($user)->create([
        'currency' => Currency::BRL,
    ]);

    $action = app(AllocateBudget::class);

    $request = new AllocateBudgetRequest(
        budget_id: $budget->id,
        month: '2025-05',
        amount: new Money(10_000, Currency::USD),
    );

    expect(fn () => $action->handle($request, $user))->toThrow(\InvalidArgumentException::class);
});

test('it respects the monthly income cap when allocating budgets', function () {
    $user = User::factory()->create([
        'preferred_currency' => Currency::BRL->value,
    ]);

    $primaryBudget = Budget::factory()->for($user)->create([
        'currency' => Currency::BRL,
    ]);

    $secondaryBudget = Budget::factory()->for($user)->create([
        'currency' => Currency::BRL,
    ]);

    BudgetMonthlyConfig::create([
        'user_id'       => $user->id,
        'month'         => '2025-05-01',
        'income_amount' => 50_000,
    ]);

    BudgetAllocation::create([
        'budget_id'       => $secondaryBudget->id,
        'month'           => '2025-05-01',
        'budgeted_amount' => 30_000,
    ]);

    $action = app(AllocateBudget::class);

    expect(fn () => $action->handle(
        new AllocateBudgetRequest(
            budget_id: $primaryBudget->id,
            month: '2025-05',
            amount: new Money(25_000, Currency::BRL),
        ),
        $user,
    ))->toThrow(BudgetAllocationLimitExceeded::class);

    $allocation = $action->handle(
        new AllocateBudgetRequest(
            budget_id: $primaryBudget->id,
            month: '2025-05',
            amount: new Money(20_000, Currency::BRL),
        ),
        $user,
    );

    expect($allocation->budgeted_amount)->toBe(20_000);
});

test('it reuses the last configured income when the month has no specific entry', function () {
    $user = User::factory()->create([
        'preferred_currency' => Currency::BRL->value,
    ]);

    $budget = Budget::factory()->for($user)->create([
        'currency' => Currency::BRL,
    ]);

    BudgetMonthlyConfig::create([
        'user_id'       => $user->id,
        'month'         => '2025-04-01',
        'income_amount' => 50_000,
    ]);

    $action = app(AllocateBudget::class);

    expect(fn () => $action->handle(
        new AllocateBudgetRequest(
            budget_id: $budget->id,
            month: '2025-05',
            amount: new Money(55_000, Currency::BRL),
        ),
        $user,
    ))->toThrow(BudgetAllocationLimitExceeded::class);

    $allocation = $action->handle(
        new AllocateBudgetRequest(
            budget_id: $budget->id,
            month: '2025-05',
            amount: new Money(45_000, Currency::BRL),
        ),
        $user,
    );

    expect($allocation->budgeted_amount)->toBe(45_000);
});
