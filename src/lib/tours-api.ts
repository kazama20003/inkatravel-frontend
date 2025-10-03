import { api } from "@/lib/axiosInstance"
import type { Tour, CreateTourDto, UpdateTourDto } from "@/types/tour"
import { PackageType, TourCategory as TourCategoryEnum, Difficulty as DifficultyEnum } from "@/types/tour"

interface ToursResponse {
  success: boolean
  message: string
  data: Tour[]
  pagination: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

// Mock data for development
const mockToursData: Tour[] = [
  {
    _id: "tour_1",
    title: {
      es: "Machu Picchu 2 días",
      en: "Machu Picchu 2 days",
      fr: "Machu Picchu 2 jours",
      de: "Machu Picchu 2 Tage",
      it: "Machu Picchu 2 giorni",
    },
    subtitle: {
      es: "Descubre la ciudadela inca más famosa del mundo",
      en: "Discover the most famous Inca citadel in the world",
      fr: "Découvrez la citadelle inca la plus célèbre au monde",
      de: "Entdecken Sie die berühmteste Inka-Zitadelle der Welt",
      it: "Scopri la cittadella inca più famosa al mondo",
    },
    imageUrl: "/placeholder.svg?height=400&width=600&text=Machu+Picchu",
    imageId: "machu_picchu_main",
    price: 350,
    originalPrice: 400,
    duration: {
      es: "2 días y 1 noche",
      en: "2 days and 1 night",
      fr: "2 jours et 1 nuit",
      de: "2 Tage und 1 Nacht",
      it: "2 giorni e 1 notte",
    },
    rating: 4.8,
    reviews: 156,
    location: "Cusco",
    region: "Cusco",
    category: TourCategoryEnum.CULTURAL,
    difficulty: DifficultyEnum.MODERATE,
    packageType: PackageType.Premium,
    highlights: [
      {
        es: "Visita a Machu Picchu",
        en: "Visit to Machu Picchu",
        fr: "Visite du Machu Picchu",
        de: "Besuch von Machu Picchu",
        it: "Visita al Machu Picchu",
      },
    ],
    featured: true,
    slug: "machu-picchu-2-dias",
    startTime: "08:00 AM",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
]

export const toursApi = {
  // GET /tours - Get all tours with pagination
  getAll: async (page = 1, limit = 10): Promise<ToursResponse> => {
    try {
      const response = await api.get(`/tours?page=${page}&limit=${limit}`)
      return response.data
    } catch (error) {
      console.warn("API endpoint for tours not available, using fallback data:", error)
      // Fallback data when API is not available
      const startIndex = (page - 1) * limit
      const endIndex = startIndex + limit
      const paginatedTours = mockToursData.slice(startIndex, endIndex)

      return {
        success: true,
        message: "Tours obtenidos exitosamente (datos de desarrollo)",
        data: paginatedTours,
        pagination: {
          total: mockToursData.length,
          page,
          limit,
          totalPages: Math.ceil(mockToursData.length / limit),
        },
      }
    }
  },

  // GET /tours/:id - Get tour by ID
  getById: async (id: string): Promise<Tour> => {
    try {
      const response = await api.get(`/all/tours/${id}`)
      return response.data.data || response.data
    } catch (error) {
      console.warn(`API endpoint for tour ${id} not available, using fallback data:`, error)
      const mockTour = mockToursData.find((tour) => tour._id === id)
      if (mockTour) {
        return mockTour
      }
      throw new Error(`Tour with ID ${id} not found`)
    }
  },

  // GET /tours/slug/:slug - Get tour by slug
  getBySlug: async (slug: string): Promise<Tour> => {
    try {
      const response = await api.get(`/tours/slug/${slug}`)
      return response.data.data || response.data
    } catch (error) {
      console.warn(`API endpoint for tour slug ${slug} not available, using fallback data:`, error)
      const mockTour = mockToursData.find((tour) => tour.slug === slug)
      if (mockTour) {
        return mockTour
      }
      throw new Error(`Tour with slug ${slug} not found`)
    }
  },

  // POST /tours - Create a new tour
  create: async (data: CreateTourDto): Promise<Tour> => {
    try {
      const response = await api.post("/tours", data)
      return response.data.data || response.data
    } catch (error) {
      console.warn("API endpoint for creating tour not available, using fallback:", error)
      const newTour: Tour = {
        _id: `tour_${Date.now()}`,
        ...data,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      mockToursData.push(newTour)
      return newTour
    }
  },

  // PATCH /tours/:id - Update a tour
  update: async (id: string, data: UpdateTourDto): Promise<Tour> => {
    try {
      const response = await api.patch(`/tours/${id}`, data)
      return response.data.data || response.data
    } catch (error) {
      console.warn(`API endpoint for updating tour ${id} not available, using fallback:`, error)
      const index = mockToursData.findIndex((t) => t._id === id)
      if (index !== -1) {
        mockToursData[index] = {
          ...mockToursData[index],
          ...data,
          updatedAt: new Date().toISOString(),
        } as Tour
        return mockToursData[index]
      }
      throw new Error(`Tour with ID ${id} not found`)
    }
  },

  // DELETE /tours/:id - Delete a tour
  delete: async (id: string): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await api.delete(`/tours/${id}`)
      return response.data
    } catch (error) {
      console.warn(`API endpoint for deleting tour ${id} not available, using fallback:`, error)
      const index = mockToursData.findIndex((t) => t._id === id)
      if (index !== -1) {
        mockToursData.splice(index, 1)
        return { success: true, message: "Tour eliminado exitosamente (desarrollo)" }
      }
      throw new Error(`Tour with ID ${id} not found`)
    }
  },
}
