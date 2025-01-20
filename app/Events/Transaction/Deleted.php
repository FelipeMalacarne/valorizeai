<?php

namespace App\Events\Transaction;

use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use Spatie\EventSourcing\StoredEvents\ShouldBeStored;

class Deleted extends ShouldBeStored
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

}
