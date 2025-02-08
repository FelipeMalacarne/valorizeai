import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/Components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePage } from "@inertiajs/react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/Components/ui/button";
import { useForm } from "react-hook-form";
import { ErrorResponse, PageProps } from "@/types";
import { Input } from "@/Components/ui/input";
import { Textarea } from "@/Components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import axios from "axios";
import { ColorSquare } from "./ColorSquare";
import { AccountIndexProps } from "../Index";

const FormSchema = z.object({
    name: z
        .string()
        .min(3, "O nome da conta deve ter no mínimo 3 caracteres")
        .max(255, "O nome da conta deve ter no máximo 255 caracteres"),
    description: z
        .string()
        .min(0)
        .max(255, "A descrição da conta deve ter no máximo 255 caracteres")
        .optional(),
    color: z.string(),
    number: z.string().optional(),
    bank_id: z.string().length(3, "O código do banco deve ter 3 caracteres"),
});

export default function CreateAccountForm({
    setIsOpen,
}: {
    setIsOpen: (isOpen: boolean) => void;
}) {
    const { toast } = useToast();
    const { props } = usePage<PageProps<AccountIndexProps>>();

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            name: "",
            description: "",
            color: "",
            number: "",
            bank_id: "",
        },
    });

    async function onSubmit(values: z.infer<typeof FormSchema>) {
        try {
            const response = await axios("/accounts", {
                method: "POST",
                data: {
                    name: values.name,
                    description: values.description,
                    color: values.color,
                    number: values.number,
                    bank_id: values.bank_id,
                },
            });

            toast({
                title: "Successo",
                description: response.data.message,
            });

            setIsOpen(false);
        } catch (error: any) {
            const errorResponse: ErrorResponse = error.response.data;
            toast({
                title: "Error",
                description: errorResponse.message,
                variant: "destructive",
            });
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
                                    {...field}
                                />
                            </FormControl>
                            <FormDescription>
                                Um nome para identificar facilmente esta conta
                                (ex: "Conta Corrente", "Poupança Família").
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    name="description"
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Descricão:</FormLabel>
                            <Textarea
                                placeholder="Conta para receber o salário mensal"
                                className="resize-none"
                                {...field}
                            />
                            <FormDescription>
                                Este campo é opcional. Pode ser usado explicar
                                melhor a finalidade da conta.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    name="color"
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Cor da conta</FormLabel>
                            <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                            >
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecione uma Cor" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {props.colors.map((color) => (
                                        <SelectItem key={color} value={color}>
                                            <ColorSquare color={color} />
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                                <FormDescription>
                                    Selecione uma cor para representar
                                    visualmente esta conta.
                                </FormDescription>
                                <FormMessage />
                            </Select>
                        </FormItem>
                    )}
                />
                <div className="grid grid-cols-12 gap-6">
                    <div className="col-span-9">
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
                                            {...field}
                                        />
                                    </FormControl>

                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="col-span-3">
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
                                            {...field}
                                        />
                                    </FormControl>

                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </div>

                <Button type="submit">Adicionar</Button>
            </form>
        </Form>
    );
}
