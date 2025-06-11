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
      text: "I couldn't recommend Nelson Travel more highly - we had the most amazing holiday - every detail had been thought about and they were always on hand to answer any questions straight away. Very personal service.",
      name: "Camilla",
      destination: "African Safari",
    },
    {
      id: 2,
      rating: 5,
      text: "Blown away by our Tanzania safari, I never expected it to be that good — it totally exceeded my expectations and was all hassle free. Our guide was absolutely amazing too. Cannot wait for next year!",
      name: "Jeremy",
      destination: "Tanzania Safari",
    },
    {
      id: 3,
      rating: 5,
      text: "Fantastic customer service. Super friendly team and no question unanswered and no request too small. Really appreciated how they co-ordinated my family throughout the planning phase. Thank you Nelson Travel.",
      name: "Jamie",
      destination: "Family Holiday",
    },
    {
      id: 4,
      rating: 5,
      text: "The attention to detail was incredible. From the moment we landed to our departure, everything was seamlessly organized. The local experiences they arranged were authentic and unforgettable.",
      name: "Sarah",
      destination: "Morocco Adventure",
    },
    {
      id: 5,
      rating: 5,
      text: "Nelson Travel made our honeymoon absolutely perfect. The romantic touches they added throughout our journey made it so special. We felt truly cared for every step of the way.",
      name: "Michael",
      destination: "Honeymoon in Maldives",
    },
    {
      id: 6,
      rating: 5,
      text: "Professional, knowledgeable, and genuinely passionate about travel. They listened to our needs and created an itinerary that was beyond our wildest dreams. Highly recommended!",
      name: "Emma",
      destination: "European Tour",
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

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <motion.span
        key={index}
        className="text-[#ff6b6b] text-lg"
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
    <section className="min-h-screen bg-gray-50 py-16 px-8 flex flex-col justify-center">
      <div className="max-w-7xl mx-auto w-full">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-light text-black">
            <span className="text-2xl">→</span> From our travellers <span className="text-2xl">←</span>
          </h2>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              {getCurrentTestimonials().map((testimonial, index) => (
                <motion.div
                  key={testimonial.id}
                  className="bg-white p-8 border border-gray-200 h-full flex flex-col justify-between"
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
                  <div className="flex justify-center mb-6 space-x-1">{renderStars(testimonial.rating)}</div>

                  {/* Testimonial Text */}
                  <div className="flex-1 mb-6">
                    <p className="text-gray-800 text-center leading-relaxed text-sm md:text-base">{testimonial.text}</p>
                  </div>

                  {/* Name */}
                  <div className="text-center">
                    <p className="text-[#ff6b6b] text-xl font-script italic">{testimonial.name}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <motion.div
            className="flex justify-center items-center space-x-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
            viewport={{ once: true }}
          >
            <motion.button
              onClick={prevPage}
              className="w-12 h-12 rounded-full border border-gray-300 flex items-center justify-center hover:border-gray-400 hover:bg-gray-100 transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={totalPages <= 1}
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </motion.button>

            {/* Page Indicators */}
            <div className="flex space-x-2">
              {Array.from({ length: totalPages }, (_, index) => (
                <motion.button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentIndex ? "bg-[#ff6b6b]" : "bg-gray-300"
                  }`}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                />
              ))}
            </div>

            <motion.button
              onClick={nextPage}
              className="w-12 h-12 rounded-full border border-gray-300 flex items-center justify-center hover:border-gray-400 hover:bg-gray-100 transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={totalPages <= 1}
            >
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </motion.button>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
