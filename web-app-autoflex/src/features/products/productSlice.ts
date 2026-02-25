import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { api } from '../../services/api'
import type { Product, ProductPayload } from './productTypes'

interface ProductState {
  items: Product[]
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
  mutationStatus: 'idle' | 'loading' | 'succeeded' | 'failed'
  error: string | null
  mutationError: string | null
}

const initialState: ProductState = {
  items: [],
  status: 'idle',
  mutationStatus: 'idle',
  error: null,
  mutationError: null,
}

export const fetchProducts = createAsyncThunk<Product[]>(
  'products/fetchProducts',
  async () => {
    const response = await api.get<Product[]>('/products')
    return response.data
  }
)

export const createProduct = createAsyncThunk<Product, ProductPayload>(
  'products/createProduct',
  async (payload) => {
    const response = await api.post<Product>('/products', payload)
    return response.data
  }
)

export const updateProduct = createAsyncThunk<Product, Product>(
  'products/updateProduct',
  async (payload) => {
    const response = await api.put<Product>(`/products/${payload.id}`, payload)
    return response.data
  }
)

export const deleteProduct = createAsyncThunk<number, number>(
  'products/deleteProduct',
  async (id) => {
    await api.delete(`/products/${id}`)
    return id
  }
)

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    clearMutationState: (state) => {
      state.mutationStatus = 'idle'
      state.mutationError = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.items = action.payload
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message || 'Error loading products'
      })
      .addCase(createProduct.pending, (state) => {
        state.mutationStatus = 'loading'
        state.mutationError = null
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.mutationStatus = 'succeeded'
        state.items.push(action.payload)
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.mutationStatus = 'failed'
        state.mutationError = action.error.message || 'Error creating product'
      })
      .addCase(updateProduct.pending, (state) => {
        state.mutationStatus = 'loading'
        state.mutationError = null
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.mutationStatus = 'succeeded'
        const index = state.items.findIndex((item) => item.id === action.payload.id)
        if (index >= 0) {
          state.items[index] = action.payload
        }
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.mutationStatus = 'failed'
        state.mutationError = action.error.message || 'Error updating product'
      })
      .addCase(deleteProduct.pending, (state) => {
        state.mutationStatus = 'loading'
        state.mutationError = null
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.mutationStatus = 'succeeded'
        state.items = state.items.filter((item) => item.id !== action.payload)
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.mutationStatus = 'failed'
        state.mutationError = action.error.message || 'Error deleting product'
      })
  }
})

export const { clearMutationState } = productSlice.actions
export default productSlice.reducer
