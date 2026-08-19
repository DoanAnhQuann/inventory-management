import { lazy } from 'react'
import { Route, Routes } from 'react-router-dom'

import { ROUTES } from '@/constants/routes'
import { MainLayout } from '@/layouts/MainLayout'

const HomePage = lazy(() => import('@/pages/Home/HomePage'))
const GoodsReceiptPage = lazy(() => import('@/pages/GoodsReceipt/GoodsReceiptPage'))
const InventoryReportPage = lazy(() => import('@/pages/InventoryReport/InventoryReportPage'))
const ProductsPage = lazy(() => import('@/pages/Products/ProductsPage'))
const SuppliersPage = lazy(() => import('@/pages/Suppliers/SuppliersPage'))
const WarehouseInboundPage = lazy(() => import('@/pages/WarehouseInbound/WarehouseInboundPage'))
const NotFoundPage = lazy(() => import('@/pages/NotFound/NotFoundPage'))

export function AppRouter() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path={ROUTES.HOME} element={<HomePage />} />
        <Route path={ROUTES.GOODS_RECEIPT} element={<GoodsReceiptPage />} />
        <Route path={ROUTES.INVENTORY_REPORT} element={<InventoryReportPage />} />
        <Route path={ROUTES.PRODUCTS} element={<ProductsPage />} />
        <Route path={ROUTES.SUPPLIERS} element={<SuppliersPage />} />
        <Route path={ROUTES.WAREHOUSE_INBOUND} element={<WarehouseInboundPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}
