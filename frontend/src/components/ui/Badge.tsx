import { cva, type VariantProps } from 'class-variance-authority'
import type { ReactNode } from 'react'

import { cn } from '@/lib/cn'

const badgeVariants = cva('inline-flex items-center gap-1.5 text-[11px] font-semibold', {
  variants: {
    tone: {
      success: 'text-success',
      warning: 'text-warning',
      muted: 'text-muted-foreground',
    },
  },
  defaultVariants: {
    tone: 'muted',
  },
})

export interface BadgeProps extends VariantProps<typeof badgeVariants> {
  children: ReactNode
  className?: string
}

export function Badge({ tone, children, className }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ tone }), className)}>
      <span className="size-1.5 rounded-full bg-current" />
      {children}
    </span>
  )
}
