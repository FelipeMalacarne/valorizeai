import { CreditCard, PiggyBank, TrendingUp, Wallet } from 'lucide-react';

export const getAccountTypeColor = (type: App.Enums.AccountType) => {
    switch (type) {
        case 'checking':
            return 'bg-chart-2/10 text-chart-2 border-chart-2/20';
        case 'savings':
            return 'bg-chart-3/10 text-chart-3 border-chart-3/20';
        case 'credit':
            return 'bg-chart-4/10 text-chart-4 border-chart-4/20';
        case 'investment':
            return 'bg-chart-5/10 text-chart-5 border-chart-5/20';
        default:
            return 'bg-chart-1/10 text-chart-1 border-chart-1/20';
    }
};

export const getAccountIcon = (type: App.Enums.AccountType) => {
    switch (type) {
        case 'checking':
            return Wallet;
        case 'savings':
            return PiggyBank;
        case 'credit':
            return CreditCard;
        case 'investment':
            return TrendingUp;
        default:
            return Wallet;
    }
};