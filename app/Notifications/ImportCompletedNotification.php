<?php

declare(strict_types=1);

namespace App\Notifications;

use App\Models\Account;
use App\Models\Import;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\BroadcastMessage;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Support\Str;
use Illuminate\Notifications\Notification;

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
            ->subject(__('Importação concluída'))
            ->greeting(__('Olá :name', ['name' => $notifiable->name]))
            ->line(
                __('Sua importação para a conta :account foi concluída.', [
                    'account' => $this->account->name,
                ])
            )
            ->line(
                __('Novos lançamentos: :count', [
                    'count' => $this->import->new_count,
                ])
            )
            ->line(
                __('Transações conciliadas: :count', [
                    'count' => $this->import->matched_count,
                ])
            )
            ->line(
                __('Transações com conflito: :count', [
                    'count' => $this->import->conflicted_count,
                ])
            )
            ->action(__('Ver detalhes'), url('/imports'))
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
            'title' => __('Importação concluída'),
            'body'  => __('Conta :account • Novos: :new • Conciliados: :matched • Conflitos: :conflicted', [
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
