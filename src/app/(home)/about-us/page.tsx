"use client"
import { motion, useScroll, useTransform } from "framer-motion"
import Image from "next/image"
import { useRef } from "react"
import {
  Users,
  Award,
  Globe,
  Heart,
  Star,
  MapPin,
  Calendar,
  Shield,
  Compass,
  Mountain,
  Leaf,
  Quote,
  ChevronDown,
  Target,
  TrendingUp,
  CheckCircle,
} from "lucide-react"

// Datos del equipo
const teamMembers = [
  {
    id: 1,
    name: "Carlos Mendoza",
    position: "Fundador & CEO",
    experience: "15 años",
    specialty: "Turismo de Aventura",
    image: "https://res.cloudinary.com/dwvikvjrq/image/upload/v1750432260/turismo-vivencial-la-comunidad-amaru-cuzco-inkayni-peru-tours_enayn1.webp",
    description:
      "Apasionado por mostrar la belleza del Perú al mundo, Carlos fundó Inka Travel con la visión de crear experiencias auténticas e inolvidables.",
    languages: ["Español", "Inglés", "Quechua"],
    certifications: ["Guía Oficial", "Primeros Auxilios", "Turismo Sostenible"],
  },
  {
    id: 2,
    name: "María Quispe",
    position: "Directora de Operaciones",
    experience: "12 años",
    specialty: "Turismo Cultural",
    image: "https://res.cloudinary.com/dwvikvjrq/image/upload/v1750432260/turismo-vivencial-la-comunidad-amaru-cuzco-inkayni-peru-tours_enayn1.webp",
    description:
      "Experta en cultura andina y tradiciones ancestrales, María asegura que cada viaje sea una inmersión cultural auténtica.",
    languages: ["Español", "Inglés", "Quechua", "Aymara"],
    certifications: ["Antropóloga", "Guía Especializada", "Patrimonio Cultural"],
  },
  {
    id: 3,
    name: "Roberto Silva",
    position: "Jefe de Guías",
    experience: "10 años",
    specialty: "Trekking & Montañismo",
    image: "https://res.cloudinary.com/dwvikvjrq/image/upload/v1750432260/turismo-vivencial-la-comunidad-amaru-cuzco-inkayni-peru-tours_enayn1.webp",
    description:
      "Montañista experimentado y conocedor profundo de los Andes, Roberto lidera nuestro equipo de guías especializados.",
    languages: ["Español", "Inglés", "Francés"],
    certifications: ["Guía de Montaña", "Rescate en Altura", "Wilderness First Aid"],
  },
  {
    id: 4,
    name: "Ana Vargas",
    position: "Coordinadora de Sostenibilidad",
    experience: "8 años",
    specialty: "Turismo Responsable",
    image: "https://res.cloudinary.com/dwvikvjrq/image/upload/v1750432260/turismo-vivencial-la-comunidad-amaru-cuzco-inkayni-peru-tours_enayn1.webp",
    description:
      "Bióloga y conservacionista, Ana desarrolla nuestros programas de turismo sostenible y responsabilidad social.",
    languages: ["Español", "Inglés", "Portugués"],
    certifications: ["Bióloga", "Turismo Sostenible", "Conservación"],
  },
]

// Estadísticas de la empresa
const companyStats = [
  {
    number: "15+",
    label: "Años de Experiencia",
    description: "Creando experiencias inolvidables",
    icon: Calendar,
    color: "text-peru-orange",
    bgColor: "bg-peru-orange/10",
  },
  {
    number: "10,000+",
    label: "Viajeros Felices",
    description: "De más de 50 países",
    icon: Users,
    color: "text-peru-green",
    bgColor: "bg-peru-green/10",
  },
  {
    number: "50+",
    label: "Destinos Únicos",
    description: "Por todo el Perú",
    icon: MapPin,
    color: "text-peru-gold",
    bgColor: "bg-peru-gold/10",
  },
  {
    number: "98%",
    label: "Satisfacción",
    description: "Calificación promedio",
    icon: Star,
    color: "text-peru-orange",
    bgColor: "bg-peru-orange/10",
  },
]

