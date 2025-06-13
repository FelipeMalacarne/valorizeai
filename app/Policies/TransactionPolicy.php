<?php

declare(strict_types=1);

namespace App\Policies;

use App\Models\Transaction;
use App\Models\User;

final class TransactionPolicy
{
    public function view(User $user, Transaction $transaction): bool
    {
        return $user->id === $transaction->account->user_id;
    }

    public function update(User $user, Transaction $transaction): bool
    {
        return $this->view($user, $transaction);
    }

    public function delete(User $user, Transaction $transaction): bool
    {
        return $this->view($user, $transaction);
    }
}
