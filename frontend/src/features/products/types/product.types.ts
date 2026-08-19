export interface Product {
  id: string
  name: string
  code: string
  unit: string
  price: number
  minStockThreshold: number | null
  createdAt: string
  updatedAt: string
}
