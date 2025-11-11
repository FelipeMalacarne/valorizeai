import { Badge } from '@/components/ui/badge';
import { getImportTransactionStatusMeta } from '@/lib/imports';
import { cn } from '@/lib/utils';

interface ImportTransactionStatusBadgeProps {
    status: App.Enums.ImportTransactionStatus;
    className?: string;
}

export const ImportTransactionStatusBadge = ({ status, className }: ImportTransactionStatusBadgeProps) => {
    const meta = getImportTransactionStatusMeta(status);

    return (
        <Badge variant="outline" className={cn('font-medium capitalize', meta.className, className)}>
            {meta.label}
        </Badge>
    );
};
