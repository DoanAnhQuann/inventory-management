import type { ProductFormValues } from '../schemas/product.schema'
import type { Product } from '../types/product.types'

let products: Product[] = [
  {
    id: crypto.randomUUID(),
    name: 'Giấy A4 Double A 80gsm',
    code: 'VT-001',
    unit: 'Ram',
    price: 78500,
    createdAt: '2026-06-01T08:00:00.000Z',
    updatedAt: '2026-07-10T10:15:00.000Z',
  },
  {
    id: crypto.randomUUID(),
    name: 'Mực in laser đen HP 76A',
    code: 'VT-014',
    unit: 'Hộp',
    price: 1240000,
    createdAt: '2026-06-15T09:30:00.000Z',
    updatedAt: '2026-06-15T09:30:00.000Z',
  },
  {
    id: crypto.randomUUID(),
    name: 'Bìa hồ sơ còng 7cm',
    code: 'VT-028',
    unit: 'Cái',
    price: 42000,
    createdAt: '2026-07-01T14:00:00.000Z',
    updatedAt: '2026-07-01T14:00:00.000Z',
  },
  {
    id: crypto.randomUUID(),
    name: 'Băng keo trong 5cm',
    code: 'VT-043',
    unit: 'Cuộn',
    price: 15000,
    createdAt: '2026-07-05T08:00:00.000Z',
    updatedAt: '2026-07-05T08:00:00.000Z',
  },
  {
    id: crypto.randomUUID(),
    name: 'Sổ tay lò xo A5',
    code: 'VT-052',
    unit: 'Quyển',
    price: 28000,
    createdAt: '2026-07-20T08:00:00.000Z',
    updatedAt: '2026-07-20T08:00:00.000Z',
  },
]

const delay = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms))

export async function getProducts(): Promise<Product[]> {
  await delay()
  return products
}

export async function createProduct(payload: ProductFormValues): Promise<Product> {
  await delay()
  const now = new Date().toISOString()
  const product: Product = { id: crypto.randomUUID(), ...payload, createdAt: now, updatedAt: now }
  products = [product, ...products]
  return product
}

export async function updateProduct(id: string, payload: ProductFormValues): Promise<Product> {
  await delay()
  let updated: Product | undefined
  const now = new Date().toISOString()
  products = products.map((product) => {
    if (product.id !== id) return product
    updated = { ...product, ...payload, updatedAt: now }
    return updated
  })
  if (!updated) throw new Error('Không tìm thấy sản phẩm')
  return updated
}

export async function deleteProduct(id: string): Promise<void> {
  await delay()
  products = products.filter((product) => product.id !== id)
}
