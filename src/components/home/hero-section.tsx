"use client"
import Image from "next/image"
import Link from "next/link"
import { useRef, useEffect, useState } from "react"
import { useLanguage, type Translations } from "@/contexts/LanguageContext"
import { api } from "@/lib/axiosInstance"
import { Star, Clock, DollarSign, CalendarDays, Route, Timer, MapPin, ChevronLeft, ChevronRight } from "lucide-react"
import { motion } from "framer-motion"

// Define the interface for route stops
interface RouteStop {
  location: string
  description: string
  imageUrl?: string
  imageId?: string
  stopTime?: string
}

// Define the interface for itinerary items
interface ItineraryItem {
  day: number
  title: string
  description: string
  imageUrl?: string
  imageId?: string
  route?: RouteStop[]
}

// Define the interface for the tour transport data based on your API response
interface TourTransport {
  _id: string
  title: string
  description: string
  termsAndConditions: string
  originCity: string
  destinationCity: string
  intermediateStops?: string[]
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
  slug?: string
  itinerary?: ItineraryItem[]
  imageUrl?: string
  imageId?: string
  createdAt: string
  updatedAt: string
  __v: number
}

interface ApiResponse {
  data: TourTransport[]
  total: number
}

export default function HeroSection() {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const { language, t } = useLanguage()
  const [tours, setTours] = useState<TourTransport[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isScrolling, setIsScrolling] = useState(false)

  // Exchange rate USD to PEN (you can make this dynamic later)
  const USD_TO_PEN = 3.75

  // Helper function to get translated day names
  const getTranslatedDay = (dayKey: string, translations: Translations) => {
    switch (dayKey.toLowerCase()) {
      case "monday":
        return translations.monday
      case "tuesday":
        return translations.tuesday
      case "wednesday":
        return translations.wednesday
      case "thursday":
        return translations.thursday
      case "friday":
        return translations.friday
      case "saturday":
        return translations.saturday
      case "sunday":
        return translations.sunday
      default:
        return dayKey
    }
  }

  useEffect(() => {
    const fetchTours = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const response = await api.get<ApiResponse>("/tour-transport", {
          params: { lang: language },
        })
        setTours(response.data.data)
      } catch (err) {
        console.error("Error fetching tour transport data:", err)
        setError(t.errorLoadingTours)
      } finally {
        setIsLoading(false)
      }
    }
    fetchTours()
  }, [language, t.errorLoadingTours])

  // Enhanced scroll handling with mouse wheel and vertical scroll continuation
  useEffect(() => {
    const scrollContainer = scrollContainerRef.current
    if (!scrollContainer) return

    const handleWheel = (e: WheelEvent) => {
      const isAtStart = currentIndex === 0
      const isAtEnd = currentIndex === tours.length - 1
      const isScrollingUp = e.deltaY < 0
      const isScrollingDown = e.deltaY > 0

      // Allow vertical scroll when at the beginning and scrolling up
      if (isAtStart && isScrollingUp) {
        return // Let the page scroll up naturally
      }

      // Allow vertical scroll when at the end and scrolling down
      if (isAtEnd && isScrollingDown) {
        return // Let the page scroll down naturally
      }

      // Prevent default for horizontal navigation
      e.preventDefault()

      if (isScrolling) return
      setIsScrolling(true)

      const cardWidth =
        scrollContainer.clientWidth /
        (window.innerWidth >= 1280 ? 4 : window.innerWidth >= 1024 ? 3 : window.innerWidth >= 768 ? 2 : 1)
      const direction = e.deltaY > 0 ? 1 : -1
      const newIndex = Math.max(0, Math.min(tours.length - 1, currentIndex + direction))

      if (newIndex !== currentIndex) {
        setCurrentIndex(newIndex)
        scrollContainer.scrollTo({
          left: newIndex * cardWidth,
          behavior: "smooth",
        })
      }

      setTimeout(() => setIsScrolling(false), 300)
    }

    const handleScroll = () => {
      const cardWidth =
        scrollContainer.clientWidth /
        (window.innerWidth >= 1280 ? 4 : window.innerWidth >= 1024 ? 3 : window.innerWidth >= 768 ? 2 : 1)
      const newIndex = Math.round(scrollContainer.scrollLeft / cardWidth)
      if (newIndex !== currentIndex) {
        setCurrentIndex(newIndex)
      }
    }

    scrollContainer.addEventListener("wheel", handleWheel, { passive: false })
    scrollContainer.addEventListener("scroll", handleScroll, { passive: true })

    return () => {
      scrollContainer.removeEventListener("wheel", handleWheel)
      scrollContainer.removeEventListener("scroll", handleScroll)
    }
  }, [tours.length, currentIndex, isScrolling])

  // Navigation functions
  const goToNext = () => {
    if (currentIndex < tours.length - 1) {
      const newIndex = currentIndex + 1
      setCurrentIndex(newIndex)
      const scrollContainer = scrollContainerRef.current
      if (scrollContainer) {
        const cardWidth =
          scrollContainer.clientWidth /
          (window.innerWidth >= 1280 ? 4 : window.innerWidth >= 1024 ? 3 : window.innerWidth >= 768 ? 2 : 1)
        scrollContainer.scrollTo({
          left: newIndex * cardWidth,
          behavior: "smooth",
        })
      }
    }
  }

  const goToPrev = () => {
    if (currentIndex > 0) {
      const newIndex = currentIndex - 1
      setCurrentIndex(newIndex)
      const scrollContainer = scrollContainerRef.current
      if (scrollContainer) {
        const cardWidth =
          scrollContainer.clientWidth /
          (window.innerWidth >= 1280 ? 4 : window.innerWidth >= 1024 ? 3 : window.innerWidth >= 768 ? 2 : 1)
        scrollContainer.scrollTo({
          left: newIndex * cardWidth,
          behavior: "smooth",
        })
      }
    }
  }

  if (isLoading) {
    return (
      <section className="w-full min-h-screen relative flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-t-transparent border-blue-500"></div>
          <p className="text-2xl text-white font-light">{t.loading}...</p>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="w-full min-h-screen relative flex flex-col items-center justify-center bg-gradient-to-br from-red-900 via-red-800 to-red-900">
        <p className="text-2xl text-white mb-6 text-center">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-8 py-4 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-white hover:bg-white/30 transition-all duration-300 font-medium"
        >
          {t.retry}
        </button>
      </section>
    )
  }

  if (tours.length === 0) {
    return (
      <section className="w-full min-h-screen relative flex items-center justify-center bg-gradient-to-br from-slate-900 via-gray-800 to-slate-900">
        <p className="text-2xl text-white font-light">{t.noToursAvailable}</p>
      </section>
    )
  }

  return (
    <section className="w-full min-h-screen relative bg-black overflow-hidden">
      {/* Navigation Arrows */}
      <button
        onClick={goToPrev}
        disabled={currentIndex === 0}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 bg-black/50 hover:bg-black/70 disabled:opacity-30 disabled:cursor-not-allowed text-white p-3 rounded-full transition-all duration-300 backdrop-blur-sm"
      >
        <ChevronLeft size={24} />
      </button>

      <button
        onClick={goToNext}
        disabled={currentIndex === tours.length - 1}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 bg-black/50 hover:bg-black/70 disabled:opacity-30 disabled:cursor-not-allowed text-white p-3 rounded-full transition-all duration-300 backdrop-blur-sm"
      >
        <ChevronRight size={24} />
      </button>

      {/* Scroll Container */}
      <div
        ref={scrollContainerRef}
        className="flex flex-nowrap overflow-x-auto scroll-smooth w-full h-screen relative hide-scrollbar"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {tours.map((tour, index) => (
          <Link
            key={tour._id}
            href={`/transport/${tour.slug}`}
            className="relative group overflow-hidden flex-shrink-0 w-full md:w-1/2 lg:w-1/3 xl:w-1/4 h-full bg-gray-900 flex items-center justify-center"
            aria-label={`${t.viewDetails} for ${tour.title}`}
          >
            {/* Background Image with Zoom Effect */}
            <motion.div
              className="absolute inset-0"
              initial={{ scale: 1 }}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <Image
                src={tour.imageUrl || "/placeholder.svg"}
                alt={tour.title}
                fill
                className="object-cover"
                priority={index === 0}
              />
            </motion.div>

            {/* Enhanced Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent group-hover:from-black/95 transition-all duration-500" />

            {/* Default Content - Enhanced */}
            <motion.div
              className="absolute bottom-8 left-6 right-6 text-white z-10"
              initial={{ opacity: 1, y: 0 }}
              whileHover={{ opacity: 0, y: 40 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            >
              <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-4 md:p-6 border border-white/20">
                <h2 className="text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold mb-2 md:mb-3 drop-shadow-lg leading-tight">
                  {tour.title}
                </h2>
                <p className="text-sm md:text-base lg:text-lg font-light drop-shadow-lg opacity-90 mb-3 md:mb-4 line-clamp-2">
                  {tour.description}
                </p>

                {/* Intermediate Stops - Basic View */}
                {tour.intermediateStops && tour.intermediateStops.length > 0 && (
                  <div className="mb-3 md:mb-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <MapPin size={14} className="text-blue-400 md:w-4 md:h-4" />
                      <span className="text-xs md:text-sm font-medium text-blue-300">{t.stopsOnRoute}:</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {tour.intermediateStops.slice(0, 2).map((stop, idx) => (
                        <span
                          key={idx}
                          className="bg-blue-500/20 text-blue-200 px-2 py-1 rounded-full text-xs font-medium"
                        >
                          {stop}
                        </span>
                      ))}
                      {tour.intermediateStops.length > 2 && (
                        <span className="bg-blue-500/20 text-blue-200 px-2 py-1 rounded-full text-xs font-medium">
                          +{tour.intermediateStops.length - 2}
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Available Days - Basic View */}
                <div className="mb-3 md:mb-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <CalendarDays size={14} className="text-purple-400 md:w-4 md:h-4" />
                    <span className="text-xs md:text-sm font-medium text-purple-300">{t.availableDays}:</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {tour.availableDays && tour.availableDays.length > 0 && !tour.availableDays.includes("all") ? (
                      <>
                        {tour.availableDays.slice(0, 3).map((day, idx) => (
                          <span
                            key={idx}
                            className="bg-purple-500/20 text-purple-200 px-2 py-1 rounded-full text-xs font-medium"
                          >
                            {getTranslatedDay(day, t).slice(0, 3)}
                          </span>
                        ))}
                        {tour.availableDays.length > 3 && (
                          <span className="bg-purple-500/20 text-purple-200 px-2 py-1 rounded-full text-xs font-medium">
                            +{tour.availableDays.length - 3}
                          </span>
                        )}
                      </>
                    ) : (
                      <span className="bg-purple-500/20 text-purple-200 px-2 py-1 rounded-full text-xs font-medium">
                        {t.allDays}
                      </span>
                    )}
                  </div>
                </div>

                {/* Quick Info Row */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 md:space-x-4">
                    {tour.rating && (
                      <div className="flex items-center space-x-1 bg-yellow-500/20 px-2 md:px-3 py-1 rounded-full">
                        <Star size={14} fill="currentColor" className="text-yellow-400 md:w-4 md:h-4" />
                        <span className="text-xs md:text-sm font-semibold">{tour.rating}</span>
                      </div>
                    )}
                    {tour.durationInHours && (
                      <div className="flex items-center space-x-1 bg-blue-500/20 px-2 md:px-3 py-1 rounded-full">
                        <Timer size={14} className="text-blue-400 md:w-4 md:h-4" />
                        <span className="text-xs md:text-sm font-semibold">{tour.durationInHours}h</span>
                      </div>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-1 text-green-400">
                      <DollarSign size={16} className="md:w-5 md:h-5" />
                      <span className="text-lg md:text-xl font-bold">${tour.price}</span>
                    </div>
                    <div className="text-xs opacity-75">S/ {(tour.price * USD_TO_PEN).toFixed(0)}</div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Enhanced Hover Content */}
            <motion.div
              className="absolute inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 md:p-6"
              initial={{ opacity: 0, scale: 0.95 }}
              whileHover={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <div className="text-white w-full max-w-sm max-h-full overflow-y-auto">
                {/* Header with spinning title */}
                <motion.div
                  className="text-center mb-4 md:mb-6"
                  initial={{ rotateY: 0 }}
                  whileHover={{ rotateY: 360 }}
                  transition={{ duration: 1, ease: "easeInOut" }}
                >
                  <h3 className="text-lg md:text-xl lg:text-2xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    {tour.title}
                  </h3>
                  <div className="flex items-center justify-center space-x-4">
                    {tour.rating && (
                      <div className="flex items-center space-x-1">
                        <Star size={14} fill="currentColor" className="text-yellow-400 md:w-4 md:h-4" />
                        <span className="text-xs md:text-sm font-bold">{tour.rating}</span>
                      </div>
                    )}
                    <div className="h-4 w-px bg-white/30"></div>
                    <div className="text-center">
                      <div className="text-base md:text-lg font-bold text-green-400">${tour.price}</div>
                      <div className="text-xs text-green-300">S/ {(tour.price * USD_TO_PEN).toFixed(0)}</div>
                    </div>
                  </div>
                </motion.div>

                {/* Enhanced Info Cards */}
                <motion.div
                  className="space-y-3"
                  initial="hidden"
                  whileHover="visible"
                  variants={{
                    hidden: {},
                    visible: {
                      transition: {
                        staggerChildren: 0.08,
                      },
                    },
                  }}
                >
                  {/* Route Information Card */}
                  <motion.div
                    className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-sm rounded-xl p-3 md:p-4 border border-blue-400/30"
                    variants={{
                      hidden: { opacity: 0, x: -30 },
                      visible: { opacity: 1, x: 0 },
                    }}
                  >
                    <div className="flex items-center space-x-2 mb-2 md:mb-3">
                      <Route size={16} className="text-blue-400 md:w-5 md:h-5" />
                      <span className="font-semibold text-xs md:text-sm text-blue-300">{t.route}</span>
                    </div>
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-gray-300">{t.originCity}:</span>
                        <span className="font-semibold text-white">{tour.originCity}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-300">{t.destinationCity}:</span>
                        <span className="font-semibold text-white">{tour.destinationCity}</span>
                      </div>

                      {/* Enhanced Intermediate Stops */}
                      {tour.intermediateStops && tour.intermediateStops.length > 0 && (
                        <motion.div
                          className="mt-2 pt-2 border-t border-white/20"
                          initial={{ height: 0, opacity: 0 }}
                          whileHover={{ height: "auto", opacity: 1 }}
                          transition={{ duration: 0.3 }}
                        >
                          <div className="flex items-center space-x-1 mb-2">
                            <MapPin size={12} className="text-purple-400" />
                            <span className="text-gray-300 text-xs font-medium">{t.stopsOnRoute}:</span>
                          </div>
                          <div className="grid grid-cols-1 gap-1 max-h-20 overflow-y-auto">
                            {tour.intermediateStops.slice(0, 3).map((stop, idx) => (
                              <motion.div
                                key={idx}
                                className="bg-blue-500/20 text-blue-200 px-2 py-1 rounded-md text-xs flex items-center space-x-1"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: idx * 0.1 }}
                              >
                                <div className="w-1 h-1 bg-blue-400 rounded-full"></div>
                                <span className="truncate">{stop}</span>
                              </motion.div>
                            ))}
                            {tour.intermediateStops.length > 3 && (
                              <div className="text-xs text-blue-300 text-center py-1">
                                +{tour.intermediateStops.length - 3} más
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </div>
                  </motion.div>

                  {/* Schedule Information Card */}
                  <motion.div
                    className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 backdrop-blur-sm rounded-xl p-3 md:p-4 border border-green-400/30"
                    variants={{
                      hidden: { opacity: 0, x: 30 },
                      visible: { opacity: 1, x: 0 },
                    }}
                  >
                    <div className="flex items-center space-x-2 mb-2 md:mb-3">
                      <Clock size={16} className="text-green-400 md:w-5 md:h-5" />
                      <span className="font-semibold text-xs md:text-sm text-green-300">{t.schedule}</span>
                    </div>
                    <div className="space-y-2 text-xs">
                      {tour.departureTime && (
                        <div className="flex justify-between">
                          <span className="text-gray-300">{t.departureTime}:</span>
                          <span className="font-semibold text-white">{tour.departureTime}</span>
                        </div>
                      )}
                      {tour.arrivalTime && (
                        <div className="flex justify-between">
                          <span className="text-gray-300">{t.arrivalTime}:</span>
                          <span className="font-semibold text-white">{tour.arrivalTime}</span>
                        </div>
                      )}
                      {tour.durationInHours && (
                        <div className="flex justify-between">
                          <span className="text-gray-300">{t.duration}:</span>
                          <span className="font-semibold text-white">
                            {tour.durationInHours} {t.hours}
                          </span>
                        </div>
                      )}
                      <div className="mt-2 pt-2 border-t border-white/20">
                        <div className="text-xs text-green-200 bg-green-500/20 rounded-lg p-2">💡 {t.arriveEarly}</div>
                      </div>
                    </div>
                  </motion.div>

                  {/* Enhanced Availability Card */}
                  <motion.div
                    className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-sm rounded-xl p-3 md:p-4 border border-purple-400/30"
                    variants={{
                      hidden: { opacity: 0, y: 30 },
                      visible: { opacity: 1, y: 0 },
                    }}
                  >
                    <div className="flex items-center space-x-2 mb-2 md:mb-3">
                      <CalendarDays size={16} className="text-purple-400 md:w-5 md:h-5" />
                      <span className="font-semibold text-xs md:text-sm text-purple-300">{t.availableDays}</span>
                    </div>

                    {/* Mobile-optimized days display */}
                    <div className="space-y-2">
                      {tour.availableDays && tour.availableDays.length > 0 && !tour.availableDays.includes("all") ? (
                        <div className="grid grid-cols-2 gap-1">
                          {tour.availableDays.slice(0, 4).map((day, idx) => (
                            <motion.span
                              key={idx}
                              className="bg-purple-500/30 text-purple-200 px-2 py-1 rounded-md text-xs font-medium text-center"
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: idx * 0.1 }}
                            >
                              {getTranslatedDay(day, t).slice(0, 3)}
                            </motion.span>
                          ))}
                          {tour.availableDays.length > 4 && (
                            <div className="col-span-2 text-xs text-purple-300 text-center py-1">
                              +{tour.availableDays.length - 4} días más
                            </div>
                          )}
                        </div>
                      ) : (
                        <span className="bg-purple-500/30 text-purple-200 px-3 py-2 rounded-lg text-xs font-medium block text-center">
                          {t.allDays}
                        </span>
                      )}
                    </div>
                  </motion.div>
                </motion.div>

                {/* Enhanced Call to Action */}
                <motion.div
                  className="mt-4 md:mt-6"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileHover={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4, duration: 0.3 }}
                >
                  <div className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 md:px-6 py-2 md:py-3 rounded-full text-xs md:text-sm font-semibold transition-all duration-300 text-center shadow-lg hover:shadow-xl transform hover:scale-105">
                    {t.viewDetails} →
                  </div>
                </motion.div>
              </div>
            </motion.div>

            {/* Enhanced Border Effect */}
            <motion.div
              className="absolute inset-0 border-2 border-transparent rounded-lg"
              whileHover={{
                borderColor: "rgba(59, 130, 246, 0.6)",
                boxShadow: "0 0 30px rgba(59, 130, 246, 0.3)",
              }}
              transition={{ duration: 0.3 }}
            />
          </Link>
        ))}
      </div>

      {/* Enhanced Progress Indicator */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-10">
        <div className="flex items-center space-x-4 bg-black/40 backdrop-blur-sm px-6 py-3 rounded-full border border-white/20">
          <div className="flex space-x-2">
            {tours.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setCurrentIndex(index)
                  const scrollContainer = scrollContainerRef.current
                  if (scrollContainer) {
                    const cardWidth =
                      scrollContainer.clientWidth /
                      (window.innerWidth >= 1280 ? 4 : window.innerWidth >= 1024 ? 3 : window.innerWidth >= 768 ? 2 : 1)
                    scrollContainer.scrollTo({
                      left: index * cardWidth,
                      behavior: "smooth",
                    })
                  }
                }}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex ? "bg-white scale-125" : "bg-white/40 hover:bg-white/60"
                }`}
              />
            ))}
          </div>
          <div className="text-white/80 text-sm font-medium">
            {currentIndex + 1} / {tours.length}
          </div>
          <div className="text-white/60 text-xs hidden md:block">
            {currentIndex === 0
              ? "↑ Scroll arriba"
              : currentIndex === tours.length - 1
                ? "↓ Scroll abajo"
                : "← → Navegar"}
          </div>
        </div>
      </div>
    </section>
  )
}
