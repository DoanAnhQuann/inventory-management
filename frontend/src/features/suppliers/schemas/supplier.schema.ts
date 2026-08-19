import { z } from 'zod'

export const supplierSchema = z.object({
  name: z.string().trim().min(1, 'Vui lòng nhập tên nhà cung cấp'),
})

export type SupplierFormValues = z.infer<typeof supplierSchema>
