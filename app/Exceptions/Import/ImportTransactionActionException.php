<?php

declare(strict_types=1);

namespace App\Exceptions\Import;

use App\Exceptions\Contracts\FlashableForInertia;
use RuntimeException;

final class ImportTransactionActionException extends RuntimeException implements FlashableForInertia
{
    public function __construct(string $message)
    {
        parent::__construct($message);
    }

    public static function cannotApprove(): self
    {
        return new self(__('Esta transação não pode ser aprovada.'));
    }

    public static function cannotReject(): self
    {
        return new self(__('Esta transação não pode ser rejeitada.'));
    }

    public static function missingMatchedTransaction(): self
    {
        return new self(__('Não há uma transação existente para ser substituída.'));
    }

    public static function bulkOnlyNew(): self
    {
        return new self(__('Apenas transações novas podem ser aprovadas em lote.'));
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
