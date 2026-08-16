import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isAfter,
  isBefore,
  isSameDay,
  isSameMonth,
  startOfDay,
  startOfMonth,
  startOfWeek,
  subMonths,
} from 'date-fns'
import { vi } from 'date-fns/locale'
import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react'
import { useRef, useState } from 'react'

import { useClickOutside } from '@/hooks/useClickOutside'
import { useIsMobile } from '@/hooks/useMediaQuery'
import { cn } from '@/lib/cn'
import {
  DATE_RANGE_PRESETS,
  type DateRangeValue,
  formatDateRangeLabel,
  getPresetRange,
} from '@/utils/dateRange'

interface TimeFilterProps {
  value: DateRangeValue
  onChange: (value: DateRangeValue) => void
  visible?: boolean
  label?: string
  className?: string
}

interface StagedRange {
  from: Date | null
  to: Date | null
}

const WEEKDAY_LABELS = ['CN', 'Th2', 'Th3', 'Th4', 'Th5', 'Th6', 'Th7']

function buildMonthGrid(month: Date): Date[] {
  const start = startOfWeek(startOfMonth(month), { weekStartsOn: 0 })
  const end = endOfWeek(endOfMonth(month), { weekStartsOn: 0 })
  return eachDayOfInterval({ start, end })
}

function toStaged(value: DateRangeValue): StagedRange {
  return {
    from: value.startDate ? new Date(value.startDate) : null,
    to: value.endDate ? new Date(value.endDate) : null,
  }
}

export function TimeFilter({
  value,
  onChange,
  visible = true,
  label = 'Thời gian',
  className,
}: TimeFilterProps) {
  const isMobile = useIsMobile()
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useClickOutside(containerRef, () => setIsOpen(false))

  if (!visible) return null

  const handleApply = (staged: StagedRange) => {
    onChange({
      startDate: staged.from ? format(staged.from, 'yyyy-MM-dd') : null,
      endDate: staged.to ? format(staged.to, 'yyyy-MM-dd') : null,
    })
    setIsOpen(false)
  }

  return (
    <div className={cn('relative inline-flex', className)} ref={containerRef}>
      <span className="flex h-9 items-center gap-1.5 text-sm font-medium whitespace-nowrap text-foreground">
        {label}
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className="inline-flex h-9 items-center gap-1.5 rounded-full border border-border px-3.5 text-sm font-medium text-foreground hover:bg-secondary"
        >
          {formatDateRangeLabel(value)}
          <ChevronDown size={14} className={cn('transition-transform', isOpen && 'rotate-180')} />
        </button>
      </span>

      {isOpen && isMobile && (
        <button
          type="button"
          aria-label="Đóng"
          className="fixed inset-0 z-40 bg-foreground/30"
          onClick={() => setIsOpen(false)}
        />
      )}

      {isOpen && (
        <TimeFilterPanel
          value={value}
          isMobile={isMobile}
          onCancel={() => setIsOpen(false)}
          onApply={handleApply}
        />
      )}
    </div>
  )
}

interface TimeFilterPanelProps {
  value: DateRangeValue
  isMobile: boolean
  onCancel: () => void
  onApply: (staged: StagedRange) => void
}

