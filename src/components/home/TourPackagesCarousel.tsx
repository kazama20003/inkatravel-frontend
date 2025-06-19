"use client"

import type React from "react"

import { useState, useRef } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import { useIsMobile } from "@/hooks/use-mobile"

// Enums basados en el DTO
export enum TourCategory {
  Aventura = "Aventura",
  Cultural = "Cultural",
  Relax = "Relax",
  Naturaleza = "Naturaleza",
}

export enum Difficulty {
  Fácil = "Fácil",
  Moderado = "Moderado",
  Difícil = "Difícil",
}

export enum TransportType {
  Premium = "Premium",
  Básico = "Básico",
}

interface TransportOptionDto {
  type: TransportType
  vehicle: string
  services: string[]
}

interface TourPackage {
  id: number
  title: string
  subtitle: string
  imageUrl: string
  imageId?: string
  price: number
  priceGroup?: number
  originalPrice?: number
  duration: string
  rating: number
  reviews: number
  location: string
  region: string
  category: TourCategory
  difficulty: Difficulty
  highlights: string[]
  featured?: boolean
  transportOptions?: TransportOptionDto[]
}

const tourPackages: TourPackage[] = [
  {
    id: 1,
    title: "CUSCO",
    subtitle: "Ciudad Imperial",
    imageUrl: "https://images.unsplash.com/photo-1587595431973-160d0d94add1?q=80&w=1000&auto=format&fit=crop",
    price: 899,
    priceGroup: 4999,
    originalPrice: 1199,
    duration: "4D/3N",
    rating: 4.9,
    reviews: 234,
    location: "Cusco",
    region: "Cusco",
    category: TourCategory.Cultural,
    difficulty: Difficulty.Moderado,
    highlights: ["Machu Picchu", "Valle Sagrado", "Sacsayhuamán"],
    featured: true,
    transportOptions: [
      {
        type: TransportType.Premium,
        vehicle: "Camioneta 4x4",
        services: ["Aire acondicionado", "Guía especializado"],
      },
    ],
  },
  {
    id: 2,
    title: "AREQUIPA",
    subtitle: "Ciudad Blanca",
    imageUrl: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=1000&auto=format&fit=crop",
    price: 649,
    priceGroup: 3499,
    duration: "3D/2N",
    rating: 4.7,
    reviews: 189,
    location: "Arequipa",
    region: "Arequipa",
    category: TourCategory.Cultural,
    difficulty: Difficulty.Fácil,
    highlights: ["Cañón del Colca", "Monasterio Santa Catalina", "Volcán Misti"],
    transportOptions: [
      {
        type: TransportType.Premium,
        vehicle: "Minivan turística",
        services: ["Aire acondicionado", "WiFi"],
      },
    ],
  },
  {
    id: 3,
    title: "AMAZONAS",
    subtitle: "Selva Tropical",
    imageUrl: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=1000&auto=format&fit=crop",
    price: 1299,
    priceGroup: 6999,
    originalPrice: 1599,
    duration: "5D/4N",
    rating: 4.8,
    reviews: 156,
    location: "Iquitos",
    region: "Loreto",
    category: TourCategory.Naturaleza,
    difficulty: Difficulty.Moderado,
    highlights: ["Pacaya Samiria", "Río Amazonas", "Comunidades Nativas"],
    featured: true,
    transportOptions: [
      {
        type: TransportType.Premium,
        vehicle: "Bote privado",
        services: ["Guía naturalista", "Equipo de pesca"],
      },
    ],
  },
  {
    id: 4,
    title: "PARACAS",
    subtitle: "Costa Peruana",
    imageUrl: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=1000&auto=format&fit=crop",
    price: 549,
    priceGroup: 2499,
    duration: "2D/1N",
    rating: 4.5,
    reviews: 123,
    location: "Paracas",
    region: "Ica",
    category: TourCategory.Relax,
    difficulty: Difficulty.Fácil,
    highlights: ["Islas Ballestas", "Reserva Nacional", "Huacachina"],
    transportOptions: [
      {
        type: TransportType.Básico,
        vehicle: "Bus turístico",
        services: ["Aire acondicionado"],
      },
    ],
  },
  {
    id: 5,
    title: "HUANCAYO",
    subtitle: "Valle del Mantaro",
    imageUrl: "https://images.unsplash.com/photo-1539037116277-4db20889f2d4?q=80&w=1000&auto=format&fit=crop",
    price: 399,
    priceGroup: 1999,
    duration: "3D/2N",
    rating: 4.3,
    reviews: 98,
    location: "Huancayo",
    region: "Junín",
    category: TourCategory.Cultural,
    difficulty: Difficulty.Fácil,
    highlights: ["Convento de Ocopa", "Torre Torre", "Artesanías"],
    transportOptions: [
      {
        type: TransportType.Básico,
        vehicle: "Minivan",
        services: ["Aire acondicionado"],
      },
    ],
  },
  {
    id: 6,
    title: "TRUJILLO",
    subtitle: "Ciudad de la Eterna Primavera",
    imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=1000&auto=format&fit=crop",
    price: 699,
    priceGroup: 3299,
    duration: "3D/2N",
    rating: 4.6,
    reviews: 167,
    location: "Trujillo",
    region: "La Libertad",
    category: TourCategory.Cultural,
    difficulty: Difficulty.Fácil,
    highlights: ["Huacas del Sol y de la Luna", "Chan Chan", "Huanchaco"],
    transportOptions: [
      {
        type: TransportType.Premium,
        vehicle: "Camioneta 4x4",
        services: ["Aire acondicionado", "Guía arqueólogo"],
      },
    ],
  },
]

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

export default function TourPackagesSection() {
  const isMobile = useIsMobile()
  const carouselRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)

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
    <section className="w-full h-screen bg-white flex flex-col overflow-hidden">
      {/* Header Section - Más compacto */}
      <div className="px-4 md:px-8 lg:px-16 pt-16 md:pt-20 pb-4 md:pb-6 flex-shrink-0">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-8 items-center">
            {/* Left Side - Description más corta */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <p className="text-sm md:text-base text-gray-600 body-text leading-relaxed">
                Explora destinos únicos del Perú. Desde los Andes hasta la Amazonía, cada lugar cuenta una historia
                milenaria que despertará tu espíritu aventurero.
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
                Destinos que
                <br />
                <em className="italic text-peru-orange">Inspiran</em>
              </h2>
              <div className="mt-2 lg:mt-4">
                <p className="text-xs md:text-sm text-gray-500 uppercase tracking-wider body-text">
                  ARRASTRA PARA EXPLORAR
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Carousel Section - Ocupa el resto del espacio */}
      <div className="flex-1 min-h-0">
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

          {/* Cards - Ocupan toda la altura disponible */}
          {tourPackages.map((tour, index) => (
            <motion.div
              key={tour.id}
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
              <div className="relative h-full mx-2 md:mx-3 overflow-hidden group rounded-lg">
                {/* Background Image */}
                <div className="absolute inset-0">
                  <Image
                    src={tour.imageUrl || "/placeholder.svg"}
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
                    <p className="text-sm md:text-base text-white/90 brand-text tracking-wide">{tour.subtitle}</p>
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
      `}</style>
    </section>
  )
}
