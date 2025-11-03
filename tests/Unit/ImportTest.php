<?php

declare(strict_types=1);

namespace Tests\Unit;

use App\Enums\ImportExtension;
use App\Enums\ImportStatus;
use App\Models\Import;
use App\Models\ImportTransaction;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

uses(TestCase::class, RefreshDatabase::class);

it('can create an import using factory', function () {
    $import = Import::factory()->create();
    expect($import)->toBeInstanceOf(Import::class);
});

it('belongs to a user', function () {
    $user = User::factory()->create();
    $import = Import::factory()->for($user)->create();

    expect($import->user)->toBeInstanceOf(User::class)
        ->and($import->user->id)->toBe($user->id);
});

it('has many import transactions', function () {
    $import = Import::factory()
        ->has(ImportTransaction::factory()->count(3))
        ->create();

    expect($import->importTransactions)->toHaveCount(3)
        ->each->toBeInstanceOf(ImportTransaction::class);
});

it('casts its attributes', function () {
    $import = Import::factory()->create([
        'extension' => ImportExtension::OFX,
        'status'    => ImportStatus::PROCESSING,
    ]);

    expect($import->extension)->toBeInstanceOf(ImportExtension::class)
        ->and($import->extension)->toBe(ImportExtension::OFX)
        ->and($import->status)->toBeInstanceOf(ImportStatus::class)
        ->and($import->status)->toBe(ImportStatus::PROCESSING);
});

it('has correct file path attribute', function () {
    $import = Import::factory()->create();
    $expectedPath = "imports/{$import->user_id}/{$import->id}.{$import->extension->value}";

    expect($import->file_path)->toBe($expectedPath);
});
