<?php

declare(strict_types=1);

namespace App\Policies;

use App\Models\ImportTransaction;
use App\Models\User;

final class ImportTransactionPolicy
{
    public function review(User $user, ImportTransaction $importTransaction): bool
    {
        return $user->id === $importTransaction->import->user_id;
    }
}
