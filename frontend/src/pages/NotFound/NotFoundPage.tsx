import { Link } from 'react-router-dom'

import { Button } from '@/components/ui/Button'
import { ROUTES } from '@/constants/routes'

export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center gap-3 py-24 text-center">
      <span className="text-5xl font-bold text-foreground">404</span>
      <p className="text-sm text-muted-foreground">Trang bạn tìm không tồn tại.</p>
      <Link to={ROUTES.HOME}>
        <Button variant="primary">Về trang chủ</Button>
      </Link>
    </div>
  )
}
