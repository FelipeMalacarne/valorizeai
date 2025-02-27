import { LinkType } from "@/types";
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
} from "./ui/pagination";
import { ChevronFirstIcon, ChevronLastIcon, ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { Link } from "@inertiajs/react";

interface LinkPaginationProps {
    links: LinkType[];
    firstPageUrl: string;
    lastPageUrl: string;
}

type JumpType = "previous" | "next" | "last" | "first";

const JumpItem = ({ type, url }: { type: JumpType; url: string | null }) => {
    return (
        <PaginationItem>
            <Link href={url || "#"} prefetch preserveScroll>
                <PaginationLink>
                    {type === "previous" ? (
                        <ChevronLeftIcon />
                    ) : type === "next" ? (
                        <ChevronRightIcon />
                    ) : type === "last" ? (
                        <ChevronLastIcon />
                    ) : (
                        <ChevronFirstIcon />
                    )}
                </PaginationLink>
            </Link>
        </PaginationItem>
    );
};

const NumberItem = ({
    url,
    label,
    active,
}: {
    url: string | null;
    label: string;
    active: boolean;
}) => {
    return (
        <PaginationItem>
            <Link href={url || "#"} prefetch preserveScroll>
                <PaginationLink isActive={active}>{label}</PaginationLink>
            </Link>
        </PaginationItem>
    );
};

export default function LinkPagination(props: LinkPaginationProps) {
    const { links } = props;

    const currentPage = links.find((link) => link.active)?.label;

    const currentPageNumber = currentPage ? parseInt(currentPage, 10) : 1;

    const filteredLinks = links.filter((link) => {
        const pageNumber =
            link.label === "..." ? null : parseInt(link.label, 10);

        return (
            link.label.includes("Previous") ||
            link.label.includes("Next") ||
            // link.label === "1" ||
            link.label === links[links.length - 1].label ||
            (pageNumber && Math.abs(pageNumber - currentPageNumber) <= 2)
        );
    });

    const paginationItems = [];

    return (
        <Pagination>
            <PaginationContent>
                <JumpItem type="first" url={props.firstPageUrl} />
                {filteredLinks.map((link) => {
                    if (link.label.includes("Previous")) {
                        return <JumpItem type="previous" url={link.url} key={link.label} />;
                    }
                    if (link.label.includes("Next")) {
                        return <JumpItem type="next" url={link.url} key={link.label} />;
                    }
                    if (link.label.includes("...")) {
                        return (
                            <PaginationItem key={link.label}>
                                <PaginationEllipsis />
                            </PaginationItem>
                        );
                    }
                    return (
                        <NumberItem
                            url={link.url}
                            label={link.label}
                            key={link.label}
                            active={link.active}
                        />
                    );
                })}
                <JumpItem type="last" url={props.lastPageUrl} />
            </PaginationContent>
        </Pagination>
    );
}
