<?php

declare(strict_types=1);

namespace App\Actions\Import;

use App\Enums\ImportStatus;
use App\Events\Import\ImportCreated;
use App\Http\Requests\Import\ImportRequest;
use App\Models\Import;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

final class CreateImport
{
    /**
     * @return Collection<int, Import>
     */
    public function handle(ImportRequest $args, User $user): Collection
    {
        $imports = collect();

        DB::transaction(function () use ($args, $user, $imports) {
            $args->files->each(function (UploadedFile $file) use ($user, $imports) {
                $import = Import::create([
                    'user_id'   => $user->id,
                    'file_name' => $file->getClientOriginalName(),
                    'extension' => $file->getClientOriginalExtension(),
                    'status'    => ImportStatus::PROCESSING,
                ]);

                $file->storeAs($import->filePath);

                $imports->push($import);

                ImportCreated::dispatch($import);
            });
        });

        return $imports;
    }
}
