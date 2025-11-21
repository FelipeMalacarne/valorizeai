<?php

declare(strict_types=1);

namespace App\Policies;

use App\Models\Import;
use App\Models\User;

final class ImportPolicy
{
    public function view(User $user, Import $import): bool
    {
        return $user->id === $import->user_id;
    }

    public function review(User $user, Import $import): bool
    {
        return $this->view($user, $import);
    }
}
