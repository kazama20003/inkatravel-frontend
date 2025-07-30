"use client"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { motion } from "framer-motion"
import { Phone, Mail, MessageCircle, Star, Users, Award, Clock } from "lucide-react"
import { useLanguage } from "@/contexts/LanguageContext"

export default function ContactSection() {
  const { t } = useLanguage()

  const stats = [
    { icon: Users, value: "5000+", label: t.testimonials },
    { icon: Award, value: "15+", label: "Años de experiencia" },
    { icon: Star, value: "4.9", label: "Rating promedio" },
  ]

  const contactMethods = [
    {
      icon: Phone,
      title: t.callUs,
      subtitle: "Llamada directa",
      action: "tel:+51996407040",
      color: "bg-green-500",
    },
    {
      icon: MessageCircle,
      title: "WhatsApp",
      subtitle: "Respuesta inmediata",
      action: "https://wa.me/51996407040",
      color: "bg-green-600",
    },
    {
      icon: Mail,
      title: t.emailUs,
      subtitle: "Consulta detallada",
      action: "mailto:incatravelperu21@gmail.com",
      color: "bg-blue-500",
    },
  ]

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
      <div className="w-full h-full grid grid-cols-1 lg:grid-cols-5 gap-0">
        {/* Left Side - Enhanced Image Section */}
        <div className="lg:col-span-3 relative h-[50vh] sm:h-[60vh] lg:h-screen">
          {/* Floating Badge */}
          <motion.div
            className="absolute top-4 left-4 sm:top-8 sm:left-8 z-20"
            initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 rounded-full border-2 border-dashed border-[#e67e22] flex items-center justify-center bg-white/95 backdrop-blur-sm shadow-lg hover:scale-105 transition-transform duration-300">
              <span className="text-[10px] sm:text-xs lg:text-sm font-bold text-[#e67e22] text-center leading-tight">
                {t.enquireNow.split(" ").map((word, index) => (
                  <span key={index}>
                    {word}
                    {index < t.enquireNow.split(" ").length - 1 && <br />}
                  </span>
                ))}
              </span>
            </div>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            className="absolute top-4 right-4 sm:top-8 sm:right-8 z-20"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
          >
            <div className="bg-white/95 backdrop-blur-sm rounded-lg p-3 shadow-lg">
              <div className="flex items-center space-x-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <span className="text-sm font-semibold text-gray-800">4.9</span>
              </div>
              <p className="text-xs text-gray-600 mt-1">+5000 {t.reviews}</p>
            </div>
          </motion.div>

          {/* Stats Overlay */}
          <motion.div
            className="absolute bottom-4 left-4 right-4 sm:bottom-8 sm:left-8 sm:right-8 z-20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}
          >
            <div className="bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-lg">
              <div className="grid grid-cols-3 gap-4">
                {stats.map((stat, index) => {
                  const IconComponent = stat.icon
                  return (
                    <motion.div
                      key={stat.label}
                      className="text-center"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{
                        duration: 0.5,
                        ease: [0.16, 1, 0.3, 1],
                        delay: 0.7 + index * 0.1,
                      }}
                    >
                      <IconComponent className="w-5 h-5 mx-auto mb-1 text-[#e67e22]" />
                      <div className="text-lg font-bold text-gray-900">{stat.value}</div>
                      <div className="text-xs text-gray-600">{stat.label}</div>
                    </motion.div>
                  )
                })}
              </div>
            </div>
          </motion.div>

          {/* Main Image with Overlay */}
          <div className="w-full h-full relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent z-10" />
            <Image
              src="https://res.cloudinary.com/dwvikvjrq/image/upload/v1750432255/turista-cusco_ad5tin.jpg"
              alt={t.contactImageAlt}
              fill
              className="object-cover transition-transform duration-700 hover:scale-105"
              priority
            />
          </div>
        </div>

        {/* Right Side - Enhanced Content */}
        <div className="lg:col-span-2 flex flex-col justify-center px-4 sm:px-6 lg:px-8 xl:px-12 py-8 sm:py-12 lg:py-0 lg:h-screen bg-white">
          <motion.div
            className="space-y-6 sm:space-y-8 lg:space-y-10 w-full max-w-none"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Brand Badge */}
            <motion.div
              className="inline-flex items-center space-x-2 bg-[#e67e22]/10 text-[#e67e22] px-4 py-2 rounded-full text-sm font-medium"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            >
              <Award className="w-4 h-4" />
              <span>Inka Travel Peru</span>
            </motion.div>

            {/* Main Title */}
            <motion.div
              className="space-y-3 sm:space-y-4 lg:space-y-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
            >
              <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl font-light text-gray-900 leading-tight">
                Comienza a planificar tu <span className="text-[#e67e22] font-medium">viaje a medida</span> con Inka
                Travel Peru
              </h2>
              <p className="text-base sm:text-lg lg:text-xl text-gray-600 leading-relaxed">
                {t.speakToSpecialist}. Creamos experiencias únicas adaptadas a tus sueños de viaje.
              </p>
            </motion.div>

            {/* Contact Methods */}
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-3 gap-3 lg:gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
            >
              {contactMethods.map((method, index) => {
                const IconComponent = method.icon
                return (
                  <motion.a
                    key={method.title}
                    href={method.action}
                    className="group p-4 rounded-xl border border-gray-200 hover:border-[#e67e22] transition-all duration-300 hover:shadow-lg bg-white"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.6,
                      ease: [0.16, 1, 0.3, 1],
                      delay: 0.5 + index * 0.1,
                    }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className={`w-10 h-10 ${method.color} rounded-lg flex items-center justify-center mb-3`}>
                      <IconComponent className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="font-semibold text-gray-900 text-sm">{method.title}</h3>
                    <p className="text-xs text-gray-600 mt-1">{method.subtitle}</p>
                  </motion.a>
                )
              })}
            </motion.div>

            {/* Main Action Buttons */}
            <motion.div
              className="space-y-3 sm:space-y-4 lg:space-y-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.6 }}
            >
              <Button
                className="w-full bg-[#e67e22] hover:bg-[#d35400] text-white py-4 sm:py-5 lg:py-6 px-6 sm:px-8 text-sm sm:text-base font-medium tracking-wider rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                size="lg"
              >
                <Mail className="w-5 h-5 mr-2" />
                {t.enquireNowButton}
              </Button>
              <Button
                variant="outline"
                className="w-full border-2 border-[#e67e22] hover:bg-[#e67e22] hover:text-white text-[#e67e22] py-4 sm:py-5 lg:py-6 px-6 sm:px-8 text-sm sm:text-base font-medium tracking-wider bg-white rounded-xl transition-all duration-300"
                size="lg"
              >
                <Phone className="w-5 h-5 mr-2" />
                {t.callUsButton}
              </Button>
            </motion.div>

            {/* Available Now Section */}
            <motion.div
              className="flex items-center justify-between p-4 bg-green-50 rounded-xl border border-green-200"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.7 }}
            >
              <div className="flex items-center space-x-3 lg:space-x-4">
                <div className="relative">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-full overflow-hidden ring-2 ring-green-500">
                    <Image
                      src="https://res.cloudinary.com/dwvikvjrq/image/upload/v1750114576/uploads/sgqkf6xncugoizwfbv7o.jpg"
                      alt={t.travelSpecialistAlt}
                      width={800}
                      height={600}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-semibold text-green-800">{t.availableNow}</span>
                  </div>
                  <p className="text-xs text-green-600 mt-1">Especialista en viajes</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs text-green-600">Tiempo de respuesta</div>
                <div className="text-sm font-bold text-green-800">{"< 2 horas"}</div>
              </div>
            </motion.div>

            {/* Trust Elements */}
            <motion.div
              className="flex items-center justify-center space-x-6 pt-4 border-t border-gray-100"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.8 }}
            >
              <div className="text-center">
                <div className="text-sm font-bold text-gray-900">100%</div>
                <div className="text-xs text-gray-600">Seguro</div>
              </div>
              <div className="w-px h-8 bg-gray-200"></div>
              <div className="text-center">
                <div className="text-sm font-bold text-gray-900">24/7</div>
                <div className="text-xs text-gray-600">Soporte</div>
              </div>
              <div className="w-px h-8 bg-gray-200"></div>
              <div className="text-center">
                <div className="text-sm font-bold text-gray-900">15+</div>
                <div className="text-xs text-gray-600">Años exp.</div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
