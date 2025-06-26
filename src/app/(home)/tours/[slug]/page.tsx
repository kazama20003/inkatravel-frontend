"use client"

import { useState, useEffect, useCallback } from "react"
import { motion } from "framer-motion"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import {
  MapPin,
  Clock,
  Users,
  Star,
  Check,
  X,
  Info,
  Shield,
  ShoppingCart,
  Car,
  Wifi,
  Wind,
  CalendarIcon,
  CreditCard,
  ChevronRightIcon as Chevron,
} from "lucide-react"
import { api } from "@/lib/axiosInstance"
import type { Tour } from "@/types/tour"
import type { CreateCartDto } from "@/types/cart"
import { toast } from "sonner"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { ChevronDown } from "lucide-react"

interface ApiError {
  response?: {
    data?: {
      message?: string
    }
    status?: number
  }
  message?: string
}

type TabKey = "itinerary" | "includes" | "bring" | "conditions" | "transport"

export default function TourDetailPage() {
  const [activeTab, setActiveTab] = useState<TabKey>("itinerary")
  const params = useParams()
  const router = useRouter()
  const slug = params.slug as string
  const [tour, setTour] = useState<Tour | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date>()
  const [participants, setParticipants] = useState<number>(1)
  const [loading, setLoading] = useState<boolean>(true)
  const [addingToCart, setAddingToCart] = useState<boolean>(false)
  const [processingOrder, setProcessingOrder] = useState<boolean>(false)

  const fetchTour = useCallback(async () => {
    try {
      setLoading(true)
      const response = await api.get(`/tours/slug/${slug}`)
      if (response.data.data) {
        setTour(response.data.data)
        // Set default date to next week
        const nextWeek = new Date()
        nextWeek.setDate(nextWeek.getDate() + 7)
        setSelectedDate(nextWeek)
      }
    } catch (err) {
      const apiError = err as ApiError
      console.error("Error fetching tour:", apiError)
    } finally {
      setLoading(false)
    }
  }, [slug])

  useEffect(() => {
    if (slug) {
      fetchTour()
    }
  }, [slug, fetchTour])

  // Add to cart function
  const handleAddToCart = async () => {
    if (!tour || !selectedDate) return

    try {
      setAddingToCart(true)

      const cartData: CreateCartDto = {
        items: [
          {
            tour: tour._id,
            startDate: selectedDate.toISOString(),
            people: participants,
            pricePerPerson: tour.price,
            total: tour.price * participants,
            notes: `Tour: ${tour.title}`,
          },
        ],
        totalPrice: tour.price * participants,
      }

      await api.post("/cart", cartData)
      toast.success("Tour agregado al carrito exitosamente!")
    } catch (err) {
      const apiError = err as ApiError
      console.error("Error adding to cart:", apiError)

      // Check if it's an authentication error
      if (apiError.response?.status === 401) {
        toast.error("Debes estar autenticado para agregar al carrito")
        router.push("/login")
      } else {
        toast.error("Error al agregar al carrito. Inténtalo de nuevo.")
      }
    } finally {
      setAddingToCart(false)
    }
  }

  // Reserve now function - goes to checkout
  const handleReserveNow = async () => {
    if (!tour || !selectedDate) return

    try {
      setProcessingOrder(true)

      // First get cart to check if user is authenticated
      await api.get("/cart")

      // If authenticated, proceed to checkout
      router.push("/checkout")
    } catch (err) {
      const apiError = err as ApiError
      console.error("Error checking authentication:", apiError)

      if (apiError.response?.status === 401) {
        toast.error("Debes estar autenticado para hacer una reserva")
        router.push("/login")
      } else {
        toast.error("Error al procesar la reserva. Inténtalo de nuevo.")
      }
    } finally {
      setProcessingOrder(false)
    }
  }

  // WhatsApp handler
  const handleWhatsAppReservation = () => {
    if (!tour || !selectedDate) return

    const message = `Hola! Estoy interesado en el tour: ${tour.title} para ${participants} persona${participants > 1 ? "s" : ""} el ${format(selectedDate, "PPPP", { locale: es })}. ¿Podrían darme más información?`

    const whatsappUrl = `https://wa.me/51999999999?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, "_blank")
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-peru-orange"></div>
      </div>
    )
  }

  if (!tour) {
    return (
      <div className="min-h-screen px-4">
        <div className="max-w-7xl mx-auto text-center py-20">
          <h1 className="text-3xl brand-text text-peru-dark mb-4">Tour no encontrado</h1>
          <p className="text-peru-dark/70 body-text mb-8">Lo sentimos, el tour que buscas no está disponible.</p>
          <button
            onClick={() => router.push("/tours")}
            className="px-6 py-3 bg-peru-orange text-white brand-text hover:bg-peru-orange/90 transition-colors"
          >
            VER TODOS LOS TOURS
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-cream-50">
      {/* Hero Section - Full Screen */}
      <div className="relative h-screen w-full">
        <Image src={tour.imageUrl || "/placeholder.svg"} alt={tour.title} fill className="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />

        <div className="absolute inset-0 flex flex-col justify-between p-3 sm:p-4 md:p-6 lg:p-8 xl:p-12">
          {/* Breadcrumbs */}
          <div className="max-w-7xl mx-auto w-full pt-16 sm:pt-18 md:pt-20 lg:pt-24">
            <div className="flex items-center space-x-2 text-white/90 mb-3 sm:mb-4 md:mb-5 lg:mb-6">
              <button onClick={() => router.push("/tours")} className="text-sm hover:underline">
                Tours
              </button>
              <Chevron size={16} />
              <span className="text-sm">{tour.slug}</span>
            </div>
          </div>

          {/* Main Content */}
          <div className="max-w-7xl mx-auto w-full flex-1 flex items-center">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              className="w-full"
            >
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 md:gap-4 lg:gap-6 mb-3 sm:mb-4 md:mb-5 lg:mb-6">
                <span
                  className={`px-3 py-1 md:px-4 md:py-2 text-xs md:text-sm brand-text text-white rounded ${
                    tour.packageType === "Premium"
                      ? "bg-peru-gold"
                      : tour.packageType === "Basico"
                        ? "bg-peru-orange"
                        : "bg-gray-600"
                  }`}
                >
                  {tour.packageType}
                </span>
                {tour.featured && (
                  <span className="px-3 py-1 md:px-4 md:py-2 text-xs md:text-sm brand-text bg-red-500 text-white rounded">
                    DESTACADO
                  </span>
                )}
                <span className="px-3 py-1 md:px-4 md:py-2 text-xs md:text-sm brand-text bg-blue-600 text-white rounded">
                  {tour.difficulty}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl xl:text-7xl brand-text text-white mb-3 sm:mb-4 md:mb-5 lg:mb-6 leading-tight">
                {tour.title}
              </h1>

              <p className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl text-white/90 body-text mb-6 md:mb-8 max-w-4xl leading-relaxed">
                {tour.subtitle}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4 lg:gap-6 text-white">
                <div className="flex items-center">
                  <Clock size={20} className="mr-2 md:mr-3 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-white/70">Duración</p>
                    <p className="body-text font-medium text-sm md:text-base">{tour.duration}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <MapPin size={20} className="mr-2 md:mr-3 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-white/70">Ubicación</p>
                    <p className="body-text font-medium text-sm md:text-base">
                      {tour.location}, {tour.region}
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Star size={20} className="mr-2 md:mr-3 text-yellow-400 fill-current flex-shrink-0" />
                  <div>
                    <p className="text-xs text-white/70">Rating</p>
                    <p className="body-text font-medium text-sm md:text-base">
                      {tour.rating} ({tour.reviews.toLocaleString()})
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Users size={20} className="mr-2 md:mr-3 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-white/70">Grupo</p>
                    <p className="body-text font-medium text-sm md:text-base">Pequeño</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Scroll Indicator */}
          <div className="max-w-7xl mx-auto w-full flex justify-center pb-8">
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
              className="text-white/70"
            >
              <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
                <div className="w-1 h-3 bg-white/50 rounded-full mt-2"></div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
          {/* Left Column - Tour Details */}
          <div className="lg:col-span-2">
            {/* Highlights - Puntos Especiales */}
            <motion.div
              className="bg-white rounded-xl p-4 sm:p-5 md:p-6 lg:p-8 mb-8 shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-lg sm:text-xl md:text-2xl brand-text text-peru-dark mb-6 flex items-center">
                <MapPin className="mr-3 text-peru-orange" size={24} />
                Puntos Destacados del Tour
              </h2>
              <div className="grid grid-cols-1 gap-4">
                {tour.highlights.map((highlight, index) => (
                  <motion.div
                    key={index}
                    className="flex items-center p-4 bg-gradient-to-r from-peru-light/20 to-peru-orange/10 rounded-lg border-l-4 border-peru-orange hover:shadow-md transition-shadow"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <div className="w-3 h-3 bg-peru-orange rounded-full mr-4 flex-shrink-0"></div>
                    <span className="body-text text-peru-dark font-medium text-sm md:text-base">{highlight}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Ruta como Mapa Visual */}
            <motion.div
              className="bg-white rounded-xl p-4 sm:p-5 md:p-6 lg:p-8 mb-8 shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <h2 className="text-lg sm:text-xl md:text-2xl brand-text text-peru-dark mb-6 flex items-center">
                <MapPin className="mr-3 text-peru-orange" size={24} />
                Mapa de la Ruta
              </h2>

              {tour.itinerary?.[0]?.route && tour.itinerary[0].route.length > 0 ? (
                <div className="relative bg-gradient-to-br from-blue-50 to-green-50 rounded-xl p-6 border-2 border-dashed border-peru-orange/30">
                  {/* Título del mapa */}
                  <div className="text-center mb-8">
                    <h3 className="text-lg brand-text text-peru-dark mb-2">Recorrido del Tour</h3>
                    <p className="text-sm text-peru-dark/70 body-text">Sigue la ruta de tu aventura</p>
                  </div>

                  {/* Ruta visual como mapa */}
                  <div className="relative">
                    {/* Línea de ruta serpenteante */}
                    <svg
                      className="absolute inset-0 w-full h-full pointer-events-none"
                      style={{ height: `${tour.itinerary[0].route.length * 200}px` }}
                    >
                      <defs>
                        <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#f97316" />
                          <stop offset="50%" stopColor="#fb923c" />
                          <stop offset="100%" stopColor="#fdba74" />
                        </linearGradient>
                      </defs>
                      <path
                        d={`M 50 50 ${tour.itinerary[0].route
                          .map((_, idx) => {
                            const y = 50 + idx * 180
                            const x = idx % 2 === 0 ? 50 : window.innerWidth > 768 ? 400 : 250
                            return `Q ${x + 100} ${y + 50} ${x} ${y + 100}`
                          })
                          .join(" ")}`}
                        stroke="url(#routeGradient)"
                        strokeWidth="4"
                        fill="none"
                        strokeDasharray="10,5"
                        className="animate-pulse"
                      />
                    </svg>

                    {/* Paradas del tour */}
                    <div className="relative z-10 space-y-12">
                      {tour.itinerary[0].route.map((stop, idx) => (
                        <motion.div
                          key={stop._id || idx}
                          className={`flex items-center gap-6 ${idx % 2 === 0 ? "flex-row" : "flex-row-reverse"}`}
                          initial={{ opacity: 0, x: idx % 2 === 0 ? -50 : 50 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.8, delay: idx * 0.2 }}
                        >
                          {/* Imagen de la parada */}
                          <div className="relative group">
                            <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 lg:w-40 lg:h-40 rounded-full overflow-hidden border-4 border-white shadow-xl group-hover:scale-105 transition-transform duration-300">
                              <Image
                                src={stop.imageUrl || "/placeholder.svg"}
                                alt={stop.location}
                                fill
                                className="object-cover"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                            </div>

                            {/* Número de parada */}
                            <div className="absolute -top-2 -right-2 w-10 h-10 bg-gradient-to-br from-peru-orange to-peru-light rounded-full flex items-center justify-center text-white font-bold brand-text shadow-lg border-2 border-white">
                              {idx + 1}
                            </div>
                          </div>

                          {/* Información de la parada */}
                          <div className={`flex-1 ${idx % 2 === 0 ? "text-left" : "text-right"}`}>
                            <div
                              className={`bg-white rounded-xl p-4 sm:p-5 md:p-6 border border-gray-100 ${idx % 2 === 0 ? "ml-4" : "mr-4"}`}
                            >
                              <h4 className="text-lg md:text-xl font-bold text-peru-dark brand-text mb-3">
                                {stop.location}
                              </h4>
                              {stop.description && (
                                <p className="text-sm md:text-base text-peru-dark/70 body-text leading-relaxed mb-4">
                                  {stop.description}
                                </p>
                              )}

                              {/* Badge de ubicación */}
                              <div className={`flex ${idx % 2 === 0 ? "justify-start" : "justify-end"}`}>
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-peru-orange/10 to-peru-light/10 text-peru-orange border border-peru-orange/20">
                                  <MapPin className="w-3 h-3 mr-1" />
                                  Parada {idx + 1}
                                </span>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    {/* Punto final */}
                    <motion.div
                      className="flex justify-center mt-12"
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.8, delay: tour.itinerary[0].route.length * 0.2 }}
                    >
                      <div className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-full font-bold brand-text shadow-lg">
                        🏁 Fin del Tour
                      </div>
                    </motion.div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-4 py-8 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl">
                  <span className="px-6 py-3 bg-gradient-to-r from-peru-light/30 to-peru-orange/20 text-peru-dark brand-text rounded-xl border border-peru-orange/20">
                    {tour.location}
                  </span>
                  <div className="flex items-center">
                    <div className="w-8 h-0.5 bg-peru-orange"></div>
                    <Chevron size={20} className="text-peru-orange mx-2" />
                    <div className="w-8 h-0.5 bg-peru-orange"></div>
                  </div>
                  <span className="px-6 py-3 bg-gradient-to-r from-peru-orange/20 to-peru-light/30 text-peru-dark brand-text rounded-xl border border-peru-orange/20">
                    {tour.region}
                  </span>
                </div>
              )}
            </motion.div>

            {/* Tabs */}
            <motion.div
              className="bg-white rounded-xl shadow-lg overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="border-b border-gray-200">
                <nav className="flex overflow-x-auto px-6 md:px-8">
                  {[
                    { key: "itinerary" as TabKey, label: "Itinerario" },
                    { key: "includes" as TabKey, label: "Incluye/No Incluye" },
                    { key: "transport" as TabKey, label: "Transporte" },
                    { key: "bring" as TabKey, label: "Qué Llevar" },
                    { key: "conditions" as TabKey, label: "Condiciones" },
                  ].map((tab) => (
                    <button
                      key={tab.key}
                      onClick={() => setActiveTab(tab.key)}
                      className={`py-4 px-2 border-b-2 font-medium text-sm brand-text transition-colors whitespace-nowrap ${
                        activeTab === tab.key
                          ? "border-peru-orange text-peru-orange"
                          : "border-transparent text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </nav>
              </div>

              <div className="p-6 md:p-8">
                {/* Itinerario Tab */}
                {activeTab === "itinerary" && tour.itinerary && (
                  <div className="space-y-8">
                    {tour.itinerary.map((day, index) => (
                      <motion.div
                        key={day._id || index}
                        className="border-l-4 border-peru-orange pl-6"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: index * 0.1 }}
                      >
                        <div className="flex items-center mb-4">
                          <span className="bg-peru-orange text-white px-4 py-2 text-sm brand-text mr-4 rounded">
                            DÍA {day.day}
                          </span>
                          <h3 className="text-lg md:text-xl brand-text text-peru-dark">{day.title}</h3>
                        </div>
                        <p className="text-peru-dark/70 body-text mb-6 leading-relaxed text-sm md:text-base">
                          {day.description}
                        </p>

                        <div className="space-y-3 mb-6">
                          {day.activities.map((activity, actIdx) => (
                            <div key={actIdx} className="flex items-start">
                              <div className="w-2 h-2 bg-peru-orange rounded-full mt-2 mr-4 flex-shrink-0" />
                              <p className="text-xs md:text-sm text-peru-dark/80 body-text">{activity}</p>
                            </div>
                          ))}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {day.meals && day.meals.length > 0 && (
                            <div className="flex items-center text-sm text-peru-dark/60">
                              <span className="font-medium mr-2">Comidas:</span>
                              <span className="body-text">{day.meals.join(", ")}</span>
                            </div>
                          )}
                          {day.accommodation && (
                            <div className="flex items-center text-sm text-peru-dark/60">
                              <span className="font-medium mr-2">Alojamiento:</span>
                              <span className="body-text">{day.accommodation}</span>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}

                {/* Includes Tab */}
                {activeTab === "includes" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <h3 className="text-lg md:text-xl brand-text text-peru-dark mb-6 flex items-center">
                        <Check size={24} className="mr-3 text-green-600" />
                        Incluye
                      </h3>
                      <ul className="space-y-3">
                        {tour.includes?.map((item, index) => (
                          <li key={index} className="flex items-start">
                            <Check size={18} className="mr-3 text-green-600 mt-0.5 flex-shrink-0" />
                            <span className="text-xs md:text-sm body-text text-peru-dark/80">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-lg md:text-xl brand-text text-peru-dark mb-6 flex items-center">
                        <X size={24} className="mr-3 text-red-600" />
                        No Incluye
                      </h3>
                      <ul className="space-y-3">
                        {tour.notIncludes?.map((item, index) => (
                          <li key={index} className="flex items-start">
                            <X size={18} className="mr-3 text-red-600 mt-0.5 flex-shrink-0" />
                            <span className="text-xs md:text-sm body-text text-peru-dark/80">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {/* Transport Tab */}
                {activeTab === "transport" && (
                  <div className="space-y-6">
                    <h3 className="text-lg md:text-xl brand-text text-peru-dark mb-6 flex items-center">
                      <Car size={24} className="mr-3 text-blue-600" />
                      Opciones de Transporte
                    </h3>
                    {tour.transportOptionIds && tour.transportOptionIds.length > 0 ? (
                      <div className="space-y-6">
                        {tour.transportOptionIds.map((transport, ) => (
                          <div
                            key={transport._id}
                            className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                          >
                            <div className="flex items-start gap-4">
                              <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                                <Image
                                  src={transport.imageUrl || "/placeholder.svg?height=80&width=80"}
                                  alt={transport.vehicle}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-3">
                                  <h4 className="text-lg brand-text text-peru-dark">{transport.vehicle}</h4>
                                  <span
                                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                                      transport.type === "Premium"
                                        ? "bg-purple-100 text-purple-800"
                                        : "bg-blue-100 text-blue-800"
                                    }`}
                                  >
                                    {transport.type}
                                  </span>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                  {transport.services.map((service, serviceIndex) => (
                                    <span
                                      key={serviceIndex}
                                      className="inline-flex items-center gap-1 bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                                    >
                                      {service === "Aire Acondicionado" && <Wind className="w-3 h-3" />}
                                      {service === "WiFi" && <Wifi className="w-3 h-3" />}
                                      <Check className="w-3 h-3 text-green-500" />
                                      {service}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Car className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600">Información de transporte no disponible</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Bring Tab */}
                {activeTab === "bring" && (
                  <div>
                    <h3 className="text-lg md:text-xl brand-text text-peru-dark mb-6 flex items-center">
                      <Info size={24} className="mr-3 text-blue-600" />
                      Qué Llevar
                    </h3>
                    <ul className="space-y-3">
                      {tour.toBring?.map((item, index) => (
                        <li key={index} className="flex items-start">
                          <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-4 flex-shrink-0" />
                          <span className="text-xs md:text-sm body-text text-peru-dark/80">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Conditions Tab */}
                {activeTab === "conditions" && (
                  <div>
                    <h3 className="text-lg md:text-xl brand-text text-peru-dark mb-6 flex items-center">
                      <Shield size={24} className="mr-3 text-orange-600" />
                      Condiciones
                    </h3>
                    <ul className="space-y-3">
                      {tour.conditions?.map((condition, index) => (
                        <li key={index} className="flex items-start">
                          <div className="w-2 h-2 bg-orange-600 rounded-full mt-2 mr-4 flex-shrink-0" />
                          <span className="text-xs md:text-sm body-text text-peru-dark/80">{condition}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Right Column - Booking Sticky */}
          <div className="lg:col-span-1">
            <motion.div
              className="bg-white rounded-xl p-4 md:p-6 lg:p-8 sticky top-20 sm:top-22 md:top-24 shadow-2xl border border-gray-100"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              {/* Header destacado */}
              <div className="text-center mb-6 md:mb-8 p-3 md:p-4 bg-gradient-to-r from-peru-orange/10 to-peru-light/10 rounded-xl border border-peru-orange/20">
                <h3 className="text-lg md:text-xl lg:text-2xl brand-text text-peru-dark mb-2">¡Reserva Ahora!</h3>
                <p className="text-xs md:text-sm text-peru-dark/70 body-text">Disponibilidad limitada</p>
              </div>

              {/* Precio destacado */}
              <div className="mb-6 md:mb-8 text-center">
                <div className="flex items-center justify-center mb-2">
                  <span className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-peru-dark brand-text">
                    S/ {tour.price}
                  </span>
                  <span className="text-xs md:text-sm text-gray-500 ml-2 body-text">por persona</span>
                </div>
                {tour.originalPrice && (
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-sm md:text-lg text-gray-500 line-through body-text">
                      S/ {tour.originalPrice}
                    </span>
                    <span className="text-xs md:text-sm bg-green-100 text-green-800 px-2 md:px-3 py-1 rounded-full font-medium">
                      ¡Ahorra S/ {tour.originalPrice - tour.price}!
                    </span>
                  </div>
                )}
              </div>

              {/* Fecha con Calendar */}
              <div className="mb-4 md:mb-6">
                <label className="text-xs md:text-sm font-medium text-peru-dark mb-2 md:mb-3 body-text flex items-center">
                  <CalendarIcon className="w-3 h-3 md:w-4 md:h-4 mr-2 text-peru-orange" />
                  Fecha de salida *
                </label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal h-9 sm:h-10 md:h-11 lg:h-12 text-xs md:text-sm border-2 border-gray-200 hover:border-peru-orange focus:border-peru-orange"
                    >
                      <CalendarIcon className="mr-2 h-3 w-3 md:h-4 md:w-4 text-peru-orange" />
                      {selectedDate ? format(selectedDate, "PPP", { locale: es }) : "Selecciona una fecha"}
                      <ChevronDown className="ml-auto h-3 w-3 md:h-4 md:w-4 text-gray-400" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      disabled={(date) => date < new Date()}
                      initialFocus
                      locale={es}
                      className="rounded-md border"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Participantes */}
              <div className="mb-6 md:mb-8">
                <label className="text-xs md:text-sm font-medium text-peru-dark mb-2 md:mb-3 body-text flex items-center">
                  <Users className="w-3 h-3 md:w-4 md:h-4 mr-2 text-peru-orange" />
                  Número de participantes *
                </label>
                <div className="flex items-center border-2 border-gray-200 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setParticipants(Math.max(1, participants - 1))}
                    className="px-2.5 sm:px-3 md:px-3.5 lg:px-4 py-2 md:py-3 hover:bg-gray-100 transition-colors text-peru-dark font-bold text-sm md:text-base"
                  >
                    -
                  </button>
                  <span className="px-4 md:px-6 py-2 md:py-3 border-x-2 border-gray-200 body-text font-bold text-peru-dark bg-gray-50 text-sm md:text-base">
                    {participants}
                  </span>
                  <button
                    onClick={() => setParticipants(participants + 1)}
                    className="px-2.5 sm:px-3 md:px-3.5 lg:px-4 py-2 md:py-3 hover:bg-gray-100 transition-colors text-peru-dark font-bold text-sm md:text-base"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Total destacado */}
              <div className="mb-6 md:mb-8 p-4 md:p-6 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border-2 border-gray-200">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-lg md:text-xl brand-text text-peru-dark">Total:</span>
                  <span className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-peru-dark brand-text">
                    S/ {tour.price * participants}
                  </span>
                </div>
                <p className="text-xs md:text-sm text-gray-600 body-text text-center">
                  {participants} participante{participants > 1 ? "s" : ""} × S/ {tour.price}
                </p>
              </div>

              {/* Botones destacados */}
              <div className="space-y-2 md:space-y-3">
                <button
                  onClick={handleReserveNow}
                  disabled={processingOrder || !selectedDate}
                  className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-2.5 sm:py-3 md:py-3.5 lg:py-4 brand-text text-xs sm:text-sm md:text-base lg:text-lg font-bold hover:from-orange-600 hover:to-orange-700 transition-all rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
                >
                  <CreditCard size={16} className="md:w-5 md:h-5" />
                  {processingOrder ? "PROCESANDO..." : "RESERVAR AHORA"}
                </button>

                <button
                  onClick={handleAddToCart}
                  disabled={addingToCart || !selectedDate}
                  className="w-full border-2 border-peru-dark text-peru-dark py-2.5 sm:py-3 md:py-3.5 lg:py-4 brand-text text-xs sm:text-sm md:text-base lg:text-lg font-bold hover:bg-peru-dark hover:text-white transition-all rounded-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                >
                  <ShoppingCart size={16} className="md:w-5 md:h-5" />
                  {addingToCart ? "AGREGANDO..." : "AGREGAR AL CARRITO"}
                </button>

                <button
                  onClick={handleWhatsAppReservation}
                  disabled={!selectedDate}
                  className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-2.5 sm:py-3 md:py-3.5 lg:py-4 brand-text text-xs sm:text-sm md:text-base lg:text-lg font-bold hover:from-green-700 hover:to-green-800 transition-all rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  <svg className="w-4 h-4 md:w-5 md:h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
                  </svg>
                  CONSULTAR POR WHATSAPP
                </button>
              </div>

              {/* Info adicional */}
              <div className="mt-6 md:mt-8 p-3 md:p-4 bg-blue-50 rounded-xl border border-blue-200">
                <div className="text-xs md:text-sm text-blue-800 space-y-2">
                  <div className="flex items-center">
                    <Shield size={14} className="md:w-4 md:h-4 mr-2 md:mr-3 text-blue-600 flex-shrink-0" />
                    <span className="body-text font-medium">Reserva 100% segura</span>
                  </div>
                  <div className="flex items-center">
                    <Clock size={14} className="md:w-4 md:h-4 mr-2 md:mr-3 text-blue-600 flex-shrink-0" />
                    <span className="body-text">Cancelación gratuita 24h antes</span>
                  </div>
                  <div className="flex items-center">
                    <Check size={14} className="md:w-4 md:h-4 mr-2 md:mr-3 text-blue-600 flex-shrink-0" />
                    <span className="body-text">Confirmación inmediata</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
