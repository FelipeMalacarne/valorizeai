import { useState } from "react"
import { Check, Copy } from "lucide-react"
import { cn } from "@/lib/utils"

interface InlineCodeProps {
  code: string
  className?: string
}

export function InlineCode({ code, className }: InlineCodeProps) {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <span
      className={cn(
        "inline-flex items-center font-mono text-xs rounded px-1.5 py-0.5 bg-muted/50 hover:bg-muted relative group cursor-pointer",
        className,
      )}
      onClick={copyToClipboard}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          copyToClipboard()
        }
      }}
      aria-label={`Copy code: ${code}`}
    >
      {code}
      <span className="ml-1.5 text-muted-foreground/70 group-hover:text-muted-foreground transition-colors">
        {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
      </span>
    </span>
  )
}
