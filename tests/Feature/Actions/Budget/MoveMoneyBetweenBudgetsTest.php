<?php

declare(strict_types=1);

use App\Actions\Budget\MoveMoneyBetweenBudgets;
use App\Enums\Currency;
use App\Http\Requests\Budget\MoveBudgetAllocationRequest;
use App\Models\Budget;
use App\Models\BudgetAllocation;
use App\Models\User;
use App\ValueObjects\Money;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('it moves money between budgets within the same month', function () {
    $user = User::factory()->create([
        'preferred_currency' => Currency::BRL->value,
    ]);

    $fromBudget = Budget::factory()->for($user)->create([
        'currency' => Currency::BRL,
    ]);

    $toBudget = Budget::factory()->for($user)->create([
        'currency' => Currency::BRL,
    ]);

    BudgetAllocation::factory()->for($fromBudget)->create([
        'month'           => '2025-05-01',
        'budgeted_amount' => 40_000,
    ]);

    BudgetAllocation::factory()->for($toBudget)->create([
        'month'           => '2025-05-01',
        'budgeted_amount' => 5_000,
    ]);

    $action = app(MoveMoneyBetweenBudgets::class);

    $request = new MoveBudgetAllocationRequest(
        from_budget_id: $fromBudget->id,
        to_budget_id: $toBudget->id,
        month: '2025-05',
        amount: new Money(10_000, Currency::BRL),
    );

    $action->handle($request, $user);

    $fromAllocation = $fromBudget->allocations()->whereDate('month', '2025-05-01')->first();
    $toAllocation = $toBudget->allocations()->whereDate('month', '2025-05-01')->first();

    expect($fromAllocation?->budgeted_amount)->toBe(30_000)
        ->and($toAllocation?->budgeted_amount)->toBe(15_000);
});

test('it rejects moves when currencies differ', function () {
    $user = User::factory()->create([
        'preferred_currency' => Currency::BRL->value,
    ]);

    $fromBudget = Budget::factory()->for($user)->create([
        'currency' => Currency::BRL,
    ]);

    $toBudget = Budget::factory()->for($user)->create([
        'currency' => Currency::BRL,
    ]);

    $action = app(MoveMoneyBetweenBudgets::class);

    $request = new MoveBudgetAllocationRequest(
        from_budget_id: $fromBudget->id,
        to_budget_id: $toBudget->id,
        month: '2025-05',
        amount: new Money(5_000, Currency::USD),
    );

    expect(fn () => $action->handle($request, $user))->toThrow(InvalidArgumentException::class);
});
