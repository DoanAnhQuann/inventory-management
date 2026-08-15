import { Button, Result } from 'antd'
import { Link } from 'react-router-dom'

import { ROUTES } from '@/constants/routes'

export default function NotFoundPage() {
  return (
    <Result
      status="404"
      title="404"
      subTitle="Trang bạn tìm không tồn tại."
      extra={
        <Link to={ROUTES.HOME}>
          <Button type="primary">Về trang chủ</Button>
        </Link>
      }
    />
  )
}
