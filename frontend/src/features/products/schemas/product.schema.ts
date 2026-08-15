import { z } from 'zod'

export const productSchema = z.object({
  name: z.string().trim().min(1, 'Vui lòng nhập tên sản phẩm'),
  code: z.string().trim().min(1, 'Vui lòng nhập mã số'),
  unit: z.string().trim().min(1, 'Vui lòng nhập đơn vị tính'),
  price: z.coerce.number({ error: 'Đơn giá phải là số' }).positive('Đơn giá phải lớn hơn 0'),
})

export type ProductFormValues = z.infer<typeof productSchema>
