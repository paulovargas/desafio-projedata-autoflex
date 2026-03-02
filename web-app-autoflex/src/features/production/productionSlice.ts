import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { api } from '../../services/api'
import type { ProductionSimulationItem, ProductionSimulationResponse } from './productionTypes'

type ProductionSimulationApi = {
  items?:
    | Array<{
        productId?: number | null
        productName?: string | null
        producibleQuantity?: number | null
        totalValue?: number | string | null
      }>
    | null
  productId?: number | null
  productName?: string | null
  producibleQuantity?: number | null
  totalValue?: number | string | null
  totalProducibleQuantity?: number | null
}

interface ProductionState {
  items: ProductionSimulationItem[]
  totalValue: number
  totalProducibleQuantity: number
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
  error: string | null
}

const initialState: ProductionState = {
  items: [],
  totalValue: 0,
  totalProducibleQuantity: 0,
  status: 'idle',
  error: null,
}

const normalizeProductionSimulationItem = (item: ProductionSimulationApi): ProductionSimulationItem => ({
  productId: Number(item.productId ?? 0),
  productName: String(item.productName ?? ''),
  producibleQuantity: Number(item.producibleQuantity ?? 0),
  totalValue: Number(item.totalValue ?? 0),
})

const normalizeProductionSimulationResponse = (payload: ProductionSimulationApi): ProductionSimulationResponse => {
  const items = Array.isArray(payload.items) ? payload.items.map(normalizeProductionSimulationItem) : []
  const fallbackTotalProducibleQuantity = items.reduce((sum, item) => sum + item.producibleQuantity, 0)
  const fallbackTotalValue = items.reduce((sum, item) => sum + item.totalValue, 0)

  return {
    items,
    totalProducibleQuantity: Number(payload.totalProducibleQuantity ?? fallbackTotalProducibleQuantity),
    totalValue: Number(payload.totalValue ?? fallbackTotalValue),
  }
}

export const fetchProductionSimulation = createAsyncThunk<ProductionSimulationResponse>(
  'production/fetchProductionSimulation',
  async () => {
    const response = await api.get<ProductionSimulationApi>('/products/production')
    return normalizeProductionSimulationResponse(response.data)
  }
)

const productionSlice = createSlice({
  name: 'production',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProductionSimulation.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(fetchProductionSimulation.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.items = action.payload.items
        state.totalValue = action.payload.totalValue
        state.totalProducibleQuantity = action.payload.totalProducibleQuantity
      })
      .addCase(fetchProductionSimulation.rejected, (state, action) => {
        state.status = 'failed'
        state.items = []
        state.totalValue = 0
        state.totalProducibleQuantity = 0
        state.error = action.error.message || 'Erro ao carregar simulacao de producao'
      })
  },
})

export default productionSlice.reducer
