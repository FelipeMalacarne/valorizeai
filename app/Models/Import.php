<?php

declare(strict_types=1);

namespace App\Models;

use App\Enums\ImportExtension;
use App\Enums\ImportStatus;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * @property string $id
 * @property string $user_id
 * @property string $file_name
 * @property ImportExtension $extension
 * @property ImportStatus $status
 * @property int $new_count
 * @property int $matched_count
 * @property int $conflicted_count
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read User $user
 * @property-read \Illuminate\Database\Eloquent\Collection<int, ImportTransaction> $importTransactions
 * @property-read int|null $import_transactions_count
 */
final class Import extends Model
{
    /** @use HasFactory<\Database\Factories\ImportFactory> */
    use HasFactory, HasUuids;

    protected $fillable = [
        'user_id',
        'file_name',
        'extension',
        'status',
        'new_count',
        'matched_count',
        'conflicted_count',
    ];

    /**
     * @return BelongsTo<User, Import>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * @return HasMany<ImportTransaction, Import>
     */
    public function importTransactions(): HasMany
    {
        return $this->hasMany(ImportTransaction::class);
    }

    /**
     * Get the path where the import file should be stored.
     */
    public function filePath(): Attribute
    {
        return Attribute::make(
            get: fn () => "imports/{$this->user_id}/{$this->id}.{$this->extension->value}"
        );
    }

    protected function casts(): array
    {
        return [
            'extension' => ImportExtension::class,
            'status'    => ImportStatus::class,
        ];
    }
}
