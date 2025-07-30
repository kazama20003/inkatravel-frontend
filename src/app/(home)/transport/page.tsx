"use client"
import { useState, useEffect, useCallback, useMemo } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import {
  MapPin,
  Clock,
  AlertCircle,
  Search,
  Filter,
  X,
  ChevronDown,
  Star,
  Route,
  Calendar,
  Timer,
  ArrowRight,
  Users,
  Fuel,
  Shield,
  Wifi,
  Coffee,
  AirVent,
} from "lucide-react"
import { api } from "@/lib/axiosInstance"
import { useLanguage, type SupportedLanguage } from "@/contexts/LanguageContext"

// Define the TranslatedText interface (for API data)
interface TranslatedText {
  es: string
  en: string
  fr: string
  de: string
}

// Define the ItineraryItem interface
interface ItineraryItem {
  day: number
  title: TranslatedText
  description: TranslatedText
  imageUrl?: string
  imageId?: string
}

// Define the TourTransport interface based on the provided DTO
interface TourTransport {
  _id: string
  title: TranslatedText
  description: TranslatedText
  termsAndConditions: TranslatedText
  originCity: string
  destinationCity: string
  intermediateStops?: string[]
  availableDays: string[] // "Monday", "Tuesday", etc.
  departureTime?: string
  arrivalTime?: string
  durationInHours?: number
  price: number
  rating?: number
  vehicleId?: string
  routeCode?: string
  isActive?: boolean
  slug: string
  itinerary?: ItineraryItem[]
  imageUrl?: string
  imageId?: string
  createdAt: string
  updatedAt: string
  __v: number
  capacity?: number
  vehicleType?: string
  amenities?: string[]
  distance?: number
  fuelType?: string
  hasWifi?: boolean
  hasAC?: boolean
  hasRefreshments?: boolean
  insurance?: boolean
}

// Helper function to safely get translated string from a TranslatedText object (for API data)
const getSafeTranslatedString = (
  translatedText: TranslatedText | undefined,
  currentLang: SupportedLanguage,
): string => {
  if (!translatedText) {
    return "" // Return empty string if the translatedText object itself is undefined/null
  }
  // Fallback to English, then empty string if the specific language translation is missing
  return translatedText[currentLang] || translatedText.en || ""
}

// Componente para el texto circular giratorio
const SpinningText = ({ text }: { text?: string }) => {
  const { t } = useLanguage()
  const defaultText = `${t.reserve} • ${t.viewDetails} • `
  return (
    <div className="relative w-10 h-10 md:w-12 md:h-12 lg:w-16 lg:h-16">
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
          <text className="text-[4px] md:text-[5px] lg:text-[6px] fill-white font-medium tracking-wider brand-text">
            <textPath href="#circle" startOffset="0%">
              {text || defaultText}
            </textPath>
          </text>
        </svg>
      </motion.div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-3 h-3 md:w-4 md:h-4 lg:w-6 lg:h-6 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
          <ArrowRight className="w-1.5 h-1.5 md:w-2 md:h-2 lg:w-3 lg:h-3 text-white" />
        </div>
      </div>
    </div>
  )
}

// Componente de Loading Skeleton mejorado
const LoadingSkeleton = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
      {Array.from({ length: 6 }).map((_, index) => (
        <motion.div
          key={index}
          className="relative h-[55vh] md:h-[65vh] lg:h-[75vh] bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse rounded-2xl overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-gray-400 via-gray-200 to-transparent rounded-2xl" />
          <div className="absolute top-4 left-4">
            <div className="bg-gray-400 h-6 w-20 rounded-full animate-pulse" />
          </div>
          <div className="absolute bottom-4 left-4 right-4 space-y-3">
            <div className="bg-gray-400 h-6 w-3/4 rounded animate-pulse" />
            <div className="bg-gray-400 h-4 w-1/2 rounded animate-pulse" />
            <div className="bg-gray-400 h-16 w-full rounded-lg animate-pulse" />
          </div>
        </motion.div>
      ))}
    </div>
  )
}

