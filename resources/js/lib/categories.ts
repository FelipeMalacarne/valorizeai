import { cva } from 'class-variance-authority';

export const categoryBadgeVariants = cva('cursor-pointer', {
    variants: {
        color: {
            lavender: 'text-lavender bg-lavender/10 border-lavender/50 hover:bg-lavender/30',
            blue: 'text-blue bg-blue/10 border-blue/50 hover:bg-blue/30',
            green: 'text-green bg-green/10 border-green/50 hover:bg-green/30',
            yellow: 'text-yellow bg-yellow/10 border-yellow/50 hover:bg-yellow/30',
            red: 'text-red bg-red/10 border-red/50 hover:bg-red/30',
            rosewater: 'text-rosewater bg-rosewater/10 border-rosewater/50 hover:bg-rosewater/30',
            flamingo: 'text-flamingo bg-flamingo/10 border-flamingo/50 hover:bg-flamingo/30',
            pink: 'text-pink bg-pink/10 border-pink/50 hover:bg-pink/30',
            mauve: 'text-mauve bg-mauve/10 border-mauve/50 hover:bg-mauve/30',
            maroon: 'text-maroon bg-maroon/10 border-maroon/50 hover:bg-maroon/30',
            peach: 'text-peach bg-peach/10 border-peach/50 hover:bg-peach/30',
            teal: 'text-teal bg-teal/10 border-teal/50 hover:bg-teal/30',
            sky: 'text-sky bg-sky/10 border-sky/50 hover:bg-sky/30',
            sapphire: 'text-sapphire bg-sapphire/10 border-sapphire/50 hover:bg-sapphire/30',
        },
    },
});
