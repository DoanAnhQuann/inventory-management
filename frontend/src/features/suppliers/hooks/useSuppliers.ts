import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { getApiErrorMessage } from '@/services/api/error-handler'

import type { SupplierFormValues } from '../schemas/supplier.schema'
import {
  createSupplier,
  deleteSupplier,
  getSuppliers,
  updateSupplier,
} from '../services/suppliers.api'

export const SUPPLIERS_KEY = ['suppliers']

export function useSuppliers() {
  return useQuery({ queryKey: SUPPLIERS_KEY, queryFn: getSuppliers })
}

export function useCreateSupplier() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createSupplier,
    onSuccess: ({ message }) => {
      queryClient.invalidateQueries({ queryKey: SUPPLIERS_KEY })
      toast.success(message)
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  })
}

export function useUpdateSupplier() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: SupplierFormValues }) =>
      updateSupplier(id, payload),
    onSuccess: ({ message }) => {
      queryClient.invalidateQueries({ queryKey: SUPPLIERS_KEY })
      toast.success(message)
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  })
}

export function useDeleteSupplier() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteSupplier,
    onSuccess: ({ message }) => {
      queryClient.invalidateQueries({ queryKey: SUPPLIERS_KEY })
      toast.success(message)
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  })
}
