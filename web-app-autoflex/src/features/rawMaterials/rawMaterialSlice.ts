import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { api } from '../../services/api'
import type { RawMaterial, RawMaterialPayload } from './rawMaterialTypes'

type RawMaterialApi = {
  id: number
  name: string
  stockQuantity?: number | string | null
  quantity?: number | null
}

interface RawMaterialsState {
  items: RawMaterial[]
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
  mutationStatus: 'idle' | 'loading' | 'succeeded' | 'failed'
  error: string | null
  mutationError: string | null
}

const initialState: RawMaterialsState = {
  items: [],
  status: 'idle',
  mutationStatus: 'idle',
  error: null,
  mutationError: null,
}

const normalizeRawMaterial = (item: RawMaterialApi): RawMaterial => ({
  id: item.id,
  name: item.name,
  stockQuantity: Number(item.stockQuantity ?? item.quantity ?? 0),
})

export const fetchRawMaterials = createAsyncThunk<RawMaterial[]>(
  'rawMaterials/fetchRawMaterials',
  async () => {
    const response = await api.get<RawMaterialApi[]>('/raw-materials')
    return response.data.map(normalizeRawMaterial)
  }
)

export const createRawMaterial = createAsyncThunk<RawMaterial, RawMaterialPayload>(
  'rawMaterials/createRawMaterial',
  async (payload) => {
    const response = await api.post<RawMaterialApi>('/raw-materials', payload)
    return normalizeRawMaterial(response.data)
  }
)

export const updateRawMaterial = createAsyncThunk<RawMaterial, RawMaterial>(
  'rawMaterials/updateRawMaterial',
  async (payload) => {
    const response = await api.put<RawMaterialApi>(`/raw-materials/${payload.id}`, payload)
    return normalizeRawMaterial(response.data)
  }
)

export const deleteRawMaterial = createAsyncThunk<number, number>(
  'rawMaterials/deleteRawMaterial',
  async (id) => {
    await api.delete(`/raw-materials/${id}`)
    return id
  }
)

const rawMaterialSlice = createSlice({
  name: 'rawMaterials',
  initialState,
  reducers: {
    clearRawMaterialsMutationState: (state) => {
      state.mutationStatus = 'idle'
      state.mutationError = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRawMaterials.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(fetchRawMaterials.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.items = action.payload
      })
      .addCase(fetchRawMaterials.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message || 'Erro ao carregar matérias-primas'
      })
      .addCase(createRawMaterial.pending, (state) => {
        state.mutationStatus = 'loading'
        state.mutationError = null
      })
      .addCase(createRawMaterial.fulfilled, (state, action) => {
        state.mutationStatus = 'succeeded'
        state.items.push(action.payload)
      })
      .addCase(createRawMaterial.rejected, (state, action) => {
        state.mutationStatus = 'failed'
        state.mutationError = action.error.message || 'Erro ao cadastrar matéria-prima'
      })
      .addCase(updateRawMaterial.pending, (state) => {
        state.mutationStatus = 'loading'
        state.mutationError = null
      })
      .addCase(updateRawMaterial.fulfilled, (state, action) => {
        state.mutationStatus = 'succeeded'
        const index = state.items.findIndex((item) => item.id === action.payload.id)
        if (index >= 0) {
          state.items[index] = action.payload
        }
      })
      .addCase(updateRawMaterial.rejected, (state, action) => {
        state.mutationStatus = 'failed'
        state.mutationError = action.error.message || 'Erro ao atualizar matéria-prima'
      })
      .addCase(deleteRawMaterial.pending, (state) => {
        state.mutationStatus = 'loading'
        state.mutationError = null
      })
      .addCase(deleteRawMaterial.fulfilled, (state, action) => {
        state.mutationStatus = 'succeeded'
        state.items = state.items.filter((item) => item.id !== action.payload)
      })
      .addCase(deleteRawMaterial.rejected, (state, action) => {
        state.mutationStatus = 'failed'
        state.mutationError = action.error.message || 'Erro ao excluir matéria-prima'
      })
  },
})

export const { clearRawMaterialsMutationState } = rawMaterialSlice.actions
export default rawMaterialSlice.reducer
