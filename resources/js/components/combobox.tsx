import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useIsMobile } from '@/hooks/use-mobile';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

export type ComboboxItem = {
    value: any;
    label: string;
};

export function Combobox<T extends ComboboxItem>({
    items,
    value,
    onChange,
    placeholder = 'Selecione um item',
    searchPlaceholder = 'Busca...',
    noResultsText = 'Nenhum resultado encontrado.',
    renderItem,
    disabled = false,
}: {
    items: T[];
    value: any;
    onChange: (value: any) => void;
    placeholder?: string;
    searchPlaceholder?: string;
    noResultsText?: string;
    className?: string;
    renderItem?: (item: T) => React.ReactNode;
    disabled?: boolean
}) {
    const [open, setOpen] = useState(false);
    const isDesktop = !useIsMobile();

    const selected = items.find((item) => item.value === value) || null;

    const itemList = (
        <Command>
            <CommandInput disabled={disabled} placeholder={searchPlaceholder} />
            <CommandList>
                <CommandEmpty>{noResultsText}</CommandEmpty>
                <CommandGroup>
                    {items.map((item) => (
                        <CommandItem
                            key={item.value}
                            value={item.label}
                            onSelect={() => {
                                onChange(item.value === value ? '' : item.value);
                                setOpen(false);
                            }}
                        >
                            {renderItem ? renderItem(item) : item.label}
                        </CommandItem>
                    ))}
                </CommandGroup>
            </CommandList>
        </Command>
    );

    if (isDesktop) {
        return (
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild disabled={disabled}>
                    <Button variant="outline" className="w-full justify-between truncate">
                        <span className="truncate">{selected ? selected.label : placeholder}</span>
                        <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="p-0" align="start">
                    {itemList}
                </PopoverContent>
            </Popover>
        );
    }

    return (
        <Drawer open={open} onOpenChange={setOpen}>
            <DrawerTrigger asChild disabled={disabled}>
                <Button variant="outline" className="w-full justify-between truncate">
                    <span className="truncate">{selected ? selected.label : placeholder}</span>
                    <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </DrawerTrigger>
            <DrawerContent>
                <div className="mt-4 border-t">{itemList}</div>
            </DrawerContent>
        </Drawer>
    );
}
