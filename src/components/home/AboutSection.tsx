"use client"

import { motion } from "framer-motion"

export default function AboutSection() {
  const stats = [
    {
      id: 1,
      title: "ATOL",
      subtitle: "NO 12034",
      icon: (
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="md:w-6 md:h-6"
        >
          <path
            d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z"
            fill="var(--peru-orange)"
            stroke="var(--peru-orange)"
            strokeWidth="1"
          />
        </svg>
      ),
    },
    {
      id: 2,
      title: "CERO",
      subtitle: "CARGOS EXTRA",
      icon: (
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="md:w-6 md:h-6"
        >
          <circle cx="12" cy="12" r="8" fill="none" stroke="var(--peru-orange)" strokeWidth="2" />
          <path d="M8 12h8" stroke="var(--peru-orange)" strokeWidth="2" strokeLinecap="round" />
        </svg>
      ),
    },
    {
      id: 3,
      title: "100%",
      subtitle: "COMPENSACIÓN CARBONO",
      icon: (
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="md:w-6 md:h-6"
        >
          <path
            d="M12 2L15.09 8.26L22 9L15.09 9.74L12 16L8.91 9.74L2 9L8.91 8.26L12 2Z"
            fill="var(--peru-orange)"
            stroke="var(--peru-orange)"
            strokeWidth="1"
          />
          <circle cx="12" cy="12" r="3" fill="var(--peru-orange)" />
        </svg>
      ),
    },
  ]

  return (
    <section className="h-screen flex flex-col justify-center items-center pt-20 md:pt-32 pb-8 md:pb-16 px-4 md:px-8 bg-white overflow-hidden">
      <div className="max-w-6xl mx-auto w-full text-center h-full flex flex-col justify-center">
        {/* Logo */}
        <motion.div
          className="mb-8 md:mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
        >
          <div className="flex items-center justify-center">
            <span className="text-3xl md:text-4xl text-peru-dark brand-text">→P←</span>
          </div>
        </motion.div>

        {/* Main Description */}
        <motion.div
          className="mb-12 md:mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          viewport={{ once: true }}
        >
          <p className="text-lg md:text-2xl lg:text-3xl xl:text-4xl text-peru-dark leading-relaxed max-w-5xl mx-auto body-text px-4">
            Peru Travel es una empresa de viajes de lujo galardonada que se especializa en viajes a medida, lunas de
            miel y vacaciones familiares por Perú, América del Sur y más allá.
          </p>
        </motion.div>

        {/* Statistics Circles */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 md:gap-12"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
          viewport={{ once: true }}
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.id}
              className="flex flex-col items-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.6,
                ease: [0.16, 1, 0.3, 1],
                delay: 0.6 + index * 0.1,
              }}
              viewport={{ once: true }}
            >
              {/* Circle with dotted border */}
              <div className="relative mb-4 md:mb-6">
                <div className="w-32 h-32 sm:w-36 sm:h-36 md:w-40 md:h-40 lg:w-48 lg:h-48 border-2 border-dotted border-gray-300 rounded-full flex flex-col items-center justify-center relative">
                  {/* Icon */}
                  <div className="absolute top-3 sm:top-4 md:top-5 lg:top-6 left-1/2 transform -translate-x-1/2">
                    {stat.icon}
                  </div>

                  {/* Main text */}
                  <div className="text-center mt-4 sm:mt-5 md:mt-6">
                    <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-peru-dark mb-1 md:mb-2 brand-text">
                      {stat.title}
                    </h3>
                    <p className="text-xs sm:text-sm md:text-sm text-gray-600 body-text">{stat.subtitle}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
