// Backend DTO types matching the NestJS class-validator DTOs

export interface TranslatedText {
  es?: string
  en?: string
  fr?: string
  de?: string
  it?: string
}

export interface GeoLocation {
  name?: string
  lat: number
  lng: number
}

export interface RouteStop {
  location: GeoLocation
  description: TranslatedText
  imageUrl?: string
  imageId?: string
  stopTime?: string
}

export interface ItineraryDay {
  day: number
  title: TranslatedText
  description: TranslatedText
  imageUrl: string
  imageId: string
  route?: RouteStop[]
}

export interface CreateTourTransportDto {
  title: TranslatedText
  description: TranslatedText
  termsAndConditions: TranslatedText
  origin: GeoLocation
  destination: GeoLocation
  intermediateStops?: GeoLocation[]
  availableDays: string[]
  departureTime?: string
  arrivalTime?: string
  durationInHours?: number
  duration?: string
  price: number
  rating?: number
  vehicleId?: string
  routeCode?: string
  isActive?: boolean
  isFeatured?: boolean
  slug?: string
  itinerary?: ItineraryDay[]
  imageUrl?: string
  imageId?: string
}

export type UpdateTourTransportDto = CreateTourTransportDto

export interface TourTransport {
  _id: string
  title: TranslatedText
  description: TranslatedText
  termsAndConditions: TranslatedText
  origin: GeoLocation
  destination: GeoLocation
  intermediateStops?: GeoLocation[]
  availableDays: string[]
  departureTime: string
  arrivalTime: string
  durationInHours: number
  duration: string
  price: number
  rating?: number
  vehicleId?: string
  routeCode: string
  isActive: boolean
  slug: string
  itinerary?: ItineraryDay[]
  imageUrl?: string
  imageId?: string
  isFeatured: boolean
  createdAt: string
  updatedAt: string
  __v?: number
}

export interface TourTransportApiResponse {
  data: TourTransport[]
  total: number
}

export function getTranslatedText(text: TranslatedText | string | undefined, locale = "es"): string {
  if (!text) return ""

  // If it's already a string, return it directly
  if (typeof text === "string") return text

  // Try to get the text in the requested locale
  const localeKey = locale as keyof TranslatedText
  if (text[localeKey]) return text[localeKey] || ""

  // Fallback to Spanish, then English, then first available
  return text.es || text.en || text.fr || text.de || text.it || ""
}
