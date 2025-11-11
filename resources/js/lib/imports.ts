import { BadgeProps } from '@/components/ui/badge';

type StatusMeta = {
    label: string;
    className: string;
};

type BadgeMeta = StatusMeta & {
    variant?: BadgeProps['variant'];
};

const importStatusMap: Record<App.Enums.ImportStatus, BadgeMeta> = {
    processing: { label: 'Processando', className: 'bg-muted text-muted-foreground' },
    pending_review: { label: 'Pendente de revisão', className: 'bg-primary/10 text-primary' },
    approved: { label: 'Aprovado', className: 'bg-green/10 text-green' },
    refused: { label: 'Recusado', className: 'bg-destructive/10 text-destructive' },
    completed: { label: 'Concluído', className: 'bg-green/10 text-green' },
    failed: { label: 'Falhou', className: 'bg-destructive/10 text-destructive' },
};

const importTransactionStatusMap: Record<App.Enums.ImportTransactionStatus, BadgeMeta> = {
    pending: { label: 'Pendente', className: 'bg-muted text-muted-foreground' },
    matched: { label: 'Conciliada', className: 'bg-blue/10 text-blue' },
    conflicted: { label: 'Conflito', className: 'bg-peach/10 text-peach' },
    refused: { label: 'Recusada', className: 'bg-destructive/10 text-destructive' },
    new: { label: 'Nova', className: 'bg-primary/10 text-primary' },
    approved: { label: 'Aprovada', className: 'bg-green/10 text-green' },
    rejected: { label: 'Rejeitada', className: 'bg-destructive/10 text-destructive' },
};

export const getImportStatusMeta = (status: App.Enums.ImportStatus): BadgeMeta => {
    return importStatusMap[status] ?? { label: status, className: 'bg-muted text-foreground' };
};

export const getImportTransactionStatusMeta = (status: App.Enums.ImportTransactionStatus): BadgeMeta => {
    return importTransactionStatusMap[status] ?? { label: status, className: 'bg-muted text-foreground' };
};
