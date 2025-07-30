"use client"
import { useState } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import { MapPin, Clock, Camera, Star, Users, Calendar, ArrowRight, CheckCircle } from "lucide-react"
import { useLanguage } from "@/contexts/LanguageContext"

// Itinerarios informativos organizados por duración
const itinerariesByDuration = {
  "Corta Duración": [
    {
      id: 1,
      title: "LIMA EXPRESS",
      subtitle: "Lo mejor de la capital en 3 días",
      description:
        "Descubre los tesoros coloniales y gastronómicos de Lima en un itinerario perfecto para una escapada corta pero intensa.",
      image: "https://images.unsplash.com/photo-1587595431973-160d0d94add1?q=80&w=1000&auto=format&fit=crop",
      duration: "3D/2N",
      difficulty: "Fácil" as const,
      tourType: "Premium" as const,
      price: "$299",
      rating: 4.8,
      destinations: ["Lima Centro", "Miraflores", "Barranco", "San Isidro"],
      highlights: ["Centro Histórico UNESCO", "Tour Gastronómico", "Museos de Clase Mundial", "Vida Nocturna"],
      included: ["Hoteles 4*", "Traslados", "Tours guiados", "Algunas comidas"],
    },
    {
      id: 2,
      title: "CUSCO CLÁSICO",
      subtitle: "Ciudad Imperial y Valle Sagrado",
      description:
        "Explora la antigua capital del Imperio Inca y sus alrededores en un viaje que combina historia, cultura y paisajes andinos.",
      image: "https://images.unsplash.com/photo-1531065208531-4036c0dba3ca?q=80&w=1000&auto=format&fit=crop",
      duration: "4D/3N",
      difficulty: "Moderado" as const,
      tourType: "Premium" as const,
      price: "$449",
      rating: 4.9,
      destinations: ["Cusco", "Valle Sagrado", "Pisac", "Ollantaytambo"],
      highlights: ["Qorikancha", "Sacsayhuamán", "Mercado de Pisac", "Fortaleza Ollantaytambo"],
      included: ["Hoteles 3-4*", "Traslados", "Tours guiados", "Entradas"],
    },
    {
      id: 3,
      title: "AREQUIPA COLONIAL",
      subtitle: "Ciudad Blanca y Cañón del Colca",
      description:
        "Descubre la arquitectura colonial de sillar blanco y contempla el vuelo de los cóndores en el segundo cañón más profundo del mundo.",
      image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=1000&auto=format&fit=crop",
      duration: "4D/3N",
      difficulty: "Moderado" as const,
      tourType: "Clásico" as const,
      price: "$389",
      rating: 4.7,
      destinations: ["Arequipa", "Colca", "Chivay", "Yanque"],
      highlights: ["Monasterio Santa Catalina", "Cruz del Cóndor", "Aguas Termales", "Pueblos Tradicionales"],
      included: ["Hoteles 3*", "Traslados", "Tours guiados", "Algunas comidas"],
    },
  ],
  "Duración Media": [
    {
      id: 4,
      title: "PERÚ CLÁSICO",
      subtitle: "Lima, Cusco y Machu Picchu",
      description:
        "El itinerario más popular del Perú que combina la capital, la ciudad imperial y la maravilla del mundo en una experiencia completa.",
      image: "https://images.unsplash.com/photo-1587595431973-160d0d94add1?q=80&w=1000&auto=format&fit=crop",
      duration: "7D/6N",
      difficulty: "Moderado" as const,
      tourType: "Premium" as const,
      price: "$1,299",
      rating: 4.9,
      destinations: ["Lima", "Cusco", "Aguas Calientes", "Valle Sagrado"],
      highlights: ["Machu Picchu", "Tren Vistadome", "Valle Sagrado", "Gastronomía Peruana"],
      included: ["Hoteles 4*", "Vuelos domésticos", "Tren Machu Picchu", "Tours guiados"],
    },
    {
      id: 5,
      title: "NORTE ARQUEOLÓGICO",
      subtitle: "Trujillo, Chiclayo y culturas pre-incas",
      description:
        "Explora las fascinantes culturas Moche, Chimú y Lambayeque en un viaje por el norte arqueológico del Perú.",
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=1000&auto=format&fit=crop",
      duration: "6D/5N",
      difficulty: "Fácil" as const,
      tourType: "Clásico" as const,
      price: "$899",
      rating: 4.6,
      destinations: ["Trujillo", "Chiclayo", "Lambayeque", "Huanchaco"],
      highlights: ["Señor de Sipán", "Chan Chan", "Huacas del Sol y Luna", "Playa Huanchaco"],
      included: ["Hoteles 3*", "Vuelos domésticos", "Tours guiados", "Entradas"],
    },
    {
      id: 6,
      title: "AMAZONAS AVENTURA",
      subtitle: "Iquitos y Reserva Pacaya Samiria",
      description:
        "Sumérgete en la biodiversidad amazónica más rica del planeta con navegación por ríos y observación de vida silvestre.",
      image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=1000&auto=format&fit=crop",
      duration: "6D/5N",
      difficulty: "Moderado" as const,
      tourType: "Premium" as const,
      price: "$1,199",
      rating: 4.8,
      destinations: ["Iquitos", "Pacaya Samiria", "Río Ucayali", "Nauta"],
      highlights: ["Navegación Amazónica", "Observación de Delfines", "Comunidades Nativas", "Pesca de Pirañas"],
      included: ["Lodge amazónico", "Todas las comidas", "Excursiones", "Guía especializado"],
    },
  ],
  "Larga Duración": [
    {
      id: 7,
      title: "GRAN TOUR DEL PERÚ",
      subtitle: "De costa a selva pasando por los Andes",
      description:
        "El itinerario más completo que abarca todas las regiones del Perú: costa, sierra y selva en una experiencia transformadora.",
      image: "https://images.unsplash.com/photo-1587595431973-160d0d94add1?q=80&w=1000&auto=format&fit=crop",
      duration: "14D/13N",
      difficulty: "Moderado" as const,
      tourType: "Premium" as const,
      price: "$2,899",
      rating: 4.9,
      destinations: ["Lima", "Cusco", "Puno", "Arequipa", "Iquitos", "Paracas"],
      highlights: ["Líneas de Nazca", "Machu Picchu", "Lago Titicaca", "Amazonía", "Cañón del Colca"],
      included: ["Hoteles 4-5*", "Todos los vuelos", "Tren Machu Picchu", "Lodge amazónico"],
    },
    {
      id: 8,
      title: "RUTA DEL INCA",
      subtitle: "Camino ancestral y ciudadelas perdidas",
      description:
        "Sigue los pasos de los antiguos incas por senderos milenarios hasta llegar a ciudadelas ocultas en los Andes.",
      image: "https://images.unsplash.com/photo-1526392060635-9d6019884377?q=80&w=1000&auto=format&fit=crop",
      duration: "10D/9N",
      difficulty: "Difícil" as const,
      tourType: "Premium" as const,
      price: "$1,899",
      rating: 4.8,
      destinations: ["Cusco", "Ollantaytambo", "Choquequirao", "Aguas Calientes"],
      highlights: ["Choquequirao Trek", "Machu Picchu", "Camping Andino", "Paisajes Épicos"],
      included: ["Camping completo", "Porteadores", "Cocinero", "Guía especializado"],
    },
    {
      id: 9,
      title: "PERÚ PROFUNDO",
      subtitle: "Culturas vivas y tradiciones ancestrales",
      description:
        "Conoce el Perú más auténtico visitando comunidades remotas donde las tradiciones ancestrales siguen vivas.",
      image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=1000&auto=format&fit=crop",
      duration: "12D/11N",
      difficulty: "Moderado" as const,
      tourType: "Clásico" as const,
      price: "$1,699",
      rating: 4.7,
      destinations: ["Cusco", "Puno", "Ayacucho", "Huancayo", "Apurímac"],
      highlights: ["Convivencia Comunitaria", "Textilería Ancestral", "Ceremonias Andinas", "Medicina Tradicional"],
      included: ["Hoteles locales", "Experiencias comunitarias", "Guías locales", "Todas las comidas"],
    },
  ],
}

