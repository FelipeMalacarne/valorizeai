import { cn } from '@/lib/utils';
import { type VariantProps } from 'class-variance-authority';
import { Badge } from './ui/badge';
import { categoryBadgeVariants } from '@/lib/categories';

interface CategoryBadgeProps extends React.ComponentPropsWithoutRef<typeof Badge>, VariantProps<typeof categoryBadgeVariants> {
    category: App.Http.Resources.CategoryResource;
}

const CategoryBadge = ({ category, className, ...props }: CategoryBadgeProps) => {
    return (
        <Badge {...props} className={cn(categoryBadgeVariants({ color: category.color }), className)}>
            {category.name}
        </Badge>
    );
};

export { CategoryBadge };
