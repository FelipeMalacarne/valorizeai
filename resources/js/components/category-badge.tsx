import { Category, Color } from "@/types";
import { Badge } from "./ui/badge";

const badgeVariants = {
    lavender:
        "text-lavender bg-lavender/30 border-lavender/50 hover:bg-lavender/10",
    blue: "text-blue bg-blue/30 border-blue/50 hover:bg-blue/10",
    green: "text-green bg-green/30 border-green/50 hover:bg-green/10",
    yellow: "text-yellow bg-yellow/30 border-yellow/50 hover:bg-yellow/10",
    red: "text-red bg-red/50 border-red/50 hover:bg-red/10",
    rosewater:
        "text-rosewater bg-rosewater/30 border-rosewater/50 hover:bg-rosewater/10",
    flamingo:
        "text-flamingo bg-flamingo/30 border-flamingo/50 hover:bg-flamingo/10",
    pink: "text-pink bg-pink/30 border-pink/50 hover:bg-pink/10",
    mauve: "text-mauve bg-mauve/30 border-mauve/50 hover:bg-mauve/10",
    maroon: "text-maroon bg-maroon/30 border-maroon/50 hover:bg-maroon/10",
    peach: "text-peach bg-peach/30 border-peach/50 hover:bg-peach/10",
    teal: "text-teal bg-teal/30 border-teal/50 hover:bg-teal/10",
    sky: "text-sky bg-sky/30 border-sky/50 hover:bg-sky/10",
    sapphire:
        "text-sapphire bg-sapphire/30 border-sapphire/50 hover:bg-sapphire/10",
} as { [key in Color]: string };
const CategoryBadge = ({ category, ...props }: { category: Category }) => {
    return (
        <Badge {...props} className={badgeVariants[category.color]}>
            {category.name}
        </Badge>
    );
};

export { CategoryBadge, badgeVariants };
