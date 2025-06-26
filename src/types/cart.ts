// Tipos para el carrito de compras
export interface CartItem {
  _id?: string
  tour: string // ID del tour
  startDate: string // Fecha de inicio en formato ISO
  people: number // Número de personas
  pricePerPerson: number // Precio por persona
  total: number // Total del item
  notes?: string // Notas adicionales
}

export interface Cart {
  _id?: string
  user?: string // ID del usuario (opcional para carritos de invitados)
  items: CartItem[]
  totalPrice: number
  createdAt?: string
  updatedAt?: string
}

// DTO para crear un carrito
export interface CreateCartDto {
  items: CartItem[]
  totalPrice: number
}

// DTO para actualizar un carrito
export interface UpdateCartDto {
  items?: CartItem[]
  totalPrice?: number
}

// DTO para agregar un item al carrito
export interface AddToCartDto {
  tour: string
  startDate: string
  people: number
  pricePerPerson: number
  total: number
  notes?: string
}

// Respuesta del API para el carrito
export interface CartResponse {
  success: boolean
  data: Cart
  message?: string
}

// Respuesta del API para operaciones del carrito
export interface CartOperationResponse {
  success: boolean
  message: string
  data?: Cart
}
