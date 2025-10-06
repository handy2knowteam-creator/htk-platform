import * as React from "react"
import { cva } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "htk-badge",
  {
    variants: {
      variant: {
        default: "htk-badge-gold",
        secondary: "bg-htk-charcoal text-htk-platinum border border-htk-gold/20",
        destructive: "htk-badge-error",
        outline: "text-htk-gold border border-htk-gold bg-transparent",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({ className, variant, ...props }) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
