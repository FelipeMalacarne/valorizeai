<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TransactionResource extends JsonResource
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
            'amount'      => $this->amount,
            'fitid'       => $this->fitid,
            'memo'        => $this->memo,
            'currency'    => $this->currency,
            'description' => $this->description,
            'categories'  => CategoryResource::collection($this->categories),
            'account'     => $this->account->name,
            'date_posted' => $this->date_posted->format('Y-m-d'),
        ];
    }
}
