import { cn } from '@/lib/cn'

interface AvatarProps {
  initials: string
  className?: string
}

export function Avatar({ initials, className }: AvatarProps) {
  return (
    <div
      className={cn(
        'grid size-[29px] shrink-0 place-items-center rounded-[9px] bg-accent text-[12px] font-bold text-accent-foreground',
        className,
      )}
    >
      {initials}
    </div>
  )
}
