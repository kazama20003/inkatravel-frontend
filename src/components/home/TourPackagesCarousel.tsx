"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useIsMobile } from "@/hooks/use-mobile"
import { api } from "@/lib/axiosInstance"
import type { Tour } from "@/types/tour"

// Componente para el texto circular giratorio
const SpinningText = ({ text = "RESERVAR • RESERVAR • " }: { text?: string }) => {
  return (
    <div className="relative w-20 h-20 md:w-24 md:h-24 lg:w-28 lg:h-28">
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
          <text className="text-[8px] md:text-[10px] lg:text-[12px] fill-white font-medium tracking-wider brand-text">
            <textPath href="#circle" startOffset="0%">
              {text}
            </textPath>
          </text>
        </svg>
      </motion.div>

      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-7 h-7 md:w-8 md:h-8 lg:w-10 lg:h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
          <svg
            className="w-3 h-3 md:w-4 md:h-4 lg:w-5 lg:h-5 text-white"
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

// Componente de Loading
const LoadingSkeleton = () => {
  const isMobile = useIsMobile()

  return (
    <div className="flex h-full overflow-hidden">
      <div className="flex-shrink-0 w-4 md:w-8"></div>
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className={`flex-shrink-0 h-full ${isMobile ? "w-[75vw]" : "w-[30vw] max-w-[420px]"}`}>
          <div className="relative h-full mx-2 md:mx-3 overflow-hidden rounded-lg bg-gray-200 animate-pulse">
            <div className="absolute inset-0 bg-gradient-to-t from-gray-300 via-gray-200 to-gray-300" />
            <div className="absolute top-4 left-4 w-20 h-6 bg-gray-300 rounded"></div>
            <div className="absolute top-16 left-4 right-4">
              <div className="w-3/4 h-8 bg-gray-300 rounded mb-2"></div>
              <div className="w-1/2 h-4 bg-gray-300 rounded"></div>
            </div>
            <div className="absolute bottom-20 left-4 right-4">
              <div className="bg-gray-300 rounded-lg p-3">
                <div className="flex justify-between">
                  <div className="w-20 h-4 bg-gray-400 rounded"></div>
                  <div className="w-16 h-4 bg-gray-400 rounded"></div>
                </div>
              </div>
            </div>
            <div className="absolute bottom-4 left-4 right-4">
              <div className="flex justify-between items-end">
                <div>
                  <div className="w-24 h-4 bg-gray-300 rounded mb-1"></div>
                  <div className="w-16 h-4 bg-gray-300 rounded"></div>
                </div>
                <div>
                  <div className="w-20 h-6 bg-gray-300 rounded mb-1"></div>
                  <div className="w-16 h-3 bg-gray-300 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
      <div className="flex-shrink-0 w-4 md:w-8"></div>
    </div>
  )
}

export default function TourPackagesSection() {
  const isMobile = useIsMobile()
  const router = useRouter()
  const carouselRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)

  // Estados para la API
  const [tours, setTours] = useState<Tour[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Cargar tours desde la API
  useEffect(() => {
    const fetchTours = async () => {
      try {
        setLoading(true)
        const response = await api.get("/tours/top")
        setTours(response.data.data || [])
        setError(null)
      } catch (err) {
        console.error("Error fetching tours:", err)
        setError("Error al cargar los tours. Por favor, intenta de nuevo.")
      } finally {
        setLoading(false)
      }
    }

    fetchTours()
  }, [])

  // Función para navegar al detalle del tour
  const handleTourClick = (slug: string) => {
    if (!isDragging) {
      router.push(`/tours/${slug}`)
    }
  }

  // Prevenir scroll vertical cuando se está arrastrando horizontalmente
  const handleWheel = (e: React.WheelEvent) => {
    if (!carouselRef.current) return

    // Si el scroll es más horizontal que vertical, prevenir el scroll de la página
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
      e.preventDefault()
      carouselRef.current.scrollLeft += e.deltaX
    }
  }

  // Funciones para el drag
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!carouselRef.current) return
    setIsDragging(true)
    setStartX(e.pageX - carouselRef.current.offsetLeft)
    setScrollLeft(carouselRef.current.scrollLeft)
    carouselRef.current.style.cursor = "grabbing"

    // Prevenir selección de texto durante el drag
    e.preventDefault()
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !carouselRef.current) return
    e.preventDefault()
    const x = e.pageX - carouselRef.current.offsetLeft
    const walk = (x - startX) * 2
    carouselRef.current.scrollLeft = scrollLeft - walk
  }

  const handleMouseUp = () => {
    setIsDragging(false)
    if (carouselRef.current) {
      carouselRef.current.style.cursor = "grab"
    }
  }

  const handleMouseLeave = () => {
    setIsDragging(false)
    if (carouselRef.current) {
      carouselRef.current.style.cursor = "grab"
    }
  }

  // Funciones para touch (móvil)
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!carouselRef.current) return
    setIsDragging(true)
    setStartX(e.touches[0].pageX - carouselRef.current.offsetLeft)
    setScrollLeft(carouselRef.current.scrollLeft)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !carouselRef.current) return
    const x = e.touches[0].pageX - carouselRef.current.offsetLeft
    const walk = (x - startX) * 2
    carouselRef.current.scrollLeft = scrollLeft - walk
  }

  const handleTouchEnd = () => {
    setIsDragging(false)
  }

  return (
    <section id="tour-packages-section" className="w-full h-screen bg-white flex flex-col overflow-hidden">
      {/* Header Section */}
      <div className="px-4 md:px-8 lg:px-16 pt-16 md:pt-20 pb-4 md:pb-6 flex-shrink-0">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-8 items-center">
            {/* Left Side - Description */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <p className="text-sm md:text-base text-gray-600 body-text leading-relaxed">
                Descubre los destinos más elegidos por nuestros viajeros. Tours únicos que combinan aventura, cultura y
                naturaleza en experiencias inolvidables por todo el Perú.
              </p>
            </motion.div>

            {/* Right Side - Title */}
            <motion.div
              className="text-center lg:text-right"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-5xl lg:text-6xl xl:text-7xl text-black leading-none brand-text">
                Destinos más
                <br />
                <em className="italic text-peru-orange">Populares</em>
              </h2>
              <div className="mt-2 lg:mt-4 flex flex-col lg:items-end">
                <p className="text-xs md:text-sm text-gray-500 uppercase tracking-wider body-text mb-2">
                  EXPLORA LOS FAVORITOS
                </p>
                <Link
                  href="/tours"
                  className="inline-flex items-center text-peru-orange hover:text-peru-orange/80 transition-colors text-sm font-medium"
                >
                  Ver todos los tours
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Carousel Section */}
      <div className="flex-1 min-h-0">
        {loading ? (
          <LoadingSkeleton />
        ) : error ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <p className="text-red-500 mb-4">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="bg-peru-orange text-white px-4 py-2 rounded hover:bg-peru-orange/90 transition-colors"
              >
                Reintentar
              </button>
            </div>
          </div>
        ) : tours.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">No hay tours disponibles en este momento.</p>
          </div>
        ) : (
          <div
            ref={carouselRef}
            className="flex h-full overflow-x-auto overflow-y-hidden scrollbar-hide select-none"
            style={{
              cursor: isDragging ? "grabbing" : "grab",
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
            onWheel={handleWheel}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {/* Padding inicial */}
            <div className="flex-shrink-0 w-4 md:w-8"></div>

            {/* Cards */}
            {tours.map((tour, index) => (
              <motion.div
                key={tour._id}
                className={`flex-shrink-0 h-full ${isMobile ? "w-[75vw]" : "w-[30vw] max-w-[420px]"}`}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.8,
                  delay: index * 0.1,
                  ease: [0.16, 1, 0.3, 1],
                }}
                viewport={{ once: true }}
              >
                <div
                  className="relative h-full mx-2 md:mx-3 overflow-hidden group rounded-lg cursor-pointer"
                  onClick={() => handleTourClick(tour.slug)}
                >
                  {/* Background Image */}
                  <div className="absolute inset-0">
                    <Image
                      src={tour.imageUrl || "/placeholder.svg?height=600&width=400&query=tour"}
                      alt={tour.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      draggable={false}
                    />
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/30" />
                  </div>

                  {/* Featured Badge */}
                  {tour.featured && (
                    <div className="absolute top-4 left-4 z-20">
                      <span className="bg-peru-gold text-white px-2 py-1 text-xs brand-text tracking-wider rounded">
                        DESTACADO
                      </span>
                    </div>
                  )}

                  {/* Spinning Text - Solo aparece en hover */}
                  <div className="absolute top-4 right-4 z-20 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-x-2 group-hover:translate-x-0">
                    <SpinningText />
                  </div>

                  {/* Top Section - Título */}
                  <div className="absolute top-16 left-4 right-4 z-10">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                      viewport={{ once: true }}
                    >
                      <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white brand-text tracking-wider mb-1">
                        {tour.title}
                      </h3>
                      <p className="text-sm md:text-base text-white/90 brand-text tracking-wide line-clamp-2">
                        {tour.subtitle}
                      </p>
                    </motion.div>
                  </div>

                  {/* Middle Section - Info esencial */}
                  <div className="absolute bottom-20 left-4 right-4 z-10">
                    <div className="bg-black/40 backdrop-blur-sm rounded-lg p-2 md:p-3 text-white">
                      <div className="flex justify-between items-center text-xs md:text-sm">
                        <div className="flex items-center space-x-3">
                          <span className="brand-text font-medium">{tour.duration}</span>
                          <span className="text-white/70">•</span>
                          <span className="brand-text font-medium">{tour.difficulty}</span>
                        </div>
                        <div className="flex items-center">
                          <span className="text-yellow-400 mr-1">★</span>
                          <span className="brand-text font-medium">{tour.rating}</span>
                          <span className="text-white/70 text-xs ml-1">({tour.reviews})</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Section - Ubicación y precio */}
                  <div className="absolute bottom-4 left-4 right-4 z-10">
                    <div className="flex justify-between items-end">
                      <div className="text-white">
                        <p className="text-sm md:text-base body-text font-medium">{tour.location}</p>
                        <span className="bg-white/20 text-white px-2 py-0.5 text-xs brand-text rounded">
                          {tour.category}
                        </span>
                      </div>

                      <div className="text-right">
                        <div className="text-white">
                          {tour.originalPrice && tour.originalPrice > tour.price && (
                            <span className="text-xs text-white/60 line-through block">${tour.originalPrice}</span>
                          )}
                          <span className="text-lg md:text-xl font-bold brand-text">${tour.price}</span>
                          <p className="text-xs text-white/70 body-text">por persona</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Hover Effect */}
                  <div className="absolute inset-0 bg-peru-orange/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-lg"></div>
                </div>
              </motion.div>
            ))}

            {/* Padding final */}
            <div className="flex-shrink-0 w-4 md:w-8"></div>
          </div>
        )}
      </div>

      {/* Estilos para ocultar scrollbar completamente */}
      <style jsx global>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </section>
  )
}
