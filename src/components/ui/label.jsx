import * as React from "react"
import { cn } from "@/lib/utils"

const Label = React.forwardRef(({ className, ...props }, ref) => (
  <label
    ref={ref}
    className={cn("htk-label", className)}
    {...props}
  />
))
Label.displayName = "Label"

export { Label }
