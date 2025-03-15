import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { useState } from "react";
import { Landmark, Plus } from "lucide-react";
import CreateAccountForm from "./create-account-form";

export default function CreateAccountSheet() {
    const [isOpen, setIsOpen] = useState<boolean>(false);

    return (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
                <Button
                    className="self-center"
                    onClick={() => setIsOpen(true)}
                    size={"icon"}
                >
                    <Plus className="w-6 h-6" />
                </Button>
            </SheetTrigger>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>Adicionar nova conta</SheetTitle>
                    <SheetDescription>
                        Adicione uma nova conta bancária, preenchendo os campos
                        abaixo.
                    </SheetDescription>
                </SheetHeader>
                <Separator className="my-4" />
                <CreateAccountForm setIsOpen={setIsOpen} />
            </SheetContent>
        </Sheet>
    );
}
