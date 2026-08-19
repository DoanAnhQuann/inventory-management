import type { ThemeConfig } from 'antd'

// Hex quy đổi từ đúng token OKLCH trong src/index.css (đo bằng canvas trong trình duyệt
// thật, xem process.md) — để component antd (Pagination...) khớp tone với phần Tailwind.
export const antdTheme: ThemeConfig = {
  token: {
    colorPrimary: '#006a95',
    colorError: '#de4544',
    colorBorder: '#cadfe6',
    colorBorderSecondary: '#cadfe6',
    colorText: '#0d1f28',
    colorTextSecondary: '#57707d',
    colorBgContainer: '#ffffff',
    colorBgLayout: '#edf7fb',
    borderRadius: 8,
    fontFamily: "'Inter', ui-sans-serif, system-ui, sans-serif",
  },
}
