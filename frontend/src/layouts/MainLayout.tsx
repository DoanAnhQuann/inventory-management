import {
  Archive,
  BarChart3,
  ClipboardList,
  LayoutDashboard,
  Menu,
  Package,
  ShieldCheck,
  Users,
  Warehouse,
  X,
} from 'lucide-react'
import type { ComponentType } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'

import { Avatar } from '@/components/ui/Avatar'
import { Button } from '@/components/ui/Button'
import { ROUTES } from '@/constants/routes'
import { cn } from '@/lib/cn'
import { useUIStore } from '@/store/useUIStore'

const NAV_ITEMS: { to: string; label: string; icon: ComponentType<{ size?: number }> }[] = [
  { to: ROUTES.HOME, label: 'Tổng quan', icon: LayoutDashboard },
  { to: ROUTES.GOODS_RECEIPT, label: 'Phiếu nhập kho', icon: ClipboardList },
  { to: ROUTES.INVENTORY_REPORT, label: 'Báo cáo tồn kho', icon: BarChart3 },
  { to: ROUTES.PRODUCTS, label: 'Sản phẩm', icon: Package },
  { to: ROUTES.SUPPLIERS, label: 'Nhà cung cấp', icon: Users },
  { to: ROUTES.WAREHOUSE_INBOUND, label: 'Quản lý kho nhập', icon: Warehouse },
]

export function MainLayout() {
  const { mobileNavOpen, toggleMobileNav, closeMobileNav } = useUIStore()
  const location = useLocation()

  const activeItem = NAV_ITEMS.find((item) =>
    item.to === ROUTES.HOME ? location.pathname === item.to : location.pathname.startsWith(item.to),
  )

  return (
    <div className="flex min-h-screen bg-background">
      <aside
        className={cn(
          'fixed z-20 flex h-screen w-[248px] flex-col border-r border-border bg-card px-3.5 py-6 transition-transform lg:static lg:translate-x-0',
          mobileNavOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full',
        )}
      >
        <div className="flex items-center gap-2.5 px-3 pb-6">
          <div className="grid size-[38px] shrink-0 place-items-center rounded-[11px] bg-primary text-primary-foreground">
            <Archive size={20} />
          </div>
          <div>
            <strong className="block text-[15px] tracking-tight text-foreground">Kho vận</strong>
            <span className="block text-[11px] text-muted-foreground">Quản lý nội bộ</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="ml-auto lg:hidden"
            aria-label="Đóng menu"
            onClick={closeMobileNav}
          >
            <X size={18} />
          </Button>
        </div>

        <div className="mx-[3px] mb-7 flex items-center gap-2.5 rounded-[10px] border border-border bg-secondary p-2.5">
          <Avatar initials="Q" />
          <div>
            <b className="block text-xs text-foreground">Đoàn Anh Quân</b>
            <span className="block text-[11px] text-muted-foreground">Kho tổng · Hà Nội</span>
          </div>
          {/* <ChevronDown size={15} className="ml-auto shrink-0 text-muted-foreground" /> */}
        </div>

        <nav className="flex flex-col gap-1" aria-label="Điều hướng chính">
          {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === ROUTES.HOME}
              onClick={closeMobileNav}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground',
                  isActive && 'bg-accent font-bold text-accent-foreground',
                )
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto flex gap-2.5 border-t border-border px-2 pt-3 text-muted-foreground">
          <ShieldCheck size={18} className="shrink-0 text-primary" />
          <div>
            <b className="block text-[11px] text-foreground">Bảo mật dữ liệu</b>
            <span className="block text-[10px]">Dữ liệu được đồng bộ an toàn</span>
          </div>
        </div>
      </aside>

      {mobileNavOpen && (
        <button
          type="button"
          className="fixed inset-0 z-10 bg-foreground/20 lg:hidden"
          aria-label="Đóng menu"
          onClick={closeMobileNav}
        />
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-[72px] items-center justify-between border-b border-border bg-card px-6 lg:px-10">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              aria-label="Mở menu"
              onClick={toggleMobileNav}
            >
              <Menu size={20} />
            </Button>
            <div className="flex items-center gap-2.5 text-[13px] text-muted-foreground">
              <span>Kho vận</span>
              <span>/</span>
              <b className="text-foreground">{activeItem?.label ?? '404'}</b>
            </div>
          </div>
          <div className="flex items-center gap-5">
            <button
              type="button"
              className="relative grid place-items-center text-muted-foreground"
              aria-label="Thông báo"
            >
              {/* <Bell size={19} />
              <i className="absolute right-0 top-0 size-1.5 rounded-full border border-card bg-destructive" /> */}
            </button>
            <Avatar
              initials="ĐA"
              className="size-[33px] rounded-full bg-primary text-[11px] text-primary-foreground"
            />
          </div>
        </header>

        <main className="mx-auto w-full max-w-[1680px] flex-1 px-6 py-8 lg:px-10">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
