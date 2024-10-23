import { Moon, Sun } from "lucide-react"
import { Button } from "@/Components/ui/button"
import { useTheme } from "@/Providers/ThemeProvider"
import { cn } from "@/lib/utils"

export function ThemeToggle({className, ...props}: React.HTMLAttributes<HTMLButtonElement>) {
    const { theme, setTheme } = useTheme()

    const handleToggle = () => {
        theme === "light" ? setTheme("dark") : setTheme("light")
    }

  return (
        <Button variant="ghost" size="icon" onClick={handleToggle} className={cn(className)} {...props}>
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
        </Button>
  )
}
