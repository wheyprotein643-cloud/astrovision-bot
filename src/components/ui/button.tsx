import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium transition-opacity duration-150 disabled:pointer-events-none disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/70",
  {
    variants: {
      variant: {
        default: "bg-accent text-accent-fg hover:opacity-90",
        ghost: "bg-transparent text-fg hover:bg-elevated",
        outline: "border border-border bg-transparent text-fg hover:bg-elevated",
        muted: "bg-elevated text-fg hover:opacity-90",
      },
      size: {
        default: "h-11 px-4 text-sm",
        sm: "h-9 px-3 text-sm",
        icon: "size-11",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  },
);

export function Button({
  className,
  variant,
  size,
  ...props
}: React.ComponentProps<"button"> & VariantProps<typeof buttonVariants>) {
  return <button className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}
