"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { api } from "@/lib/axiosInstance"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import {
  Clock,
  Star,
  MapPin,
  Calendar,
  Route,
  Phone,
  ShoppingCart,
  MessageCircle,
  ArrowRight,
  Users,
  Timer,
  DollarSign,
  X,
  Images,
  Loader2,
} from "lucide-react"
import { useLanguage } from "@/contexts/LanguageContext"
import { isAxiosError } from "axios"
import Link from "next/link"

// Exchange rate constant
const USD_TO_PEN_RATE = 3.75

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

// Define the interface for the tour transport data
interface TransportData {
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
  data: TransportData[]
  total: number
}

// Interfaces for Izipay payment request
interface CustomerDto {
  email: string
  billingFirstName?: string
  billingLastName?: string
}

interface PaymentForm {
  type: string
  // Optional fields for when we have card data (usually not needed for web forms)
  pan?: string
  cardScheme?: string
  expiryMonth?: string
  expiryYear?: string
  securityCode?: string
}

interface CreateFormTokenRequest {
  amount: number // Amount in cents
  currency: string
  orderId: string
  customer: CustomerDto
  formAction: string
  contextMode?: string // Add context mode for test/production
  paymentForms: PaymentForm[] // Array of payment form objects
}

interface FormTokenResponse {
  formToken: string
  publicKey: string
}