// Valores de la empresa
const companyValues = [
  {
    title: "Autenticidad",
    description: "Experiencias genuinas que conectan con la cultura local y las tradiciones ancestrales del Perú.",
    icon: Heart,
    color: "bg-red-50 text-red-600",
    borderColor: "border-red-200",
  },
  {
    title: "Sostenibilidad",
    description: "Turismo responsable que protege el medio ambiente y beneficia a las comunidades locales.",
    icon: Leaf,
    color: "bg-green-50 text-green-600",
    borderColor: "border-green-200",
  },
  {
    title: "Excelencia",
    description: "Estándares de calidad superiores en cada detalle de nuestros servicios y experiencias.",
    icon: Award,
    color: "bg-yellow-50 text-yellow-600",
    borderColor: "border-yellow-200",
  },
  {
    title: "Seguridad",
    description: "Protocolos rigurosos y equipos especializados para garantizar la seguridad de nuestros viajeros.",
    icon: Shield,
    color: "bg-blue-50 text-blue-600",
    borderColor: "border-blue-200",
  },
  {
    title: "Innovación",
    description: "Constantemente mejoramos nuestros servicios incorporando nuevas tecnologías y metodologías.",
    icon: Compass,
    color: "bg-purple-50 text-purple-600",
    borderColor: "border-purple-200",
  },
  {
    title: "Pasión",
    description: "Amor genuino por el Perú y dedicación absoluta para compartir sus maravillas con el mundo.",
    icon: Mountain,
    color: "bg-orange-50 text-orange-600",
    borderColor: "border-orange-200",
  },
]

// Certificaciones y reconocimientos
const certifications = [
  {
    title: "Certificación IATA",
    description: "Agencia de viajes certificada internacionalmente",
    year: "2015",
    icon: Globe,
  },
  {
    title: "Turismo Sostenible",
    description: "Certificado por el Ministerio de Turismo del Perú",
    year: "2018",
    icon: Leaf,
  },
  {
    title: "Excelencia TripAdvisor",
    description: "Certificado de Excelencia por 5 años consecutivos",
    year: "2019-2024",
    icon: Award,
  },
  {
    title: "ISO 9001",
    description: "Sistema de gestión de calidad certificado",
    year: "2020",
    icon: Shield,
  },
]

// Testimonios de clientes
const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    country: "Estados Unidos",
    rating: 5,
    text: "Inka Travel hizo que nuestro viaje a Perú fuera absolutamente mágico. Cada detalle estaba perfectamente planificado y nuestro guía Carlos fue increíble. ¡Definitivamente regresaremos!",
    tour: "Machu Picchu & Valle Sagrado",
    image: "https://res.cloudinary.com/dwvikvjrq/image/upload/v1750432260/turismo-vivencial-la-comunidad-amaru-cuzco-inkayni-peru-tours_enayn1.webp",
  },
  {
    id: 2,
    name: "Hans Mueller",
    country: "Alemania",
    rating: 5,
    text: "La experiencia más auténtica que he tenido viajando. El equipo de Inka Travel realmente conoce el Perú y te hace sentir la cultura de una manera única.",
    tour: "Camino Inca Clásico",
    image: "https://res.cloudinary.com/dwvikvjrq/image/upload/v1750432260/turismo-vivencial-la-comunidad-amaru-cuzco-inkayni-peru-tours_enayn1.webp",
  },
  {
    id: 3,
    name: "Yuki Tanaka",
    country: "Japón",
    rating: 5,
    text: "Profesionalismo excepcional y atención a cada detalle. Inka Travel superó todas nuestras expectativas. El Amazonas fue una experiencia transformadora.",
    tour: "Aventura Amazónica",
    image: "https://res.cloudinary.com/dwvikvjrq/image/upload/v1750432260/turismo-vivencial-la-comunidad-amaru-cuzco-inkayni-peru-tours_enayn1.webp",
  },
]

