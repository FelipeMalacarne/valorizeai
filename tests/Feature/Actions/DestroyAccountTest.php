<?php

declare(strict_types=1);

use App\Actions\Account\DestroyAccount;
use App\Models\Account;

test('test it successfully deletes the account', function () {
    $account = Account::factory()->create();

    $action = app(DestroyAccount::class);

    $result = $action->handle($account);

    expect($result)->toBeTrue();
    $this->assertDatabaseMissing('accounts', [
        'id' => $account->id,
    ]);
});
