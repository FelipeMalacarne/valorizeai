import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useState } from 'react';
// import { ManualTab } from "./manual-tab";

export const AddTransactionCard = () => {
    const [open, setOpen] = useState<boolean>(false);

    return (
        <Card>
            <CardHeader className="pb-3">
                <CardTitle>Suas Transações</CardTitle>
                <CardDescription className="max-w-lg leading-relaxed text-balance">
                    Adicione suas transações para ter um controle financeiro mais preciso.
                </CardDescription>
            </CardHeader>
            <CardFooter>
                <Sheet open={open} onOpenChange={setOpen}>
                    <SheetTrigger asChild>
                        <Button>Adicione Transações</Button>
                    </SheetTrigger>
                    <SheetContent>
                        <SheetHeader>
                            <SheetTitle>Adicionar novas Transações</SheetTitle>
                            <SheetDescription>Adicione novas transações ao seu painel, utilizando um dos métodos abaixo.</SheetDescription>
                        </SheetHeader>

                        <Separator className="my-4" />

                        <Tabs defaultValue="manual">
                            <TabsList>
                                <TabsTrigger value="manual">Manual</TabsTrigger>
                                <TabsTrigger value="ofx"> Ofx</TabsTrigger>
                                <TabsTrigger value="csv">Csv</TabsTrigger>
                            </TabsList>
                            {/* <OfxTab close={() => setOpen(false)} /> */}
                            {/* <ManualTab close={() => setOpen(false)} /> */}
                        </Tabs>
                    </SheetContent>
                </Sheet>
            </CardFooter>
        </Card>
    );
};
