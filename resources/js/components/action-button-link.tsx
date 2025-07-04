import { Link } from '@inertiajs/react';
import { Edit, Eye, Plus, Trash } from 'lucide-react';
import { Button } from './ui/button';

type Action = 'create' | 'edit' | 'show' | 'delete';

type ActionButtonSize = 'default' | 'sm' | 'lg' | 'icon';

type ActionButtonParts = Record<
    Action,
    {
        icon: React.ReactNode;
        text: string;
    }
>;

const parts: ActionButtonParts = {
    create: {
        icon: <Plus />,
        text: 'Criar',
    },
    edit: {
        icon: <Edit />,
        text: 'Editar',
    },
    show: {
        icon: <Eye />,
        text: 'Visualizar',
    },
    delete: {
        icon: <Trash />,
        text: 'Excluir',
    },
};

export function ActionButtonLink({
    action,
    href,
    prefetch = false,
    size = 'default',
    className = '',
}: {
    action: Action;
    href: string;
    prefetch?: boolean;
    size?: ActionButtonSize;
    className?: string;
}) {
    return (
        <Button className={className} size={size} asChild>
            <Link href={href} prefetch={prefetch}>
                {parts[action].icon}
                {size !== 'icon' && <span>{parts[action].text}</span>}
            </Link>
        </Button>
    );
}
