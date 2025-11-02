import InputError from '@/components/input-error';
import { Combobox } from '@/components/combobox';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from '@inertiajs/react';
import { FormEventHandler, useEffect } from 'react';

type CreateBudgetFormProps = {
    categories: App.Http.Resources.CategoryResource[];
    onClose: () => void;
};

export const CreateBudgetForm = ({ categories, onClose }: CreateBudgetFormProps) => {
    const { data, setData, post, processing, errors, reset } = useForm({
        category_id: '',
        name: '',
    });

    useEffect(() => {
        if (!processing) {
            reset('category_id');
        }
    }, [categories.length]);

    const submit: FormEventHandler<HTMLFormElement> = (event) => {
        event.preventDefault();

        post(route('budgets.store'), {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                onClose();
            },
        });
    };

    const isEmpty = categories.length === 0;

    return (
        <form className="space-y-4" onSubmit={submit}>
            <div className="space-y-2">
                <Label htmlFor="category_id">Categoria</Label>
                <Combobox
                    disabled={isEmpty}
                    placeholder={isEmpty ? 'Todas as categorias já possuem orçamento' : 'Selecione uma categoria'}
                    value={data.category_id}
                    onChange={(value) => setData('category_id', value ?? '')}
                    items={categories.map((category) => ({
                        value: category.id,
                        label: category.name,
                        ...category,
                    }))}
                />
                <InputError message={errors.category_id} />
            </div>

            <div className="space-y-2">
                <Label htmlFor="name">Nome do orçamento (opcional)</Label>
                <Input
                    id="name"
                    value={data.name}
                    onChange={(event) => setData('name', event.target.value)}
                    placeholder="Ex: Mercado, Alimentação..."
                />
                <InputError message={errors.name} />
            </div>

            <Button type="submit" className="w-full" disabled={processing || isEmpty || !data.category_id}>
                Criar orçamento
            </Button>
        </form>
    );
};
