import { Plus } from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/components/ui/Button'
import { Spinner } from '@/components/ui/Spinner'
import { DeleteProductDialog } from '@/features/products/components/DeleteProductDialog'
import { ProductFormDialog } from '@/features/products/components/ProductFormDialog'
import { ProductTable } from '@/features/products/components/ProductTable'
import {
  useCreateProduct,
  useDeleteProduct,
  useProducts,
  useUpdateProduct,
} from '@/features/products/hooks/useProducts'
import type { Product } from '@/features/products/types/product.types'

interface FormState {
  mode: 'create' | 'edit'
  product?: Product
}

export default function ProductsPage() {
  const { data: products = [], isLoading } = useProducts()
  const createProduct = useCreateProduct()
  const updateProduct = useUpdateProduct()
  const deleteProduct = useDeleteProduct()

  const [formState, setFormState] = useState<FormState | null>(null)
  const [productToDelete, setProductToDelete] = useState<Product | null>(null)

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">Sản phẩm</h1>
          <p className="text-sm text-muted-foreground">Danh mục sản phẩm, vật tư trong kho.</p>
        </div>
        <Button onClick={() => setFormState({ mode: 'create' })}>
          <Plus size={16} /> Thêm sản phẩm
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16">
          <Spinner size={28} />
        </div>
      ) : (
        <ProductTable
          products={products}
          onEdit={(product) => setFormState({ mode: 'edit', product })}
          onDelete={setProductToDelete}
        />
      )}

      <ProductFormDialog
        open={formState !== null}
        mode={formState?.mode ?? 'create'}
        defaultValues={
          formState?.product
            ? {
                name: formState.product.name,
                code: formState.product.code,
                unit: formState.product.unit,
                price: formState.product.price,
              }
            : undefined
        }
        submitting={createProduct.isPending || updateProduct.isPending}
        onClose={() => setFormState(null)}
        onSubmit={(values) => {
          if (formState?.mode === 'edit' && formState.product) {
            updateProduct.mutate(
              { id: formState.product.id, payload: values },
              { onSuccess: () => setFormState(null) },
            )
          } else {
            createProduct.mutate(values, { onSuccess: () => setFormState(null) })
          }
        }}
      />

      <DeleteProductDialog
        product={productToDelete}
        submitting={deleteProduct.isPending}
        onClose={() => setProductToDelete(null)}
        onConfirm={() => {
          if (!productToDelete) return
          deleteProduct.mutate(productToDelete.id, { onSuccess: () => setProductToDelete(null) })
        }}
      />
    </div>
  )
}
