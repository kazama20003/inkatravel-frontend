"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Clock, MapPin, Users, Star, Phone, MessageCircle, CreditCard, Navigation } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useParams } from "next/navigation"
import { api } from "@/lib/axiosInstance"
import { useLanguage } from "@/contexts/LanguageContext"

// Tipos para la API de transporte
interface TransportOption {
  _id: string
  type: "Basico" | "Premium"
  vehicle: string
  services: string[]
  imageUrl: string
  imageId?: string
}

interface RoutePoint {
  _id?: string
  location: string
  description?: string
  imageUrl?: string
  imageId?: string
}

interface ItineraryDay {
  _id?: string
  day: number
  title: string
  description: string
  activities: string[]
  meals?: string[]
  accommodation?: string
  imageUrl?: string
  imageId?: string
  route: RoutePoint[]
}

interface TransportTour {
  _id: string
  title: string
  subtitle: string
  imageUrl: string
  imageId?: string
  price: number
  originalPrice?: number
  duration: string
  rating: number
  reviews: number
  location: string
  region: string
  category: string
  difficulty: "Facil" | "Moderado" | "Difícil"
  packageType: "Basico" | "Premium"
  highlights: string[]
  featured?: boolean
  transportOptionIds: TransportOption[]
  itinerary?: ItineraryDay[]
  includes?: string[]
  notIncludes?: string[]
  toBring?: string[]
  conditions?: string[]
  slug: string
  createdAt: string
  updatedAt: string
  __v: number
}

interface TransportApiResponse {
  message: string
  data: TransportTour[]
  pagination: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

// Tipos para crear orden
interface OrderItemDto {
  tour: string
  startDate: string
  people: number
  pricePerPerson: number
  total: number
  notes?: string
}

interface CustomerInfoDto {
  fullName: string
  email: string
  phone?: string
  nationality?: string
}

interface CreateOrderDto {
  items: OrderItemDto[]
  customer: CustomerInfoDto
  totalPrice: number
  paymentMethod?: string
  notes?: string
  discountCodeUsed?: string
}

export default function TransportDetailPage() {
  const { t } = useLanguage()
  const params = useParams()
  const slug = params.slug as string
  const [tour, setTour] = useState<TransportTour | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedDate, setSelectedDate] = useState<string>("")
  const [people, setPeople] = useState(1)
  const [showBookingForm, setShowBookingForm] = useState(false)
  const [customerInfo, setCustomerInfo] = useState<CustomerInfoDto>({
    fullName: "",
    email: "",
    phone: "",
    nationality: "",
  })

  // Cargar datos del tour específico
  useEffect(() => {
    const fetchTourData = async () => {
      try {
        setLoading(true)
        const response = await api.get<TransportApiResponse>("/tours/transport")
        const tours = response.data.data || []
        const foundTour = tours.find((t) => t.slug === slug)
        setTour(foundTour || null)
        setError(foundTour ? null : t.tourNotFound)
      } catch (err) {
        console.error("Error fetching tour data:", err)
        setError(t.error)
      } finally {
        setLoading(false)
      }
    }

    if (slug) {
      fetchTourData()
    }
  }, [slug, t])

  // Función para obtener fechas disponibles con días correctos de la semana
  const getAvailableDates = () => {
    if (!tour) return []

    const dates = []
    const today = new Date()
    const isChivayToCusco = tour.title.includes("CHIVAY - CUSCO") || tour.slug.includes("chivay-cusco")

    // Días de la semana: 0=Domingo, 1=Lunes, 2=Martes, 3=Miércoles, 4=Jueves, 5=Viernes, 6=Sábado
    const availableDays = isChivayToCusco ? [1, 3, 5] : [2, 4, 6] // Lun/Mié/Vie vs Mar/Jue/Sáb

    // Generar fechas para los próximos 60 días
    for (let i = 0; i < 60; i++) {
      const date = new Date(today)
      date.setDate(today.getDate() + i)
      if (availableDays.includes(date.getDay())) {
        dates.push({
          date: date.toISOString().split("T")[0],
          display: date.toLocaleDateString(t.locale, {
            weekday: "short",
            day: "numeric",
            month: "short",
          }),
          full: date.toLocaleDateString(t.locale, {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
          }),
          dayName: date.toLocaleDateString(t.locale, { weekday: "long" }),
        })
      }
    }

    return dates.slice(0, 15) // Mostrar solo las próximas 15 fechas disponibles
  }

  // Función para convertir soles a dólares
  const convertToUSD = (soles: number) => {
    const exchangeRate = 3.8
    return Math.round(soles / exchangeRate)
  }

  // Función para formatear precio de manera más entendible
  const formatPrice = (price: number) => {
    return {
      soles: `S/. ${Math.round(price).toLocaleString()}`,
      dollars: `$${convertToUSD(price)}`,
      solesNumber: Math.round(price),
      dollarsNumber: convertToUSD(price),
    }
  }

