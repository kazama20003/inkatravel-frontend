// Enum for product types, matching backend's CartItemType
export enum CartItemType {
  Tour = "Tour",
  Transport = "TourTransport",
}

// Cart item with denormalized product info, matching backend's CartItemDto
export interface CartItem {
  _id: string
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

// Cart interface (as stored in DB)
export interface Cart {
  _id: string
  user?: string
  items: CartItem[]
  totalPrice: number
  createdAt: string
  updatedAt: string
}

// DTO for creating a cart
export interface CreateCartDto {
  userId?: string
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

// DTO for updating a cart
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

// DTO for adding a single item to the cart
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

// API response for cart operations
export interface CartResponse {
  success: boolean
  data: Cart[]
  message?: string
  meta?: {
    total: number
  }
}

// API response for cart operations (add, remove, update)
export interface CartOperationResponse {
  success: boolean
  message: string
  data?: Cart
}
