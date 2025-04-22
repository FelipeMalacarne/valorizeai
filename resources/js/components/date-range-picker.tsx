import * as React from "react";
import { addDays, addHours, endOfDay, format, startOfDay } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import { Calendar } from "./ui/calendar";
import { Separator } from "./ui/separator";

type DatePreset = {
    label: string;
    from: Date;
    to: Date;
};

const presets = [
    {
        label: "Today",
        from: startOfDay(new Date()),
        to: endOfDay(new Date()),
    },
    {
        label: "Yesterday",
        from: startOfDay(addDays(new Date(), -1)),
        to: endOfDay(addDays(new Date(), -1)),
    },
    {
        label: "Last 7 days",
        from: startOfDay(addDays(new Date(), -7)),
        to: endOfDay(new Date()),
    },
    {
        label: "Last 14 days",
        from: startOfDay(addDays(new Date(), -14)),
        to: endOfDay(new Date()),
    },
    {
        label: "Last 30 days",
        from: startOfDay(addDays(new Date(), -30)),
        to: endOfDay(new Date()),
    },
    {
        label: "Last 90 days",
        from: startOfDay(addDays(new Date(), -90)),
        to: endOfDay(new Date()),
    },
    {
        label: "Last year",
        from: startOfDay(addDays(new Date(), -365)),
        to: endOfDay(new Date()),
    },
] satisfies DatePreset[];

export function DatePickerWithRange({
    date,
    setDate,
}: {
    date?: DateRange;
    setDate: (date: DateRange | undefined) => void;
}) {
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    id="date"
                    variant={"outline"}
                    className={cn(
                        "h-8 justify-start text-left font-normal",
                        !date && "text-muted-foreground",
                    )}
                >
                    <CalendarIcon />
                    {date?.from ? (
                        date.to ? (
                            <>
                                {format(date.from, "LLL dd, y")} -{" "}
                                {format(date.to, "LLL dd, y")}
                            </>
                        ) : (
                            format(date.from, "LLL dd, y")
                        )
                    ) : (
                        <span>Selecione a data</span>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
                <div className="flex justify-between">
                    <DatePresets
                        onSelect={setDate}
                        selected={date}
                        presets={presets}
                    />
                    <Separator
                        orientation="vertical"
                        className="h-auto w-[px]"
                    />
                    <Calendar
                        initialFocus
                        mode="range"
                        defaultMonth={date?.from}
                        selected={date}
                        onSelect={setDate}
                        numberOfMonths={2}
                    />
                </div>
            </PopoverContent>
        </Popover>
    );
}

function DatePresets({
    selected,
    onSelect,
    presets,
}: {
    selected: DateRange | undefined;
    onSelect: (date: DateRange | undefined) => void;
    presets: DatePreset[];
}) {
    return (
        <div className="flex flex-col gap-2 p-3">
            <p className="mx-3 text-xs uppercase text-muted-foreground">
                Date Range
            </p>
            <div className="grid gap-1">
                {presets.map(({ label, from, to }) => {
                    const isActive =
                        selected?.from === from && selected?.to === to;
                    return (
                        <Button
                            key={label}
                            variant={isActive ? "outline" : "ghost"}
                            size="sm"
                            onClick={() => onSelect({ from, to })}
                            className={cn(
                                "flex items-center justify-between gap-6",
                                !isActive && "border border-transparent",
                            )}
                        >
                            <span className="mr-auto">{label}</span>
                        </Button>
                    );
                })}
                {/* clear range */}
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onSelect({ from: undefined, to: undefined })}
                    className="flex items-center justify-between gap-6"
                >
                    <span className="mr-auto">Clear</span>
                </Button>
            </div>
        </div>
    );
}