// Historia de la empresa (timeline)
const companyHistory = [
  {
    year: "2009",
    title: "Fundación",
    description: "Carlos Mendoza funda Inka Travel con la visión de mostrar el verdadero Perú al mundo.",
    milestone: "Primeros tours a Machu Picchu",
    icon: Target,
    color: "bg-peru-orange",
    achievements: ["Primera oficina en Cusco", "5 tours iniciales", "Equipo de 3 personas"],
  },
  {
    year: "2012",
    title: "Expansión",
    description: "Ampliamos nuestros servicios al Amazonas y la costa norte del Perú.",
    milestone: "1,000 viajeros atendidos",
    icon: TrendingUp,
    color: "bg-peru-green",
    achievements: ["Nuevas rutas amazónicas", "Oficina en Lima", "15 guías especializados"],
  },
  {
    year: "2015",
    title: "Certificación Internacional",
    description: "Obtenemos la certificación IATA y reconocimiento del Ministerio de Turismo.",
    milestone: "Certificación IATA",
    icon: Award,
    color: "bg-peru-gold",
    achievements: ["Certificación IATA", "Reconocimiento oficial", "5,000 clientes satisfechos"],
  },
  {
    year: "2018",
    title: "Turismo Sostenible",
    description: "Implementamos programas de turismo responsable y sostenibilidad ambiental.",
    milestone: "Certificación Sostenible",
    icon: Leaf,
    color: "bg-green-600",
    achievements: ["Programas eco-friendly", "Alianzas comunitarias", "Certificación verde"],
  },
  {
    year: "2020",
    title: "Innovación Digital",
    description: "Adaptación a nuevas tecnologías y protocolos de seguridad post-pandemia.",
    milestone: "Plataforma digital",
    icon: Compass,
    color: "bg-blue-600",
    achievements: ["Plataforma online", "Tours virtuales", "Protocolos COVID-19"],
  },
  {
    year: "2024",
    title: "Líderes del Sector",
    description: "Reconocidos como una de las mejores agencias de turismo del Perú.",
    milestone: "10,000+ viajeros felices",
    icon: CheckCircle,
    color: "bg-purple-600",
    achievements: ["Líder del mercado", "50+ destinos", "98% satisfacción"],
  },
]

// Razones para elegirnos
const whyChooseUs = [
  {
    title: "Experiencia Local",
    description: "15 años de experiencia profunda en el turismo peruano con guías nativos especializados.",
    icon: Mountain,
    color: "text-peru-orange",
  },
  {
    title: "Turismo Responsable",
    description: "Comprometidos con la sostenibilidad y el beneficio de las comunidades locales.",
    icon: Leaf,
    color: "text-green-600",
  },
  {
    title: "Atención Personalizada",
    description: "Cada viaje es único y diseñado específicamente para tus intereses y necesidades.",
    icon: Heart,
    color: "text-red-600",
  },
  {
    title: "Seguridad Garantizada",
    description: "Protocolos rigurosos de seguridad y equipos especializados en cada expedición.",
    icon: Shield,
    color: "text-blue-600",
  },
  {
    title: "Soporte 24/7",
    description: "Asistencia completa antes, durante y después de tu viaje por el Perú.",
    icon: Users,
    color: "text-purple-600",
  },
  {
    title: "Mejor Precio Garantizado",
    description: "Precios competitivos sin comprometer la calidad de nuestros servicios premium.",
    icon: Award,
    color: "text-yellow-600",
  },
]

