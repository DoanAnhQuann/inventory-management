import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import type { ProductFormValues } from '../schemas/product.schema'
import { createProduct, deleteProduct, getProducts, updateProduct } from '../services/products.api'

const PRODUCTS_KEY = ['products']

export function useProducts() {
  return useQuery({ queryKey: PRODUCTS_KEY, queryFn: getProducts })
}

export function useCreateProduct() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PRODUCTS_KEY })
      toast.success('Đã thêm sản phẩm mới')
    },
    onError: () => toast.error('Thêm sản phẩm thất bại, thử lại sau'),
  })
}

export function useUpdateProduct() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: ProductFormValues }) =>
      updateProduct(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PRODUCTS_KEY })
      toast.success('Đã cập nhật sản phẩm')
    },
    onError: () => toast.error('Cập nhật sản phẩm thất bại, thử lại sau'),
  })
}

export function useDeleteProduct() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PRODUCTS_KEY })
      toast.success('Đã xoá sản phẩm')
    },
    onError: () => toast.error('Xoá sản phẩm thất bại, thử lại sau'),
  })
}
