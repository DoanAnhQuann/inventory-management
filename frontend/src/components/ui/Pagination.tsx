import { Pagination as AntPagination } from 'antd'

export interface PaginationProps {
  current: number
  pageSize: number
  total: number
  onChange: (page: number) => void
}

export function Pagination({ current, pageSize, total, onChange }: PaginationProps) {
  return (
    <div className="flex justify-end">
      <AntPagination
        current={current}
        pageSize={pageSize}
        total={total}
        onChange={onChange}
        hideOnSinglePage
        showTotal={(totalCount, range) => `${range[0]}–${range[1]} trên ${totalCount}`}
      />
    </div>
  )
}
