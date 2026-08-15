import { QueryClientProvider } from '@tanstack/react-query'
import { ConfigProvider } from 'antd'
import { Suspense } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'sonner'

import { PageLoading } from '@/components/common/PageLoading'
import { antdTheme } from '@/lib/antd-theme'
import { queryClient } from '@/lib/query-client'
import { AppRouter } from '@/router'

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ConfigProvider theme={antdTheme}>
        <BrowserRouter>
          <Suspense fallback={<PageLoading />}>
            <AppRouter />
          </Suspense>
        </BrowserRouter>
        <Toaster
          position="top-right"
          duration={3000}
          richColors
          toastOptions={{ style: { fontFamily: 'inherit' } }}
        />
      </ConfigProvider>
    </QueryClientProvider>
  )
}

export default App
