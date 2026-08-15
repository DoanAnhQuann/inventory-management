import { lazy } from 'react'
import { Route, Routes } from 'react-router-dom'

import { ROUTES } from '@/constants/routes'
import { MainLayout } from '@/layouts/MainLayout'

const HomePage = lazy(() => import('@/pages/Home/HomePage'))
const NotFoundPage = lazy(() => import('@/pages/NotFound/NotFoundPage'))

export function AppRouter() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path={ROUTES.HOME} element={<HomePage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}