const durations = ["Corta Duración", "Duración Media", "Larga Duración"]

export default function ItinerariesPage() {
  const [activeDuration, setActiveDuration] = useState("Corta Duración")
  const currentItineraries = itinerariesByDuration[activeDuration as keyof typeof itinerariesByDuration]
  const { t } = useLanguage()

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src="https://res.cloudinary.com/dwvikvjrq/image/upload/v1748624876/banner_waz5ov.jpg"
            alt={t.adventurerImageAlt}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>
        {/* Hero Content */}
        <div className="relative z-10 text-center text-white px-4 max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-light mb-6 brand-text leading-none">
              {t.itineraries}
              <br />
              <span className="text-peru-gold">{t.peru}</span>
            </h1>
            <p className="text-xl md:text-2xl lg:text-3xl font-light mb-8 body-text max-w-4xl mx-auto leading-relaxed">
              {t.itinerariesHeroSubtitle}
            </p>
            <motion.button
              className="px-8 py-4 bg-peru-orange text-white brand-text text-lg hover:bg-peru-orange/90 transition-all duration-300 group"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {t.exploreItineraries}
              <ArrowRight className="inline-block ml-2 group-hover:translate-x-1 transition-transform" size={20} />
            </motion.button>
          </motion.div>
          {/* Scroll Indicator */}
          <motion.div
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
          >
            <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
              <div className="w-1 h-3 bg-white rounded-full mt-2"></div>
            </div>
          </motion.div>
        </div>
      </section>
      {/* Stats Section */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { number: "50+", label: t.uniqueItineraries },
              { number: "15", label: t.yearsOfExperience },
              { number: "10,000+", label: t.happyTravelers },
              { number: "4.9", label: t.averageRating },
            ].map((stat, index) => (
              <motion.div
                key={index}
                className="text-center"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="text-3xl md:text-4xl lg:text-5xl font-bold text-peru-orange brand-text mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 body-text text-sm md:text-base">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      {/* Duration Selection */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-light text-black mb-6 brand-text">
              {t.chooseYourAdventure.split(" ")[0]}{" "}
              <span className="text-peru-orange">{t.chooseYourAdventure.split(" ")[1]}</span>
            </h2>
            <p className="text-lg md:text-xl text-gray-600 body-text max-w-3xl mx-auto">{t.chooseAdventureSubtitle}</p>
          </motion.div>
          {/* Duration Tabs */}
          <motion.div
            className="flex justify-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-0 bg-white shadow-lg rounded-lg p-2">
              {durations.map((duration) => (
                <motion.button
                  key={duration}
                  onClick={() => setActiveDuration(duration)}
                  className={`px-6 md:px-8 py-4 text-sm md:text-base font-medium tracking-wider transition-all duration-300 rounded-md ${
                    activeDuration === duration
                      ? "bg-peru-orange text-white shadow-md"
                      : "text-gray-600 hover:text-peru-orange hover:bg-peru-orange/5"
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {duration}
                </motion.button>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
      {/* Itineraries Grid */}
      <section className="pb-16 md:pb-24">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <motion.div
            key={`itineraries-${activeDuration}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8"
          >
            {currentItineraries.map((itinerary, index) => (
              <motion.div
                key={itinerary.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group"
              >
                {/* Image */}
                <div className="relative h-64 overflow-hidden">
                  <Image
                    src={itinerary.image || "/placeholder.svg"}
                    alt={itinerary.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  {/* Badges */}
                  <div className="absolute top-4 left-4 right-4 flex justify-between">
                    <span className="bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-medium brand-text flex items-center">
                      <Clock size={12} className="mr-1 text-peru-orange" />
                      {itinerary.duration}
                    </span>
                    <span
                      className={`px-3 py-1.5 rounded-full text-xs font-medium brand-text ${
                        itinerary.tourType === "Premium" ? "bg-peru-gold text-white" : "bg-peru-orange text-white"
                      }`}
                    >
                      {itinerary.tourType}
                    </span>
                  </div>
                  {/* Price */}
                  <div className="absolute bottom-4 right-4">
                    <div className="bg-white/95 backdrop-blur-sm px-3 py-2 rounded-lg">
                      <div className="text-xs text-gray-600 body-text">{t.from}</div>
                      <div className="text-lg font-bold text-peru-orange brand-text">{itinerary.price}</div>
                    </div>
                  </div>
                  {/* Title */}
                  <div className="absolute bottom-4 left-4">
                    <h3 className="text-xl font-bold text-white brand-text mb-1">{itinerary.title}</h3>
                    <div className="flex items-center text-white/90">
                      <Star size={14} className="text-yellow-400 mr-1" fill="currentColor" />
                      <span className="text-sm body-text">{itinerary.rating}</span>
                    </div>
                  </div>
                </div>
                {/* Content */}
                <div className="p-6">
                  <h4 className="text-lg font-medium text-gray-800 brand-text mb-2">{itinerary.subtitle}</h4>
                  <p className="text-gray-600 body-text text-sm leading-relaxed mb-4">{itinerary.description}</p>
                  {/* Highlights */}
                  <div className="mb-4">
                    <h5 className="text-sm font-medium text-gray-800 brand-text mb-2">{t.mainHighlights}</h5>
                    <div className="space-y-1">
                      {itinerary.highlights.slice(0, 3).map((highlight, idx) => (
                        <div key={idx} className="flex items-center text-xs text-gray-600">
                          <CheckCircle size={12} className="text-green-500 mr-2 flex-shrink-0" />
                          <span className="body-text">{highlight}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  {/* Destinations */}
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-1">
                      {itinerary.destinations.slice(0, 3).map((destination, idx) => (
                        <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs body-text rounded">
                          {destination}
                        </span>
                      ))}
                      {itinerary.destinations.length > 3 && (
                        <span className="px-2 py-1 bg-peru-orange/10 text-peru-orange text-xs body-text rounded">
                          +{itinerary.destinations.length - 3}{" "}
                          {t.plusMore.replace("{count}", (itinerary.destinations.length - 3).toString())}
                        </span>
                      )}
                    </div>
                  </div>
                  {/* Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <div className="flex items-center">
                        <Users size={12} className="mr-1" />
                        <span className="body-text">{t.group}</span>
                      </div>
                      <div className="flex items-center">
                        <Calendar size={12} className="mr-1" />
                        <span className="body-text">
                          {itinerary.difficulty === "Fácil" && t.difficultyFacil}
                          {itinerary.difficulty === "Moderado" && t.difficultyModerado}
                          {itinerary.difficulty === "Difícil" && t.difficultyDificil}
                        </span>
                      </div>
                    </div>
                    <motion.button
                      className="text-peru-orange hover:text-peru-orange/80 text-sm font-medium brand-text flex items-center group"
                      whileHover={{ x: 5 }}
                    >
                      {t.viewDetails}
                      <ArrowRight size={14} className="ml-1 group-hover:translate-x-1 transition-transform" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
      {/* Why Choose Us */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-light text-black mb-6 brand-text">
              {t.whyChooseOurItineraries.split(" ")[0]} {t.whyChooseOurItineraries.split(" ")[1]}{" "}
              {t.whyChooseOurItineraries.split(" ")[2]}{" "}
              <span className="text-peru-orange">{t.whyChooseOurItineraries.split(" ")[3]}</span>?
            </h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <MapPin className="text-peru-orange" size={32} />,
                title: t.exclusiveRoutes,
                description: t.exclusiveRoutesDescription,
              },
              {
                icon: <Users className="text-peru-orange" size={32} />,
                title: t.smallGroups,
                description: t.smallGroupsDescription,
              },
              {
                icon: <Star className="text-peru-orange" size={32} />,
                title: t.guaranteedQuality,
                description: t.guaranteedQualityDescription,
              },
              {
                icon: <Clock className="text-peru-orange" size={32} />,
                title: t.totalFlexibility,
                description: t.totalFlexibilityDescription,
              },
              {
                icon: <CheckCircle className="text-peru-orange" size={32} />,
                title: t.allInclusive,
                description: t.allInclusiveDescription,
              },
              {
                icon: <Camera className="text-peru-orange" size={32} />,
                title: t.uniqueExperiences,
                description: t.uniqueExperiencesDescription,
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="text-center p-6"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="flex justify-center mb-4">{feature.icon}</div>
                <h3 className="text-xl font-medium text-gray-800 brand-text mb-3">{feature.title}</h3>
                <p className="text-gray-600 body-text leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-peru-dark text-white">
        <div className="max-w-4xl mx-auto text-center px-4 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-light mb-6 brand-text leading-tight">
              {t.readyForAdventure.split(" ")[0]} {t.readyForAdventure.split(" ")[1]}{" "}
              {t.readyForAdventure.split(" ")[2]} <br />
              <span className="text-peru-gold">{t.readyForAdventure.split(" ")[3]}</span>?
            </h2>
            <p className="text-lg md:text-xl body-text mb-8 max-w-2xl mx-auto opacity-90">
              {t.readyForAdventureSubtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                className="px-8 py-4 bg-peru-orange text-white brand-text text-lg hover:bg-peru-orange/90 transition-all duration-300 group"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {t.consultItinerary}
                <ArrowRight className="inline-block ml-2 group-hover:translate-x-1 transition-transform" size={20} />
              </motion.button>
              <motion.button
                className="px-8 py-4 border-2 border-white text-white brand-text text-lg hover:bg-white hover:text-peru-dark transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {t.speakToExpert}
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
