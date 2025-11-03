import { Head, Link, useForm } from '@inertiajs/react';
import { useMemo, useState } from 'react';

import { CategoryForm } from '@/components/category-form';
import { CategoryBadge } from '@/components/category-badge';
import { ConfirmDialog } from '@/components/confirm-dialog';
import { ResponsiveDialog } from '@/components/responsive-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { CATEGORY_COLOR_SWATCHES } from '@/lib/category-colors';
import { BreadcrumbItem, SharedData } from '@/types';
import { Pencil, Plus, Trash2, Eye } from 'lucide-react';

type CategoriesIndexProps = {
    categories: App.Http.Resources.CategoryResource[];
    available_colors: Array<{ value: App.Enums.Color; label: string }>;
};

const CategoriesIndex = (props: SharedData<CategoriesIndexProps>) => {
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<App.Http.Resources.CategoryResource | null>(null);
    const [categoryPendingDeletion, setCategoryPendingDeletion] = useState<App.Http.Resources.CategoryResource | null>(null);

    const deleteForm = useForm({});

    const usedColors = useMemo(() => props.categories.map((category) => category.color), [props.categories]);

    const handleDelete = () => {
        if (!categoryPendingDeletion) {
            return;
        }

        deleteForm.delete(route('categories.destroy', categoryPendingDeletion.id), {
            preserveScroll: true,
            onSuccess: () => setCategoryPendingDeletion(null),
        });
    };

    return (
        <>
            <Head title="Categorias" />
            <div className="container mx-auto flex h-full flex-1 flex-col space-y-6 p-4">
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <CardTitle>Categorias</CardTitle>
                                <CardDescription>
                                    Organize suas transações em categorias personalizadas.
                                </CardDescription>
                            </div>
                            <Button onClick={() => setIsCreateDialogOpen(true)}>
                                <Plus className="mr-2 h-4 w-4" />
                                Nova categoria
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Nome</TableHead>
                                    <TableHead>Cor</TableHead>
                                    <TableHead>Descrição</TableHead>
                                    <TableHead>Tipo</TableHead>
                                    <TableHead className="text-right">Ações</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {props.categories.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="py-10 text-center text-muted-foreground">
                                            Nenhuma categoria cadastrada ainda. Comece criando uma nova categoria.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    props.categories.map((category) => (
                                        <TableRow key={category.id}>
                                            <TableCell className="font-medium">
                                                <CategoryBadge category={category} />
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <span
                                                        className={`inline-flex h-3 w-3 rounded-full border border-border ${CATEGORY_COLOR_SWATCHES[category.color]}`}
                                                    />
                                                    <span className="capitalize">{category.color}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                {category.description
                                                    ? <span className="text-sm text-muted-foreground">{category.description}</span>
                                                    : <span className="text-sm text-muted-foreground italic">Sem descrição</span>}
                                            </TableCell>
                                            <TableCell>
                                                {category.is_default ? (
                                                    <Badge variant="secondary">Padrão</Badge>
                                                ) : (
                                                    <Badge variant="outline">Personalizada</Badge>
                                                )}
                                            </TableCell>
                                            <TableCell className="flex justify-end gap-2">
                                                <Button variant="ghost" size="icon" onClick={() => setEditingCategory(category)}>
                                                    <Pencil className="h-4 w-4" />
                                                    <span className="sr-only">Editar</span>
                                                </Button>
                                                <Button variant="ghost" size="icon" asChild>
                                                    <Link href={route('categories.show', category.id)} prefetch>
                                                        <Eye className="h-4 w-4" />
                                                        <span className="sr-only">Visualizar</span>
                                                    </Link>
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => setCategoryPendingDeletion(category)}
                                                    disabled={deleteForm.processing}
                                                >
                                                    <Trash2 className="h-4 w-4 text-destructive" />
                                                    <span className="sr-only">Excluir</span>
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>

            <ResponsiveDialog
                title="Nova categoria"
                description="Crie uma nova categoria com nome, cor e descrição."
                isOpen={isCreateDialogOpen}
                setIsOpen={setIsCreateDialogOpen}
            >
                <CategoryForm
                    usedColors={usedColors}
                    availableColors={props.available_colors}
                    onSuccess={() => setIsCreateDialogOpen(false)}
                />
            </ResponsiveDialog>

            <ResponsiveDialog
                title="Editar categoria"
                description="Atualize as informações desta categoria."
                isOpen={!!editingCategory}
                setIsOpen={(open) => {
                    if (!open) {
                        setEditingCategory(null);
                    }
                }}
            >
                {editingCategory ? (
                    <CategoryForm
                        category={editingCategory}
                        usedColors={usedColors}
                        availableColors={props.available_colors}
                        onSuccess={() => setEditingCategory(null)}
                    />
                ) : null}
            </ResponsiveDialog>

            <ConfirmDialog
                open={!!categoryPendingDeletion}
                onOpenChange={(open) => {
                    if (!open) {
                        setCategoryPendingDeletion(null);
                    }
                }}
                title="Remover categoria"
                description="Tem certeza de que deseja remover esta categoria? Esta ação não pode ser desfeita."
                confirmLabel="Remover"
                confirmVariant="destructive"
                onConfirm={handleDelete}
                loading={deleteForm.processing}
            />
        </>
    );
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Categorias',
        href: route('categories.index'),
    },
];

CategoriesIndex.layout = (page: React.ReactNode) => <AppLayout breadcrumbs={breadcrumbs}>{page}</AppLayout>;

export default CategoriesIndex;
