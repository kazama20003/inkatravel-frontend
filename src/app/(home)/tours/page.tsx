"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { MapPin, Clock, Star, Users, AlertCircle, Search, Filter, X, ChevronDown } from "lucide-react"
import { api } from "@/lib/axiosInstance"
import type { Tour, TourCategory, Difficulty, PackageType } from "@/types/tour"

// Interfaces para filtros
interface TourFilters {
  page: number
  limit: number
  category?: TourCategory
  difficulty?: Difficulty
  packageType?: PackageType
  region?: string
  location?: string
}

// Componente para el texto circular giratorio
const SpinningText = ({ text = "RESERVAR • RESERVAR • " }: { text?: string }) => {
  return (
    <div className="relative w-12 h-12 md:w-16 md:h-16 lg:w-20 lg:h-20">
      <motion.div
        className="absolute inset-0"
        animate={{ rotate: 360 }}
        transition={{
          duration: 8,
          repeat: Number.POSITIVE_INFINITY,
          ease: "linear",
        }}
      >
        <svg className="w-full h-full" viewBox="0 0 100 100">
          <defs>
            <path id="circle" d="M 50, 50 m -28, 0 a 28,28 0 1,1 56,0 a 28,28 0 1,1 -56,0" />
          </defs>
          <text className="text-[5px] md:text-[6px] lg:text-[8px] fill-white font-medium tracking-wider brand-text">
            <textPath href="#circle" startOffset="0%">
              {text}
            </textPath>
          </text>
        </svg>
      </motion.div>

      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-4 h-4 md:w-6 md:h-6 lg:w-8 lg:h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
          <svg
            className="w-2 h-2 md:w-3 md:h-3 lg:w-4 lg:h-4 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </div>
  )
}

// Componente de Loading Skeleton
const LoadingSkeleton = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className="relative h-[60vh] md:h-[70vh] lg:h-[75vh] bg-gray-200 animate-pulse rounded-lg">
          <div className="absolute inset-0 bg-gradient-to-t from-gray-300 via-gray-200 to-transparent rounded-lg" />
          <div className="absolute top-4 left-4">
            <div className="bg-gray-300 h-6 w-24 rounded animate-pulse" />
          </div>
          <div className="absolute bottom-4 left-4 right-4">
            <div className="bg-gray-300 h-8 w-3/4 rounded mb-2 animate-pulse" />
            <div className="bg-gray-300 h-4 w-1/2 rounded animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  )
}

// Componente de Error State
const ErrorState = ({ onRetry }: { onRetry: () => void }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
      <h3 className="text-xl font-semibold text-gray-900 mb-2">Error al cargar los tours</h3>
      <p className="text-gray-600 mb-4 text-center">No pudimos cargar los tours. Por favor, intenta nuevamente.</p>
      <button
        onClick={onRetry}
        className="bg-peru-orange text-white px-6 py-2 rounded-lg hover:bg-peru-orange/90 transition-colors"
      >
        Reintentar
      </button>
    </div>
  )
}

