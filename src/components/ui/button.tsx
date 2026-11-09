import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * Applecn Button component adhering to Apple Human Interface Guidelines.
 * Supports filled, tinted, gray, bordered, plain, glass, glass-prominent, and destructive variants
 * across Apple control sizes (mini, small, regular, large, xl) and shapes (capsule, rounded, circle).
 */
const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center gap-1.5 border border-transparent bg-clip-padding leading-none font-semibold whitespace-nowrap cursor-pointer transition-[background-color,transform,opacity,box-shadow,color] duration-100 ease-out outline-none select-none focus-visible:ring-4 focus-visible:ring-ring/60 active:scale-[0.97] active:opacity-80 disabled:pointer-events-none disabled:opacity-40 aria-invalid:ring-3 aria-invalid:ring-destructive/30 motion-reduce:active:scale-100 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        filled:
          "bg-primary text-primary-foreground hover:bg-[color-mix(in_srgb,var(--primary),white_8%)] shadow-xs",
        default:
          "bg-primary text-primary-foreground hover:bg-[color-mix(in_srgb,var(--primary),white_8%)] shadow-xs",
        tinted:
          "bg-primary/15 text-accent-text hover:bg-primary/25",
        gray:
          "bg-fill-3 text-accent-text hover:bg-fill-2",
        secondary:
          "bg-fill-3 text-accent-text hover:bg-fill-2",
        bordered:
          "border-border bg-transparent text-accent-text hover:bg-fill-4",
        outline:
          "border-border bg-transparent text-accent-text hover:bg-fill-4",
        plain:
          "bg-transparent text-accent-text hover:bg-fill-4",
        ghost:
          "bg-transparent text-accent-text hover:bg-fill-4",
        glass:
          "glass text-foreground hover:bg-muted/60",
        "glass-prominent":
          "bg-[color-mix(in_srgb,var(--primary)_88%,transparent)] text-primary-foreground backdrop-blur-md shadow-lg",
        destructive:
          "bg-destructive/15 text-destructive hover:bg-destructive/20",
        link:
          "bg-transparent text-accent-text underline-offset-4 hover:underline p-0 h-auto font-medium",
      },
      size: {
        mini: "h-7 gap-1 px-2.5 text-xs rounded-full",
        small: "h-7 px-3 text-xs rounded-full",
        sm: "h-7 px-3 text-xs rounded-full",
        regular: "h-[34px] px-4 text-sm rounded-full",
        default: "h-[34px] px-4 text-sm rounded-full",
        large: "h-[50px] px-6 text-base rounded-full",
        lg: "h-[50px] px-6 text-base rounded-full",
        xl: "h-[60px] px-7 text-lg rounded-full",
        icon: "h-[34px] w-[34px] p-0 aspect-square rounded-full",
      },
      shape: {
        automatic: "",
        capsule: "rounded-full",
        rounded: "rounded-xl",
        circle: "aspect-square rounded-full px-0",
      },
    },
    defaultVariants: {
      variant: "filled",
      size: "regular",
      shape: "automatic",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, shape, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, shape, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