function TimeFilterPanel({ value, isMobile, onCancel, onApply }: TimeFilterPanelProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [staged, setStaged] = useState<StagedRange>(() => toStaged(value))

  const today = new Date()
  const minDate = subMonths(today, 12)

  const handlePresetClick = (days: number) => setStaged(getPresetRange(days))

  const isDayDisabled = (date: Date, month: Date) =>
    !isSameMonth(date, month) || isAfter(date, today) || isBefore(date, minDate)

  const handleDateClick = (date: Date, month: Date) => {
    if (isDayDisabled(date, month)) return
    if (!staged.from || (staged.from && staged.to)) {
      setStaged({ from: date, to: null })
    } else if (date < staged.from) {
      setStaged({ from: date, to: staged.from })
    } else {
      setStaged({ ...staged, to: date })
    }
  }

  const isDateSelected = (date: Date) => {
    if (!staged.from) return false
    if (!staged.to) return isSameDay(date, staged.from)
    if (isSameDay(staged.from, staged.to)) return isSameDay(date, staged.from)
    return date >= startOfDay(staged.from) && date <= startOfDay(staged.to)
  }

  const isTodaySelected = (date: Date) => isSameDay(date, today) && isDateSelected(date)

  const activePresetDays = DATE_RANGE_PRESETS.find((preset) => {
    const range = getPresetRange(preset.days)
    return (
      staged.from &&
      staged.to &&
      isSameDay(range.from, staged.from) &&
      isSameDay(range.to, staged.to)
    )
  })?.days

  const summaryText =
    staged.from && staged.to
      ? `Từ ${format(staged.from, 'dd/MM/yyyy')} - ${format(staged.to, 'dd/MM/yyyy')}`
      : 'Chọn khoảng thời gian'

  const renderMonth = (month: Date, onPrev?: () => void, onNext?: () => void) => (
    <div className="min-w-0">
      <div className="mb-1 flex items-center justify-between px-1">
        {onPrev ? (
          <button
            type="button"
            onClick={onPrev}
            aria-label="Tháng trước"
            className="grid size-6 place-items-center rounded text-muted-foreground hover:bg-secondary"
          >
            <ChevronLeft size={14} />
          </button>
        ) : (
          <span className="size-6" />
        )}
        <h4 className="text-xs font-medium text-foreground capitalize">
          {format(month, 'MMMM yyyy', { locale: vi })}
        </h4>
        {onNext ? (
          <button
            type="button"
            onClick={onNext}
            aria-label="Tháng sau"
            className="grid size-6 place-items-center rounded text-muted-foreground hover:bg-secondary"
          >
            <ChevronRight size={14} />
          </button>
        ) : (
          <span className="size-6" />
        )}
      </div>

      <div className="grid grid-cols-7">
        {WEEKDAY_LABELS.map((day) => (
          <span
            key={day}
            className="py-1 text-center text-[11px] font-medium text-muted-foreground"
          >
            {day}
          </span>
        ))}
      </div>

      <div className="grid grid-cols-7">
        {buildMonthGrid(month).map((date) => {
          const disabled = isDayDisabled(date, month)
          const selected = isDateSelected(date)
          const todaySelected = isTodaySelected(date)
          return (
            <div key={date.toISOString()} className="flex items-center justify-center p-0.5">
              <button
                type="button"
                disabled={disabled}
                onClick={() => handleDateClick(date, month)}
                className={cn(
                  'grid size-7 place-items-center rounded-full text-xs font-normal text-foreground',
                  !disabled && !selected && 'hover:bg-secondary',
                  disabled && 'cursor-default text-muted-foreground/40',
                  selected && !todaySelected && 'bg-accent font-medium text-primary',
                  todaySelected && 'bg-primary font-medium text-primary-foreground',
                )}
              >
                {format(date, 'd')}
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )

  return (
    <div
      className={cn(
        'absolute top-full right-0 z-50 mt-2 flex w-max min-w-[560px] max-w-[calc(100vw-2rem)] rounded-2xl border border-border bg-card p-3 shadow-xl',
        'max-lg:fixed max-lg:inset-x-3 max-lg:top-auto max-lg:bottom-3 max-lg:mt-0 max-lg:max-h-[calc(100vh-24px)] max-lg:w-auto max-lg:min-w-0 max-lg:max-w-none max-lg:flex-col max-lg:overflow-y-auto',
      )}
    >
      <div className="flex w-[112px] shrink-0 flex-col gap-0.5 pt-8 max-lg:w-auto max-lg:flex-row max-lg:flex-wrap max-lg:pt-0 max-lg:pb-2">
        {DATE_RANGE_PRESETS.map((preset) => (
          <button
            key={preset.label}
            type="button"
            onClick={() => handlePresetClick(preset.days)}
            className={cn(
              'rounded-lg px-3 py-1.5 text-left text-xs text-foreground hover:bg-secondary',
              'max-lg:rounded-full max-lg:border max-lg:border-border max-lg:px-3 max-lg:py-1',
              activePresetDays === preset.days &&
                'bg-accent font-semibold text-primary max-lg:border-primary',
            )}
          >
            {preset.label}
          </button>
        ))}
      </div>

      <div className="mx-2 w-px shrink-0 self-stretch bg-border max-lg:hidden" />

      <div className="min-w-0 flex-1">
        <div className="grid grid-cols-1 gap-2 lg:grid-cols-2">
          {isMobile
            ? renderMonth(
                currentMonth,
                () => setCurrentMonth((prev) => subMonths(prev, 1)),
                () => setCurrentMonth((prev) => addMonths(prev, 1)),
              )
            : renderMonth(currentMonth, () => setCurrentMonth((prev) => subMonths(prev, 1)))}
          {!isMobile &&
            renderMonth(addMonths(currentMonth, 1), undefined, () =>
              setCurrentMonth((prev) => addMonths(prev, 1)),
            )}
        </div>

        <div className="mt-1 flex flex-wrap items-center justify-between gap-2 border-t border-border pt-2">
          <div>
            <p className="text-[11px] text-muted-foreground">Khoảng thời gian</p>
            <p className="text-xs font-medium text-foreground">{summaryText}</p>
          </div>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={onCancel}
              className="text-xs font-medium text-muted-foreground hover:text-foreground"
            >
              Huỷ
            </button>
            <button
              type="button"
              onClick={() => onApply(staged)}
              className="text-xs font-semibold text-primary hover:underline"
            >
              Áp dụng
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
