import { Table } from "@tanstack/react-table";
import { Settings2 } from "lucide-react";

import { Button } from "./ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Command, CommandItem, CommandList } from "./ui/command";
import { Checkbox } from "./ui/checkbox";

interface DataTableViewOptionsProps<TData> {
    table: Table<TData>;
}

export function DataTableViewOptions<TData>({
    table,
}: DataTableViewOptionsProps<TData>) {
    return (
        <>
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                    >
                        <Settings2 />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0" align="start">
                    <Command>
                        <CommandList>
                            {table
                                .getAllColumns()
                                .filter(
                                    (column) =>
                                        typeof column.accessorFn !==
                                            "undefined" && column.getCanHide(),
                                )
                                .map((column) => {
                                    const isVisible = column.getIsVisible();
                                    return (
                                        <CommandItem
                                            key={column.id}
                                            className="capitalize"
                                            onSelect={() => {
                                                if (isVisible) {
                                                    column.toggleVisibility(
                                                        false,
                                                    );
                                                } else {
                                                    column.toggleVisibility(
                                                        true,
                                                    );
                                                }
                                            }}
                                        >
                                            <Checkbox
                                                checked={column.getIsVisible()}
                                            />
                                            <span>{column.id} </span>
                                        </CommandItem>
                                    );
                                })}
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
        </>
    );
}
