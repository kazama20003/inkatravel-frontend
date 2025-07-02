"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { api } from "@/lib/axiosInstance"
import { useLanguage } from "@/contexts/LanguageContext"

// Tipos para la API de transporte - definidos en el mismo componente
interface TransportOption {
  _id: string
  type: "Basico" | "Premium"
  vehicle: string
  services: string[]
  imageUrl: string
  imageId?: string
  createdAt: string
  updatedAt: string
  __v: number
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

interface HeroSectionProps {
  route?: "chivay-cusco" | "cusco-chivay"
}

export default function HeroSection({}: HeroSectionProps) {
  const [transportData, setTransportData] = useState<TransportTour[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Usar el contexto de idioma
  const { t } = useLanguage()

  // Cargar datos de transporte desde la API
  useEffect(() => {
    const fetchTransportData = async () => {
      try {
        setLoading(true)
        const response = await api.get<TransportApiResponse>("/tours/transport")
        setTransportData(response.data.data || [])
        setError(null)
      } catch (err) {
        console.error("Error fetching transport data:", err)
        setError("Error al cargar los datos de transporte")
        setTransportData([])
      } finally {
        setLoading(false)
      }
    }

    fetchTransportData()
  }, [])

  // Función para convertir soles a dólares (tasa aproximada)
  const convertToUSD = (soles: number) => {
    const exchangeRate = 3.8 // Tasa aproximada PEN a USD
    return Math.round(soles / exchangeRate)
  }

  // Función para obtener datos de la ruta específica usando la API
  const getRouteData = () => {
    // Buscar tours específicos en los datos de la API
    const chivayToCusco = transportData.find(
      (tour) => tour.title.includes("CHIVAY - CUSCO") || tour.slug === "transporte-chivay-cusco",
    )
    const cuscoToChivay = transportData.find(
      (tour) => tour.title.includes("CUSCO - CHIVAY") || tour.slug === "transporte-cusco-chivay",
    )

    // Función para obtener horarios basados en la ruta
    const getSchedule = (isChivayToCusco: boolean) => {
      return isChivayToCusco ? "LUNES • MIÉRCOLES • VIERNES" : "MARTES • JUEVES • SÁBADO"
    }

    // Función para formatear el título
    const formatTitle = (title: string) => {
      return title.replace("TRANSPORTE ", "").replace(" - ", " → ")
    }

    return {
      leftSection: {
        title: chivayToCusco ? formatTitle(chivayToCusco.title) : "CHIVAY → CUSCO",
        subtitle: chivayToCusco
          ? `${chivayToCusco.duration} • S/. ${Math.round(chivayToCusco.price)} / $${convertToUSD(chivayToCusco.price)}`
          : "6 Horas • S/. 260 / $68",
        schedule: getSchedule(true),
        slug: chivayToCusco?.slug || "transporte-chivay-cusco",
        image:
          chivayToCusco?.imageUrl ||
          "https://res.cloudinary.com/dwvikvjrq/image/upload/v1751150598/uploads/meuzgqf0nak3gvd7lxdk.jpg",
        bgGradient: "from-stone-900/70 via-stone-800/50 to-stone-900/70",
        textColor: "text-white",
        buttonStyle: "bg-white text-black hover:bg-gray-100",
        highlights: chivayToCusco?.highlights || ["Pueblo Cabanaconde", "Cruz del Condor", "Bosque de piedras"],
        rating: chivayToCusco?.rating || 5,
        reviews: chivayToCusco?.reviews || 5000,
        originalPrice: chivayToCusco?.originalPrice,
        subtitle_full:
          chivayToCusco?.subtitle ||
          "Un viaje panorámico que cruza los Andes entre volcanes, valles y pueblos milenarios.",
      },
      rightSection: {
        title: cuscoToChivay ? formatTitle(cuscoToChivay.title) : "CUSCO → CHIVAY",
        subtitle: cuscoToChivay
          ? `${cuscoToChivay.duration} • S/. ${Math.round(cuscoToChivay.price)} / $${convertToUSD(cuscoToChivay.price)}`
          : "6 Horas • S/. 260 / $68",
        schedule: getSchedule(false),
        slug: cuscoToChivay?.slug || "transporte-cusco-chivay",
        image:
          cuscoToChivay?.imageUrl ||
          "https://res.cloudinary.com/dwvikvjrq/image/upload/v1751172442/uploads/vvp3okc9jc3zoweer3w0.jpg",
        bgGradient: "from-slate-900/75 via-slate-800/55 to-slate-900/75",
        textColor: "text-white",
        buttonStyle: "bg-white text-black hover:bg-gray-100",
        highlights: cuscoToChivay?.highlights || ["La Raya", "Mirador de los Andes", "Valle del Colca"],
        rating: cuscoToChivay?.rating || 5,
        reviews: cuscoToChivay?.reviews || 5000,
        originalPrice: cuscoToChivay?.originalPrice,
        subtitle_full:
          cuscoToChivay?.subtitle ||
          "Una travesía por los Andes desde la capital inca hasta el corazón del Valle del Colca.",
      },
    }
  }

  if (loading) {
    return (
      <div className="relative h-screen bg-gray-100 flex items-center justify-center">
        <motion.div
          className="w-16 h-16 border-4 border-gray-800 border-t-transparent rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
        />
      </div>
    )
  }

  if (error) {
    return (
      <div className="relative h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-peru-orange text-white px-4 py-2 rounded hover:bg-peru-orange/90 transition-colors"
          >
            {t.retry}
          </button>
        </div>
      </div>
    )
  }

  const currentRoute = getRouteData()
  const sections = [currentRoute.leftSection, currentRoute.rightSection]

  return (
    <section className="relative w-full h-screen overflow-hidden">
      <div className="flex flex-col md:flex-row w-full h-full">
        {sections.map((section, index) => (
          <motion.div
            key={index}
            className="relative w-full h-1/2 md:w-1/2 md:h-full flex flex-col overflow-hidden"
            initial={{ x: index === 0 ? -100 : 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: index * 0.2 }}
          >
            {/* Background Image */}
            <div className="absolute inset-0 w-full h-full">
              <Image
                src={section.image || "/placeholder.svg?height=800&width=600&query=transport landscape"}
                alt={`${section.title} landscape`}
                fill
                className="object-cover w-full h-full"
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
                quality={95}
              />
              {/* Gradient Overlay - Mejorado para mostrar mejor el paisaje */}
              <div className={`absolute inset-0 w-full h-full bg-gradient-to-br ${section.bgGradient}`} />
              {/* Bottom gradient for text readability */}
              <div className="absolute bottom-0 left-0 right-0 h-2/3 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
            </div>

            {/* Content */}
            <div className="relative z-10 flex-1 flex flex-col justify-end p-4 md:p-12 w-full h-full">
              {/* Schedule Info */}
              <motion.div
                className="mb-3 md:mb-4"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 + index * 0.2, duration: 0.6 }}
              >
                <div className={`${section.textColor} drop-shadow-lg`}>
                  <div className="text-xs md:text-sm font-medium tracking-wider mb-1 opacity-90">
                    {t.departures} • 08:00 AM
                  </div>
                  <div className="text-xs md:text-sm font-bold tracking-wider">{section.schedule}</div>
                </div>
              </motion.div>

              {/* Rating and Reviews */}
              <motion.div
                className="mb-2 md:mb-3"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.35 + index * 0.2, duration: 0.6 }}
              >
                <div className="flex items-center gap-2">
                  <div className="flex items-center">
                    <span className="text-yellow-400 text-sm md:text-base">★</span>
                    <span className={`${section.textColor} text-sm md:text-base font-medium ml-1`}>
                      {section.rating}
                    </span>
                  </div>
                  <span className={`${section.textColor} opacity-70 text-xs md:text-sm`}>
                    ({section.reviews.toLocaleString()} {t.reviews})
                  </span>
                </div>
              </motion.div>

              {/* Title */}
              <motion.div
                className="mb-4 md:mb-6"
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 + index * 0.2, duration: 0.6 }}
              >
                <h1
                  className={`text-2xl md:text-5xl lg:text-6xl font-bold leading-tight mb-2 ${section.textColor} tracking-tight drop-shadow-lg`}
                >
                  {section.title}
                </h1>
                <div className="flex flex-col gap-1">
                  <p className={`text-sm md:text-base ${section.textColor} opacity-95 font-medium drop-shadow-md`}>
                    {section.subtitle}
                  </p>
                  {section.originalPrice &&
                    section.originalPrice > Number.parseInt(section.subtitle.split("S/. ")[1]) && (
                      <p className={`text-xs md:text-sm ${section.textColor} opacity-70 line-through`}>
                        {t.regularPrice}: S/. {Math.round(section.originalPrice)} / $
                        {convertToUSD(section.originalPrice)}
                      </p>
                    )}
                </div>
              </motion.div>

