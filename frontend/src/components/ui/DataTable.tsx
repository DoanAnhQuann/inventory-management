import type { ReactNode } from 'react'

import { cn } from '@/lib/cn'

import { Card } from './Card'

interface DataTableColumn<T> {
  key: string
  header: string
  render: (row: T) => ReactNode
  className?: string
}

interface DataTableProps<T> {
  data: T[]
  getRowKey: (row: T) => string
  columns: DataTableColumn<T>[]
  renderActions?: (row: T) => ReactNode
  renderMobileCard: (row: T) => ReactNode
  emptyMessage: string
}

export function DataTable<T>({
  data,
  getRowKey,
  columns,
  renderActions,
  renderMobileCard,
  emptyMessage,
}: DataTableProps<T>) {
  if (data.length === 0) {
    return <Card className="p-10 text-center text-sm text-muted-foreground">{emptyMessage}</Card>
  }

  return (
    <>
      <Card className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[640px] border-collapse text-sm">
          <thead>
            <tr className="bg-secondary text-left text-[11px] tracking-wide text-muted-foreground uppercase">
              {columns.map((column) => (
                <th key={column.key} className={cn('px-5 py-3 font-semibold', column.className)}>
                  {column.header}
                </th>
              ))}
              {renderActions && <th className="px-5 py-3" />}
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr key={getRowKey(row)} className="border-t border-border hover:bg-secondary/50">
                {columns.map((column) => (
                  <td key={column.key} className={cn('px-5 py-3', column.className)}>
                    {column.render(row)}
                  </td>
                ))}
                {renderActions && (
                  <td className="px-5 py-3">
                    <div className="flex justify-end gap-2">{renderActions(row)}</div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <div className="flex flex-col gap-3 md:hidden">
        {data.map((row) => (
          <Card key={getRowKey(row)} className="p-4">
            {renderMobileCard(row)}
          </Card>
        ))}
      </div>
    </>
  )
}
