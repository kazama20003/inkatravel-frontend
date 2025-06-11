"use client"

import Image from "next/image"
import { useState } from "react"
import { motion } from "framer-motion"

const destinations = [
  {
    id: 1,
    title: "MACHU PICCHU",
    image: "https://images.unsplash.com/photo-1587595431973-160d0d94add1?q=80&w=1000&auto=format&fit=crop",
    location: "Cusco, Perú",
    price: "$899",
    days: "4 días",
    description: "La ciudadela perdida de los Incas",
  },
  {
    id: 2,
    title: "LAGO TITICACA",
    image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=1000&auto=format&fit=crop",
    location: "Puno, Perú",
    price: "$649",
    days: "3 días",
    description: "El lago navegable más alto del mundo",
  },
  {
    id: 3,
    title: "AMAZONAS",
    image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=1000&auto=format&fit=crop",
    location: "Iquitos, Perú",
    price: "$1,299",
    days: "5 días",
    description: "Aventura en la selva tropical",
  },
]

export default function ExploreSection() {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)

  return (
    <section className="h-screen bg-white flex flex-col pt-20 md:pt-32 pb-4 md:pb-8 px-4 md:px-8 overflow-hidden">
      <div className="max-w-7xl mx-auto w-full flex-1 flex flex-col h-full">
        {/* Header Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8 flex-shrink-0">
          {/* Left Column - Description */}
          <motion.div
            className="max-w-lg order-2 lg:order-1"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <p className="text-sm md:text-base lg:text-lg leading-relaxed body-text text-gray-800">
              Adéntrate en un reino donde lo extraordinario se convierte en realidad. Desde valles ocultos hasta costas
              vírgenes, estos son lugares que desafían la imaginación y conmueven el alma.
            </p>
          </motion.div>

          {/* Right Column - Title */}
          <motion.div
            className="flex flex-col justify-start order-1 lg:order-2"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl md:text-4xl lg:text-6xl xl:text-7xl text-peru-dark leading-none brand-text">
              EXPLORA{" "}
              <span className="relative">
                M
                <span className="absolute top-0 -right-2 md:-right-4 lg:-right-6">
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-3 h-3 md:w-4 md:h-4 lg:w-6 lg:h-6"
                  >
                    <path
                      d="M22 16.9998L12 6.99982L2 16.9998"
                      stroke="var(--peru-dark)"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M19.9999 13.9998V19.9998H3.99988V13.9998"
                      stroke="var(--peru-dark)"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M12 6.99982V2.99982"
                      stroke="var(--peru-dark)"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M12 2.99982H15.9999"
                      stroke="var(--peru-dark)"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </span>{" "}
              UNDOS
            </h2>
            <h2 className="text-2xl md:text-4xl lg:text-6xl xl:text-7xl text-peru-dark leading-none brand-text">
              MÁS ALLÁ DE LA IMAGINACIÓN
            </h2>
            <div className="text-right mt-2 hidden md:block">
              <p className="text-xs lg:text-sm text-gray-500 uppercase tracking-wider body-text">
                ARRASTRA PARA NAVEGAR
              </p>
            </div>
          </motion.div>
        </div>

        {/* Tours Populares Label */}
        <motion.div
          className="mb-4 md:mb-6 flex-shrink-0"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <h3 className="text-base md:text-lg lg:text-xl text-peru-orange brand-text uppercase tracking-wider">
            Tours Populares
          </h3>
          <div className="w-12 md:w-16 h-0.5 bg-peru-orange mt-1 md:mt-2"></div>
        </motion.div>

        {/* Destination Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 lg:gap-6 flex-1 min-h-0">
          {destinations.map((destination, index) => (
            <motion.div
              key={destination.id}
              className="relative h-full min-h-[200px] md:min-h-[250px] lg:min-h-[300px] overflow-hidden group cursor-pointer"
              onMouseEnter={() => setHoveredCard(destination.id)}
              onMouseLeave={() => setHoveredCard(null)}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
            >
              {/* Image */}
              <div className="absolute inset-0 w-full h-full">
                <Image
                  src={destination.image || "/placeholder.svg"}
                  alt={destination.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent group-hover:from-black/80 transition-all duration-300" />

              {/* Content */}
              <div className="absolute inset-0 flex flex-col justify-between p-3 md:p-4 lg:p-6 text-white">
                {/* Top Content - Price Badge */}
                <div className="flex justify-end">
                  <motion.div
                    className="bg-peru-gold text-peru-dark px-2 md:px-3 py-1 text-xs md:text-sm font-medium brand-text"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{
                      opacity: hoveredCard === destination.id ? 1 : 0,
                      scale: hoveredCard === destination.id ? 1 : 0.8,
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    {destination.price}
                  </motion.div>
                </div>

                {/* Bottom Content */}
                <div>
                  {/* Title */}
                  <h3 className="text-lg md:text-xl lg:text-2xl font-medium brand-text mb-1 md:mb-2">
                    {destination.title}
                  </h3>

                  {/* Description - Only visible on hover/mobile */}
                  <motion.p
                    className="text-xs md:text-sm body-text mb-1 md:mb-2 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300"
                    initial={{ opacity: 1 }}
                  >
                    {destination.description}
                  </motion.p>

                  {/* Location and Days */}
                  <div className="flex flex-col md:flex-row md:justify-between md:items-end">
                    <div>
                      <p className="text-xs md:text-sm body-text opacity-90">{destination.location}</p>
                    </div>

                    {/* Days Badge */}
                    <motion.div
                      className="mt-1 md:mt-0"
                      initial={{ opacity: 1 }}
                      animate={{
                        opacity: hoveredCard === destination.id ? 1 : 0.7,
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      <span className="inline-flex items-center bg-white/20 backdrop-blur-sm px-2 md:px-3 py-1 text-xs font-medium brand-text">
                        <svg
                          width="10"
                          height="10"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          className="mr-1 md:w-3 md:h-3"
                        >
                          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                          <polyline points="12,6 12,12 16,14" stroke="currentColor" strokeWidth="2" />
                        </svg>
                        {destination.days}
                      </span>
                    </motion.div>
                  </div>

                  {/* CTA Button - Only visible on hover */}
                  <motion.button
                    className="mt-2 md:mt-4 w-full bg-peru-orange text-white py-2 px-3 md:px-4 text-xs md:text-sm font-medium brand-text opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-peru-orange/90"
                    initial={{ y: 10, opacity: 0 }}
                    animate={{
                      y: hoveredCard === destination.id ? 0 : 10,
                      opacity: hoveredCard === destination.id ? 1 : 0,
                    }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                  >
                    VER DETALLES
                  </motion.button>
                </div>
              </div>

              {/* Mobile Touch Indicator */}
              <div className="md:hidden absolute top-3 left-3">
                <div className="w-6 h-6 bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="text-white"
                  >
                    <path
                      d="M9 18l6-6-6-6"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          className="mt-4 md:mt-6 text-center flex-shrink-0"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          viewport={{ once: true }}
        >
          <button className="bg-peru-dark text-white px-6 md:px-8 py-2 md:py-3 brand-text hover:bg-peru-dark/90 transition-colors duration-300 text-sm md:text-base">
            VER TODOS LOS TOURS
          </button>
        </motion.div>
      </div>
    </section>
  )
}
