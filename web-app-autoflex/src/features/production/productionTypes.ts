export interface ProductionSimulationItem {
  productId: number
  productName: string
  producibleQuantity: number
  totalValue: number
}

export interface ProductionSimulationResponse {
  items: ProductionSimulationItem[]
  totalProducibleQuantity: number
  totalValue: number
}
