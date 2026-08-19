import { Spinner } from '@/components/ui/Spinner'

export function PageLoading() {
  return (
    <div className="flex h-screen items-center justify-center">
      <Spinner size={32} />
    </div>
  )
}
