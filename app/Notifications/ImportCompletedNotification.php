<?php

declare(strict_types=1);

namespace App\Notifications;

use App\Models\Account;
use App\Models\Import;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\BroadcastMessage;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Str;

class ImportCompletedNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(
        public readonly Import $import,
        public readonly Account $account,
    ) {}

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['database', 'broadcast'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject(__('Importação pronta para revisão'))
            ->greeting(__('Olá :name', ['name' => $notifiable->name]))
            ->line(
                __('Sua importação para a conta :account já está disponível para revisão.', [
                    'account' => $this->account->name,
                ])
            )
            ->line(
                __('Novos lançamentos pendentes: :count', [
                    'count' => $this->import->new_count,
                ])
            )
            ->line(
                __('Transações conciliadas automaticamente: :count', [
                    'count' => $this->import->matched_count,
                ])
            )
            ->line(
                __('Transações com conflito: :count', [
                    'count' => $this->import->conflicted_count,
                ])
            )
            ->action(__('Revisar importação'), route('imports.show', $this->import))
            ->line(__('Obrigado por usar o Valorize!'));
    }

    public function toBroadcast(object $notifiable): BroadcastMessage
    {
        return new BroadcastMessage([
            'id'         => (string) Str::uuid(),
            'type'       => static::class,
            'data'       => $this->toArray($notifiable),
            'read_at'    => null,
            'created_at' => now()->toIso8601String(),
        ]);
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'title' => __('Importação pronta para revisão'),
            'body'  => __('Conta :account • Pendentes: :new • Conciliadas: :matched • Conflitos: :conflicted', [
                'account'    => $this->account->name,
                'new'        => $this->import->new_count,
                'matched'    => $this->import->matched_count,
                'conflicted' => $this->import->conflicted_count,
            ]),
            'import_id'        => $this->import->id,
            'account_id'       => $this->account->id,
            'new_count'        => $this->import->new_count,
            'matched_count'    => $this->import->matched_count,
            'conflicted_count' => $this->import->conflicted_count,
        ];
    }
}
