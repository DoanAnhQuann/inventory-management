import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { createGoodsReceipt } from '../services/goods-receipts.api'

export function useCreateGoodsReceipt() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createGoodsReceipt,
    onSuccess: (receipt) => {
      queryClient.invalidateQueries({ queryKey: ['goods-receipts'] })
      toast.success(`Đã tạo phiếu nhập kho ${receipt.code}`)
    },
    onError: () => toast.error('Tạo phiếu nhập kho thất bại, thử lại sau'),
  })
}
