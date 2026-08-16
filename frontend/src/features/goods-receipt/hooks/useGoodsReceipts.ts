import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { createGoodsReceipt, getGoodsReceipts } from '../services/goods-receipts.api'

const GOODS_RECEIPTS_KEY = ['goods-receipts']

export function useGoodsReceipts() {
  return useQuery({ queryKey: GOODS_RECEIPTS_KEY, queryFn: getGoodsReceipts })
}

export function useCreateGoodsReceipt() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createGoodsReceipt,
    onSuccess: (receipt) => {
      queryClient.invalidateQueries({ queryKey: GOODS_RECEIPTS_KEY })
      toast.success(`Đã tạo phiếu nhập kho ${receipt.code}`)
    },
    onError: () => toast.error('Tạo phiếu nhập kho thất bại, thử lại sau'),
  })
}
