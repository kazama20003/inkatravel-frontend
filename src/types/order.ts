export interface OrderItem {
  tour: string | null
  startDate: string
  people: number
  notes: string
  pricePerPerson: number
  total: number
  _id: string
}

export interface Customer {
  fullName: string
  email: string
  phone: string
  nationality: string
  _id: string
}

export interface AppliedOffer {
  _id: string
  title: string
  discountPercentage: number
}

export interface User {
  _id: string
  fullName: string
  email: string
}

export interface Order {
  _id: string
  tour?: string
  customer: Customer
  startDate?: string
  people?: number
  totalPrice: number
  status: string
  paymentMethod: string
  notes: string
  appliedOffer: AppliedOffer | null
  discountCodeUsed: string
  user: User
  createdAt: string
  updatedAt: string
  items: OrderItem[]
  __v: number
}

export interface OrderApiResponse {
  message: string
  data: Order[]
  pagination: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

export function getStatusBadgeVariant(status: string): "default" | "secondary" | "destructive" | "outline" {
  switch (status.toLowerCase()) {
    case "created":
      return "secondary"
    case "confirmed":
      return "default"
    case "cancelled":
      return "destructive"
    default:
      return "outline"
  }
}

export function getStatusLabel(status: string): string {
  switch (status.toLowerCase()) {
    case "created":
      return "Creada"
    case "confirmed":
      return "Confirmada"
    case "cancelled":
      return "Cancelada"
    case "completed":
      return "Completada"
    default:
      return status
  }
}

export function getPaymentMethodLabel(method: string): string {
  switch (method.toLowerCase()) {
    case "tarjeta":
      return "Tarjeta"
    case "bcp":
      return "BCP"
    case "pending":
      return "Pendiente"
    case "efectivo":
      return "Efectivo"
    default:
      return method
  }
}
