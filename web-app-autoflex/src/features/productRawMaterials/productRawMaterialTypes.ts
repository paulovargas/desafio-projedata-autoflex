export interface ProductRawMaterial {
  id: number
  productId: number
  rawMaterialId: number
  requiredQuantity: number
}

export interface ProductRawMaterialPayload {
  productId: number
  rawMaterialId: number
  requiredQuantity: number
}
