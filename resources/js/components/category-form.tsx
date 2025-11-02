import { useForm } from '@inertiajs/react';
import { FormEventHandler, useMemo } from 'react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { CATEGORY_COLOR_SWATCHES } from '@/lib/category-colors';

type AvailableColorOption = {
    value: App.Enums.Color;
    label: string;
};

type CategoryFormProps = {
    category?: App.Http.Resources.CategoryResource;
    usedColors: App.Enums.Color[];
    availableColors: AvailableColorOption[];
    onSuccess?: () => void;
};

export const CategoryForm = ({ category, usedColors, availableColors, onSuccess }: CategoryFormProps) => {
    const isEditing = !!category;
    const disabledColors = useMemo(() => {
        const values = new Set(usedColors);
        if (isEditing && category) {
            values.delete(category.color);
        }

        return values;
    }, [usedColors, isEditing, category]);

    const defaultColor = (availableColors[0]?.value ?? 'red') as App.Enums.Color;

    const { data, setData, post, patch, processing, errors, reset } = useForm({
        name: category?.name ?? '',
        description: category?.description ?? '',
        color: category?.color ?? defaultColor,
        is_default: category?.is_default ?? false,
    });

    const submit: FormEventHandler = (event) => {
        event.preventDefault();

        const options = {
            onSuccess: () => {
                reset();
                onSuccess?.();
            },
        };

        if (isEditing && category) {
            patch(route('categories.update', category.id), options);
        } else {
            post(route('categories.store'), options);
        }
    };

    return (
        <form className="space-y-6" onSubmit={submit}>
            <div className="space-y-2">
                <Label htmlFor="name">Nome</Label>
                <Input
                    id="name"
                    value={data.name}
                    onChange={(event) => setData('name', event.target.value)}
                    placeholder="Nome da categoria"
                    autoFocus
                />
                <InputError message={errors.name} />
            </div>

            <div className="space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                    id="description"
                    value={data.description ?? ''}
                    onChange={(event) => setData('description', event.target.value)}
                    placeholder="Descreva quando utilizar esta categoria."
                    rows={3}
                />
                <InputError message={errors.description} />
            </div>

            <div className="space-y-2">
                <Label htmlFor="color">Cor</Label>
                <Select
                    value={data.color}
                    onValueChange={(value: App.Enums.Color) => setData('color', value)}
                >
                    <SelectTrigger id="color" className="w-full">
                        <SelectValue placeholder="Selecione uma cor" />
                    </SelectTrigger>
                    <SelectContent>
                        {availableColors.map((option) => {
                            const isDisabled = disabledColors.has(option.value);
                            return (
                                <SelectItem
                                    key={option.value}
                                    value={option.value}
                                    disabled={isDisabled}
                                >
                                    <span className={`inline-flex items-center gap-2 ${isDisabled ? 'opacity-50' : ''}`}>
                                        <span
                                            className={`inline-flex h-2.5 w-2.5 rounded-full border border-border ${CATEGORY_COLOR_SWATCHES[option.value]}`}
                                        />
                                        {option.label}
                                    </span>
                                </SelectItem>
                            );
                        })}
                    </SelectContent>
                </Select>
                <InputError message={errors.color} />
            </div>

            <div className="flex justify-end gap-2">
                <Button type="submit" disabled={processing}>
                    {isEditing ? 'Salvar alterações' : 'Criar categoria'}
                </Button>
            </div>
        </form>
    );
};
