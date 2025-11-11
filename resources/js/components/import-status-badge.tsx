import { Badge } from '@/components/ui/badge';
import { getImportStatusMeta } from '@/lib/imports';
import { cn } from '@/lib/utils';

interface ImportStatusBadgeProps {
    status: App.Enums.ImportStatus;
    className?: string;
}

export const ImportStatusBadge = ({ status, className }: ImportStatusBadgeProps) => {
    const meta = getImportStatusMeta(status);

    return (
        <Badge variant="outline" className={cn('font-medium capitalize', meta.className, className)}>
            {meta.label}
        </Badge>
    );
};