  // Función para crear orden
  const handleCreateOrder = async () => {
    if (!tour || !selectedDate || !customerInfo.fullName || !customerInfo.email) {
      alert(t.completeRequiredFields)
      return
    }

    try {
      const orderData: CreateOrderDto = {
        items: [
          {
            tour: tour._id,
            startDate: selectedDate,
            people: people,
            pricePerPerson: tour.price,
            total: tour.price * people,
            notes: `${t.reserve} ${tour.title}`,
          },
        ],
        customer: customerInfo,
        totalPrice: tour.price * people,
        paymentMethod: "pending",
        notes: `${t.booking} ${people} ${people > 1 ? t.passengers : t.passenger}`,
      }

      const response = await api.post("/orders", orderData)
      alert(t.orderCreatedSuccess)
      setShowBookingForm(false)
      console.log("Orden creada:", response.data)
    } catch (err) {
      console.error("Error creating order:", err)
      alert(t.orderCreationError)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <motion.div
          className="w-16 h-16 border-4 border-gray-800 border-t-transparent rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
        />
      </div>
    )
  }

  if (error || !tour) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error || t.tourNotFound}</p>
          <Link
            href="/"
            className="bg-peru-orange text-white px-4 py-2 rounded hover:bg-peru-orange/90 transition-colors"
          >
            {t.backToHome}
          </Link>
        </div>
      </div>
    )
  }

  const availableDates = getAvailableDates()
  const totalPrice = tour.price * people
  const formattedPrice = formatPrice(tour.price)
  const formattedTotal = formatPrice(totalPrice)

  // Verificar si existe itinerary y obtener el primer elemento de forma segura
  const firstItinerary = tour.itinerary && tour.itinerary.length > 0 ? tour.itinerary[0] : null
  const routePoints = firstItinerary?.route || []

  // Obtener días disponibles según la ruta
  const getAvailableDaysText = () => {
    const isChivayToCusco = tour.title.includes("CHIVAY - CUSCO") || tour.slug.includes("chivay-cusco")
    return isChivayToCusco
      ? `${t.monday} • ${t.wednesday} • ${t.friday}`
      : `${t.tuesday} • ${t.thursday} • ${t.saturday}`
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative h-[60vh] overflow-hidden">
        <Image
          src={tour.imageUrl || "/placeholder.svg?height=600&width=1200&query=transport landscape"}
          alt={tour.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/20" />
        <div className="absolute bottom-0 left-0 right-0 p-4 md:p-8 lg:p-16">
          <div className="max-w-7xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
              <div className="flex items-center gap-2 mb-4">
                <Star className="w-5 h-5 text-yellow-400 fill-current" />
                <span className="text-white font-medium">{tour.rating}</span>
                <span className="text-white/70">
                  ({tour.reviews.toLocaleString()} {t.reviews})
                </span>
              </div>
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-4 tracking-tight">
                {tour.title.replace("TRANSPORTE ", "").replace(" - ", " → ")}
              </h1>
              <p className="text-lg md:text-xl text-white/90 mb-6 max-w-3xl">{tour.subtitle}</p>
              <div className="flex flex-wrap gap-4 text-white">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  <span>{tour.duration}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  <span>
                    {tour.location} → {tour.region}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  <span>{t.unlimitedCapacity}</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 py-8 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Left Column - Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Route Map */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">{t.panoramicRoute}</h2>
              {firstItinerary ? (
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">{firstItinerary.title}</h3>
                  <p className="text-gray-600 mb-6">{firstItinerary.description}</p>

                  {/* Route Points - Mejorado como mapa visual */}
                  {routePoints.length > 0 ? (
                    <div className="space-y-6">
                      <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                        <Navigation className="w-5 h-5 text-peru-orange" />
                        {t.stopsOnRoute}:
                      </h4>
                      <div className="relative">
                        {/* Línea conectora */}
                        <div className="absolute left-6 top-8 bottom-8 w-0.5 bg-gradient-to-b from-peru-orange via-peru-orange/60 to-peru-orange"></div>
                        {routePoints.map((point, index) => (
                          <motion.div
                            key={point._id || index}
                            className="relative flex gap-6 mb-8 last:mb-0"
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            viewport={{ once: true }}
                          >
                            {/* Punto del mapa */}
                            <div className="relative z-10 flex-shrink-0">
                              <div className="w-12 h-12 bg-peru-orange text-white rounded-full flex items-center justify-center text-lg font-bold shadow-lg">
                                {index + 1}
                              </div>
                              {/* Pulso animado */}
                              <div className="absolute inset-0 w-12 h-12 bg-peru-orange rounded-full animate-ping opacity-20"></div>
                            </div>

                            {/* Contenido de la parada */}
                            <div className="flex-1 bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow">
                              <div className="flex flex-col md:flex-row gap-4">
                                <div className="flex-1">
                                  <h5 className="font-bold text-gray-900 text-lg mb-2">{point.location}</h5>
                                  {point.description && (
                                    <p className="text-gray-600 leading-relaxed mb-3">{point.description}</p>
                                  )}
                                  <div className="flex items-center gap-2 text-sm text-peru-orange font-medium">
                                    <MapPin className="w-4 h-4" />
                                    <span>
                                      {t.stopOf} {index + 1} {t.stopOf} {routePoints.length}
                                    </span>
                                  </div>
                                </div>

                                {/* Imagen de la parada */}
                                {point.imageUrl && (
                                  <div className="flex-shrink-0 w-full md:w-32 h-24 md:h-20 rounded-lg overflow-hidden shadow-md">
                                    <Image
                                      src={point.imageUrl || "/placeholder.svg?height=80&width=128&query=landscape"}
                                      alt={point.location}
                                      width={128}
                                      height={80}
                                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                    />
                                  </div>
                                )}
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Navigation className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>{t.routeInfoNotAvailable}</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="text-center py-8 text-gray-500">
                    <Navigation className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>{t.routeInfoNotAvailable}</p>
                  </div>
                </div>
              )}
            </motion.section>

            {/* Schedule */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">{t.schedulesAndAvailability}</h2>
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-100">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <Clock className="w-5 h-5 text-peru-orange" />
                      {t.departureTime}
                    </h3>
                    <div className="text-2xl font-bold text-peru-orange mb-2">08:00 AM</div>
                    <p className="text-gray-600 text-sm">{t.arriveEarly}</p>
                  </div>

                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <h3 className="font-semibold text-gray-900 mb-3">{t.availableDays}</h3>
                    <div className="text-lg font-bold text-peru-orange mb-2">{getAvailableDaysText()}</div>
                    <p className="text-gray-600 text-sm">{t.regularDepartures}</p>
                  </div>
                </div>
              </div>
            </motion.section>

            {/* Includes/Not Includes */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {tour.includes && tour.includes.length > 0 && (
                  <div className="bg-green-50 rounded-lg p-6 border border-green-200">
                    <h3 className="font-semibold text-green-900 mb-4 text-lg">✅ {t.includes}</h3>
                    <ul className="space-y-3">
                      {tour.includes.map((item, index) => (
                        <li key={index} className="flex items-start gap-3 text-green-800">
                          <span className="text-green-600 mt-1 font-bold">✓</span>
                          <span className="text-sm leading-relaxed">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {tour.notIncludes && tour.notIncludes.length > 0 && (
                  <div className="bg-red-50 rounded-lg p-6 border border-red-200">
                    <h3 className="font-semibold text-red-900 mb-4 text-lg">❌ {t.notIncludes}</h3>
                    <ul className="space-y-3">
                      {tour.notIncludes.map((item, index) => (
                        <li key={index} className="flex items-start gap-3 text-red-800">
                          <span className="text-red-600 mt-1 font-bold">✗</span>
                          <span className="text-sm leading-relaxed">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </motion.section>
          </div>

          {/* Right Column - Booking */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              className="sticky top-8"
            >
              <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-6">
                {/* Price - Mejorado y más entendible */}
                <div className="text-center mb-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-4">
                  {tour.originalPrice && tour.originalPrice > tour.price && (
                    <div className="mb-2">
                      <p className="text-gray-500 line-through text-lg">
                        {formatPrice(tour.originalPrice).soles} / {formatPrice(tour.originalPrice).dollars}
                      </p>
                      <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">{t.offer}</span>
                    </div>
                  )}
                  <div className="mb-2">
                    <p className="text-3xl font-bold text-gray-900">{formattedPrice.soles}</p>
                    <p className="text-xl font-semibold text-gray-600">{formattedPrice.dollars}</p>
                  </div>
                  <p className="text-gray-600 text-sm">{t.perPerson}</p>
                </div>

                {!showBookingForm ? (
                  <div className="space-y-4">
                    {/* Date Selection - Mejorado */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">📅 {t.selectAvailableDate}</label>
                      <div className="grid grid-cols-1 gap-2 max-h-64 overflow-y-auto bg-gray-50 rounded-lg p-3">
                        {availableDates.map((dateOption) => (
                          <button
                            key={dateOption.date}
                            onClick={() => setSelectedDate(dateOption.date)}
                            className={`p-3 text-sm rounded-lg border transition-all duration-200 ${
                              selectedDate === dateOption.date
                                ? "bg-peru-orange text-white border-peru-orange shadow-md transform scale-105"
                                : "bg-white text-gray-700 border-gray-300 hover:border-peru-orange hover:bg-peru-orange/5"
                            }`}
                          >
                            <div className="font-semibold">{dateOption.dayName}</div>
                            <div className="text-xs opacity-90">{dateOption.display}</div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* People Selection - Sin límite */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">👥 {t.numberOfPassengers}</label>
                      <div className="flex items-center gap-4 bg-gray-50 rounded-lg p-3">
                        <button
                          onClick={() => setPeople(Math.max(1, people - 1))}
                          className="w-10 h-10 rounded-full bg-white border border-gray-300 flex items-center justify-center hover:bg-gray-50 font-bold text-lg"
                        >
                          -
                        </button>
                        <div className="flex-1 text-center">
                          <span className="font-bold text-2xl text-gray-900">{people}</span>
                          <p className="text-xs text-gray-600">{people > 1 ? t.passengers : t.passenger}</p>
                        </div>
                        <button
                          onClick={() => setPeople(people + 1)}
                          className="w-10 h-10 rounded-full bg-white border border-gray-300 flex items-center justify-center hover:bg-gray-50 font-bold text-lg"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* Total - Más claro */}
                    <div className="border-t pt-4 bg-gradient-to-r from-peru-orange/5 to-peru-orange/10 rounded-lg p-4">
                      <div className="text-center">
                        <p className="text-sm text-gray-600 mb-1">{t.totalToPay}:</p>
                        <div className="text-2xl font-bold text-gray-900">{formattedTotal.soles}</div>
                        <div className="text-lg font-semibold text-gray-600">{formattedTotal.dollars}</div>
                        <p className="text-xs text-gray-500 mt-1">
                          {formattedPrice.soles} × {people} {people > 1 ? t.passengers : t.passenger}
                        </p>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-3">
                      <button
                        onClick={() => setShowBookingForm(true)}
                        disabled={!selectedDate}
                        className="w-full bg-peru-orange text-white py-4 rounded-lg font-bold hover:bg-peru-orange/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-lg"
                      >
                        <CreditCard className="w-5 h-5" />
                        {t.reserveNow}
                      </button>
                      <a
                        href={`https://wa.me/51987654321?text=${t.contact}, ${tour.title} ${people} ${people > 1 ? t.passengers : t.passenger} ${selectedDate ? new Date(selectedDate).toLocaleDateString(t.locale) : ""}. ${t.totalToPay}: ${formattedTotal.soles} (${formattedTotal.dollars})`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                      >
                        <MessageCircle className="w-5 h-5" />
                        {t.consultWhatsApp}
                      </a>
                      <a
                        href="tel:+51987654321"
                        className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                      >
                        <Phone className="w-5 h-5" />
                        {t.callNow}
                      </a>
                    </div>
                  </div>
                ) : (
                  /* Booking Form */
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">📋 {t.passengerInfo}</h3>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">{t.fullName} *</label>
                      <input
                        type="text"
                        value={customerInfo.fullName}
                        onChange={(e) => setCustomerInfo({ ...customerInfo, fullName: e.target.value })}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-peru-orange focus:ring-2 focus:ring-peru-orange/20"
                        placeholder={t.fullName}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">{t.email} *</label>
                      <input
                        type="email"
                        value={customerInfo.email}
                        onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-peru-orange focus:ring-2 focus:ring-peru-orange/20"
                        placeholder={t.email}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">{t.phone}</label>
                      <input
                        type="tel"
                        value={customerInfo.phone}
                        onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-peru-orange focus:ring-2 focus:ring-peru-orange/20"
                        placeholder="+51 999 999 999"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">{t.nationality}</label>
                      <input
                        type="text"
                        value={customerInfo.nationality}
                        onChange={(e) => setCustomerInfo({ ...customerInfo, nationality: e.target.value })}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-peru-orange focus:ring-2 focus:ring-peru-orange/20"
                        placeholder={t.nationality}
                      />
                    </div>

                    {/* Summary */}
                    <div className="bg-gray-50 rounded-lg p-4 text-sm border">
                      <h4 className="font-semibold text-gray-900 mb-2">📋 {t.reservationSummary}:</h4>
                      <div className="space-y-1">
                        <p>
                          <strong>{t.date}:</strong>{" "}
                          {selectedDate
                            ? availableDates.find((d) => d.date === selectedDate)?.full || selectedDate
                            : t.unavailable}
                        </p>
                        <p>
                          <strong>{t.passengers}:</strong> {people}
                        </p>
                        <p>
                          <strong>{t.totalToPay}:</strong> {formattedTotal.soles} ({formattedTotal.dollars})
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => setShowBookingForm(false)}
                        className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                      >
                        ← {t.backButton}
                      </button>
                      <button
                        onClick={handleCreateOrder}
                        className="flex-1 bg-peru-orange text-white py-2 rounded-lg font-semibold hover:bg-peru-orange/90 transition-colors"
                      >
                        {t.confirmReservation}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
