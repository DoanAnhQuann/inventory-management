import { Spin } from 'antd'

export function PageLoading() {
  return (
    <div className="flex h-screen items-center justify-center">
      <Spin size="large" />
    </div>
  )
}
