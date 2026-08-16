import { endOfDay, format, startOfDay, subDays } from 'date-fns'

export interface DateRangeValue {
  startDate: string | null
  endDate: string | null
}

export interface DateRangePreset {
  label: string
  days: number
}

export const DATE_RANGE_PRESETS: DateRangePreset[] = [
  { label: 'Hôm nay', days: 0 },
  { label: '7 ngày qua', days: 7 },
  { label: '30 ngày qua', days: 30 },
  { label: '90 ngày qua', days: 90 },
]

export function getPresetRange(days: number): { from: Date; to: Date } {
  const today = new Date()
  return { from: startOfDay(subDays(today, days)), to: endOfDay(today) }
}

export function formatDateRangeLabel(value: DateRangeValue): string {
  if (!value.startDate || !value.endDate) return 'Chọn khoảng thời gian'
  return `${format(new Date(value.startDate), 'dd/MM/yyyy')} - ${format(new Date(value.endDate), 'dd/MM/yyyy')}`
}
