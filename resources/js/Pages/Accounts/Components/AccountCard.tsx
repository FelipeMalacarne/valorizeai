import { Button } from "@/Components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/Components/ui/card";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { Account } from "@/types";
import { Landmark, MoreHorizontal } from "lucide-react";

export function AccountCard({ account }: { account: Account }) {
    const colors = {
        rosewater: "bg-rosewater",
        flamingo: "bg-flamingo",
        pink: "bg-pink",
        mauve: "bg-mauve",
        red: "bg-red",
        maroon: "bg-maroon",
        peach: "bg-peach",
        yellow: "bg-yellow",
        green: "bg-green",
        teal: "bg-teal",
        sky: "bg-sky",
        sapphire: "bg-sapphire",
        blue: "bg-blue",
        lavender: "bg-lavender",
    };

    return (
        <Card className="w-80 hover:shadow-lg transition-shadow">
            <CardTitle>
                <div
                    className={`relative w-full flex justify-center align-middle p-4 py-8 rounded-t-lg bg-${account.color}`}
                >
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                size="icon"
                                variant="ghost"
                                className="h-8 w-8 absolute top-2 right-2 hover:bg-opacity-10"
                            >
                                <MoreHorizontal
                                    className={`text-background/50`}
                                />
                                <span className="sr-only">More</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => console.log(true)}>
                                Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem>Exportar</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => console.log(true)}>
                                Excluir
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <Landmark size={64} className={`text-background/50`} />
                </div>
            </CardTitle>

            <CardHeader>
                <CardTitle className="text-ellipsis line-clamp-1">
                    {account.name}
                </CardTitle>

                <CardDescription
                    className={
                        "h-24 text-ellipsis overflow-hidden line-clamp-5"
                    }
                >
                    {account.description}
                </CardDescription>
            </CardHeader>

            <CardContent className="mt-auto grid grid-cols-2 grid-rows-1">
                <p className="text-sm/10 font-medium text-ellipsis">
                    {account.number}
                </p>

                <p className="text-sm/10 font-medium text-ellipsis line-clamp-1 justify-self-end">
                    {account.type}
                </p>
            </CardContent>
        </Card>
    );
}
