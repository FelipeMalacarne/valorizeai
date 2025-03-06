
export function ColorSquare({ color }: { color: string }) {
    return (
        <div className="flex gap-2 items-center">
            <div className={`h-6 w-6 rounded-md bg-${color}`} />
            {color.charAt(0).toUpperCase() + color.slice(1)}
        </div>
    )
}
