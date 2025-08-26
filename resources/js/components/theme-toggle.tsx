import { Button } from '@/components/ui/button';
import { useAppearance } from '@/hooks/use-appearance';
import { cn } from '@/lib/utils';
import { Moon, Sun } from 'lucide-react';

export function ThemeToggle({ className, ...props }: React.HTMLAttributes<HTMLButtonElement>) {
    const { appearance, updateAppearance } = useAppearance();

    const handleToggle = () => {
        return appearance === 'light' ? updateAppearance('dark') : updateAppearance('light');
    };

    return (
        <Button variant="ghost" size="icon" onClick={handleToggle} className={cn(className)} {...props}>
            <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
            <span className="sr-only">Toggle theme</span>
        </Button>
    );
}
