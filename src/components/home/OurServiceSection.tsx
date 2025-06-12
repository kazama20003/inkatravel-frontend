"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Image from "next/image"

export default function OurServiceSection() {
  const [activeTab, setActiveTab] = useState("TAILOR-MADE")

  const tabs = [
    "TAILOR-MADE",
    "EXPERT GUIDES",
    "PRICE PROMISE",
    "FAMILY OPERATED",
    "CARBON OFFSET",
    "CHARITY COMMITMENT",
  ]

  const tabContent = {
    "TAILOR-MADE": {
      title: "Viajes a Medida",
      description:
        "Cada viaje está diseñado únicamente para ti, adaptándose a tus preferencias personales, intereses y estilo de viaje. Nuestro equipo experto crea itinerarios personalizados que generan experiencias inolvidables.",
      image: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=1000&auto=format&fit=crop",
      buttonText: "PLANIFICA TU VIAJE",
    },
    "EXPERT GUIDES": {
      title: "Guías Expertos",
      description:
        "Nuestros guías locales cuidadosamente seleccionados dan vida a los destinos con su profundo conocimiento, pasión y acceso exclusivo. Experimenta conexiones culturales auténticas y gemas ocultas que solo los locales conocen.",
      image: "https://images.unsplash.com/photo-1539650116574-75c0c6d73c6e?q=80&w=1000&auto=format&fit=crop",
      buttonText: "CONOCE NUESTROS GUÍAS",
    },
    "PRICE PROMISE": {
      title: "Garantía de Precio",
      description:
        "Garantizamos precios transparentes sin costos ocultos. Si encuentras un viaje comparable a un precio menor, lo igualamos. Tu inversión va directamente a crear experiencias de viaje excepcionales.",
      image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=1000&auto=format&fit=crop",
      buttonText: "VER PRECIOS",
    },
    "FAMILY OPERATED": {
      title: "Empresa Familiar",
      description:
        "Como empresa familiar, brindamos cuidado personal y atención a cada detalle de tu viaje. Nuestro compromiso con la excelencia abarca generaciones, asegurando un servicio auténtico y cordial.",
      image: "https://images.unsplash.com/photo-1511895426328-dc8714191300?q=80&w=1000&auto=format&fit=crop",
      buttonText: "NUESTRA HISTORIA",
    },
    "CARBON OFFSET": {
      title: "Compensación de Carbono",
      description:
        "Estamos comprometidos con el turismo responsable. Cada viaje incluye iniciativas de compensación de carbono, apoyando proyectos de reforestación y programas de energía renovable para minimizar el impacto ambiental.",
      image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=1000&auto=format&fit=crop",
      buttonText: "SOSTENIBILIDAD",
    },
    "CHARITY COMMITMENT": {
      title: "Compromiso Benéfico",
      description:
        "Nos enorgullece ser el socio oficial de viajes de la Fundación ForRangers, apoyando sus esfuerzos críticos de conservación y protegiendo la vida silvestre en peligro de extinción.",
      image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=1000&auto=format&fit=crop",
      buttonText: "CONOCE MÁS",
    },
  }

  const currentContent = tabContent[activeTab as keyof typeof tabContent]

  return (
    <section className="w-full h-full bg-peru-dark text-white py-4 md:py-8 px-4 md:px-8 flex flex-col justify-center overflow-hidden">
      <div className="max-w-7xl mx-auto h-full flex flex-col justify-center">
        {/* Header */}
        <motion.div
          className="text-center mb-4 md:mb-8"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
        >
          <h2 className="text-2xl md:text-4xl lg:text-5xl xl:text-6xl font-light mb-2 md:mb-6 brand-text">
            <span className="text-lg md:text-2xl">→</span> NUESTROS SERVICIOS{" "}
            <span className="text-lg md:text-2xl">←</span>
          </h2>
          <p className="text-sm md:text-lg text-gray-300 max-w-2xl mx-auto body-text">
            Itinerarios a medida, creados por nuestros expertos
          </p>
        </motion.div>

        {/* Tabs Navigation */}
        <motion.div
          className="mb-4 md:mb-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          viewport={{ once: true }}
        >
          <div className="flex flex-wrap justify-center gap-2 md:gap-8 lg:gap-12 border-b border-gray-600 pb-2 md:pb-4">
            {tabs.map((tab, index) => (
              <motion.button
                key={tab}
                className={`text-xs md:text-sm lg:text-base font-medium tracking-wider transition-all duration-300 pb-1 md:pb-4 relative px-1 md:px-2 ${
                  activeTab === tab ? "text-white" : "text-gray-400 hover:text-gray-200"
                }`}
                onClick={() => setActiveTab(tab)}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.6,
                  ease: [0.16, 1, 0.3, 1],
                  delay: 0.4 + index * 0.1,
                }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {tab}
                {activeTab === tab && (
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-white"
                    layoutId="activeTab"
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  />
                )}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Content */}
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8 lg:gap-12 items-center flex-1"
          key={activeTab}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Image */}
          <motion.div
            className="relative h-48 md:h-80 lg:h-96 overflow-hidden order-2 lg:order-1"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          >
            <Image
              src={currentContent.image || "/placeholder.svg"}
              alt={currentContent.title}
              fill
              className="object-cover transition-transform duration-700 hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/20" />
          </motion.div>

          {/* Text Content */}
          <motion.div
            className="space-y-2 md:space-y-4 lg:space-y-6 order-1 lg:order-2"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
          >
            <h3 className="text-xl md:text-3xl lg:text-4xl font-light brand-text">{currentContent.title}</h3>

            <p className="text-sm md:text-lg text-gray-300 leading-relaxed body-text">{currentContent.description}</p>

            <motion.button
              className="border border-white px-4 md:px-8 py-2 md:py-3 text-xs md:text-sm font-medium tracking-wider hover:bg-white hover:text-peru-dark transition-all duration-300 brand-text"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              {currentContent.buttonText}
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
