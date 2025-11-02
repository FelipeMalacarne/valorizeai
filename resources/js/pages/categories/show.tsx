import { useState } from 'react';
import { Head, Link } from '@inertiajs/react';

import { CategoryBadge } from '@/components/category-badge';
import { CategoryForm } from '@/components/category-form';
import { ResponsiveDialog } from '@/components/responsive-dialog';
import AppLayout from '@/layouts/app-layout';
import { CATEGORY_COLOR_SWATCHES } from '@/lib/category-colors';
import { BreadcrumbItem, SharedData } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Pencil } from 'lucide-react';

type CategoryShowProps = {
    category: App.Http.Resources.CategoryResource;
    available_colors: Array<{ value: App.Enums.Color; label: string }>;
    used_colors: App.Enums.Color[];
};

const CategoryShow = (props: SharedData<CategoryShowProps>) => {
    const { category, available_colors, used_colors } = props;
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

    return (
        <>
            <Head title={`Categoria • ${category.name}`} />
            <div className="container mx-auto flex h-full flex-1 flex-col space-y-6 p-4">
                <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">{category.name}</h1>
                        <p className="text-muted-foreground">
                            Detalhes e informações sobre esta categoria.
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <Button asChild variant="outline">
                            <Link href={route('categories.index')}>
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Voltar
                            </Link>
                        </Button>
                        <Button onClick={() => setIsEditDialogOpen(true)}>
                            <Pencil className="mr-2 h-4 w-4" />
                            Editar
                        </Button>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Resumo</CardTitle>
                        <CardDescription>
                            Informações principais da categoria selecionada.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex items-center gap-4">
                            <CategoryBadge category={category} />
                            <span className="text-sm text-muted-foreground">
                                Cor: <span className="capitalize">{category.color}</span>
                            </span>
                            <span
                                className={`inline-flex h-3 w-3 rounded-full border border-border ${CATEGORY_COLOR_SWATCHES[category.color]}`}
                            />
                        </div>

                        <div>
                            <h2 className="text-sm font-semibold text-muted-foreground">Descrição</h2>
                            {category.description ? (
                                <p className="mt-2 text-sm text-foreground">{category.description}</p>
                            ) : (
                                <p className="mt-2 text-sm italic text-muted-foreground">Nenhuma descrição fornecida.</p>
                            )}
                        </div>

                        <div>
                            <h2 className="text-sm font-semibold text-muted-foreground">Tipo</h2>
                            <div className="mt-2">
                                {category.is_default ? (
                                    <Badge variant="secondary">Padrão</Badge>
                                ) : (
                                    <Badge variant="outline">Personalizada</Badge>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <ResponsiveDialog
                title="Editar categoria"
                description="Atualize as informações desta categoria."
                isOpen={isEditDialogOpen}
                setIsOpen={setIsEditDialogOpen}
            >
                <CategoryForm
                    category={category}
                    usedColors={used_colors}
                    availableColors={available_colors}
                    onSuccess={() => setIsEditDialogOpen(false)}
                />
            </ResponsiveDialog>
        </>
    );
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Categorias',
        href: route('categories.index'),
    },
    {
        title: 'Detalhes',
        href: '#',
    },
];

CategoryShow.layout = (page: React.ReactNode) => <AppLayout breadcrumbs={breadcrumbs}>{page}</AppLayout>;

export default CategoryShow;
