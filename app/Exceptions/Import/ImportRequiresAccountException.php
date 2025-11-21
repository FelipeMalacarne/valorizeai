<?php

declare(strict_types=1);

namespace App\Exceptions\Import;

use App\Exceptions\Contracts\FlashableForInertia;
use RuntimeException;

final class ImportRequiresAccountException extends RuntimeException implements FlashableForInertia
{
    public function __construct()
    {
        parent::__construct(__('Vincule a importação a uma conta para revisar ou aprovar transações.'));
    }

    public function status(): int
    {
        return 422;
    }

    public function flash(): array
    {
        return [
            'error' => $this->getMessage(),
        ];
    }

    public function json(): array
    {
        return [
            'message' => $this->getMessage(),
        ];
    }
}
