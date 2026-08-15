import { cva, type VariantProps } from 'class-variance-authority'
import type { ButtonHTMLAttributes } from 'react'

import { cn } from '@/lib/cn'

const buttonVariants = cva(
  'inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-[7px] text-xs font-bold outline-none transition-colors disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        primary: 'bg-primary text-primary-foreground shadow-sm hover:brightness-95',
        outline: 'border border-border bg-card text-foreground hover:bg-secondary',
        ghost: 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
        text: 'p-0 text-primary hover:underline',
        destructive: 'bg-destructive/10 text-destructive hover:bg-destructive/20',
      },
      size: {
        default: 'h-9 px-3.5',
        sm: 'h-8 px-3 text-[11px]',
        icon: 'size-9',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'default',
    },
  },
)

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {}

export function Button({ className, variant, size, type = 'button', ...props }: ButtonProps) {
  return (
    <button type={type} className={cn(buttonVariants({ variant, size, className }))} {...props} />
  )
}
