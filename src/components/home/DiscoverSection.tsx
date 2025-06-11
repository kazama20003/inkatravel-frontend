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
    <section className="min-h-screen bg-white py-16 px-8">
      <div className="max-w-7xl mx-auto">
        {/* Title */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl text-peru-dark leading-tight max-w-2xl brand-text">
            DESCUBRE LAS <em className="italic">MARAVILLAS</em>
            <br />
            DEL PERÚ
          </h2>
        </motion.div>

        {/* Destinations Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          viewport={{ once: true }}
        >
          {visibleDestinations.map((destination, index) => (
            <motion.div
              key={destination.id}
              className="relative h-80 overflow-hidden group cursor-pointer"
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
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-300" />

              {/* Text Content */}
              <div className="absolute inset-0 flex flex-col justify-between p-6">
                {/* Title */}
                <div>
                  <h3 className="text-white text-xl tracking-wide brand-text">{destination.title}</h3>
                </div>

                {/* Subtitle */}
                <div>
                  <p className="text-white text-sm opacity-90 body-text">{destination.subtitle}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Load More Button */}
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
              className="bg-peru-dark text-white px-12 py-4 text-sm font-medium uppercase tracking-wider hover:bg-peru-orange transition-colors duration-300 brand-text"
            >
              VER MÁS
            </button>
          </motion.div>
        )}
      </div>
    </section>
  )
}
