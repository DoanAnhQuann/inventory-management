import type { ProductFormValues } from '../schemas/product.schema'
import type { Product } from '../types/product.types'

let products: Product[] = [
  {
    id: crypto.randomUUID(),
    name: 'Giấy A4 Double A 80gsm',
    code: 'VT-001',
    unit: 'Ram',
    price: 78500,
  },
  {
    id: crypto.randomUUID(),
    name: 'Mực in laser đen HP 76A',
    code: 'VT-014',
    unit: 'Hộp',
    price: 1240000,
  },
  {
    id: crypto.randomUUID(),
    name: 'Bìa hồ sơ còng 7cm',
    code: 'VT-028',
    unit: 'Cái',
    price: 42000,
  },
]

const delay = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms))

export async function getProducts(): Promise<Product[]> {
  await delay()
  return products
}

export async function createProduct(payload: ProductFormValues): Promise<Product> {
  await delay()
  const product: Product = { id: crypto.randomUUID(), ...payload }
  products = [product, ...products]
  return product
}

export async function updateProduct(id: string, payload: ProductFormValues): Promise<Product> {
  await delay()
  let updated: Product | undefined
  products = products.map((product) => {
    if (product.id !== id) return product
    updated = { ...product, ...payload }
    return updated
  })
  if (!updated) throw new Error('Không tìm thấy sản phẩm')
  return updated
}

export async function deleteProduct(id: string): Promise<void> {
  await delay()
  products = products.filter((product) => product.id !== id)
}
