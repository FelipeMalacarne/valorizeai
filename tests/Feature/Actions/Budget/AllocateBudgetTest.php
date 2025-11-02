<?php

declare(strict_types=1);

use App\Actions\Budget\AllocateBudget;
use App\Enums\Currency;
use App\Http\Requests\Budget\AllocateBudgetRequest;
use App\Models\Budget;
use App\Models\User;
use App\ValueObjects\Money;
use Carbon\CarbonImmutable;
use Illuminate\Foundation\Testing\RefreshDatabase;

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
