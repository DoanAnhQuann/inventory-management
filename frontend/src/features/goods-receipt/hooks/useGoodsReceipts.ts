import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { PRODUCTS_KEY } from '@/features/products/hooks/useProducts'
import { SUPPLIERS_KEY } from '@/features/suppliers/hooks/useSuppliers'
import { WAREHOUSES_KEY } from '@/features/warehouses/hooks/useWarehouses'
import { getApiErrorMessage } from '@/services/api/error-handler'

import { createGoodsReceipt, getGoodsReceipts } from '../services/goods-receipts.api'

const GOODS_RECEIPTS_KEY = ['goods-receipts']

export function useGoodsReceipts() {
  return useQuery({ queryKey: GOODS_RECEIPTS_KEY, queryFn: getGoodsReceipts })
}

export function useCreateGoodsReceipt() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createGoodsReceipt,
    onSuccess: ({ message }) => {
      queryClient.invalidateQueries({ queryKey: GOODS_RECEIPTS_KEY })
      queryClient.invalidateQueries({ queryKey: WAREHOUSES_KEY })
      queryClient.invalidateQueries({ queryKey: SUPPLIERS_KEY })
      queryClient.invalidateQueries({ queryKey: PRODUCTS_KEY })
      toast.success(message)
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  })
}
