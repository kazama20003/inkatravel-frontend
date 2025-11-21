export interface CartItem {
  productType: string
  productId: string
  startDate: string
  people: number
  pricePerPerson: number
  total: number
  notes?: string
  productTitle: string
  productImageUrl: string
  productSlug: string
}

export interface SyncCartRequest {
  items: CartItem[]
  totalPrice?: number
}

export interface SyncCartResponse {
  success: boolean
  synced: number
  data?: unknown
  error?: string
}
