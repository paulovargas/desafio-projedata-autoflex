import { configureStore } from '@reduxjs/toolkit'
import productReducer from '../features/products/productSlice'
import productRawMaterialReducer from '../features/productRawMaterials/productRawMaterialSlice'
import productionReducer from '../features/production/productionSlice'
import rawMaterialReducer from '../features/rawMaterials/rawMaterialSlice'

export const store = configureStore({
    reducer: {
        products: productReducer,
        productRawMaterials: productRawMaterialReducer,
        rawMaterials: rawMaterialReducer,
        production: productionReducer,
    }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
