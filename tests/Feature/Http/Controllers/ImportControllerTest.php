<?php

declare(strict_types=1);

namespace Tests\Feature\Http\Controllers;

use App\Events\Import\ImportCreated;
use App\Models\Account;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\Storage;

it('can store multiple import files and dispatch events', function () {
    // 1. Arrange
    $user = User::factory()->create();
    $this->actingAs($user);

    Storage::fake();
    Event::fake();

    $account = Account::factory()->create(['user_id' => $user->id]);

    $files = [
        UploadedFile::fake()->create('statement1.csv', 100),
        UploadedFile::fake()->create('statement2.ofx', 100),
    ];

    // 2. Act
    $response = $this->postJson(route('imports.store'), [
        'files'      => $files,
        'account_id' => $account->id,
    ]);

    // 3. Assert
    $response->assertStatus(201)
        ->assertJsonStructure([
            'message',
            'imports' => [
                '*' => ['id', 'user_id', 'file_name', 'extension', 'status', 'new_count', 'matched_count', 'conflicted_count', 'created_at', 'updated_at'],
            ],
        ]);

    $imports = $response->json('imports');
    expect($imports)->toHaveCount(2);

    // Assert for the first file
    $import1 = collect($imports)->first();
    Storage::assertExists('imports/'.$user->id.'/'.$import1['id'].'.csv');
    $this->assertDatabaseHas('imports', [
        'id'        => $import1['id'],
        'file_name' => 'statement1.csv',
        'user_id'   => $user->id,
    ]);

    // Assert for the second file
    $import2 = collect($imports)->last();
    Storage::assertExists('imports/'.$user->id.'/'.$import2['id'].'.ofx');
    $this->assertDatabaseHas('imports', [
        'id'        => $import2['id'],
        'file_name' => 'statement2.ofx',
        'user_id'   => $user->id,
    ]);

    // Assert events were dispatched
    Event::assertDispatched(ImportCreated::class, 2);
    Event::assertDispatched(function (ImportCreated $event) use ($import1) {
        return $event->import->id === $import1['id'];
    });
    Event::assertDispatched(function (ImportCreated $event) use ($import2) {
        return $event->import->id === $import2['id'];
    });
});
