export function PageContainer({ children }: { children: React.ReactNode }) {
    return <div className="container mx-auto flex h-full flex-1 flex-col space-y-6 p-4">{children}</div>;
}
