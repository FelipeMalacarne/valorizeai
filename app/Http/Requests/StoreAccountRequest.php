<?php

declare(strict_types=1);

namespace App\Http\Requests;

use App\Domain\Account\Enums\Color;
use App\Domain\Account\Enums\Type;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;

final class StoreAccountRequest extends FormRequest
{
    public function authorize(): bool
    {
        return Auth::check();
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name'        => ['required', 'string', 'min:3', 'max:255'],
            'color'       => ['required', Rule::enum(Color::class)],
            'type'        => ['required', Rule::enum(Type::class)],
            'bank_code'   => ['required', 'numeric', 'digits:3'],
            'description' => ['nullable', 'string', 'max:255'],
            'number'      => ['nullable', 'string', 'max:16'],
        ];
    }
}
