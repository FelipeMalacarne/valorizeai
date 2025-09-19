<?php

declare(strict_types=1);

namespace Tests\Feature\Actions\Import;

use App\Actions\Import\CreateImport;
use App\Events\Import\ImportCreated;
use App\Http\Requests\Import\ImportRequest;
use App\Models\Account;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\Storage;

it('creates imports, stores files, and dispatches events for each file', function () {
    // 1. Arrange
    $user = User::factory()->create();
    $this->actingAs($user);

    Storage::fake();
    Event::fake();

    $files = [
        UploadedFile::fake()->create('import1.csv', 100, 'text/csv'),
        UploadedFile::fake()->create('import2.ofx', 100, 'application/ofx'),
    ];

    $request = new ImportRequest(
        files: collect($files),
        account_id: Account::factory()->create(['user_id' => $user->id])->id,
    );

    // 2. Act
    $action = app(CreateImport::class);
    $imports = $action->handle($request, $user);

    // 3. Assert
    expect($imports)->toHaveCount(2);

    // Assert for the first file
    $import1 = $imports->first();
    Storage::assertExists($import1->filePath);
    $this->assertDatabaseHas('imports', [
        'id'        => $import1->id,
        'file_name' => 'import1.csv',
        'user_id'   => $user->id,
    ]);

    // Assert for the second file
    $import2 = $imports->last();
    Storage::assertExists($import2->filePath);
    $this->assertDatabaseHas('imports', [
        'id'        => $import2->id,
        'file_name' => 'import2.ofx',
        'user_id'   => $user->id,
    ]);

    // Assert events were dispatched
    Event::assertDispatched(ImportCreated::class, 2);
    Event::assertDispatched(function (ImportCreated $event) use ($import1) {
        return $event->import->id === $import1->id;
    });
    Event::assertDispatched(function (ImportCreated $event) use ($import2) {
        return $event->import->id === $import2->id;
    });
});
