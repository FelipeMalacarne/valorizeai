<?php

declare(strict_types=1);

namespace App\Exceptions\Contracts;

interface FlashableForInertia
{
    /**
     * HTTP status code to associate with the exception.
     */
    public function status(): int;

    /**
     * Payload that should be flashed to the session for Inertia responses.
     *
     * @return array<string, mixed>
     */
    public function flash(): array;

    /**
     * Payload that should be returned for JSON clients.
     *
     * @return array<string, mixed>
     */
    public function json(): array;
}
