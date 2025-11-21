<?php

declare(strict_types=1);

namespace App\Listeners;

use App\Actions\Import\ProcessImport;
use App\Events\Import\ImportCreated;

final class ProcessImportListener
{
    public function __construct(
        private readonly ProcessImport $action,
    ) {}

    public function handle(ImportCreated $event): void
    {
        $this->action->handle($event->import);
    }
}
