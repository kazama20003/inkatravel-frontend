// Tipos específicos para el módulo de transportes
// Este archivo define tipos independientes para el sistema de gestión de transportes

import type { PackageTypeTransport } from "./tour"

// Enum para PackageType compatible con PackageTypeTransport
export enum PackageType {
  BASICO = "Basico",
  PREMIUM = "Premium",
}

// TransportOption para el módulo de gestión de transportes
export interface TransportOption {
  _id: string
  name: string
  description?: string
  type: PackageTypeTransport
  vehicle: string
  services: string[]
  imageUrl?: string
  imageId?: string
  createdAt: string
  updatedAt: string
}

// DTO para crear transporte
export interface CreateTransportDto {
  name: string
  description?: string
  type: PackageTypeTransport
  vehicle: string
  services: string[]
  imageUrl?: string
  imageId?: string
}

// DTO para actualizar transporte
export interface UpdateTransportDto {
  name?: string
  description?: string
  type?: PackageTypeTransport
  vehicle?: string
  services?: string[]
  imageUrl?: string
  imageId?: string
}

// Respuesta de la API
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
