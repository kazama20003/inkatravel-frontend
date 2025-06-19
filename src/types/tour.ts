// Actualizado para coincidir EXACTAMENTE con el nuevo backend DTO
export type TransportType = "Premium" | "Básico"
export type Difficulty = "Fácil" | "Moderado" | "Difícil"
export type TourCategory = "Aventura" | "Cultural" | "Relax" | "Naturaleza"

export interface RoutePoint {
  location: string
  description?: string
  imageId?: string
  imageUrl?: string
}

export interface ItineraryDay {
  day: number
  title: string
  description: string
  activities: string[]
  meals?: string[]
  accommodation?: string
  imageId?: string
  imageUrl?: string
  route: RoutePoint[] // Agregado según el nuevo DTO
}

export interface TransportOption {
  type: TransportType
  vehicle: string
  services: string[]
}

export interface Tour {
  _id: string
  title: string
  subtitle: string
  imageUrl: string
  imageId?: string
  price: number
  priceGroup?: number
  originalPrice?: number
  duration: string
  rating: number
  reviews: number
  location: string
  region: string
  category: TourCategory // Cambiado a enum
  difficulty: Difficulty
  highlights: string[]
  featured?: boolean
  transportOptions?: TransportOption[] // Ahora opcional
  itinerary?: ItineraryDay[]
  includes?: string[]
  notIncludes?: string[]
  toBring?: string[]
  conditions?: string[]
  createdAt: string
  updatedAt: string
}

// DTO que coincide EXACTAMENTE con el backend
export interface CreateTourDto {
  title: string
  subtitle: string
  imageUrl: string
  imageId?: string
  price: number
  priceGroup?: number
  originalPrice?: number
  duration: string
  rating: number
  reviews: number
  location: string
  region: string
  category: TourCategory // Cambiado a enum
  difficulty: Difficulty
  highlights: string[]
  featured?: boolean
  transportOptions?: TransportOption[] // Ahora opcional
  itinerary?: ItineraryDay[]
  includes?: string[]
  notIncludes?: string[]
  toBring?: string[]
  conditions?: string[]
}

export interface UpdateTourDto {
  title?: string
  subtitle?: string
  imageUrl?: string
  imageId?: string
  price?: number
  priceGroup?: number
  originalPrice?: number
  duration?: string
  rating?: number
  reviews?: number
  location?: string
  region?: string
  category?: TourCategory
  difficulty?: Difficulty
  highlights?: string[]
  featured?: boolean
  transportOptions?: TransportOption[]
  itinerary?: ItineraryDay[]
  includes?: string[]
  notIncludes?: string[]
  toBring?: string[]
  conditions?: string[]
}

// Usamos CreateTourDto directamente para el formulario
export type TourFormData = CreateTourDto