// Componente de Filtros Mejorado
const FiltersPanel = ({
  filters,
  onFiltersChange,
  onClearFilters,
  isOpen,
  onToggle,
}: {
  filters: TourFilters
  onFiltersChange: (newFilters: Partial<TourFilters>) => void
  onClearFilters: () => void
  isOpen: boolean
  onToggle: () => void
}) => {
  const categories: TourCategory[] = ["Aventura", "Cultural", "Relax", "Naturaleza"]
  const difficulties: Difficulty[] = ["Facil", "Moderado", "Difícil"]
  const packageTypes: PackageType[] = ["Basico", "Premium"]

  return (
    <div className="relative">
      <button
        onClick={onToggle}
        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 hover:bg-gray-50 rounded-lg transition-colors shadow-sm"
      >
        <Filter size={16} />
        <span className="text-sm font-medium hidden md:inline">Filtros</span>
        <ChevronDown size={14} className={`transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-12 right-0 md:left-0 z-50 bg-white border border-gray-200 rounded-lg shadow-xl p-4 w-80 max-w-[90vw]"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-gray-900">Filtros de Búsqueda</h3>
              <button onClick={onToggle} className="text-gray-500 hover:text-gray-700 p-1">
                <X size={16} />
              </button>
            </div>

            <div className="space-y-4 max-h-96 overflow-y-auto">
              {/* Categoría */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Categoría</label>
                <select
                  value={filters.category || ""}
                  onChange={(e) => onFiltersChange({ category: (e.target.value as TourCategory) || undefined })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-peru-orange focus:border-transparent text-sm"
                >
                  <option value="">Todas las categorías</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Dificultad */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Dificultad</label>
                <select
                  value={filters.difficulty || ""}
                  onChange={(e) => onFiltersChange({ difficulty: (e.target.value as Difficulty) || undefined })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-peru-orange focus:border-transparent text-sm"
                >
                  <option value="">Todas las dificultades</option>
                  {difficulties.map((diff) => (
                    <option key={diff} value={diff}>
                      {diff === "Facil" ? "Fácil" : diff}
                    </option>
                  ))}
                </select>
              </div>

              {/* Tipo de Paquete */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Paquete</label>
                <select
                  value={filters.packageType || ""}
                  onChange={(e) => onFiltersChange({ packageType: (e.target.value as PackageType) || undefined })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-peru-orange focus:border-transparent text-sm"
                >
                  <option value="">Todos los tipos</option>
                  {packageTypes.map((type) => (
                    <option key={type} value={type}>
                      {type === "Basico" ? "Básico" : type}
                    </option>
                  ))}
                </select>
              </div>

              {/* Región */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Región</label>
                <input
                  type="text"
                  value={filters.region || ""}
                  onChange={(e) => onFiltersChange({ region: e.target.value || undefined })}
                  placeholder="Ej: Cusco, Lima, Arequipa..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-peru-orange focus:border-transparent text-sm"
                />
              </div>

              {/* Ubicación */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Ubicación</label>
                <input
                  type="text"
                  value={filters.location || ""}
                  onChange={(e) => onFiltersChange({ location: e.target.value || undefined })}
                  placeholder="Ej: Machu Picchu, Iquitos..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-peru-orange focus:border-transparent text-sm"
                />
              </div>
            </div>

            {/* Botones */}
            <div className="flex gap-2 pt-4 border-t mt-4">
              <button
                onClick={onClearFilters}
                className="flex-1 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
              >
                Limpiar
              </button>
              <button
                onClick={onToggle}
                className="flex-1 px-4 py-2 bg-peru-orange text-white rounded-lg hover:bg-peru-orange/90 transition-colors text-sm"
              >
                Aplicar
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function ToursPage() {
  const [tours, setTours] = useState<Tour[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [totalTours, setTotalTours] = useState(0)
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  const [filters, setFilters] = useState<TourFilters>({
    page: 1,
    limit: 12,
  })

  // Función para construir query params
  const buildQueryParams = useCallback((filterParams: TourFilters) => {
    const params = new URLSearchParams()

    Object.entries(filterParams).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        params.append(key, value.toString())
      }
    })

    return params.toString()
  }, [])

  // Función para cargar tours con useCallback para evitar dependencias
  const fetchTours = useCallback(
    async (filterParams: TourFilters = filters) => {
      try {
        setLoading(true)
        setError(null)

        const queryString = buildQueryParams(filterParams)
        const response = await api.get(`/tours${queryString ? `?${queryString}` : ""}`)

        setTours(response.data.data || [])
        setTotalTours(response.data.total || response.data.data?.length || 0)
      } catch (err) {
        console.error("Error fetching tours:", err)
        setError("Error al cargar los tours")
      } finally {
        setLoading(false)
      }
    },
    [buildQueryParams, filters],
  )

  // Efecto para cargar tours cuando cambian los filtros con debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchTours(filters)
    }, 300) // Debounce de 300ms

    return () => clearTimeout(timeoutId)
  }, [filters, fetchTours])

  // Función para actualizar filtros sin recargar inmediatamente
  const handleFiltersChange = useCallback((newFilters: Partial<TourFilters>) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
      page: newFilters.page || 1, // Reset page when filters change unless it's a page change
    }))
  }, [])

  // Función para limpiar filtros
  const handleClearFilters = useCallback(() => {
    setFilters({
      page: 1,
      limit: 12,
    })
    setSearchTerm("")
    setFiltersOpen(false)
  }, [])

  // Filtrar tours por búsqueda local
  const filteredTours = useMemo(() => {
    if (!searchTerm) return tours

    return tours.filter(
      (tour) =>
        tour.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tour.subtitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tour.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tour.region.toLowerCase().includes(searchTerm.toLowerCase()),
    )
  }, [tours, searchTerm])

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Facil":
        return "bg-green-500 text-white"
      case "Moderado":
        return "bg-yellow-500 text-white"
      case "Difícil":
        return "bg-red-500 text-white"
      default:
        return "bg-gray-500 text-white"
    }
  }

  const getPackageTypeColor = (packageType: string) => {
    switch (packageType) {
      case "Premium":
        return "bg-peru-gold text-white"
      case "Basico":
        return "bg-gray-600 text-white"
      default:
        return "bg-peru-orange text-white"
    }
  }

  // Función para truncar texto
  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + "..."
  }

  // Función para formatear precio en soles
  const formatPrice = (price: number) => {
    return `S/ ${price.toLocaleString("es-PE")}`
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="pt-32 pb-4 md:pb-6 px-4 md:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="mb-6">
              <div className="h-8 md:h-12 bg-gray-200 rounded w-1/2 md:w-1/3 mb-4 animate-pulse" />
              <div className="h-4 md:h-6 bg-gray-200 rounded w-3/4 md:w-1/2 animate-pulse" />
            </div>
            <div className="mb-8">
              <div className="flex gap-4 mb-4">
                {Array.from({ length: 2 }).map((_, i) => (
                  <div key={i} className="h-8 md:h-10 bg-gray-200 rounded w-20 md:w-24 animate-pulse" />
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="px-4 md:px-8">
          <div className="max-w-7xl mx-auto">
            <LoadingSkeleton />
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white">
        <div className="pt-32 pb-4 md:pb-6 px-4 md:px-8">
          <div className="max-w-7xl mx-auto">
            <ErrorState onRetry={() => fetchTours()} />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header Section */}
      <div className="pt-32 pb-4 md:pb-6 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Main Title */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-6"
          >
            <h1 className="text-2xl md:text-4xl lg:text-6xl font-light text-black leading-none brand-text">
              Tours del Perú
            </h1>
            <p className="text-sm md:text-base lg:text-lg text-gray-600 mt-2 body-text max-w-2xl">
              Descubre los destinos más increíbles del Perú ({totalTours} tours disponibles)
            </p>
          </motion.div>

          {/* Search and Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-6"
          >
            <div className="flex flex-col md:flex-row gap-3 md:gap-4 items-stretch md:items-center">
              {/* Search Bar */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="text"
                  placeholder="Buscar tours..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-peru-orange focus:border-transparent text-sm"
                />
              </div>

              {/* Filters */}
              <FiltersPanel
                filters={filters}
                onFiltersChange={handleFiltersChange}
                onClearFilters={handleClearFilters}
                isOpen={filtersOpen}
                onToggle={() => setFiltersOpen(!filtersOpen)}
              />
            </div>

            {/* Active Filters Display */}
            {(filters.category || filters.difficulty || filters.packageType || filters.region || filters.location) && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="flex flex-wrap gap-2 mt-4"
              >
                <span className="text-xs md:text-sm text-gray-600">Filtros activos:</span>
                {filters.category && (
                  <span className="px-2 py-1 bg-peru-orange/10 text-peru-orange text-xs rounded-full flex items-center gap-1">
                    {filters.category}
                    <button
                      onClick={() => handleFiltersChange({ category: undefined })}
                      className="hover:bg-peru-orange/20 rounded-full p-0.5"
                    >
                      <X size={10} />
                    </button>
                  </span>
                )}
                {filters.difficulty && (
                  <span className="px-2 py-1 bg-peru-orange/10 text-peru-orange text-xs rounded-full flex items-center gap-1">
                    {filters.difficulty === "Facil" ? "Fácil" : filters.difficulty}
                    <button
                      onClick={() => handleFiltersChange({ difficulty: undefined })}
                      className="hover:bg-peru-orange/20 rounded-full p-0.5"
                    >
                      <X size={10} />
                    </button>
                  </span>
                )}
                {filters.packageType && (
                  <span className="px-2 py-1 bg-peru-orange/10 text-peru-orange text-xs rounded-full flex items-center gap-1">
                    {filters.packageType === "Basico" ? "Básico" : filters.packageType}
                    <button
                      onClick={() => handleFiltersChange({ packageType: undefined })}
                      className="hover:bg-peru-orange/20 rounded-full p-0.5"
                    >
                      <X size={10} />
                    </button>
                  </span>
                )}
                {filters.region && (
                  <span className="px-2 py-1 bg-peru-orange/10 text-peru-orange text-xs rounded-full flex items-center gap-1">
                    {filters.region}
                    <button
                      onClick={() => handleFiltersChange({ region: undefined })}
                      className="hover:bg-peru-orange/20 rounded-full p-0.5"
                    >
                      <X size={10} />
                    </button>
                  </span>
                )}
                {filters.location && (
                  <span className="px-2 py-1 bg-peru-orange/10 text-peru-orange text-xs rounded-full flex items-center gap-1">
                    {filters.location}
                    <button
                      onClick={() => handleFiltersChange({ location: undefined })}
                      className="hover:bg-peru-orange/20 rounded-full p-0.5"
                    >
                      <X size={10} />
                    </button>
                  </span>
                )}
              </motion.div>
            )}
          </motion.div>

          {/* Results Count */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-4"
          >
            <p className="text-sm md:text-base text-gray-600">
              {filteredTours.length} {filteredTours.length === 1 ? "tour encontrado" : "tours encontrados"}
            </p>
          </motion.div>
        </div>
      </div>

      {/* Tours Grid */}
      <div className="px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          {filteredTours.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="text-4xl md:text-6xl mb-4">🏔️</div>
              <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-2">No hay tours disponibles</h3>
              <p className="text-sm md:text-base text-gray-600 text-center">
                No encontramos tours que coincidan con tus filtros. Prueba ajustando los criterios de búsqueda.
              </p>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"
            >
              {filteredTours.map((tour, index) => (
                <motion.div
                  key={`tour-${tour._id}`}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="group cursor-pointer"
                >
                  <Link href={`/tours/${tour.slug}`}>
                    <div className="relative h-[60vh] md:h-[70vh] lg:h-[75vh] overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 rounded-lg">
                      {/* Background Image */}
                      <div className="absolute inset-0">
                        <Image
                          src={tour.imageUrl || "/placeholder.svg?height=800&width=600&text=Tour+Image"}
                          alt={tour.title}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-110"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                        {/* Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                      </div>

                      {/* Category Badge */}
                      <div className="absolute top-3 left-3 z-20">
                        <div className="bg-white/95 backdrop-blur-sm px-2 md:px-3 py-1 md:py-1.5 rounded-lg flex items-center space-x-1 md:space-x-2">
                          <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-peru-orange rounded-full"></div>
                          <span className="text-xs font-medium text-gray-800 brand-text">{tour.category}</span>
                        </div>
                      </div>

                      {/* Featured Badge */}
                      {tour.featured && (
                        <div className="absolute top-3 right-3 z-20">
                          <div className="bg-peru-gold text-white px-2 md:px-3 py-1 md:py-1.5 text-xs font-medium brand-text rounded-lg">
                            DESTACADO
                          </div>
                        </div>
                      )}

                      {/* Spinning Text - Aparece en hover */}
                      <div className="absolute top-12 md:top-16 right-3 z-20 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-x-2 group-hover:translate-x-0">
                        <SpinningText />
                      </div>

                      {/* Content */}
                      <div className="absolute inset-0 p-3 md:p-4 lg:p-6 flex flex-col justify-between z-10">
                        {/* Top Section - Title */}
                        <div className="mt-8 md:mt-12 lg:mt-16">
                          <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-white brand-text mb-1 md:mb-2 leading-tight">
                            {truncateText(tour.title, 30)}
                          </h3>
                          <p className="text-white/90 text-xs md:text-sm lg:text-base body-text mb-2 md:mb-3 leading-relaxed">
                            {truncateText(tour.subtitle, 60)}
                          </p>
                        </div>

                        {/* Middle Section - Lugares destacados (visible en hover) */}
                        <div className="flex-1 flex items-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
                          <div className="space-y-2">
                            <p className="text-white/90 text-xs md:text-sm font-medium">Lugares destacados:</p>
                            <div className="flex flex-wrap gap-1">
                              {tour.highlights.slice(0, 3).map((highlight, idx) => (
                                <span
                                  key={idx}
                                  className="text-xs bg-white/20 text-white px-2 py-1 rounded body-text flex items-center gap-1"
                                >
                                  <MapPin size={10} />
                                  {truncateText(highlight, 15)}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Bottom Section - Tour Info */}
                        <div className="bg-black/60 backdrop-blur-sm p-3 md:p-4 lg:p-5 space-y-2 md:space-y-3 rounded-lg">
                          {/* Price and Duration */}
                          <div className="flex justify-between items-center">
                            <div>
                              {tour.originalPrice && tour.originalPrice > tour.price && (
                                <span className="text-xs md:text-sm text-white/60 line-through mr-2">
                                  {formatPrice(tour.originalPrice)}
                                </span>
                              )}
                              <span className="text-lg md:text-xl lg:text-2xl font-bold text-white brand-text">
                                {formatPrice(tour.price)}
                              </span>
                              <span className="text-white/70 text-xs md:text-sm ml-1 md:ml-2 body-text">
                                por persona
                              </span>
                            </div>
                            <div className="flex items-center text-white/90 text-xs md:text-sm">
                              <Clock size={12} className="mr-1" />
                              <span className="body-text">{tour.duration}</span>
                            </div>
                          </div>

                          {/* Location and Rating */}
                          <div className="flex justify-between items-center">
                            <div className="flex items-center text-white/90 text-xs md:text-sm">
                              <MapPin size={12} className="mr-1" />
                              <span className="body-text">{truncateText(tour.location, 12)}</span>
                            </div>
                            <div className="flex items-center text-white/90 text-xs md:text-sm">
                              <Star size={12} className="mr-1 text-yellow-400 fill-current" />
                              <span className="body-text">
                                {tour.rating} ({tour.reviews})
                              </span>
                            </div>
                          </div>

                          {/* Transport and Difficulty */}
                          <div className="flex justify-between items-center">
                            <div className="flex items-center text-white/90 text-xs md:text-sm">
                              <Users size={12} className="mr-1" />
                              <span className="body-text">
                                {tour.transportOptionIds.length > 0
                                  ? truncateText(tour.transportOptionIds[0].vehicle, 12)
                                  : "Transporte"}
                              </span>
                            </div>
                            <span
                              className={`px-2 py-1 text-xs brand-text rounded ${getDifficultyColor(tour.difficulty)}`}
                            >
                              {tour.difficulty === "Facil" ? "Fácil" : tour.difficulty}
                            </span>
                          </div>

                          {/* Package Type */}
                          <div className="flex justify-center pt-1 md:pt-2">
                            <span
                              className={`px-2 md:px-3 py-1 text-xs brand-text rounded ${getPackageTypeColor(tour.packageType)}`}
                            >
                              {tour.packageType === "Basico" ? "Básico" : tour.packageType}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Hover Effect */}
                      <div className="absolute inset-0 bg-peru-orange/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg" />
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </div>

      {/* Pagination */}
      {totalTours > filters.limit && (
        <div className="px-4 md:px-8 py-6 md:py-8">
          <div className="max-w-7xl mx-auto flex justify-center">
            <div className="flex gap-2">
              <button
                onClick={() => handleFiltersChange({ page: Math.max(1, filters.page - 1) })}
                disabled={filters.page === 1}
                className="px-3 md:px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors text-sm"
              >
                Anterior
              </button>

              <span className="px-3 md:px-4 py-2 bg-peru-orange text-white rounded-lg text-sm">
                Página {filters.page}
              </span>

              <button
                onClick={() => handleFiltersChange({ page: filters.page + 1 })}
                disabled={tours.length < filters.limit}
                className="px-3 md:px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors text-sm"
              >
                Siguiente
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Spacing */}
      <div className="h-6 md:h-8 lg:h-12"></div>
    </div>
  )
}
