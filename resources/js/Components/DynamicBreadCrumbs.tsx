import { Link } from "@inertiajs/react";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "./ui/breadcrumb";

export interface Crumb {
    label: string;
    href?: string;
}

export function DynamicBreadcrumbs({ items }: { items: Crumb[] }) {
    return (
        <Breadcrumb>
            <BreadcrumbList>
                {items.map((item, index) => (
                    <span key={index} className="flex items-center gap-2">
                        <BreadcrumbItem>
                            {item.href ? (
                                <BreadcrumbLink >
                                    <Link href={item.href}>
                                        {item.label}
                                    </Link>
                                </BreadcrumbLink>
                            ) : (
                                <BreadcrumbPage>
                                    {item.label}
                                </BreadcrumbPage>
                            )}
                        </BreadcrumbItem>
                        {index < items.length - 1 && <BreadcrumbSeparator />}
                    </span>
                ))}
            </BreadcrumbList>
        </Breadcrumb>
    );
}
