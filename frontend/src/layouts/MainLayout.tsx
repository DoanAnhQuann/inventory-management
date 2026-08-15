import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons'
import { Layout } from 'antd'
import { Outlet } from 'react-router-dom'

import { useUIStore } from '@/store/useUIStore'

const { Header, Sider, Content } = Layout

export function MainLayout() {
  const { sidebarCollapsed, toggleSidebar } = useUIStore()

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsed={sidebarCollapsed} trigger={null} />
      <Layout>
        <Header className="flex items-center bg-white px-4 shadow-sm">
          {sidebarCollapsed ? (
            <MenuUnfoldOutlined onClick={toggleSidebar} />
          ) : (
            <MenuFoldOutlined onClick={toggleSidebar} />
          )}
        </Header>
        <Content className="p-6">
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  )
}
