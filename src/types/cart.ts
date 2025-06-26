export interface Tour {
  _id: string
  title: string
  imageUrl: string
  price: number
  slug: string
  location?: string
  duration?: string
  rating?: number
  description?: string
}

export interface CartItem {
  _id: string
  tour: Tour
  people: number
  pricePerPerson: number
  total: number
  startDate: string
  notes?: string
}

export interface CartResponse {
  _id: string
  user: string
  items: CartItem[]
  totalPrice: number
  createdAt: string
  updatedAt: string
}

export interface CartsApiResponse {
  success: boolean
  data: CartResponse[]
  message?: string
}

export interface UpdateCartItemDto {
  people?: number
  startDate?: string
  notes?: string
}