// Componente de Error State mejorado
const ErrorState = ({ onRetry }: { onRetry: () => void }) => {
  const { t } = useLanguage()
  return (
    <motion.div
      className="flex flex-col items-center justify-center py-16"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}>
        <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
      </motion.div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{t.errorLoadingTours}</h3>
      <p className="text-gray-600 mb-4 text-center max-w-md">{t.errorLoadingToursMessage}</p>
      <motion.button
        onClick={onRetry}
        className="bg-peru-orange text-white px-6 py-3 rounded-xl hover:bg-peru-orange/90 transition-all duration-300 shadow-lg hover:shadow-xl"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {t.retry}
      </motion.button>
    </motion.div>
  )
}

// Componente de Filtros mejorado y mobile-friendly
const FiltersPanel = ({
  filters,
  onFiltersChange,
  onClearFilters,
  isOpen,
  onToggle,
}: {
  filters: { originCity?: string; destinationCity?: string; availableDay?: string }
  onFiltersChange: (
    newFilters: Partial<{ originCity?: string; destinationCity?: string; availableDay?: string }>,
  ) => void
  onClearFilters: () => void
  isOpen: boolean
  onToggle: () => void
}) => {
  const { t } = useLanguage()
  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

  const getTranslatedDay = (day: string) => {
    switch (day) {
      case "Monday":
        return t.monday
      case "Tuesday":
        return t.tuesday
      case "Wednesday":
        return t.wednesday
      case "Thursday":
        return t.thursday
      case "Friday":
        return t.friday
      case "Saturday":
        return t.saturday
      case "Sunday":
        return t.sunday
      default:
        return day
    }
  }

  return (
    <div className="relative">
      <motion.button
        onClick={onToggle}
        className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-300 hover:bg-gray-50 rounded-xl transition-all duration-300 shadow-sm hover:shadow-md"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Filter size={16} />
        <span className="text-sm font-medium hidden sm:inline">{t.filters}</span>
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.3 }}>
          <ChevronDown size={14} />
        </motion.div>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Mobile Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/20 z-40 md:hidden"
              onClick={onToggle}
            />

            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute top-12 right-0 md:left-0 z-50 bg-white border border-gray-200 rounded-xl shadow-2xl p-4 w-80 max-w-[90vw] md:max-w-sm"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                  <Filter size={16} />
                  {t.searchFilters}
                </h3>
                <button
                  onClick={onToggle}
                  className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="space-y-4 max-h-80 overflow-y-auto">
                {/* Origin City */}
                <div>
                  <label className="flex items-center gap-1 text-sm font-medium text-gray-700 mb-2">
                    <MapPin size={14} />
                    {t.originCity}
                  </label>
                  <input
                    type="text"
                    value={filters.originCity || ""}
                    onChange={(e) => onFiltersChange({ originCity: e.target.value || undefined })}
                    placeholder={`${t.search} ${t.originCity.toLowerCase()}...`}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-peru-orange focus:border-transparent text-sm transition-all duration-300"
                  />
                </div>

                {/* Destination City */}
                <div>
                  <label className="flex items-center gap-1 text-sm font-medium text-gray-700 mb-2">
                    <MapPin size={14} />
                    {t.destinationCity}
                  </label>
                  <input
                    type="text"
                    value={filters.destinationCity || ""}
                    onChange={(e) => onFiltersChange({ destinationCity: e.target.value || undefined })}
                    placeholder={`${t.search} ${t.destinationCity.toLowerCase()}...`}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-peru-orange focus:border-transparent text-sm transition-all duration-300"
                  />
                </div>

                {/* Available Day */}
                <div>
                  <label className="flex items-center gap-1 text-sm font-medium text-gray-700 mb-2">
                    <Calendar size={14} />
                    {t.availableDays}
                  </label>
                  <select
                    value={filters.availableDay || ""}
                    onChange={(e) => onFiltersChange({ availableDay: e.target.value || undefined })}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-peru-orange focus:border-transparent text-sm transition-all duration-300"
                  >
                    <option value="">{t.allDays}</option>
                    {daysOfWeek.map((day) => (
                      <option key={day} value={day}>
                        {getTranslatedDay(day)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Botones */}
              <div className="flex gap-2 pt-4 border-t mt-4">
                <motion.button
                  onClick={onClearFilters}
                  className="flex-1 px-4 py-2.5 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-300 text-sm font-medium"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {t.clear}
                </motion.button>
                <motion.button
                  onClick={onToggle}
                  className="flex-1 px-4 py-2.5 bg-peru-orange text-white rounded-lg hover:bg-peru-orange/90 transition-all duration-300 text-sm font-medium shadow-md"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {t.apply}
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function TransportPage() {
  const { t, language } = useLanguage()
  const [transportTours, setTransportTours] = useState<TourTransport[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [filters, setFilters] = useState<{ originCity?: string; destinationCity?: string; availableDay?: string }>({})

  // Function to fetch transport tours
  const fetchTransportTours = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await api.get(`/tour-transport?lang=${language}`)
      setTransportTours(response.data.data || [])
    } catch (err) {
      console.error("Error fetching transport tours:", err)
      setError(t.errorLoadingTours)
    } finally {
      setLoading(false)
    }
  }, [language, t.errorLoadingTours])

  // Fetch tours on component mount and when language changes
  useEffect(() => {
    fetchTransportTours()
  }, [fetchTransportTours])

  // Function to update filters
  const handleFiltersChange = useCallback((newFilters: Partial<typeof filters>) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
    }))
  }, [])

  // Function to clear filters
  const handleClearFilters = useCallback(() => {
    setFilters({})
    setSearchTerm("")
    setFiltersOpen(false)
  }, [])

  // Filter tours by search term and filters
  const filteredTours = useMemo(() => {
    let currentFilteredTours = transportTours

    // Apply text search
    if (searchTerm) {
      currentFilteredTours = currentFilteredTours.filter(
        (tour) =>
          getSafeTranslatedString(tour.title, language).toLowerCase().includes(searchTerm.toLowerCase()) ||
          getSafeTranslatedString(tour.description, language).toLowerCase().includes(searchTerm.toLowerCase()) ||
          tour.originCity.toLowerCase().includes(searchTerm.toLowerCase()) ||
          tour.destinationCity.toLowerCase().includes(searchTerm.toLowerCase()) ||
          tour.intermediateStops?.some((stop) => stop.toLowerCase().includes(searchTerm.toLowerCase())),
      )
    }

    // Apply filters
    if (filters.originCity) {
      currentFilteredTours = currentFilteredTours.filter((tour) =>
        tour.originCity.toLowerCase().includes(filters.originCity!.toLowerCase()),
      )
    }
    if (filters.destinationCity) {
      currentFilteredTours = currentFilteredTours.filter((tour) =>
        tour.destinationCity.toLowerCase().includes(filters.destinationCity!.toLowerCase()),
      )
    }
    if (filters.availableDay) {
      currentFilteredTours = currentFilteredTours.filter((tour) => tour.availableDays.includes(filters.availableDay!))
    }

    return currentFilteredTours
  }, [transportTours, searchTerm, filters, language])

  const formatPrice = (price: number) => {
    return `S/ ${price.toLocaleString("es-PE")}`
  }

  const getTranslatedDay = (day: string) => {
    switch (day) {
      case "Monday":
        return t.monday
      case "Tuesday":
        return t.tuesday
      case "Wednesday":
        return t.wednesday
      case "Thursday":
        return t.thursday
      case "Friday":
        return t.friday
      case "Saturday":
        return t.saturday
      case "Sunday":
        return t.sunday
      default:
        return day
    }
  }

  // Function to truncate text - made more defensive
  const truncateText = (text: string | undefined | null, maxLength: number) => {
    const safeText = String(text || "")
    if (safeText.length <= maxLength) return safeText
    return safeText.substring(0, maxLength) + "..."
  }

  // Function to get amenity icon
  const getAmenityIcon = (amenity: string) => {
    switch (amenity.toLowerCase()) {
      case "wifi":
        return <Wifi size={12} />
      case "ac":
      case "air conditioning":
        return <AirVent size={12} />
      case "refreshments":
      case "snacks":
        return <Coffee size={12} />
      case "insurance":
        return <Shield size={12} />
      default:
        return <div className="w-3 h-3 bg-current rounded-full" />
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white">
        <div className="pt-24 md:pt-32 pb-4 md:pb-6 px-4 md:px-8">
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
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-white">
        <div className="pt-24 md:pt-32 pb-4 md:pb-6 px-4 md:px-8">
          <div className="max-w-7xl mx-auto">
            <ErrorState onRetry={() => fetchTransportTours()} />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Header Section */}
      <div className="pt-24 md:pt-32 pb-6 md:pb-8 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Main Title */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <Route className="w-6 h-6 md:w-8 md:h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl md:text-4xl lg:text-6xl font-light text-gray-900 leading-none brand-text">
                  {t.transport}
                </h1>
                <div className="w-20 md:w-32 h-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mt-2"></div>
              </div>
            </div>
            <p className="text-sm md:text-base lg:text-lg text-gray-600 body-text max-w-3xl leading-relaxed">
              {t.carouselSubtitle}
            </p>
          </motion.div>

          {/* Search and Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-6"
          >
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 items-stretch sm:items-center">
              {/* Search Bar */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="text"
                  placeholder={t.searchToursPlaceholder}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-all duration-300 shadow-sm"
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
            {(filters.originCity || filters.destinationCity || filters.availableDay) && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="flex flex-wrap gap-2 mt-4"
              >
                <span className="text-xs md:text-sm text-gray-600 font-medium">{t.activeFilters}</span>
                {filters.originCity && (
                  <motion.span
                    className="px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded-full flex items-center gap-1 font-medium"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                  >
                    <MapPin size={10} />
                    {filters.originCity}
                    <button
                      onClick={() => handleFiltersChange({ originCity: undefined })}
                      className="hover:bg-blue-200 rounded-full p-0.5 transition-colors"
                    >
                      <X size={10} />
                    </button>
                  </motion.span>
                )}
                {filters.destinationCity && (
                  <motion.span
                    className="px-3 py-1 bg-purple-100 text-purple-700 text-xs rounded-full flex items-center gap-1 font-medium"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                  >
                    <MapPin size={10} />
                    {filters.destinationCity}
                    <button
                      onClick={() => handleFiltersChange({ destinationCity: undefined })}
                      className="hover:bg-purple-200 rounded-full p-0.5 transition-colors"
                    >
                      <X size={10} />
                    </button>
                  </motion.span>
                )}
                {filters.availableDay && (
                  <motion.span
                    className="px-3 py-1 bg-green-100 text-green-700 text-xs rounded-full flex items-center gap-1 font-medium"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                  >
                    <Calendar size={10} />
                    {getTranslatedDay(filters.availableDay)}
                    <button
                      onClick={() => handleFiltersChange({ availableDay: undefined })}
                      className="hover:bg-green-200 rounded-full p-0.5 transition-colors"
                    >
                      <X size={10} />
                    </button>
                  </motion.span>
                )}
              </motion.div>
            )}
          </motion.div>

          {/* Results Count */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-6"
          >
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <p className="text-sm md:text-base text-gray-600 font-medium">
                {filteredTours.length} {filteredTours.length === 1 ? t.toursFoundSingular : t.toursFoundPlural}
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Transport Tours Grid */}
      <div className="px-4 md:px-8 pb-12">
        <div className="max-w-7xl mx-auto">
          {filteredTours.length === 0 ? (
            <motion.div
              className="flex flex-col items-center justify-center py-16"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <motion.div
                animate={{
                  y: [0, -10, 0],
                  rotate: [0, 5, -5, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
                className="text-6xl md:text-8xl mb-6"
              >
                🚌
              </motion.div>
              <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-2">{t.noToursAvailableTitle}</h3>
              <p className="text-sm md:text-base text-gray-600 text-center max-w-md">{t.noToursAvailableMessage}</p>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"
            >
              {filteredTours.map((tour, index) => (
                <motion.div
                  key={`transport-tour-${tour._id}`}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="group cursor-pointer"
                >
                  <Link href={`/transport/${tour.slug}`}>
                    <div className="relative h-[55vh] md:h-[65vh] lg:h-[75vh] overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 rounded-2xl bg-white">
                      {/* Background Image */}
                      <div className="absolute inset-0">
                        <Image
                          src={tour.imageUrl || "/placeholder.svg?height=800&width=600&text=Transport+Image"}
                          alt={getSafeTranslatedString(tour.title, language)}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-110"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                        {/* Enhanced Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-transparent group-hover:from-black/98 transition-all duration-500" />
                      </div>

                      {/* Category Badge */}
                      <div className="absolute top-4 left-4 z-20">
                        <motion.div
                          className="bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center space-x-2 shadow-lg"
                          whileHover={{ scale: 1.05 }}
                        >
                          <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"></div>
                          <span className="text-xs font-semibold text-gray-800 brand-text">{t.transport}</span>
                        </motion.div>
                      </div>

                      {/* Rating Badge */}
                      {tour.rating && (
                        <div className="absolute top-4 right-4 z-20">
                          <motion.div
                            className="bg-yellow-500/90 backdrop-blur-sm px-2 py-1 rounded-full flex items-center space-x-1 shadow-lg"
                            whileHover={{ scale: 1.05 }}
                          >
                            <Star size={12} fill="white" className="text-white" />
                            <span className="text-xs font-bold text-white">{tour.rating}</span>
                          </motion.div>
                        </div>
                      )}

                      {/* Capacity Badge */}
                      {tour.capacity && (
                        <div className="absolute top-16 right-4 z-20">
                          <motion.div
                            className="bg-blue-500/90 backdrop-blur-sm px-2 py-1 rounded-full flex items-center space-x-1 shadow-lg"
                            whileHover={{ scale: 1.05 }}
                          >
                            <Users size={12} className="text-white" />
                            <span className="text-xs font-bold text-white">{tour.capacity}</span>
                          </motion.div>
                        </div>
                      )}

                      {/* Spinning Text - Appears on hover */}
                      <div className="absolute top-28 right-4 z-20 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-x-2 group-hover:translate-x-0">
                        <SpinningText />
                      </div>

                      {/* Content */}
                      <div className="absolute inset-0 p-4 md:p-6 flex flex-col justify-between z-10">
                        {/* Top Section - Title and Description */}
                        <div className="mt-16 md:mt-20">
                          <motion.h3
                            className="text-lg md:text-xl lg:text-2xl font-bold text-white brand-text mb-2 leading-tight"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 + 0.3 }}
                          >
                            {truncateText(getSafeTranslatedString(tour.title, language), 40)}
                          </motion.h3>
                          <motion.p
                            className="text-white/90 text-sm lg:text-base body-text mb-3 leading-relaxed"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 + 0.4 }}
                          >
                            {truncateText(getSafeTranslatedString(tour.description, language), 80)}
                          </motion.p>
                        </div>

                        {/* Middle Section - Enhanced Route Info (visible on hover) */}
                        <div className="flex-1 flex items-center opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
                          <div className="w-full space-y-3">
                            {/* Route Visualization */}
                            <div className="bg-black/50 backdrop-blur-sm rounded-xl p-3">
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center text-blue-300 text-xs font-medium">
                                  <MapPin size={12} className="mr-1" />
                                  {truncateText(tour.originCity, 12)}
                                </div>
                                <ArrowRight size={14} className="text-white/60" />
                                <div className="flex items-center text-purple-300 text-xs font-medium">
                                  <MapPin size={12} className="mr-1" />
                                  {truncateText(tour.destinationCity, 12)}
                                </div>
                              </div>

                              {/* Distance and Duration */}
                              <div className="flex justify-between text-xs text-white/70">
                                {tour.distance && (
                                  <span className="flex items-center gap-1">
                                    <Route size={10} />
                                    {tour.distance} km
                                  </span>
                                )}
                                {tour.durationInHours && (
                                  <span className="flex items-center gap-1">
                                    <Timer size={10} />
                                    {tour.durationInHours}h
                                  </span>
                                )}
                              </div>

                              {/* Intermediate Stops */}
                              {tour.intermediateStops && tour.intermediateStops.length > 0 && (
                                <div className="border-t border-white/20 pt-2 mt-2">
                                  <p className="text-white/70 text-xs mb-1">{t.stopsOnRoute}:</p>
                                  <div className="flex flex-wrap gap-1">
                                    {tour.intermediateStops.slice(0, 2).map((stop, idx) => (
                                      <span
                                        key={idx}
                                        className="text-xs bg-white/20 text-white px-2 py-0.5 rounded-full"
                                      >
                                        {truncateText(stop, 12)}
                                      </span>
                                    ))}
                                    {tour.intermediateStops.length > 2 && (
                                      <span className="text-xs bg-white/20 text-white px-2 py-0.5 rounded-full">
                                        +{tour.intermediateStops.length - 2}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* Vehicle Info and Amenities */}
                            <div className="bg-black/50 backdrop-blur-sm rounded-xl p-3">
                              <div className="flex justify-between items-center mb-2">
                                {tour.vehicleType && (
                                  <span className="text-xs text-green-300 font-medium">🚌 {tour.vehicleType}</span>
                                )}
                                {tour.fuelType && (
                                  <span className="flex items-center gap-1 text-xs text-yellow-300">
                                    <Fuel size={10} />
                                    {tour.fuelType}
                                  </span>
                                )}
                              </div>

                              {/* Amenities */}
                              {tour.amenities && tour.amenities.length > 0 && (
                                <div className="flex flex-wrap gap-1">
                                  {tour.amenities.slice(0, 4).map((amenity, idx) => (
                                    <span
                                      key={idx}
                                      className="flex items-center gap-1 text-xs bg-white/20 text-white px-2 py-0.5 rounded-full"
                                    >
                                      {getAmenityIcon(amenity)}
                                      {amenity}
                                    </span>
                                  ))}
                                  {tour.amenities.length > 4 && (
                                    <span className="text-xs bg-white/20 text-white px-2 py-0.5 rounded-full">
                                      +{tour.amenities.length - 4}
                                    </span>
                                  )}
                                </div>
                              )}

                              {/* Quick Amenities Icons */}
                              <div className="flex justify-center gap-3 mt-2 pt-2 border-t border-white/20">
                                {tour.hasWifi && (
                                  <div className="flex items-center text-blue-300">
                                    <Wifi size={12} />
                                  </div>
                                )}
                                {tour.hasAC && (
                                  <div className="flex items-center text-cyan-300">
                                    <AirVent size={12} />
                                  </div>
                                )}
                                {tour.hasRefreshments && (
                                  <div className="flex items-center text-orange-300">
                                    <Coffee size={12} />
                                  </div>
                                )}
                                {tour.insurance && (
                                  <div className="flex items-center text-green-300">
                                    <Shield size={12} />
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Bottom Section - Enhanced Transport Info */}
                        <motion.div
                          className="bg-black/80 backdrop-blur-md p-4 space-y-3 rounded-xl border border-white/10"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 + 0.5 }}
                        >
                          {/* Price and Main Info */}
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                              <span className="text-xl md:text-2xl font-bold text-white brand-text">
                                {formatPrice(tour.price)}
                              </span>
                              <span className="text-white/70 text-xs body-text">PEN</span>
                            </div>
                            {tour.durationInHours && (
                              <div className="flex items-center text-blue-300 text-sm">
                                <Timer size={14} className="mr-1" />
                                <span className="body-text font-medium">{tour.durationInHours}h</span>
                              </div>
                            )}
                          </div>

                          {/* Schedule and Capacity Info */}
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div className="flex items-center text-white/80">
                              <Clock size={12} className="mr-1 text-green-400" />
                              <span className="body-text">{tour.departureTime || t.notAvailable}</span>
                            </div>
                            <div className="flex items-center text-white/80">
                              <Clock size={12} className="mr-1 text-orange-400" />
                              <span className="body-text">{tour.arrivalTime || t.notAvailable}</span>
                            </div>
                          </div>

                          {/* Available Days and Route Code */}
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-1">
                              <Calendar size={12} className="text-purple-400" />
                              {tour.availableDays && tour.availableDays.length > 0 ? (
                                <span className="px-2 py-1 text-xs brand-text rounded-full bg-gradient-to-r from-purple-500/30 to-blue-500/30 text-white border border-white/20">
                                  {getTranslatedDay(tour.availableDays[0])}
                                  {tour.availableDays.length > 1 && ` +${tour.availableDays.length - 1}`}
                                </span>
                              ) : (
                                <span className="px-2 py-1 text-xs brand-text rounded-full bg-gray-600/50 text-white">
                                  {t.allDays}
                                </span>
                              )}
                            </div>
                            {tour.routeCode && (
                              <span className="px-2 py-1 text-xs bg-white/20 text-white rounded-full font-mono">
                                {tour.routeCode}
                              </span>
                            )}
                          </div>
                        </motion.div>
                      </div>

                      {/* Enhanced Hover Effect */}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-t from-blue-600/20 via-purple-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"
                        whileHover={{ scale: 1.02 }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}
