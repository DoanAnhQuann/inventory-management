import { X } from 'lucide-react'
import { type ReactNode, useEffect } from 'react'
import { createPortal } from 'react-dom'

import { cn } from '@/lib/cn'

interface DialogProps {
  open: boolean
  onClose: () => void
  title: string
  children: ReactNode
  footer?: ReactNode
  className?: string
}

export function Dialog({ open, onClose, title, children, footer, className }: DialogProps) {
  useEffect(() => {
    if (!open) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  if (!open) return null

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Đóng"
        className="fixed inset-0 bg-foreground/30"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
        className={cn(
          'relative flex w-full max-w-md flex-col gap-5 rounded-lg border border-border bg-card p-6 shadow-xl',
          className,
        )}
      >
        <div className="flex items-center justify-between">
          <h2 id="dialog-title" className="text-base font-bold text-foreground">
            {title}
          </h2>
          <button
            type="button"
            aria-label="Đóng"
            className="text-muted-foreground hover:text-foreground"
            onClick={onClose}
          >
            <X size={18} />
          </button>
        </div>
        {children}
        {footer && <div className="flex justify-end gap-2.5">{footer}</div>}
      </div>
    </div>,
    document.body,
  )
}
