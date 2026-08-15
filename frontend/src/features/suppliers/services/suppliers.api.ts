import type { SupplierFormValues } from '../schemas/supplier.schema'
import type { Supplier } from '../types/supplier.types'

let suppliers: Supplier[] = [
  {
    id: crypto.randomUUID(),
    name: 'Công ty TNHH Thiết bị Văn phòng Minh Long',
    createdAt: '2026-05-20T08:00:00.000Z',
    updatedAt: '2026-07-18T11:20:00.000Z',
  },
  {
    id: crypto.randomUUID(),
    name: 'Nhà phân phối Đông Á',
    createdAt: '2026-06-05T08:00:00.000Z',
    updatedAt: '2026-06-05T08:00:00.000Z',
  },
  {
    id: crypto.randomUUID(),
    name: 'Văn phòng phẩm Hồng Hà',
    createdAt: '2026-06-28T08:00:00.000Z',
    updatedAt: '2026-06-28T08:00:00.000Z',
  },
]

const delay = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms))

export async function getSuppliers(): Promise<Supplier[]> {
  await delay()
  return suppliers
}

export async function createSupplier(payload: SupplierFormValues): Promise<Supplier> {
  await delay()
  const now = new Date().toISOString()
  const supplier: Supplier = { id: crypto.randomUUID(), ...payload, createdAt: now, updatedAt: now }
  suppliers = [supplier, ...suppliers]
  return supplier
}

export async function updateSupplier(id: string, payload: SupplierFormValues): Promise<Supplier> {
  await delay()
  let updated: Supplier | undefined
  const now = new Date().toISOString()
  suppliers = suppliers.map((supplier) => {
    if (supplier.id !== id) return supplier
    updated = { ...supplier, ...payload, updatedAt: now }
    return updated
  })
  if (!updated) throw new Error('Không tìm thấy nhà cung cấp')
  return updated
}

export async function deleteSupplier(id: string): Promise<void> {
  await delay()
  suppliers = suppliers.filter((supplier) => supplier.id !== id)
}
