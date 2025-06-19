"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

export default function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0)

  const testimonials = [
    {
      id: 1,
      rating: 5,
      text: "No podría recomendar Peru Travel más altamente - tuvimos las vacaciones más increíbles - cada detalle había sido pensado y siempre estuvieron disponibles para responder cualquier pregunta de inmediato. Servicio muy personal.",
      name: "Camila",
    },
    {
      id: 2,
      rating: 5,
      text: "Quedé impresionado por nuestro safari en Tanzania, nunca esperé que fuera tan bueno - superó totalmente mis expectativas y fue todo sin complicaciones. Nuestro guía también fue absolutamente increíble. ¡No puedo esperar al próximo año!",
      name: "Jeremy",
    },
    {
      id: 3,
      rating: 5,
      text: "Fantástico servicio al cliente. Equipo súper amigable y ninguna pregunta sin respuesta y ninguna solicitud demasiado pequeña. Realmente aprecié cómo coordinaron a mi familia durante toda la fase de planificación. Gracias Peru Travel.",
      name: "Jamie",
    },
    {
      id: 4,
      rating: 5,
      text: "La atención al detalle fue increíble. Desde el momento en que aterrizamos hasta nuestra partida, todo estaba perfectamente organizado. Las experiencias locales que organizaron fueron auténticas e inolvidables.",
      name: "Sarah",
    },
    {
      id: 5,
      rating: 5,
      text: "Peru Travel hizo nuestra luna de miel absolutamente perfecta. Los toques románticos que agregaron a lo largo de nuestro viaje lo hicieron tan especial. Nos sentimos verdaderamente cuidados en cada paso del camino.",
      name: "Michael",
    },
    {
      id: 6,
      rating: 5,
      text: "Profesional, conocedor y genuinamente apasionado por los viajes. Escucharon nuestras necesidades y crearon un itinerario que estaba más allá de nuestros sueños más salvajes. ¡Altamente recomendado!",
      name: "Emma",
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
        className="text-pink-500 text-lg"
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
    <section className="min-h-screen bg-gray-50 py-12 md:py-20 flex items-center">
      <div className="container mx-auto px-4 w-full">
        {/* Header */}
        <motion.div
          className="text-center mb-12 md:mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl text-gray-900 mb-8">→ From our travellers ←</h2>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="max-w-7xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-12"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              {getCurrentTestimonials().map((testimonial, index) => (
                <motion.div
                  key={testimonial.id}
                  className="bg-white p-8 md:p-10 border border-gray-200 h-full flex flex-col justify-between min-h-[300px] md:min-h-[350px]"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.6,
                    ease: [0.16, 1, 0.3, 1],
                    delay: index * 0.1,
                  }}
                >
                  {/* Stars */}
                  <div className="flex justify-center mb-6 space-x-1">{renderStars()}</div>

                  {/* Testimonial Text */}
                  <div className="flex-1 mb-6">
                    <p className="text-gray-800 text-center leading-relaxed text-base md:text-lg">{testimonial.text}</p>
                  </div>

                  {/* Name */}
                  <div className="text-center">
                    <p className="text-pink-500 text-xl md:text-2xl italic">{testimonial.name}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <motion.div
            className="flex justify-center items-center space-x-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
            viewport={{ once: true }}
          >
            <motion.button
              onClick={prevPage}
              className="text-2xl md:text-3xl text-gray-400 hover:text-gray-600 transition-colors duration-300"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              disabled={totalPages <= 1}
            >
              ←
            </motion.button>

            <motion.button
              onClick={nextPage}
              className="text-2xl md:text-3xl text-gray-400 hover:text-gray-600 transition-colors duration-300"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              disabled={totalPages <= 1}
            >
              →
            </motion.button>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
