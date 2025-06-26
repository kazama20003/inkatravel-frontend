// Interfaces base
export interface Customer {
  fullName: string
  email: string
  phone?: string
  nationality?: string
}

export interface TourComplete {
  _id: string
  title: string
  subtitle?: string
  price: number
  originalPrice?: number
  duration: string
  region: string
  imageUrl?: string
  imageId?: string
  rating?: number
  reviews?: number
  location?: string
  category?: string
  difficulty?: string
  packageType?: string
  highlights?: string[]
  featured?: boolean
  description?: string
  includes?: string[]
  notIncludes?: string[]
  toBring?: string[]
  conditions?: string[]
  slug?: string
  transportOptionIds?: Array<{
    _id: string
    type: string
    vehicle: string
    services: string[]
    imageUrl?: string
    imageId?: string
  }>
  itinerary?: Array<{
    day: number
    title: string
    description: string
    activities: string[]
    meals: string[]
    accommodation?: string
    route?: Array<{
      location: string
      description: string
      imageUrl?: string
      _id: string
    }>
    _id: string
  }>
  createdAt: string
  updatedAt: string
}

export interface Order {
  _id: string
  tour: TourComplete
  customer: Customer
  startDate: string
  people: number
  totalPrice: number
  status: "created" | "confirmed" | "cancelled" | "completed"
  paymentMethod?: string
  notes?: string
  discountCodeUsed?: string
  user?: {
    _id: string
    fullName: string
    email: string
  }
  createdAt: string
  updatedAt: string
}

// DTOs para crear y actualizar órdenes
export interface CreateOrderDto {
  tour: string
  customer: Customer
  startDate: string
  people: number
  totalPrice: number
  paymentMethod?: string
  notes?: string
  discountCodeUsed?: string
  user?: string
}

export interface UpdateOrderDto {
  tour?: string
  customer?: Customer
  startDate?: string
  people?: number
  totalPrice?: number
  paymentMethod?: string
  notes?: string
  discountCodeUsed?: string
  user?: string
}

// Interfaces para selección
export interface TourSelectionOption {
  _id: string
  title: string
  price: number
  duration: string
  region: string
}

export interface UserOption {
  _id: string
  fullName: string
  email: string
}

// Parámetros de consulta
export interface OrdersQueryParams {
  page?: number
  limit?: number
  search?: string
  status?: string
  startDate?: string
  endDate?: string
}

// Respuesta de la API
export interface OrdersResponse {
  data: Order[]
  meta: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
  message?: string
}

// Respuesta del backend (estructura original)
export interface OrderResponse {
  _id: string
  tour: string | TourComplete
  customer: Customer
  startDate: string
  people: number
  totalPrice: number
  status: string
  paymentMethod?: string
  notes?: string
  discountCodeUsed?: string
  user?: string | UserOption
  createdAt: string
  updatedAt: string
}
export interface CustomerInfoDto {
  fullName: string
  email: string
  phone?: string
  nationality?: string
}
export interface OrderItemDto {
  tour: string // MongoDB ObjectId
  startDate: string // ISO Date string
  people: number
  pricePerPerson: number
  total: number
  notes?: string
}