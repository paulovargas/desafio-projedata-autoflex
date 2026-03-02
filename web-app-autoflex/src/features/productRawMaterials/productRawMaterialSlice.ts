import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { api } from '../../services/api'
import type { ProductRawMaterial, ProductRawMaterialPayload } from './productRawMaterialTypes'

type ProductRawMaterialApi = {
  id: number
  productId: number
  rawMaterialId: number
  requiredQuantity: number | string
}

interface ProductRawMaterialsState {
  items: ProductRawMaterial[]
  currentProductId: number | null
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
  mutationStatus: 'idle' | 'loading' | 'succeeded' | 'failed'
  error: string | null
  mutationError: string | null
}

const initialState: ProductRawMaterialsState = {
  items: [],
  currentProductId: null,
  status: 'idle',
  mutationStatus: 'idle',
  error: null,
  mutationError: null,
}

const normalize = (item: ProductRawMaterialApi): ProductRawMaterial => ({
  id: Number(item.id),
  productId: Number(item.productId),
  rawMaterialId: Number(item.rawMaterialId),
  requiredQuantity: Number(item.requiredQuantity),
})

export const fetchProductRawMaterialsByProduct = createAsyncThunk<
  { productId: number; items: ProductRawMaterial[] },
  number
>('productRawMaterials/fetchByProduct', async (productId) => {
  const response = await api.get<ProductRawMaterialApi[]>(`/product-raw-materials/product/${productId}`)
  return {
    productId,
    items: response.data.map(normalize),
  }
})

export const createProductRawMaterial = createAsyncThunk<ProductRawMaterial, ProductRawMaterialPayload>(
  'productRawMaterials/create',
  async (payload) => {
    const response = await api.post<ProductRawMaterialApi>('/product-raw-materials', payload)
    return normalize(response.data)
  }
)

export const updateProductRawMaterial = createAsyncThunk<ProductRawMaterial, ProductRawMaterial>(
  'productRawMaterials/update',
  async (payload) => {
    const response = await api.put<ProductRawMaterialApi>(`/product-raw-materials/${payload.id}`, payload)
    return normalize(response.data)
  }
)

export const deleteProductRawMaterial = createAsyncThunk<number, number>(
  'productRawMaterials/delete',
  async (id) => {
    await api.delete(`/product-raw-materials/${id}`)
    return id
  }
)

const productRawMaterialSlice = createSlice({
  name: 'productRawMaterials',
  initialState,
  reducers: {
    clearProductRawMaterialMutationState: (state) => {
      state.mutationStatus = 'idle'
      state.mutationError = null
    },
    clearProductRawMaterialsList: (state) => {
      state.items = []
      state.currentProductId = null
      state.status = 'idle'
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProductRawMaterialsByProduct.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(fetchProductRawMaterialsByProduct.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.currentProductId = action.payload.productId
        state.items = action.payload.items
      })
      .addCase(fetchProductRawMaterialsByProduct.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message || 'Erro ao carregar composicao do produto'
      })
      .addCase(createProductRawMaterial.pending, (state) => {
        state.mutationStatus = 'loading'
        state.mutationError = null
      })
      .addCase(createProductRawMaterial.fulfilled, (state, action) => {
        state.mutationStatus = 'succeeded'
        state.items.push(action.payload)
      })
      .addCase(createProductRawMaterial.rejected, (state, action) => {
        state.mutationStatus = 'failed'
        state.mutationError = action.error.message || 'Erro ao vincular materia-prima'
      })
      .addCase(updateProductRawMaterial.pending, (state) => {
        state.mutationStatus = 'loading'
        state.mutationError = null
      })
      .addCase(updateProductRawMaterial.fulfilled, (state, action) => {
        state.mutationStatus = 'succeeded'
        const index = state.items.findIndex((item) => item.id === action.payload.id)
        if (index >= 0) {
          state.items[index] = action.payload
        }
      })
      .addCase(updateProductRawMaterial.rejected, (state, action) => {
        state.mutationStatus = 'failed'
        state.mutationError = action.error.message || 'Erro ao atualizar composicao do produto'
      })
      .addCase(deleteProductRawMaterial.pending, (state) => {
        state.mutationStatus = 'loading'
        state.mutationError = null
      })
      .addCase(deleteProductRawMaterial.fulfilled, (state, action) => {
        state.mutationStatus = 'succeeded'
        state.items = state.items.filter((item) => item.id !== action.payload)
      })
      .addCase(deleteProductRawMaterial.rejected, (state, action) => {
        state.mutationStatus = 'failed'
        state.mutationError = action.error.message || 'Erro ao remover materia-prima'
      })
  },
})

export const { clearProductRawMaterialMutationState, clearProductRawMaterialsList } =
  productRawMaterialSlice.actions
export default productRawMaterialSlice.reducer