export default function TransportDetailPage() {
  const params = useParams()
  const slug = params.slug as string
  const { t, language } = useLanguage()
  const [transport, setTransport] = useState<TransportData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [passengers, setPassengers] = useState(1)
  const [, setCurrentImageIndex] = useState(0)
  const [isGalleryOpen, setIsGalleryOpen] = useState(false)

  // Payment state
  const [formToken, setFormToken] = useState<string | null>(null)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [isProcessingPayment, setIsProcessingPayment] = useState(false)

  // Create comprehensive gallery images from transport data
  const galleryImages = transport
    ? [
        // Main transport image
        transport.imageUrl,
        // Itinerary day images
        ...(transport.itinerary?.map((day) => day.imageUrl) || []),
        // Route stop images from all days
        ...(transport.itinerary?.flatMap((day) => day.route?.map((stop) => stop.imageUrl) || []) || []),
      ].filter((url): url is string => Boolean(url)) // Type-safe filter to remove undefined/null
    : ["/placeholder.svg"]

  // Helper function to get translated day names
  const getTranslatedDay = (dayKey: string) => {
    switch (dayKey.toLowerCase()) {
      case "monday":
        return t.monday
      case "tuesday":
        return t.tuesday
      case "wednesday":
        return t.wednesday
      case "thursday":
        return t.thursday
      case "friday":
        return t.friday
      case "saturday":
        return t.saturday
      case "sunday":
        return t.sunday
      default:
        return dayKey
    }
  }

  useEffect(() => {
    const fetchTransportDetails = async () => {
      setLoading(true)
      setError(null)
      try {
        const response = await api.get<ApiResponse>("/tour-transport", {
          params: { lang: language },
        })
        const apiResponseData: ApiResponse = response.data
        const foundTransport = apiResponseData.data.find((item: TransportData) => item.slug === slug)
        if (foundTransport) {
          setTransport(foundTransport)
        } else {
          setError(t.tourNotFound)
        }
      } catch (err: unknown) {
        console.error("Error fetching transport details:", err)
        let errorMessage = t.errorLoadingToursMessage
        if (err instanceof Error) {
          errorMessage = err.message
        } else if (isAxiosError(err)) {
          if (err.response?.data && typeof err.response.data === "object" && "message" in err.response.data) {
            errorMessage = (err.response.data as { message: string }).message
          } else if (err.message) {
            errorMessage = err.message
          }
        }
        setError(errorMessage)
      } finally {
        setLoading(false)
      }
    }
    if (slug) {
      fetchTransportDetails()
    }
  }, [slug, language, t.tourNotFound, t.errorLoadingToursMessage])

  // Effect to load Izipay script when modal opens and formToken is available
  useEffect(() => {
    if (showPaymentModal && formToken) {
      const scriptId = "izipay-script"
      if (document.getElementById(scriptId)) {
        // If script already exists, re-initialize if necessary or just ensure form is rendered
        // For Izipay, simply having the div with kr-form-token should be enough if script is loaded
        return
      }

      const script = document.createElement("script")
      script.id = scriptId
      script.src = "https://static.micuentaweb.pe/static/js/krypton-client/V4.0/stable/kr-payment-form.min.js"
      script.setAttribute("kr-public-key", process.env.NEXT_PUBLIC_IZIPAY_PUBLIC_KEY || "")
      script.setAttribute("kr-post-url-success", process.env.NEXT_PUBLIC_IZIPAY_SUCCESS_URL || "")
      script.setAttribute("kr-post-url-refused", process.env.NEXT_PUBLIC_IZIPAY_REFUSED_URL || "")
      document.body.appendChild(script)

      // Clean up script on unmount or when modal closes
      return () => {
        const existingScript = document.getElementById(scriptId)
        if (existingScript) {
          document.body.removeChild(existingScript)
        }
      }
    }
  }, [showPaymentModal, formToken])

  const handleWhatsAppContact = () => {
    const message = `${t.consultWhatsApp}: ${transport?.title} - ${transport?.originCity} → ${transport?.destinationCity}`
    const whatsappUrl = `https://wa.me/51987654321?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, "_blank")
  }

  const handlePhoneCall = () => {
    window.open("tel:+51987654321", "_self")
  }

  const handleReserveNow = async () => {
    if (!transport) return

    setIsProcessingPayment(true)
    setError(null)

    try {
      const totalAmountPEN = (transport.price * passengers * USD_TO_PEN_RATE).toFixed(0)
      const payload: CreateFormTokenRequest = {
        amount: Number.parseInt(totalAmountPEN) * 100, // Amount in cents
        currency: "PEN",
        orderId: `ORDER-${Date.now()}-${Math.floor(Math.random() * 1000)}`, // Unique order ID
        customer: {
          email: "cliente@correo.com", // Replace with actual user email
          billingFirstName: "Juan", // Optional - replace with actual user data
          billingLastName: "Pérez", // Optional - replace with actual user data
        },
        formAction: "PAYMENT",
        contextMode: "TEST", // Add this for test environment
        paymentForms: [
          {
            type: "card", // Specify that we want to enable card payments
          },
        ],
      }

      const response = await api.post<FormTokenResponse>("/payments/formtoken", payload)
      setFormToken(response.data.formToken)
      setShowPaymentModal(true)
    } catch (err: unknown) {
      console.error("Error generating payment form token:", err)
      let errorMessage = t.errorProcessingPayment || "Error processing payment. Please try again."
      if (isAxiosError(err)) {
        if (err.response?.data && typeof err.response.data === "object" && "message" in err.response.data) {
          errorMessage = (err.response.data as { message: string }).message
        } else if (err.message) {
          errorMessage = err.message
        }
      }
      setError(errorMessage)
    } finally {
      setIsProcessingPayment(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 pt-20 md:pt-32">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 md:h-16 md:w-16 border-4 border-t-transparent border-blue-500"></div>
          <p className="text-xl md:text-2xl text-white font-light">{t.loading}...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-red-900 via-red-800 to-red-900 pt-20 md:pt-32 px-4">
        <p className="text-xl md:text-2xl text-white mb-6 text-center">{error}</p>
        <Link
          href="/"
          className="px-6 md:px-8 py-3 md:py-4 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-white hover:bg-white/30 transition-all duration-300 font-medium"
        >
          {t.backToHome}
        </Link>
      </div>
    )
  }

  if (!transport) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-gray-800 to-slate-900 pt-20 md:pt-32">
        <p className="text-xl md:text-2xl text-white font-light">{t.noToursAvailable}</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Hero Section - Full Height on Mobile */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative h-screen md:h-[80vh] overflow-hidden"
      >
        <Image
          src={transport.imageUrl || "/placeholder.svg"}
          alt={transport.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/20" />
        {/* Gallery Button */}
        <button
          onClick={() => setIsGalleryOpen(true)}
          className="absolute top-20 md:top-32 right-4 md:right-6 bg-black/40 backdrop-blur-sm text-white p-2 md:p-3 rounded-full hover:bg-black/60 transition-all duration-300 z-10"
        >
          <Images size={20} className="md:w-6 md:h-6" />
        </button>
        {/* Hero Content */}
        <div className="absolute inset-0 flex items-end">
          <div className="w-full px-4 md:px-6 pb-8 md:pb-16 max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-white"
            >
              <div className="flex flex-wrap items-center gap-2 md:gap-4 mb-4">
                {transport.rating && (
                  <div className="flex items-center space-x-1 bg-yellow-500/20 px-2 md:px-3 py-1 rounded-full backdrop-blur-sm">
                    <Star size={14} fill="currentColor" className="md:w-4 md:h-4 text-yellow-400" />
                    <span className="text-xs md:text-sm font-semibold">{transport.rating}</span>
                  </div>
                )}
                {transport.durationInHours && (
                  <div className="flex items-center space-x-1 bg-blue-500/20 px-2 md:px-3 py-1 rounded-full backdrop-blur-sm">
                    <Timer size={14} className="md:w-4 md:h-4 text-blue-400" />
                    <span className="text-xs md:text-sm font-semibold">
                      {transport.durationInHours} {t.hours}
                    </span>
                  </div>
                )}
                <div className="bg-green-500/20 px-2 md:px-3 py-1 rounded-full backdrop-blur-sm">
                  <span className="text-xs md:text-sm font-semibold text-green-400">{t.transport}</span>
                </div>
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-6xl font-bold mb-3 md:mb-4 leading-tight">
                {transport.title}
              </h1>
              <p className="text-base md:text-xl lg:text-2xl font-light opacity-90 max-w-3xl mb-4 md:mb-6">
                {transport.description}
              </p>
              {/* Route Preview - Responsive */}
              <div className="flex items-center space-x-2 md:space-x-4 bg-black/30 backdrop-blur-sm rounded-xl md:rounded-2xl p-3 md:p-4 max-w-fit">
                <div className="text-center">
                  <div className="text-xs md:text-sm opacity-75">{t.originCity}</div>
                  <div className="font-bold text-sm md:text-lg">{transport.originCity}</div>
                </div>
                <ArrowRight className="text-blue-400 md:w-6 md:h-6" size={20} />
                <div className="text-center">
                  <div className="text-xs md:text-sm opacity-75">{t.destinationCity}</div>
                  <div className="font-bold text-sm md:text-lg">{transport.destinationCity}</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-12">
          {/* Left Column - Route Map & Details */}
          <div className="lg:col-span-2 space-y-6 md:space-y-8">
            {/* Route Map Visualization */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="bg-white dark:bg-slate-800 rounded-2xl md:rounded-3xl p-4 md:p-8 shadow-xl border border-slate-200 dark:border-slate-700"
            >
              <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-slate-800 dark:text-slate-100 flex items-center">
                <Route className="mr-2 md:mr-3 text-blue-500 md:w-7 md:h-7" size={24} />
                {t.panoramicRoute}
              </h2>
              {/* Route Visualization - Mobile Optimized */}
              <div className="relative">
                {/* Route Line */}
                <div className="absolute left-6 md:left-8 top-12 md:top-16 bottom-12 md:bottom-16 w-0.5 md:w-1 bg-gradient-to-b from-blue-500 via-purple-500 to-green-500 rounded-full"></div>
                {/* Origin */}
                <div className="flex items-center mb-6 md:mb-8">
                  <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg z-10">
                    <MapPin size={18} className="md:w-6 md:h-6" />
                  </div>
                  <div className="ml-4 md:ml-6 bg-blue-50 dark:bg-blue-900/20 rounded-xl md:rounded-2xl p-3 md:p-4 flex-1">
                    <div className="text-xs md:text-sm text-blue-600 dark:text-blue-400 font-medium">
                      {t.originCity}
                    </div>
                    <div className="text-lg md:text-xl font-bold text-slate-800 dark:text-slate-100">
                      {transport.originCity}
                    </div>
                    {transport.departureTime && (
                      <div className="text-xs md:text-sm text-slate-600 dark:text-slate-400 mt-1">
                        {t.departureTime}: <span className="font-semibold">{transport.departureTime}</span>
                      </div>
                    )}
                  </div>
                </div>
                {/* Intermediate Stops */}
                {transport.intermediateStops && transport.intermediateStops.length > 0 && (
                  <div className="mb-6 md:mb-8">
                    <div className="flex items-center mb-3 md:mb-4">
                      <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg z-10">
                        <Route size={16} className="md:w-5 md:h-5" />
                      </div>
                      <div className="ml-4 md:ml-6">
                        <div className="text-base md:text-lg font-bold text-slate-800 dark:text-slate-100">
                          {t.stopsOnRoute}
                        </div>
                        <div className="text-xs md:text-sm text-slate-600 dark:text-slate-400">
                          {transport.intermediateStops.length}{" "}
                          {transport.intermediateStops.length === 1 ? t.stopOf : t.stopsOnRoute}
                        </div>
                      </div>
                    </div>
                    <div className="ml-16 md:ml-22 space-y-2">
                      {transport.intermediateStops.map((stop, index) => (
                        <div
                          key={index}
                          className="bg-purple-50 dark:bg-purple-900/20 rounded-lg md:rounded-xl p-2 md:p-3"
                        >
                          <div className="font-medium text-sm md:text-base text-slate-800 dark:text-slate-100">
                            {stop}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {/* Destination */}
                <div className="flex items-center">
                  <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg z-10">
                    <MapPin size={18} className="md:w-6 md:h-6" />
                  </div>
                  <div className="ml-4 md:ml-6 bg-green-50 dark:bg-green-900/20 rounded-xl md:rounded-2xl p-3 md:p-4 flex-1">
                    <div className="text-xs md:text-sm text-green-600 dark:text-green-400 font-medium">
                      {t.destinationCity}
                    </div>
                    <div className="text-lg md:text-xl font-bold text-slate-800 dark:text-slate-100">
                      {transport.destinationCity}
                    </div>
                    {transport.arrivalTime && (
                      <div className="text-xs md:text-sm text-slate-600 dark:text-slate-400 mt-1">
                        {t.arrivalTime}: <span className="font-semibold">{transport.arrivalTime}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
            {/* Schedule & Availability - Mobile Optimized */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="bg-white dark:bg-slate-800 rounded-2xl md:rounded-3xl p-4 md:p-8 shadow-xl border border-slate-200 dark:border-slate-700"
            >
              <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-slate-800 dark:text-slate-100 flex items-center">
                <Calendar className="mr-2 md:mr-3 text-green-500 md:w-7 md:h-7" size={24} />
                {t.schedulesAndAvailability}
              </h2>
              <div className="grid grid-cols-1 gap-4 md:gap-6">
                {/* Schedule */}
                <div className="bg-slate-50 dark:bg-slate-700 rounded-xl md:rounded-2xl p-4 md:p-6">
                  <h3 className="font-bold text-base md:text-lg mb-3 md:mb-4 text-slate-800 dark:text-slate-100 flex items-center">
                    <Clock className="mr-2 text-blue-500 md:w-5 md:h-5" size={18} />
                    {t.schedule}
                  </h3>
                  <div className="space-y-2 md:space-y-3">
                    {transport.departureTime && (
                      <div className="flex justify-between">
                        <span className="text-sm md:text-base text-slate-600 dark:text-slate-400">
                          {t.departureTime}:
                        </span>
                        <span className="font-semibold text-sm md:text-base text-slate-800 dark:text-slate-100">
                          {transport.departureTime}
                        </span>
                      </div>
                    )}
                    {transport.arrivalTime && (
                      <div className="flex justify-between">
                        <span className="text-sm md:text-base text-slate-600 dark:text-slate-400">
                          {t.arrivalTime}:
                        </span>
                        <span className="font-semibold text-sm md:text-base text-slate-800 dark:text-slate-100">
                          {transport.arrivalTime}
                        </span>
                      </div>
                    )}
                    {transport.durationInHours && (
                      <div className="flex justify-between">
                        <span className="text-sm md:text-base text-slate-600 dark:text-slate-400">{t.duration}:</span>
                        <span className="font-semibold text-sm md:text-base text-slate-800 dark:text-slate-100">
                          {transport.durationInHours} {t.hours}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="mt-3 md:mt-4 p-2 md:p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg md:rounded-xl">
                    <p className="text-xs md:text-sm text-blue-700 dark:text-blue-300">💡 {t.arriveEarly}</p>
                  </div>
                </div>
                {/* Available Days */}
                <div className="bg-slate-50 dark:bg-slate-700 rounded-xl md:rounded-2xl p-4 md:p-6">
                  <h3 className="font-bold text-base md:text-lg mb-3 md:mb-4 text-slate-800 dark:text-slate-100 flex items-center">
                    <Calendar className="mr-2 text-purple-500 md:w-5 md:h-5" size={18} />
                    {t.availableDays}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {transport.availableDays &&
                    transport.availableDays.length > 0 &&
                    !transport.availableDays.includes("all") ? (
                      transport.availableDays.map((day, index) => (
                        <span
                          key={index}
                          className="bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-2 md:px-3 py-1 rounded-full text-xs md:text-sm font-medium"
                        >
                          {getTranslatedDay(day)}
                        </span>
                      ))
                    ) : (
                      <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-2 md:px-3 py-1 rounded-full text-xs md:text-sm font-medium">
                        {t.allDays}
                      </span>
                    )}
                  </div>
                  <div className="mt-3 md:mt-4 p-2 md:p-3 bg-green-100 dark:bg-green-900/30 rounded-lg md:rounded-xl">
                    <p className="text-xs md:text-sm text-green-700 dark:text-green-300">✅ {t.regularDepartures}</p>
                  </div>
                </div>
              </div>
            </motion.div>
            {/* Terms and Conditions */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="bg-white dark:bg-slate-800 rounded-2xl md:rounded-3xl p-4 md:p-8 shadow-xl border border-slate-200 dark:border-slate-700"
            >
              <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-slate-800 dark:text-slate-100">
                {t.termsOfService}
              </h2>
              <p className="text-sm md:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
                {transport.termsAndConditions}
              </p>
            </motion.div>
            {/* Itinerary Section - Enhanced */}
            {transport.itinerary && transport.itinerary.length > 0 && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="bg-white dark:bg-slate-800 rounded-2xl md:rounded-3xl p-4 md:p-8 shadow-xl border border-slate-200 dark:border-slate-700"
              >
                <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-slate-800 dark:text-slate-100 flex items-center">
                  <Calendar className="mr-2 md:mr-3 text-purple-500 md:w-7 md:h-7" size={24} />
                  {t.itineraries}
                </h2>
                <div className="space-y-6 md:space-y-8">
                  {transport.itinerary?.map((day, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="relative"
                    >
                      {/* Day Header */}
                      <div className="flex items-start space-x-4 mb-4">
                        <div className="flex-shrink-0">
                          <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                            <span className="text-sm md:text-lg">{day.day}</span>
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg md:text-xl font-bold text-slate-800 dark:text-slate-100 mb-2 leading-tight">
                            {day.title}
                          </h3>
                          <p className="text-sm md:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
                            {day.description}
                          </p>
                        </div>
                      </div>
                      {/* Day Image */}
                      {day.imageUrl && (
                        <motion.div
                          className="mb-4 relative h-48 md:h-64 lg:h-72 rounded-xl md:rounded-2xl overflow-hidden shadow-lg group cursor-pointer"
                          whileHover={{ scale: 1.02 }}
                          transition={{ duration: 0.3 }}
                          onClick={() => {
                            const dayImageIndex = galleryImages.findIndex((img) => img === day.imageUrl)
                            if (dayImageIndex !== -1) {
                              setCurrentImageIndex(dayImageIndex)
                              setIsGalleryOpen(true)
                            }
                          }}
                        >
                          <Image
                            src={day.imageUrl || "/placeholder.svg"}
                            alt={day.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          <div className="absolute bottom-4 left-4 right-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <p className="text-sm font-medium bg-black/50 backdrop-blur-sm rounded-lg px-3 py-2">
                              {t.view} {day.title}
                            </p>
                          </div>
                        </motion.div>
                      )}
                      {/* Route Stops */}
                      {day.route && day.route.length > 0 && (
                        <div className="mt-4">
                          <h4 className="font-semibold text-slate-800 dark:text-slate-100 mb-4 flex items-center">
                            <Route className="mr-2 text-blue-500" size={18} />
                            {t.stopsOnRoute}
                          </h4>
                          <div className="space-y-4">
                            {day.route?.map((stop, stopIndex) => (
                              <motion.div
                                key={stopIndex}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.4, delay: stopIndex * 0.1 }}
                                className="bg-gradient-to-r from-slate-50 to-blue-50 dark:from-slate-700 dark:to-blue-900/20 rounded-xl p-4 border border-slate-200 dark:border-slate-600"
                              >
                                <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                                  {/* Stop Info */}
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between mb-2">
                                      <h5 className="font-medium text-slate-800 dark:text-slate-100 text-base md:text-lg">
                                        📍 {stop.location}
                                      </h5>
                                      {stop.stopTime && (
                                        <div className="flex items-center space-x-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full text-sm font-medium">
                                          <Clock size={14} />
                                          <span>{stop.stopTime}</span>
                                        </div>
                                      )}
                                    </div>
                                    <p className="text-sm md:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
                                      {stop.description}
                                    </p>
                                  </div>
                                  {/* Stop Image */}
                                  {stop.imageUrl && (
                                    <motion.div
                                      className="w-full lg:w-32 xl:w-40 h-24 lg:h-20 xl:h-24 relative rounded-lg overflow-hidden shadow-md group cursor-pointer flex-shrink-0"
                                      whileHover={{ scale: 1.05 }}
                                      transition={{ duration: 0.3 }}
                                      onClick={() => {
                                        const stopImageIndex = galleryImages.findIndex((img) => img === stop.imageUrl)
                                        if (stopImageIndex !== -1) {
                                          setCurrentImageIndex(stopImageIndex)
                                          setIsGalleryOpen(true)
                                        }
                                      }}
                                    >
                                      <Image
                                        src={stop.imageUrl || "/placeholder.svg"}
                                        alt={stop.location}
                                        fill
                                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                                      />
                                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                        <Images className="text-white" size={20} />
                                      </div>
                                    </motion.div>
                                  )}
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      )}
                      {/* Connector Line (except for last item) */}
                      {index < (transport.itinerary?.length || 0) - 1 && (
                        <div className="flex justify-center mt-6 mb-2">
                          <div className="w-0.5 h-8 bg-gradient-to-b from-purple-400 to-transparent rounded-full"></div>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
                {/* Itinerary Summary */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.8 }}
                  className="mt-8 p-4 md:p-6 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl border border-purple-200 dark:border-purple-700"
                >
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center space-x-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                          {transport.itinerary?.length || 0}
                        </div>
                        <div className="text-xs text-slate-600 dark:text-slate-400">
                          {(transport.itinerary?.length || 0) === 1 ? "Día" : "Días"}
                        </div>
                      </div>
                      <div className="w-px h-8 bg-purple-300 dark:bg-purple-600"></div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                          {transport.itinerary?.reduce((total, day) => total + (day.route?.length || 0), 0) || 0}
                        </div>
                        <div className="text-xs text-slate-600 dark:text-slate-400">Paradas</div>
                      </div>
                      {transport.durationInHours && (
                        <>
                          <div className="w-px h-8 bg-purple-300 dark:bg-purple-600"></div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                              {transport.durationInHours}h
                            </div>
                            <div className="text-xs text-slate-600 dark:text-slate-400">Duración</div>
                          </div>
                        </>
                      )}
                    </div>
                    <button
                      onClick={() => setIsGalleryOpen(true)}
                      className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors duration-300"
                    >
                      <Images size={18} />
                      <span className="text-sm font-medium">Ver Galería</span>
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </div>
          {/* Right Column - Booking Panel - Mobile Optimized */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="sticky top-24 md:top-40 bg-white dark:bg-slate-800 rounded-2xl md:rounded-3xl p-4 md:p-8 shadow-2xl border border-slate-200 dark:border-slate-700"
            >
              {/* Price Section */}
              <div className="text-center mb-6 md:mb-8">
                <h3 className="text-xl md:text-2xl font-bold mb-3 md:mb-4 text-slate-800 dark:text-slate-100">
                  {t.priceUSD}
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-center space-x-2">
                    <DollarSign className="text-green-500 md:w-8 md:h-8" size={24} />
                    <span className="text-3xl md:text-4xl font-bold text-green-600">{transport.price}</span>
                    <span className="text-base md:text-lg text-slate-500">USD</span>
                  </div>
                  <div className="text-xl md:text-2xl font-semibold text-slate-600 dark:text-slate-400">
                    S/ {(transport.price * USD_TO_PEN_RATE).toFixed(0)} PEN
                  </div>
                  <div className="text-xs md:text-sm text-slate-500">{t.perPerson}</div>
                </div>
              </div>
              {/* Passenger Selection */}
              <div className="mb-4 md:mb-6">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  {t.numberOfPassengers}
                </label>
                <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-700 rounded-xl p-3">
                  <button
                    onClick={() => setPassengers(Math.max(1, passengers - 1))}
                    className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-slate-200 dark:bg-slate-600 flex items-center justify-center hover:bg-slate-300 dark:hover:bg-slate-500 transition-colors"
                  >
                    -
                  </button>
                  <div className="flex items-center space-x-2">
                    <Users size={18} className="md:w-5 md:h-5 text-slate-500" />
                    <span className="text-lg md:text-xl font-semibold text-slate-800 dark:text-slate-100">
                      {passengers}
                    </span>
                    <span className="text-xs md:text-sm text-slate-500">
                      {passengers === 1 ? t.passenger : t.passengers}
                    </span>
                  </div>
                  <button
                    onClick={() => setPassengers(passengers + 1)}
                    className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-slate-200 dark:bg-slate-600 flex items-center justify-center hover:bg-slate-300 dark:hover:bg-slate-500 transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>
              {/* Total Price */}
              <div className="mb-6 md:mb-8 p-3 md:p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl md:rounded-2xl border border-blue-200 dark:border-blue-700">
                <div className="text-center">
                  <div className="text-xs md:text-sm text-slate-600 dark:text-slate-400 mb-1">{t.totalToPay}</div>
                  <div className="text-2xl md:text-3xl font-bold text-blue-600 dark:text-blue-400">
                    ${(transport.price * passengers).toFixed(2)} USD
                  </div>
                  <div className="text-base md:text-lg text-slate-600 dark:text-slate-400">
                    S/ {(transport.price * passengers * USD_TO_PEN_RATE).toFixed(0)} PEN
                  </div>
                </div>
              </div>
              {/* Action Buttons - Mobile Optimized */}
              <div className="space-y-3 md:space-y-4">
                {/* Reserve Button */}
                <button
                  onClick={handleReserveNow}
                  disabled={isProcessingPayment}
                  className="w-full py-3 md:py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold rounded-xl md:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessingPayment ? (
                    <>
                      <Loader2 className="animate-spin mr-2" size={18} />
                      <span>{t.processingPayment || "Processing..."}</span>
                    </>
                  ) : (
                    <>
                      <ShoppingCart size={18} className="md:w-5 md:h-5" />
                      <span className="text-sm md:text-base">{t.reserveNow}</span>
                    </>
                  )}
                </button>
                {/* WhatsApp Button */}
                <button
                  onClick={handleWhatsAppContact}
                  className="w-full py-3 md:py-4 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold rounded-xl md:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2"
                >
                  <MessageCircle size={18} className="md:w-5 md:h-5" />
                  <span className="text-sm md:text-base">{t.consultWhatsApp}</span>
                </button>
                {/* Call Button */}
                <button
                  onClick={handlePhoneCall}
                  className="w-full py-3 md:py-4 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold rounded-xl md:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2"
                >
                  <Phone size={18} className="md:w-5 md:h-5" />
                  <span className="text-sm md:text-base">{t.callNow}</span>
                </button>
              </div>
              {/* Additional Info */}
              <div className="mt-4 md:mt-6 p-3 md:p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl md:rounded-2xl border border-yellow-200 dark:border-yellow-700">
                <p className="text-xs md:text-sm text-yellow-700 dark:text-yellow-300 text-center">
                  ⚡ {t.availableNow} - {t.confirmReservation}
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
      {/* Image Gallery Modal */}
      <AnimatePresence>
        {isGalleryOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
            onClick={() => setIsGalleryOpen(false)}
          >
            <div className="relative w-full max-w-6xl h-full max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
              {/* Close Button */}
              <button
                onClick={() => setIsGalleryOpen(false)}
                className="absolute top-4 right-4 z-10 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
              >
                <X size={24} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
