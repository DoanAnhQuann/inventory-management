import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import type { SupplierFormValues } from '../schemas/supplier.schema'
import {
  createSupplier,
  deleteSupplier,
  getSuppliers,
  updateSupplier,
} from '../services/suppliers.api'

const SUPPLIERS_KEY = ['suppliers']

export function useSuppliers() {
  return useQuery({ queryKey: SUPPLIERS_KEY, queryFn: getSuppliers })
}

export function useCreateSupplier() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createSupplier,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SUPPLIERS_KEY })
      toast.success('Đã thêm nhà cung cấp mới')
    },
    onError: () => toast.error('Thêm nhà cung cấp thất bại, thử lại sau'),
  })
}

export function useUpdateSupplier() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: SupplierFormValues }) =>
      updateSupplier(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SUPPLIERS_KEY })
      toast.success('Đã cập nhật nhà cung cấp')
    },
    onError: () => toast.error('Cập nhật nhà cung cấp thất bại, thử lại sau'),
  })
}

export function useDeleteSupplier() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteSupplier,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SUPPLIERS_KEY })
      toast.success('Đã xoá nhà cung cấp')
    },
    onError: () => toast.error('Xoá nhà cung cấp thất bại, thử lại sau'),
  })
}
