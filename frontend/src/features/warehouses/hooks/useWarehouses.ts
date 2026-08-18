import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { getApiErrorMessage } from '@/services/api/error-handler'

import type { WarehouseFormValues } from '../schemas/warehouse.schema'
import {
  createWarehouse,
  deleteWarehouse,
  getWarehouses,
  updateWarehouse,
} from '../services/warehouses.api'

const WAREHOUSES_KEY = ['warehouses']

export function useWarehouses() {
  return useQuery({ queryKey: WAREHOUSES_KEY, queryFn: getWarehouses })
}

export function useCreateWarehouse() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createWarehouse,
    onSuccess: ({ message }) => {
      queryClient.invalidateQueries({ queryKey: WAREHOUSES_KEY })
      toast.success(message)
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  })
}

export function useUpdateWarehouse() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: WarehouseFormValues }) =>
      updateWarehouse(id, payload),
    onSuccess: ({ message }) => {
      queryClient.invalidateQueries({ queryKey: WAREHOUSES_KEY })
      toast.success(message)
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  })
}

export function useDeleteWarehouse() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteWarehouse,
    onSuccess: ({ message }) => {
      queryClient.invalidateQueries({ queryKey: WAREHOUSES_KEY })
      toast.success(message)
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  })
}
