import { z } from 'zod'

export const warehouseSchema = z.object({
  name: z.string().trim().min(1, 'Vui lòng nhập tên kho'),
  location: z.string().trim().min(1, 'Vui lòng nhập địa điểm'),
})

export type WarehouseFormValues = z.infer<typeof warehouseSchema>
