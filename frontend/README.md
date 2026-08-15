# Inventory Management — Frontend

React 19 + TypeScript + Vite.

## Yêu cầu

- Node.js >= 20 (đang dùng v24)
- npm

## Bắt đầu

```bash
npm install
cp .env.example .env   # Windows: copy .env.example .env
npm run dev
```

Dev server chạy ở http://localhost:3000

## Scripts

| Lệnh                   | Tác dụng                                 |
| ---------------------- | ---------------------------------------- |
| `npm run dev`          | Chạy dev server (HMR)                    |
| `npm run build`        | Typecheck + build production ra `dist/`  |
| `npm run preview`      | Chạy thử bản build production            |
| `npm run lint`         | Kiểm tra lỗi bằng ESLint                 |
| `npm run lint:fix`     | Tự sửa lỗi ESLint sửa được               |
| `npm run format`       | Format toàn bộ code bằng Prettier        |
| `npm run format:check` | Kiểm tra format, không sửa (dùng cho CI) |
| `npm run typecheck`    | Chỉ kiểm tra type, không build           |

## Quy ước

- **Path alias**: import bằng `@/` thay vì `../../` — ví dụ `import { env } from '@/lib/env'`
- **Biến môi trường**: chỉ biến có tiền tố `VITE_` mới ra được client. Khai báo type trong
  `src/vite-env.d.ts`, đọc qua `src/lib/env.ts`. Không commit file `.env`.
- **Pre-commit hook**: Husky + lint-staged tự chạy `eslint --fix` và `prettier --write`
  trên file được stage. Bỏ qua tạm thời bằng `git commit --no-verify`.

## Cấu trúc

```
src/
  assets/       ảnh, svg
  lib/          tiện ích dùng chung (env, http client, format...)
  App.tsx
  main.tsx
```
