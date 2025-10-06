import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "htk-button",
  {
    variants: {
      variant: {
        default: "htk-button-primary",
        secondary: "htk-button-secondary",
        ghost: "htk-button-ghost",
        outline: "htk-button-secondary",
        destructive: "bg-red-600 text-white hover:bg-red-700",
        link: "text-htk-gold underline-offset-4 hover:underline bg-transparent shadow-none",
      },
      size: {
        default: "px-6 py-3 text-base",
        sm: "px-4 py-2 text-sm",
        lg: "px-8 py-4 text-lg",
        icon: "p-3",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props} />
  );
}

export { Button, buttonVariants }
