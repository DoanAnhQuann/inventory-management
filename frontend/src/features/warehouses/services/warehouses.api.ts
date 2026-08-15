import type { WarehouseFormValues } from '../schemas/warehouse.schema'
import type { Warehouse } from '../types/warehouse.types'

let warehouses: Warehouse[] = [
  {
    id: crypto.randomUUID(),
    name: 'Kho tổng Hà Nội',
    location: 'Số 12, Đường Giải Phóng, Hà Nội',
    createdAt: '2026-06-01T08:00:00.000Z',
    inboundAt: '2026-06-03T09:30:00.000Z',
  },
  {
    id: crypto.randomUUID(),
    name: 'Kho miền Nam',
    location: 'KCN Tân Bình, TP. Hồ Chí Minh',
    createdAt: '2026-07-15T08:00:00.000Z',
    inboundAt: '2026-07-20T14:00:00.000Z',
  },
]

const delay = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms))

export async function getWarehouses(): Promise<Warehouse[]> {
  await delay()
  return warehouses
}

export async function createWarehouse(payload: WarehouseFormValues): Promise<Warehouse> {
  await delay()
  const now = new Date().toISOString()
  const warehouse: Warehouse = {
    id: crypto.randomUUID(),
    ...payload,
    createdAt: now,
    inboundAt: now,
  }
  warehouses = [warehouse, ...warehouses]
  return warehouse
}

export async function updateWarehouse(
  id: string,
  payload: WarehouseFormValues,
): Promise<Warehouse> {
  await delay()
  let updated: Warehouse | undefined
  warehouses = warehouses.map((warehouse) => {
    if (warehouse.id !== id) return warehouse
    updated = { ...warehouse, ...payload }
    return updated
  })
  if (!updated) throw new Error('Không tìm thấy kho')
  return updated
}

export async function deleteWarehouse(id: string): Promise<void> {
  await delay()
  warehouses = warehouses.filter((warehouse) => warehouse.id !== id)
}
