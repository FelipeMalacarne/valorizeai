import * as React from 'react';
import { SidebarInset } from './ui/sidebar';


interface AppContentProps extends React.ComponentProps<'main'> {
    variant?: 'header' | 'sidebar';
    children?: React.ReactNode;
}

function AppContent({ variant = 'header', children, ...props }: AppContentProps) {
    if (variant === 'sidebar') {
        const { ref: _ref, ...restProps } = props;
        return <SidebarInset {...restProps}>{children}</SidebarInset>;
    }

    return (
        <main className="mx-auto flex h-full w-full max-w-7xl flex-1 flex-col gap-4 rounded-xl" {...props}>
            {children}
        </main>
    );
}

export default AppContent;
