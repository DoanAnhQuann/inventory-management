import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { getApiErrorMessage } from '@/services/api/error-handler'

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
    onSuccess: ({ message }) => {
      queryClient.invalidateQueries({ queryKey: PRODUCTS_KEY })
      toast.success(message)
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  })
}

export function useUpdateProduct() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: ProductFormValues }) =>
      updateProduct(id, payload),
    onSuccess: ({ message }) => {
      queryClient.invalidateQueries({ queryKey: PRODUCTS_KEY })
      toast.success(message)
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  })
}

export function useDeleteProduct() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteProduct,
    onSuccess: ({ message }) => {
      queryClient.invalidateQueries({ queryKey: PRODUCTS_KEY })
      toast.success(message)
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  })
}