export default function AboutUsPage() {
  const timelineRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ["start end", "end start"],
  })

  const progressHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"])

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* Hero Section */}
      <div className="relative h-screen">
        <Image
          src="https://res.cloudinary.com/dwvikvjrq/image/upload/v1748624876/banner_waz5ov.jpg"
          alt="Equipo de Inka Travel en Machu Picchu"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

        <div className="absolute inset-0 flex items-center justify-center">
          <div className="max-w-7xl mx-auto px-4 md:px-8 text-center">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
              <motion.h1
                className="text-5xl md:text-7xl lg:text-8xl font-light text-white leading-none brand-text mb-6"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                Sobre Nosotros
              </motion.h1>
              <motion.p
                className="text-xl md:text-2xl text-white/90 body-text max-w-4xl mx-auto mb-8 leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                Somos una empresa familiar peruana dedicada a crear experiencias auténticas e inolvidables que conectan
                a los viajeros con la rica cultura, historia y naturaleza del Perú.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="flex flex-col sm:flex-row gap-4 justify-center"
              >
                <motion.button
                  className="px-8 py-4 bg-peru-orange text-white brand-text text-lg hover:bg-peru-orange/90 transition-all duration-300"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  CONOCE NUESTRA HISTORIA
                </motion.button>
                <motion.button
                  className="px-8 py-4 border-2 border-white text-white brand-text text-lg hover:bg-white hover:text-peru-dark transition-all duration-300"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  VER NUESTRO EQUIPO
                </motion.button>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white cursor-pointer"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
          onClick={() => window.scrollTo({ top: window.innerHeight, behavior: "smooth" })}
        >
          <div className="flex flex-col items-center">
            <span className="text-sm body-text mb-2">Descubre más</span>
            <ChevronDown size={32} />
          </div>
        </motion.div>
      </div>

      {/* Estadísticas */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-light text-black brand-text mb-6">Nuestros Logros</h2>
            <p className="text-lg md:text-xl text-gray-600 body-text max-w-3xl mx-auto">
              Números que reflejan nuestro compromiso con la excelencia y la satisfacción de nuestros viajeros.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {companyStats.map((stat, index) => {
              const IconComponent = stat.icon
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center bg-white p-6 md:p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-102 border border-gray-100"
                >
                  <div
                    className={`w-16 h-16 mx-auto mb-4 ${stat.bgColor} rounded-full flex items-center justify-center`}
                  >
                    <IconComponent size={32} className={stat.color} />
                  </div>
                  <motion.div
                    className="text-3xl md:text-4xl font-bold text-black brand-text mb-2"
                    initial={{ scale: 0.8 }}
                    whileInView={{ scale: 1 }}
                    transition={{ duration: 0.4, delay: index * 0.1 + 0.2 }}
                    viewport={{ once: true }}
                  >
                    {stat.number}
                  </motion.div>
                  <h3 className="text-base md:text-lg font-medium text-gray-800 brand-text mb-2">{stat.label}</h3>
                  <p className="text-sm text-gray-600 body-text">{stat.description}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Timeline con Progress Bar */}
      <section className="py-16 md:py-24 bg-white" ref={timelineRef}>
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-light text-black brand-text mb-6">Nuestra Historia</h2>
            <p className="text-lg md:text-xl text-gray-600 body-text max-w-3xl mx-auto">
              Un viaje de 15 años construyendo experiencias inolvidables y conectando corazones con el Perú.
            </p>
          </motion.div>

          {/* Timeline con Progress Bar */}
          <div className="relative max-w-6xl mx-auto">
            {/* Línea de fondo */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gray-200 hidden md:block" />

            {/* Línea de progreso animada */}
            <motion.div
              className="absolute left-1/2 transform -translate-x-1/2 w-1 bg-gradient-to-b from-peru-orange to-peru-gold hidden md:block"
              style={{ height: progressHeight }}
            />

            <div className="space-y-12 md:space-y-20">
              {companyHistory.map((item, index) => {
                const IconComponent = item.icon
                return (
                  <motion.div
                    key={item.year}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true, margin: "-100px" }}
                    className={`flex flex-col md:flex-row items-center ${
                      index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                    }`}
                  >
                    {/* Contenido */}
                    <div
                      className={`w-full md:w-5/12 ${index % 2 === 0 ? "md:text-right md:pr-12" : "md:text-left md:pl-12"}`}
                    >
                      <motion.div
                        className="bg-white p-8 md:p-10 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-102 border border-gray-100"
                        whileHover={{ y: -2 }}
                      >
                        <div className="flex items-center space-x-3 mb-6">
                          <motion.span
                            className={`${item.color} text-white px-4 py-2 text-lg brand-text font-medium rounded-full`}
                            initial={{ scale: 0.8 }}
                            whileInView={{ scale: 1 }}
                            transition={{ duration: 0.4, delay: index * 0.1 + 0.3 }}
                            viewport={{ once: true }}
                          >
                            {item.year}
                          </motion.span>
                          <h3 className="text-2xl md:text-3xl font-bold text-black brand-text">{item.title}</h3>
                        </div>

                        <p className="text-gray-600 body-text mb-6 leading-relaxed text-lg">{item.description}</p>

                        <div className="flex items-center space-x-2 text-peru-orange mb-6">
                          <Award size={20} />
                          <span className="text-base font-medium body-text">{item.milestone}</span>
                        </div>

                        {/* Logros específicos */}
                        <div className="space-y-2">
                          <h4 className="text-sm font-semibold text-gray-700 brand-text mb-3">Logros Destacados:</h4>
                          {item.achievements.map((achievement, idx) => (
                            <motion.div
                              key={idx}
                              className="flex items-center space-x-2"
                              initial={{ opacity: 0, x: -10 }}
                              whileInView={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.4, delay: index * 0.1 + 0.5 + idx * 0.1 }}
                              viewport={{ once: true }}
                            >
                              <CheckCircle size={16} className="text-green-500" />
                              <span className="text-sm text-gray-600 body-text">{achievement}</span>
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>
                    </div>

                    {/* Punto central animado con icono */}
                    <div className="hidden md:flex w-2/12 justify-center">
                      <motion.div
                        className={`w-16 h-16 ${item.color} rounded-full border-4 border-white shadow-xl relative z-10 flex items-center justify-center`}
                        initial={{ scale: 0 }}
                        whileInView={{ scale: 1 }}
                        transition={{ duration: 0.5, delay: index * 0.1 + 0.2 }}
                        viewport={{ once: true }}
                        whileHover={{ scale: 1.1 }}
                      >
                        <IconComponent size={24} className="text-white" />

                        {/* Pulso animado más sutil */}
                        <motion.div
                          className={`absolute inset-0 ${item.color} rounded-full opacity-20`}
                          initial={{ scale: 1, opacity: 0.2 }}
                          animate={{ scale: 1.5, opacity: 0 }}
                          transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, delay: index * 0.5 }}
                        />
                      </motion.div>
                    </div>

                    {/* Espacio */}
                    <div className="hidden md:block w-5/12" />
                  </motion.div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Por qué Elegirnos - Sin gradiente */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-light text-black brand-text mb-6">¿Por Qué Elegirnos?</h2>
            <p className="text-lg md:text-xl text-gray-600 body-text max-w-3xl mx-auto">
              Descubre las razones que nos convierten en la mejor opción para tu aventura peruana.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {whyChooseUs.map((reason, index) => {
              const IconComponent = reason.icon
              return (
                <motion.div
                  key={reason.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white p-6 md:p-8 shadow-lg hover:shadow-xl transition-all duration-300 text-center transform hover:scale-102 border border-gray-100"
                >
                  <div className="w-16 h-16 mx-auto mb-6 bg-gray-50 rounded-full flex items-center justify-center">
                    <IconComponent size={32} className={reason.color} />
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold text-black brand-text mb-4">{reason.title}</h3>
                  <p className="text-gray-600 body-text leading-relaxed">{reason.description}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Nuestros Valores */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-light text-black brand-text mb-6">Nuestros Valores</h2>
            <p className="text-lg md:text-xl text-gray-600 body-text max-w-3xl mx-auto">
              Los principios que guían cada decisión y acción en Inka Travel, asegurando experiencias excepcionales y
              responsables.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {companyValues.map((value, index) => {
              const IconComponent = value.icon
              return (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className={`bg-white p-6 md:p-8 shadow-lg hover:shadow-xl transition-all duration-300 text-center transform hover:scale-102 border-2 ${value.borderColor}`}
                >
                  <div
                    className={`w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center ${value.color}`}
                  >
                    <IconComponent size={32} />
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold text-black brand-text mb-4">{value.title}</h3>
                  <p className="text-gray-600 body-text leading-relaxed">{value.description}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Nuestro Equipo */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-light text-black brand-text mb-6">Nuestro Equipo</h2>
            <p className="text-lg md:text-xl text-gray-600 body-text max-w-3xl mx-auto">
              Conoce a los expertos apasionados que hacen posible cada experiencia única en el Perú.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {teamMembers.map((member, index) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group transform hover:scale-102 border border-gray-100"
              >
                {/* Foto del miembro */}
                <div className="relative h-64 overflow-hidden">
                  <Image
                    src={member.image || "/placeholder.svg"}
                    alt={member.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* Info overlay en hover */}
                  <div className="absolute bottom-4 left-4 right-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="flex flex-wrap gap-1 mb-2">
                      {member.languages.map((lang, idx) => (
                        <span key={idx} className="px-2 py-1 bg-white/20 text-xs body-text rounded">
                          {lang}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Información del miembro */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-black brand-text mb-1">{member.name}</h3>
                  <p className="text-peru-orange font-medium body-text mb-2">{member.position}</p>

                  <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 text-sm text-gray-600 mb-4 space-y-1 sm:space-y-0">
                    <div className="flex items-center space-x-1">
                      <Calendar size={14} />
                      <span className="body-text">{member.experience}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Mountain size={14} />
                      <span className="body-text">{member.specialty}</span>
                    </div>
                  </div>

                  <p className="text-gray-600 body-text text-sm leading-relaxed mb-4">{member.description}</p>

                  {/* Certificaciones */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 brand-text mb-2">Certificaciones</h4>
                    <div className="flex flex-wrap gap-1">
                      {member.certifications.map((cert, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-peru-orange/10 text-peru-orange text-xs body-text rounded"
                        >
                          {cert}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Certificaciones */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-light text-black brand-text mb-6">
              Certificaciones y Reconocimientos
            </h2>
            <p className="text-lg md:text-xl text-gray-600 body-text max-w-3xl mx-auto">
              Nuestro compromiso con la excelencia está respaldado por certificaciones internacionales y reconocimientos
              de la industria.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {certifications.map((cert, index) => {
              const IconComponent = cert.icon
              return (
                <motion.div
                  key={cert.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white p-6 shadow-lg hover:shadow-xl transition-all duration-300 text-center transform hover:scale-102 border border-gray-100"
                >
                  <div className="w-16 h-16 mx-auto mb-4 bg-peru-orange/10 rounded-full flex items-center justify-center">
                    <IconComponent size={32} className="text-peru-orange" />
                  </div>
                  <h3 className="text-lg font-bold text-black brand-text mb-2">{cert.title}</h3>
                  <p className="text-gray-600 body-text text-sm mb-3">{cert.description}</p>
                  <span className="inline-block px-3 py-1 bg-peru-orange text-white text-xs brand-text rounded-full">
                    {cert.year}
                  </span>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Testimonios - Espaciado corregido */}
      <section className="py-16 md:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-5xl font-light text-black brand-text mb-6">
              Lo Que Dicen Nuestros Viajeros
            </h2>
            <p className="text-lg md:text-xl text-gray-600 body-text max-w-3xl mx-auto">
              Las experiencias de nuestros viajeros son nuestro mayor orgullo y motivación para seguir mejorando.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white p-6 md:p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-102 border border-gray-100"
              >
                {/* Rating */}
                <div className="flex items-center space-x-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} size={16} className="text-yellow-400 fill-current" />
                  ))}
                </div>

                {/* Quote */}
                <div className="relative mb-6">
                  <Quote size={24} className="text-peru-orange/30 absolute -top-2 -left-2" />
                  <p className="text-gray-600 body-text leading-relaxed italic pl-6">{'"' + testimonial.text + '"'}</p>
                </div>

                {/* Cliente info */}
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                    <Image
                      src={testimonial.image || "/placeholder.svg"}
                      alt={testimonial.name}
                      width={48}
                      height={48}
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-medium text-black brand-text truncate">{testimonial.name}</h4>
                    <p className="text-sm text-gray-600 body-text truncate">{testimonial.country}</p>
                    <p className="text-xs text-peru-orange body-text truncate">{testimonial.tour}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 md:py-24 bg-peru-dark text-white">
        <div className="max-w-4xl mx-auto text-center px-4 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-5xl font-light leading-tight mb-6 brand-text">
              ¿Listo para vivir tu aventura peruana?
            </h2>
            <p className="text-lg md:text-xl text-white/90 body-text mb-8 max-w-2xl mx-auto">
              Únete a los miles de viajeros que han confiado en nosotros para descubrir las maravillas del Perú. Tu
              aventura inolvidable te está esperando.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                className="px-8 py-4 bg-peru-orange text-white brand-text text-lg hover:bg-peru-orange/90 transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                PLANIFICA TU VIAJE
              </motion.button>
              <motion.button
                className="px-8 py-4 border-2 border-white text-white brand-text text-lg hover:bg-white hover:text-peru-dark transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                CONTÁCTANOS
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
