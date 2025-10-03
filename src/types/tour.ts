export type PackageTypeTransport = "Basico" | "Premium"

export interface GeoLocation {
  name: string
  lat: number
  lng: number
}

export interface RouteStop {
  location: string
  description: string
  imageUrl?: string
  imageId?: string
  stopTime?: string
}

export interface ItineraryDay {
  day: number
  title: string | TranslatedText
  description: string | TranslatedText
  imageUrl: string
  imageId: string
  activities?: (string | TranslatedText)[]
  route?: RouteStop[]
  meals?: string[]
  accommodation?: string
}

export interface TourTransport {
  _id: string
  title: string
  description: string
  termsAndConditions: string
  origin: GeoLocation
  destination: GeoLocation
  intermediateStops: GeoLocation[]
  availableDays: string[]
  departureTime: string
  arrivalTime: string
  durationInHours: number
  duration: string
  price: number
  rating: number
  vehicleId: string
  routeCode: string
  isActive: boolean
  slug: string
  itinerary: ItineraryDay[]
  imageUrl: string
  imageId: string
  isFeatured: boolean
  createdAt: string
  updatedAt: string
}

export enum TourCategory {
  AVENTURA = "Aventura",
  CULTURAL = "Cultural",
  RELAJACION = "Relajación",
  NATURALEZA = "Naturaleza",
  TREKKING = "Trekking",
  PANORAMICO = "Panoramico",
  TRANSPORTE_TURISTICO = "Transporte Turistico",
}

export enum PackageType {
  Basico = "Basico",
  Premium = "Premium",
}

export enum Difficulty {
  EASY = "Facil",
  MODERATE = "Moderado",
  DIFFICULT = "Difícil",
}

export interface TranslatedText {
  es: string
  en: string
  fr: string
  de: string
  it: string
}

export interface Tour {
  _id: string
  title: TranslatedText
  subtitle: TranslatedText
  imageUrl: string
  imageId?: string
  price: number
  originalPrice?: number
  duration: TranslatedText
  rating: number
  reviews: number
  location: string
  region: string
  category: TourCategory
  difficulty: Difficulty
  packageType: PackageType
  highlights: TranslatedText[]
  featured?: boolean
  slug: string
  startTime: string
  itinerary?: ItineraryDay[]
  includes?: TranslatedText[]
  notIncludes?: TranslatedText[]
  toBring?: TranslatedText[]
  conditions?: TranslatedText[]
  transportOptionIds?: string[]
  createdAt: string
  updatedAt: string
}

export interface TransportOption {
  _id: string
  name: string
  description: string
  type: PackageType
  vehicle: string
  services: string[]
  imageUrl: string
  imageId?: string
  createdAt: string
  updatedAt: string
}

export interface CreateTourDto {
  title: TranslatedText
  subtitle: TranslatedText
  imageUrl: string
  imageId?: string
  price: number
  originalPrice?: number
  duration: TranslatedText
  rating: number
  reviews: number
  location: string
  region: string
  category: TourCategory
  difficulty: Difficulty
  packageType: PackageType
  highlights: TranslatedText[]
  featured?: boolean
  transportOptionIds?: string[]
  itinerary: ItineraryDay[]
  includes?: TranslatedText[]
  notIncludes?: TranslatedText[]
  toBring?: TranslatedText[]
  conditions?: TranslatedText[]
  slug: string
  startTime: string
}

export type UpdateTourDto = CreateTourDto

export interface TourTransportResponse {
  success: boolean
  message: string
  data: TourTransport[]
  meta: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

export interface TransportResponse {
  success: boolean
  message: string
  data: TransportOption[]
  meta: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

// Mock data for fallback (can be removed once API is fully integrated)
export const transportToursData: TourTransport[] = [
  {
    _id: "68cf0b306a74be42247a1797",
    title: "Transport from Cabanaconde to Cusco",
    description: "Comfortable trip from Cabanaconde to Cusco with scenic stops and cultural experiences.",
    termsAndConditions: "Reservation required 24h in advance. Arrive 15 minutes before departure.",
    origin: {
      name: "Cabanaconde, Arequipa, Perú",
      lat: -15.6225,
      lng: -71.8528,
    },
    destination: {
      name: "Cusco, Perú",
      lat: -13.5319,
      lng: -71.9675,
    },
    intermediateStops: [
      {
        name: "Yanque, Arequipa, Perú",
        lat: -15.7167,
        lng: -71.6333,
      },
      {
        name: "Sicuani, Cusco, Perú",
        lat: -14.2694,
        lng: -71.2269,
      },
    ],
    availableDays: ["Monday", "Wednesday", "Friday"],
    departureTime: "07:30 AM",
    arrivalTime: "05:00 PM",
    durationInHours: 9.5,
    duration: "9 horas 30 minutos",
    price: 150,
    rating: 4.6,
    vehicleId: "685abac224654a2b186c0e13",
    routeCode: "CAB-CUS-001",
    isActive: true,
    slug: "transporte-cabanaconde-cusco",
    itinerary: [
      {
        day: 1,
        title: "Route Cabanaconde - Cusco",
        description: "Stops in Yanque and Sicuani with stunning views and cultural activities.",
        imageUrl:
          "https://res.cloudinary.com/dwvikvjrq/image/upload/v1753737374/aca448d871c7a42445834bda4935b924_dmkq3p.jpg",
        imageId: "aca448d871c7a42445834bda4935b924_dmkq3p",
        route: [
          {
            location: "Yanque, Arequipa, Perú",
            description: "Town with hot springs and living culture.",
            imageUrl: "",
            imageId: "",
            stopTime: "10:00 AM",
          },
          {
            location: "Sicuani, Cusco, Perú",
            description: "Stop for lunch and rest.",
            imageUrl: "",
            imageId: "",
            stopTime: "01:00 PM",
          },
        ],
        meals: ["Breakfast", "Lunch", "Dinner"],
        accommodation: "Hotel in Cusco",
      },
    ],
    imageUrl:
      "https://res.cloudinary.com/dwvikvjrq/image/upload/v1753736716/d317ad6db4da5fb413c4a99f67eb5def34289d8c8c0efd3940f1d563eec7b985_l1pcsu.jpg",
    imageId: "d317ad6db4da5fb413c4a99f67eb5def34289d8c8c0efd3940f1d563eec7b985_l1pcsu",
    isFeatured: true,
    createdAt: "2025-09-20T20:14:40.939Z",
    updatedAt: "2025-09-20T20:14:40.939Z",
  },
]

// Tipo para el formulario interno (incluye transportes seleccionados)
export interface TourFormData extends Omit<CreateTourDto, "transportOptionIds"> {
  selectedTransports: TransportOption[] // Para mostrar en el formulario
  transportOptionIds?: string[] // Para enviar al backend
}
