import { api } from "./axiosInstance"
import type { TransportOption, TransportResponse } from "@/types/transport"
import { PackageType } from "@/types/tour"

const mockTransportsData: TransportOption[] = [
  {
    _id: "685abac224654a2b186c0e13",
    name: "Toyota Runner",
    description: "Vehículo cómodo y confiable para tours básicos",
    type: PackageType.Basico,
    vehicle: "Toyota Runner",
    services: ["Aire Acondicionado", "WiFi", "Asientos Cómodos"],
    imageUrl: "/placeholder.svg?height=200&width=300&text=Toyota+Runner",
    imageId: "mock-toyota-runner",
    createdAt: "2025-06-24T14:48:34.057Z",
    updatedAt: "2025-06-24T14:48:34.057Z",
  },
  {
    _id: "685abc97bf63385f7004c534",
    name: "Vans Sprinter",
    description: "Van premium con todas las comodidades para grupos",
    type: PackageType.Premium,
    vehicle: "Vans Sprinter",
    services: ["Aire Acondicionado", "WiFi", "Asientos Reclinables"],
    imageUrl: "/placeholder.svg?height=200&width=300&text=Vans+Sprinter",
    imageId: "mock-vans-sprinter",
    createdAt: "2025-06-24T14:56:23.071Z",
    updatedAt: "2025-06-24T14:56:23.071Z",
  },
]

export const transportApi = {
  // GET /transport - Get all transports with pagination
  getAll: async (page = 1, limit = 10): Promise<TransportResponse> => {
    try {
      const response = await api.get(`/transport?page=${page}&limit=${limit}`)
      return response.data
    } catch (error) {
      console.warn("API endpoint for transports not available, using fallback data:", error)
      console.info("Using fallback data for transports")
      const startIndex = (page - 1) * limit
      const endIndex = startIndex + limit
      const paginatedTransports = mockTransportsData.slice(startIndex, endIndex)

      return {
        success: true,
        message: "Transportes obtenidos exitosamente (datos de desarrollo)",
        data: paginatedTransports,
        meta: {
          total: mockTransportsData.length,
          page,
          limit,
          totalPages: Math.ceil(mockTransportsData.length / limit),
        },
      }
    }
  },

  // GET /transport/:id - Get transport by ID
  getById: async (id: string): Promise<TransportOption> => {
    try {
      const response = await api.get(`/transport/${id}`)
      return response.data.data || response.data
    } catch (error) {
      console.warn(`API endpoint for transport ${id} not available, using fallback data:`, error)
      console.info(`Using fallback data for transport ${id}`)
      const mockTransport = mockTransportsData.find((transport) => transport._id === id)
      if (mockTransport) {
        return mockTransport
      }
      return {
        _id: id,
        name: "Transporte Genérico",
        description: "Servicio de transporte básico",
        type: PackageType.Basico,
        vehicle: "Transporte Genérico",
        services: ["Servicio básico"],
        imageUrl: "/placeholder.svg?height=200&width=300&text=Transporte",
        imageId: "mock-transport",
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: "2025-06-24T00:00:00Z",
      }
    }
  },

  // POST /transport - Create a new transport
  create: async (data: Omit<TransportOption, "_id" | "createdAt" | "updatedAt">): Promise<TransportOption> => {
    try {
      const response = await api.post("/transport", data)
      return response.data.data || response.data
    } catch (error) {
      console.warn("API endpoint for creating transport not available, using fallback:", error)
      const newTransport: TransportOption = {
        _id: `mock-${Date.now()}`,
        name: data.name,
        description: data.description,
        type: data.type,
        vehicle: data.vehicle,
        services: data.services,
        imageUrl: data.imageUrl || "",
        imageId: data.imageId || "",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      mockTransportsData.push(newTransport)
      return newTransport
    }
  },

  // PATCH /transport/:id - Update a transport
  update: async (id: string, data: Partial<TransportOption>): Promise<TransportOption> => {
    try {
      const response = await api.patch(`/transport/${id}`, data)
      return response.data.data || response.data
    } catch (error) {
      console.warn(`API endpoint for updating transport ${id} not available, using fallback:`, error)
      const index = mockTransportsData.findIndex((t) => t._id === id)
      if (index !== -1) {
        mockTransportsData[index] = {
          ...mockTransportsData[index],
          ...data,
          updatedAt: new Date().toISOString(),
        }
        return mockTransportsData[index]
      }
      throw new Error(`Transport with ID ${id} not found`)
    }
  },

  // DELETE /transport/:id - Delete a transport
  delete: async (id: string): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await api.delete(`/transport/${id}`)
      return response.data
    } catch (error) {
      console.warn(`API endpoint for deleting transport ${id} not available, using fallback:`, error)
      const index = mockTransportsData.findIndex((t) => t._id === id)
      if (index !== -1) {
        mockTransportsData.splice(index, 1)
        return { success: true, message: "Transporte eliminado exitosamente (desarrollo)" }
      }
      throw new Error(`Transport with ID ${id} not found`)
    }
  },
}

export async function getTransportOptions(): Promise<TransportOption[]> {
  try {
    const response = await transportApi.getAll(1, 100) // Get first 100 transports
    return response.data
  } catch (error) {
    console.error("Error fetching transport options:", error)
    return []
  }
}
