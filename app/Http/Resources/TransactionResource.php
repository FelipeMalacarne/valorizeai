<?php

declare(strict_types=1);

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

final class TransactionResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id'          => $this->id,
            'money'       => $this->money,
            'fitid'       => $this->fitid,
            'memo'        => $this->memo,
            'description' => $this->description,
            'categories'  => CategoryResource::collection($this->categories),
            'account'     => $this->account->name,
            'date_posted' => $this->date_posted->format('Y-m-d'),
        ];
    }
}
