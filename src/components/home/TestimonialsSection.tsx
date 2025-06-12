"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"

export default function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0)

  const testimonials = [
    {
      id: 1,
      rating: 5,
      text: "No podría recomendar Peru Travel más altamente - tuvimos las vacaciones más increíbles - cada detalle había sido pensado y siempre estuvieron disponibles para responder cualquier pregunta de inmediato. Servicio muy personal.",
      name: "Camila",
      destination: "Safari Africano",
    },
    {
      id: 2,
      rating: 5,
      text: "Quedé impresionado por nuestro safari en Tanzania, nunca esperé que fuera tan bueno - superó totalmente mis expectativas y fue todo sin complicaciones. Nuestro guía también fue absolutamente increíble. ¡No puedo esperar al próximo año!",
      name: "Jeremy",
      destination: "Safari en Tanzania",
    },
    {
      id: 3,
      rating: 5,
      text: "Fantástico servicio al cliente. Equipo súper amigable y ninguna pregunta sin respuesta y ninguna solicitud demasiado pequeña. Realmente aprecié cómo coordinaron a mi familia durante toda la fase de planificación. Gracias Peru Travel.",
      name: "Jamie",
      destination: "Vacaciones Familiares",
    },
    {
      id: 4,
      rating: 5,
      text: "La atención al detalle fue increíble. Desde el momento en que aterrizamos hasta nuestra partida, todo estaba perfectamente organizado. Las experiencias locales que organizaron fueron auténticas e inolvidables.",
      name: "Sarah",
      destination: "Aventura en Marruecos",
    },
    {
      id: 5,
      rating: 5,
      text: "Peru Travel hizo nuestra luna de miel absolutamente perfecta. Los toques románticos que agregaron a lo largo de nuestro viaje lo hicieron tan especial. Nos sentimos verdaderamente cuidados en cada paso del camino.",
      name: "Michael",
      destination: "Luna de Miel en Maldivas",
    },
    {
      id: 6,
      rating: 5,
      text: "Profesional, conocedor y genuinamente apasionado por los viajes. Escucharon nuestras necesidades y crearon un itinerario que estaba más allá de nuestros sueños más salvajes. ¡Altamente recomendado!",
      name: "Emma",
      destination: "Tour Europeo",
    },
  ]

  const testimonialsPerPage = 3
  const totalPages = Math.ceil(testimonials.length / testimonialsPerPage)

  const getCurrentTestimonials = () => {
    const startIndex = currentIndex * testimonialsPerPage
    return testimonials.slice(startIndex, startIndex + testimonialsPerPage)
  }

  const nextPage = () => {
    setCurrentIndex((prev) => (prev + 1) % totalPages)
  }

  const prevPage = () => {
    setCurrentIndex((prev) => (prev - 1 + totalPages) % totalPages)
  }

  const renderStars = () => {
    return Array.from({ length: 5 }, (_, index) => (
      <motion.span
        key={index}
        className="text-peru-gold text-base md:text-lg"
        initial={{ opacity: 0, scale: 0 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{
          duration: 0.3,
          delay: index * 0.1,
          ease: [0.16, 1, 0.3, 1],
        }}
        viewport={{ once: true }}
      >
        ★
      </motion.span>
    ))
  }

  return (
    <section className="w-full h-full bg-gray-50 py-4 md:py-8 px-4 md:px-8 flex flex-col justify-center overflow-hidden">
      <div className="max-w-7xl mx-auto h-full flex flex-col justify-center">
        {/* Header */}
        <motion.div
          className="text-center mb-4 md:mb-8"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
        >
          <h2 className="text-2xl md:text-4xl lg:text-5xl xl:text-6xl font-light text-black brand-text">
            <span className="text-lg md:text-2xl">→</span> DE NUESTROS VIAJEROS{" "}
            <span className="text-lg md:text-2xl">←</span>
          </h2>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="relative flex-1 flex flex-col justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6 mb-4 md:mb-8"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              {getCurrentTestimonials().map((testimonial, index) => (
                <motion.div
                  key={testimonial.id}
                  className="bg-white p-3 md:p-6 lg:p-8 border border-gray-200 h-full flex flex-col justify-between min-h-[200px] md:min-h-[300px]"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.6,
                    ease: [0.16, 1, 0.3, 1],
                    delay: index * 0.1,
                  }}
                  whileHover={{ y: -5, transition: { duration: 0.3 } }}
                >
                  {/* Stars */}
                  <div className="flex justify-center mb-3 md:mb-6 space-x-1">{renderStars()}</div>

                  {/* Testimonial Text */}
                  <div className="flex-1 mb-3 md:mb-6">
                    <p className="text-gray-800 text-center leading-relaxed text-xs md:text-base body-text">
                      {testimonial.text}
                    </p>
                  </div>

                  {/* Name */}
                  <div className="text-center">
                    <p className="text-peru-orange text-base md:text-xl font-script italic brand-text">
                      {testimonial.name}
                    </p>
                    <p className="text-gray-600 text-xs md:text-sm body-text mt-1">{testimonial.destination}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <motion.div
            className="flex justify-center items-center space-x-3 md:space-x-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
            viewport={{ once: true }}
          >
            <motion.button
              onClick={prevPage}
              className="w-8 h-8 md:w-12 md:h-12 rounded-full border border-gray-300 flex items-center justify-center hover:border-gray-400 hover:bg-gray-100 transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={totalPages <= 1}
            >
              <ChevronLeft className="w-3 h-3 md:w-5 md:h-5 text-gray-600" />
            </motion.button>

            {/* Page Indicators */}
            <div className="flex space-x-2">
              {Array.from({ length: totalPages }, (_, index) => (
                <motion.button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentIndex ? "bg-peru-orange" : "bg-gray-300"
                  }`}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                />
              ))}
            </div>

            <motion.button
              onClick={nextPage}
              className="w-8 h-8 md:w-12 md:h-12 rounded-full border border-gray-300 flex items-center justify-center hover:border-gray-400 hover:bg-gray-100 transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={totalPages <= 1}
            >
              <ChevronRight className="w-3 h-3 md:w-5 md:h-5 text-gray-600" />
            </motion.button>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
