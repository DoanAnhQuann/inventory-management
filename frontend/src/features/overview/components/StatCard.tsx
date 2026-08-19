import type { ComponentType } from 'react'

import { Card } from '@/components/ui/Card'
import { cn } from '@/lib/cn'

interface StatCardProps {
  icon: ComponentType<{ size?: number }>
  iconClassName: string
  label: string
  value: string
  footnote: string
}

export function StatCard({ icon: Icon, iconClassName, label, value, footnote }: StatCardProps) {
  return (
    <Card className="relative flex flex-col gap-1 overflow-hidden p-[18px_19px]">
      <div
        className={cn(
          'absolute top-[18px] right-[17px] grid size-[34px] place-items-center rounded-[9px]',
          iconClassName,
        )}
      >
        <Icon size={19} />
      </div>
      <span className="pr-11 text-xs text-muted-foreground">{label}</span>
      <strong className="mt-1.5 text-[23px] font-semibold tracking-tight text-foreground tabular-nums">
        {value}
      </strong>
      <small className="text-[11px] text-muted-foreground">{footnote}</small>
    </Card>
  )
}
