<?php

declare(strict_types=1);

namespace App\Exceptions;

use App\Exceptions\Contracts\FlashableForInertia;
use App\ValueObjects\Money;
use InvalidArgumentException;

final class BudgetAllocationLimitExceeded extends InvalidArgumentException implements FlashableForInertia
{
    public function __construct(public readonly Money $remaining)
    {
        parent::__construct(
            __('Você ultrapassou o valor disponível para alocar neste mês (:remaining restantes).', [
                'remaining' => $remaining->format(),
            ])
        );
    }

    public function status(): int
    {
        return 422;
    }

    public function flash(): array
    {
        return [
            'error'             => $this->getMessage(),
            'budget_allocation' => $this->json(),
        ];
    }

    public function json(): array
    {
        return [
            'message'   => $this->getMessage(),
            'remaining' => $this->remaining->toArray(),
        ];
    }
}
