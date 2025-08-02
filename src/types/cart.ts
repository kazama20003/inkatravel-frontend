// Enum for product types, matching backend's CartItemType
export enum CartItemType {
  Tour = "Tour",
  Transport = "TourTransport",
}

// Cart item with denormalized product info, matching backend's CartItemDto
export interface CartItem {
  _id: string // This is typically added by the DB, not part of the DTO for creation
  productType: CartItemType
  productId: string
  startDate: string
  people: number
  pricePerPerson: number
  total: number
  notes?: string
  productTitle?: string
  productImageUrl?: string
  productSlug?: string
  // Removed 'tour?: Tour' as per backend DTO
}

// Cart interface (as stored in DB, might include _id and user)
export interface Cart {
  _id: string
  user?: string // ID del usuario (opcional para carritos de invitados)
  items: CartItem[] // Now uses the updated CartItem
  totalPrice: number
  createdAt: string
  updatedAt: string
}

// DTO for creating a cart (what frontend sends to backend), matching backend's CreateCartDto
export interface CreateCartDto {
  userId?: string // Optional userId as per backend DTO
  items: Array<{
    productType: CartItemType
    productId: string
    startDate: string
    people: number
    pricePerPerson: number
    total: number
    notes?: string
    productTitle?: string
    productImageUrl?: string
    productSlug?: string
  }>
  totalPrice: number
}

// DTO for updating a cart (what frontend sends to backend)
export interface UpdateCartDto {
  items?: Array<{
    productType: CartItemType
    productId: string
    startDate: string
    people: number
    pricePerPerson: number
    total: number
    notes?: string
    productTitle?: string
    productImageUrl?: string
    productSlug?: string
  }>
  totalPrice?: number
}

// DTO for adding a single item to the cart (if used separately)
export interface AddToCartDto {
  productType: CartItemType
  productId: string
  startDate: string
  people: number
  pricePerPerson: number
  total: number
  notes?: string
  productTitle?: string
  productImageUrl?: string
  productSlug?: string
}

// DTO for updating a specific item within the cart
export interface UpdateCartItemDto {
  startDate?: string
  people?: number
  notes?: string
}

// Respuesta del API para el carrito - CORREGIDA para reflejar que 'data' es un array de Cart
export interface CartResponse {
  success: boolean
  data: Cart[] // Cambiado a un array de Cart
  message?: string
  meta?: {
    total: number
    // Otros campos de meta si existen
  }
}

// API response for cart operations (e.g., add, remove, update)
export interface CartOperationResponse {
  success: boolean
  message: string
  data?: Cart
}
