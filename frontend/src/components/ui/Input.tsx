import { forwardRef, type InputHTMLAttributes } from 'react'

import { cn } from '@/lib/cn'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, id, className, ...props }, ref) => {
    return (
      <label className="flex flex-col gap-1.5" htmlFor={id}>
        {label && <span className="text-xs font-semibold text-muted-foreground">{label}</span>}
        <input
          id={id}
          ref={ref}
          className={cn(
            'w-full rounded-md border border-input bg-card px-3 py-2 text-sm text-foreground outline-none focus:border-ring focus:ring-3 focus:ring-ring/20',
            error && 'border-destructive focus:border-destructive focus:ring-destructive/20',
            className,
          )}
          {...props}
        />
        {error && <span className="text-xs text-destructive">{error}</span>}
      </label>
    )
  },
)
Input.displayName = 'Input'
