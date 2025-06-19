"use client"

import { motion } from "framer-motion"
import { MapPin, Users, Star, Calendar, Plane, Camera } from "lucide-react"

export default function ExploreSection() {
  const stats = [
    {
      id: 1,
      number: "2,847",
      unit: "viajeros",
      label: "Turistas Satisfechos",
      sublabel: "Este año han viajado con nosotros",
      icon: Users,
      color: "bg-blue-50",
      iconColor: "text-blue-600",
      numberColor: "text-blue-700",
    },
    {
      id: 2,
      number: "4.9",
      unit: "/5",
      label: "Calificación Promedio",
      sublabel: "Basado en más de 1,200 reseñas",
      icon: Star,
      color: "bg-amber-50",
      iconColor: "text-amber-600",
      numberColor: "text-amber-700",
    },
    {
      id: 3,
      number: "127",
      unit: "destinos",
      label: "Lugares Únicos",
      sublabel: "Descubre rincones mágicos del Perú",
      icon: MapPin,
      color: "bg-green-50",
      iconColor: "text-green-600",
      numberColor: "text-green-700",
    },
    {
      id: 4,
      number: "15",
      unit: "años",
      label: "Experiencia",
      sublabel: "Creando memorias inolvidables",
      icon: Calendar,
      color: "bg-purple-50",
      iconColor: "text-purple-600",
      numberColor: "text-purple-700",
    },
    {
      id: 5,
      number: "98%",
      unit: "éxito",
      label: "Tours Completados",
      sublabel: "Sin cancelaciones por nuestra parte",
      icon: Plane,
      color: "bg-red-50",
      iconColor: "text-red-600",
      numberColor: "text-red-700",
    },
    {
      id: 6,
      number: "24/7",
      unit: "soporte",
      label: "Atención Continua",
      sublabel: "Estamos aquí cuando nos necesites",
      icon: Camera,
      color: "bg-indigo-50",
      iconColor: "text-indigo-600",
      numberColor: "text-indigo-700",
    },
  ]

  return (
    <section className="w-full h-screen bg-gradient-to-br from-gray-50 to-white flex flex-col justify-center pt-20 md:pt-32 pb-8 md:pb-16 px-4 md:px-8 overflow-hidden">
      <div className="max-w-7xl mx-auto w-full h-full flex flex-col justify-center">
        {/* Header */}
        <motion.div
          className="text-center mb-6 md:mb-8"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-5xl lg:text-6xl xl:text-7xl text-peru-dark leading-tight brand-text mb-4">
            EXPLORA CON
            <br />
            <span className="text-peru-orange">CONFIANZA</span>
          </h2>
          <p className="text-lg md:text-xl text-gray-600 body-text max-w-2xl mx-auto">
            Números que respaldan nuestra experiencia en turismo peruano
          </p>
        </motion.div>

        {/* Stats Grid - Ocupa el espacio principal */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8 flex-1 content-center"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
        >
          {stats.map((stat, index) => {
            const IconComponent = stat.icon

            return (
              <motion.div
                key={stat.id}
                className={`${stat.color} rounded-2xl p-6 md:p-8 h-full min-h-[200px] md:min-h-[240px] flex flex-col justify-between relative overflow-hidden group hover:shadow-lg transition-all duration-300`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.6,
                  delay: 0.4 + index * 0.1,
                  ease: [0.16, 1, 0.3, 1],
                }}
                viewport={{ once: true }}
                whileHover={{ y: -4, scale: 1.02 }}
              >
                {/* Background Pattern */}
                <div className="absolute top-0 right-0 w-24 h-24 opacity-10">
                  <div className="w-full h-full rounded-full border-4 border-current transform translate-x-8 -translate-y-8"></div>
                </div>

                {/* Icon */}
                <div className="flex justify-between items-start mb-4">
                  <div
                    className={`w-12 h-12 md:w-14 md:h-14 rounded-xl ${stat.iconColor} bg-white/50 flex items-center justify-center`}
                  >
                    <IconComponent className="w-6 h-6 md:w-7 md:h-7" />
                  </div>
                  <div className="text-right">
                    <div className="text-xs md:text-sm text-gray-500 body-text">{stat.unit}</div>
                  </div>
                </div>

                {/* Main Number */}
                <div className="mb-4">
                  <div
                    className={`text-4xl md:text-5xl lg:text-6xl font-bold ${stat.numberColor} brand-text leading-none`}
                  >
                    {stat.number}
                  </div>
                </div>

                {/* Labels */}
                <div className="mt-auto">
                  <h3 className="text-lg md:text-xl font-semibold text-gray-800 brand-text mb-1">{stat.label}</h3>
                  <p className="text-sm md:text-base text-gray-600 body-text leading-relaxed">{stat.sublabel}</p>
                </div>

                {/* Hover Effect */}
                <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          className="text-center mt-6 md:mt-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button className="bg-peru-orange text-white px-8 py-3 rounded-lg brand-text hover:bg-peru-orange/90 transition-colors duration-300 shadow-lg">
              PLANIFICA TU VIAJE
            </button>
            <button className="border-2 border-peru-dark text-peru-dark px-8 py-3 rounded-lg brand-text hover:bg-peru-dark hover:text-white transition-colors duration-300">
              VER TESTIMONIOS
            </button>
          </div>
          <p className="text-sm text-gray-500 mt-4 body-text">Únete a miles de viajeros que han confiado en nosotros</p>
        </motion.div>
      </div>
    </section>
  )
}