              {/* Subtitle description */}
              <motion.div
                className="mb-4 md:mb-6"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.45 + index * 0.2, duration: 0.6 }}
              >
                <p className={`text-xs md:text-sm ${section.textColor} opacity-80 leading-relaxed max-w-md`}>
                  {section.subtitle_full}
                </p>
              </motion.div>

              {/* Highlights */}
              {section.highlights && section.highlights.length > 0 && (
                <motion.div
                  className="mb-4 md:mb-6"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 + index * 0.2, duration: 0.6 }}
                >
                  <div className="flex flex-wrap gap-2">
                    {section.highlights.slice(0, 3).map((highlight, idx) => (
                      <span
                        key={idx}
                        className="bg-white/20 backdrop-blur-sm text-white px-2 py-1 text-xs rounded-full border border-white/30"
                      >
                        {highlight}
                      </span>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Buttons */}
              <motion.div
                className="flex flex-col gap-3 md:gap-4"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 + index * 0.2, duration: 0.6 }}
              >
                {/* Main CTA Button - Ahora lleva a transport/[slug] */}
                <Link href={`/transport/${section.slug}`}>
                  <motion.button
                    className={`${section.buttonStyle} px-4 md:px-6 py-3 md:py-4 flex items-center gap-3 md:gap-4 transition-all duration-300 group w-fit shadow-lg backdrop-blur-sm`}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span className="font-bold text-xs md:text-base tracking-wider">{t.reserve}</span>
                    <motion.div
                      className="flex items-center"
                      animate={{ x: [0, 5, 0] }}
                      transition={{
                        duration: 2,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: "easeInOut",
                      }}
                    >
                      <div className="w-6 md:w-8 h-px bg-current mr-2 md:mr-3"></div>
                      <ArrowRight className="w-4 md:w-5 h-4 md:h-5" />
                    </motion.div>
                  </motion.button>
                </Link>

                {/* Secondary Details Button - También lleva a transport/[slug] */}
                <Link href={`/transport/${section.slug}`}>
                  <motion.button
                    className={`${section.textColor} opacity-90 hover:opacity-100 transition-all duration-300 group w-fit drop-shadow-md`}
                    whileHover={{ x: 5 }}
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.8 + index * 0.2, duration: 0.6 }}
                  >
                    <span className="text-xs md:text-sm font-medium tracking-wider border-b border-current pb-1 group-hover:border-opacity-100 border-opacity-70">
                      {t.viewDetails}
                    </span>
                  </motion.button>
                </Link>
              </motion.div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
