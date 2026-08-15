import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: WAREHOUSES_KEY })
      toast.success('Đã thêm kho mới')
    },
    onError: () => toast.error('Thêm kho thất bại, thử lại sau'),
  })
}

export function useUpdateWarehouse() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: WarehouseFormValues }) =>
      updateWarehouse(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: WAREHOUSES_KEY })
      toast.success('Đã cập nhật kho')
    },
    onError: () => toast.error('Cập nhật kho thất bại, thử lại sau'),
  })
}

export function useDeleteWarehouse() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteWarehouse,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: WAREHOUSES_KEY })
      toast.success('Đã xoá kho')
    },
    onError: () => toast.error('Xoá kho thất bại, thử lại sau'),
  })
}
