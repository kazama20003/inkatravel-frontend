"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Image from "next/image"

export default function DiscoverSection() {
  const [showMore, setShowMore] = useState(false)

  const destinations = [
    {
      id: 1,
      title: "CUSCO",
      subtitle: "Ciudad Imperial, Perú",
      image: "https://images.unsplash.com/photo-1526392060635-9d6019884377?q=80&w=1000&auto=format&fit=crop",
    },
    {
      id: 2,
      title: "AREQUIPA",
      subtitle: "Ciudad Blanca, Perú",
      image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=1000&auto=format&fit=crop",
    },
    {
      id: 3,
      title: "HUACACHINA",
      subtitle: "Oasis del Desierto, Perú",
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=1000&auto=format&fit=crop",
    },
    {
      id: 4,
      title: "PARACAS",
      subtitle: "Reserva Nacional, Perú",
      image: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=1000&auto=format&fit=crop",
    },
    {
      id: 5,
      title: "CHACHAPOYAS",
      subtitle: "Fortaleza de Kuelap, Perú",
      image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=1000&auto=format&fit=crop",
    },
    {
      id: 6,
      title: "HUANCAYO",
      subtitle: "Valle del Mantaro, Perú",
      image: "https://images.unsplash.com/photo-1539037116277-4db20889f2d4?q=80&w=1000&auto=format&fit=crop",
    },
    {
      id: 7,
      title: "TRUJILLO",
      subtitle: "Ciudad de la Eterna Primavera, Perú",
      image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=1000&auto=format&fit=crop",
    },
    {
      id: 8,
      title: "CAJAMARCA",
      subtitle: "Tierra del Carnaval, Perú",
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=1000&auto=format&fit=crop",
    },
  ]

  const visibleDestinations = showMore ? destinations : destinations.slice(0, 4)

  return (
    <section className="w-full h-full bg-white py-4 md:py-12 px-4 md:px-8 flex flex-col justify-center overflow-hidden">
      <div className="max-w-7xl mx-auto h-full flex flex-col justify-center">
        {/* Title - Más compacto en móvil */}
        <motion.div
          className="text-center mb-4 md:mb-8"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
        >
          <h2 className="text-xl md:text-4xl lg:text-5xl xl:text-6xl text-peru-dark leading-tight brand-text">
            DESCUBRE LAS <em className="italic text-peru-orange">MARAVILLAS</em>
            <br className="hidden md:block" />
            <span className="md:hidden"> </span>DEL PERÚ
          </h2>
        </motion.div>

        {/* Destinations Grid */}
        <motion.div
          className="flex-1 flex flex-col justify-center"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          viewport={{ once: true }}
        >
          {/* Desktop Grid - 4 columns con mejor proporción */}
          <div className="hidden md:grid md:grid-cols-4 gap-3 lg:gap-4 mb-6">
            {visibleDestinations.map((destination, index) => (
              <motion.div
                key={destination.id}
                className="relative h-64 lg:h-72 xl:h-80 overflow-hidden group cursor-pointer bg-gray-100"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.6,
                  ease: [0.16, 1, 0.3, 1],
                  delay: 0.4 + index * 0.1,
                }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.02 }}
              >
                {/* Image */}
                <div className="absolute inset-0">
                  <Image
                    src={destination.image || "/placeholder.svg"}
                    alt={destination.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>

                {/* Overlay */}
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors duration-300" />

                {/* Text Content */}
                <div className="absolute inset-0 flex flex-col justify-between p-4 lg:p-5">
                  {/* Empty space for top */}
                  <div></div>

                  {/* Bottom content */}
                  <div className="text-white">
                    <h3 className="text-lg lg:text-xl font-bold tracking-wide brand-text mb-1">{destination.title}</h3>
                    <p className="text-xs lg:text-sm opacity-90 body-text">{destination.subtitle}</p>
                  </div>
                </div>

                {/* Hover effect border */}
                <div className="absolute inset-0 border-2 border-transparent group-hover:border-white/20 transition-colors duration-300"></div>
              </motion.div>
            ))}
          </div>

          {/* Mobile Grid - 2 columns más compacto */}
          <div className="md:hidden grid grid-cols-2 gap-2 mb-4">
            {visibleDestinations.map((destination, index) => (
              <motion.div
                key={destination.id}
                className="relative h-36 overflow-hidden group cursor-pointer bg-gray-100"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.6,
                  ease: [0.16, 1, 0.3, 1],
                  delay: 0.4 + index * 0.1,
                }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.02 }}
              >
                {/* Image */}
                <div className="absolute inset-0">
                  <Image
                    src={destination.image || "/placeholder.svg"}
                    alt={destination.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>

                {/* Overlay */}
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors duration-300" />

                {/* Text Content */}
                <div className="absolute inset-0 flex flex-col justify-between p-3">
                  {/* Empty space for top */}
                  <div></div>

                  {/* Bottom content */}
                  <div className="text-white">
                    <h3 className="text-sm font-bold tracking-wide brand-text mb-1">{destination.title}</h3>
                    <p className="text-xs opacity-90 body-text leading-tight">{destination.subtitle}</p>
                  </div>
                </div>

                {/* Hover effect border */}
                <div className="absolute inset-0 border border-transparent group-hover:border-white/20 transition-colors duration-300"></div>
              </motion.div>
            ))}
          </div>

          {/* Load More Button - Más compacto */}
          {!showMore && (
            <motion.div
              className="flex justify-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.8 }}
              viewport={{ once: true }}
            >
              <button
                onClick={() => setShowMore(true)}
                className="bg-peru-dark text-white px-6 md:px-12 py-2 md:py-3 text-xs md:text-sm font-medium uppercase tracking-wider hover:bg-peru-orange transition-colors duration-300 brand-text"
              >
                VER MÁS
              </button>
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  )
}
