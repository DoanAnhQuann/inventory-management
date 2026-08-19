import { AutoComplete } from 'antd'
import type { ReactNode } from 'react'

import { cn } from '@/lib/cn'

export interface ComboboxOption {
  value: string
  label?: ReactNode
}

interface ComboboxProps {
  label?: string
  placeholder?: string
  value: string
  onChange: (value: string) => void
  onSelectOption?: (value: string) => void
  options: ComboboxOption[]
  error?: string
  className?: string
}

export function Combobox({
  label,
  placeholder,
  value,
  onChange,
  onSelectOption,
  options,
  error,
  className,
}: ComboboxProps) {
  const keyword = value.trim().toLowerCase()
  const filtered = keyword
    ? options.filter((option) => option.value.toLowerCase().includes(keyword))
    : options

  return (
    <label className={cn('flex flex-col gap-1.5', className)}>
      {label && <span className="text-xs font-semibold text-muted-foreground">{label}</span>}
      <AutoComplete
        value={value}
        options={filtered}
        filterOption={false}
        onChange={(newValue) => onChange(newValue)}
        onSelect={(selected) => onSelectOption?.(String(selected))}
        placeholder={placeholder}
        status={error ? 'error' : undefined}
        popupMatchSelectWidth
        style={{ width: '100%' }}
      />
      {error && <span className="text-xs text-destructive">{error}</span>}
    </label>
  )
}
