import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/Components/ui/form";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod"
import { router } from "@inertiajs/react";
import { toast, useToast } from "@/hooks/use-toast";
import { Button } from "@/Components/ui/button";
import { useForm } from "react-hook-form";
import { ErrorResponse, PageProps } from "@/types";
import { Input } from "@/Components/ui/input";
import { Textarea } from "@/Components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select";
import { ColorSquare } from "./Components/ColorSquare";
import axios from "axios";

const FormSchema = z.object({
  name: z.string().min(3).max(255),
  description: z.string().min(0).max(255).optional(),
  color: z.string(),
  number: z.string().optional(),
  bank_id: z.string().min(3).max(3).optional()
});

export default function Create({
    colors,
}: PageProps<{
    colors: string[]
}>) {
    const { toast } = useToast()

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
    })

    async function onSubmit(values: z.infer<typeof FormSchema>) {
        try {
            const response = await axios('/accounts', {
                method: 'POST',
                data: {
                    name: values.name,
                    description: values.description,
                    color: values.color,
                    number: values.number,
                    bank_id: values.bank_id,
                },
            })

            toast({
                title: 'Successo',
                description: response.data.message,
            })
        } catch (error: any) {
            const errorResponse: ErrorResponse = error.response.data
            toast({
                title: 'Error',
                description: errorResponse.message,
                variant: 'destructive'
            })
        }
    }

    return (
        <div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-3xl mx-auto py-10">

                    <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Nome da conta</FormLabel>
                        <FormControl>
                            <Input
                            placeholder="Conta Salário"

                            type="text"
                            {...field} />
                        </FormControl>
                        <FormDescription>Um nome para identificar facilmente esta conta (ex: "Conta Corrente", "Poupança Família").</FormDescription>
                        <FormMessage />
                        </FormItem>
                    )}
                    />

                    <FormField
                        name="description"
                        control={form.control}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    Descricão:
                                </FormLabel>
                                <Textarea
                                    placeholder="Descrição"
                                    className="resize-none"
                                    {...field}
                                />
                                <FormDescription>
                                    Este campo é opcional.
                                    Pode ser usado explicar melhor a finalidade da conta.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="grid grid-cols-4 md:grid-cols-12 gap-4">

                        <div className="col-span-4">
                            <FormField
                                name="color"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Cor da conta</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Selecione uma Cor" />
                                                </SelectTrigger>

                                            </FormControl>
                                            <SelectContent>
                                                {colors.map((color) => (
                                                    <SelectItem key={color} value={color}>
                                                        <ColorSquare color={color} />
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                            <FormMessage />
                                        </Select>
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="col-span-4">
                            <FormField
                            control={form.control}
                            name="number"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Número da conta</FormLabel>
                                    <FormControl>
                                        <Input
                                        placeholder="00000000-0"
                                        type="number"
                                        {...field} />
                                    </FormControl>

                                    <FormMessage />
                                </FormItem>
                            )}/>
                        </div>


                        <div className="col-span-4">
                            <FormField
                            control={form.control}
                            name="bank_id"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Banco</FormLabel>
                                    <FormControl>
                                        <Input
                                        placeholder="000"

                                        type="number"
                                        {...field} />
                                    </FormControl>

                                    <FormMessage />
                                </FormItem>
                            )}/>
                        </div>

                    </div>

                    <Button type="submit">Adicionar</Button>

                </form>
            </Form>
        </div>
    );
}


Create.layout = (page: any) => (
    <AuthenticatedLayout
        children={page}
        breadcrumbs={[
            { label: 'Contas Bancárias', href: route('accounts.index') },
            { label: 'Criar Nova Conta', href: route('accounts.create') },
        ]}
    />
);
