"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import { MapPin, Clock, Camera } from "lucide-react"

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
      destinations: ["Lima Centro", "Miraflores", "Barranco", "San Isidro"],
      activities: ["City tour", "Tour gastronómico", "Museos", "Vida nocturna"],
      dayByDay: [
        {
          day: 1,
          title: "LLEGADA A LIMA - CENTRO HISTÓRICO",
          location: "Lima Centro",
          activities: [
            "Recepción en el aeropuerto Jorge Chávez",
            "Traslado al hotel en Miraflores",
            "Tour por el Centro Histórico de Lima",
            "Visita a la Plaza Mayor y Catedral",
            "Cena de bienvenida con show folclórico",
          ],
        },
        {
          day: 2,
          title: "LIMA MODERNA - BARRANCO Y GASTRONOMÍA",
          location: "Miraflores - Barranco",
          activities: [
            "Tour por Miraflores y el Malecón",
            "Exploración del bohemio distrito de Barranco",
            "Tour gastronómico por mercados locales",
            "Degustación de pisco y cócteles peruanos",
            "Cena en restaurante de autor",
          ],
        },
        {
          day: 3,
          title: "MUSEOS Y DESPEDIDA",
          location: "Lima - Aeropuerto",
          activities: [
            "Visita al Museo Larco Herrera",
            "Tiempo libre para compras",
            "Almuerzo de despedida",
            "Traslado al aeropuerto",
          ],
        },
      ],
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
      destinations: ["Cusco", "Valle Sagrado", "Pisac", "Ollantaytambo"],
      activities: ["Sitios arqueológicos", "Mercados locales", "Textilería", "Gastronomía andina"],
      dayByDay: [
        {
          day: 1,
          title: "LLEGADA A CUSCO",
          location: "Cusco",
          activities: [
            "Recepción en aeropuerto",
            "Traslado al hotel",
            "Tiempo de aclimatación",
            "Caminata suave por San Blas",
          ],
        },
        {
          day: 2,
          title: "CITY TOUR CUSCO",
          location: "Cusco",
          activities: ["Visita a Qorikancha", "Tour por Sacsayhuamán", "Exploración de Q'enqo", "Mercado de San Pedro"],
        },
        {
          day: 3,
          title: "VALLE SAGRADO",
          location: "Valle Sagrado",
          activities: [
            "Mercado de Pisac",
            "Sitio arqueológico de Pisac",
            "Almuerzo en Urubamba",
            "Fortaleza de Ollantaytambo",
          ],
        },
        {
          day: 4,
          title: "DESPEDIDA",
          location: "Cusco - Aeropuerto",
          activities: ["Tiempo libre para compras", "Traslado al aeropuerto"],
        },
      ],
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
      destinations: ["Arequipa", "Colca", "Chivay", "Yanque"],
      activities: ["Arquitectura colonial", "Observación de cóndores", "Aguas termales", "Pueblos tradicionales"],
      dayByDay: [
        {
          day: 1,
          title: "LLEGADA A AREQUIPA",
          location: "Arequipa",
          activities: [
            "Recepción en aeropuerto",
            "City tour por Arequipa",
            "Monasterio de Santa Catalina",
            "Plaza de Armas",
          ],
        },
        {
          day: 2,
          title: "CAMINO AL COLCA",
          location: "Ruta al Colca",
          activities: ["Salida hacia el Colca", "Mirador de volcanes", "Vicuñas en Pampa Cañahuas", "Llegada a Chivay"],
        },
        {
          day: 3,
          title: "CRUZ DEL CÓNDOR",
          location: "Cañón del Colca",
          activities: [
            "Mirador Cruz del Cóndor",
            "Observación de cóndores",
            "Pueblos de Yanque y Maca",
            "Aguas termales La Calera",
          ],
        },
        {
          day: 4,
          title: "RETORNO A AREQUIPA",
          location: "Arequipa - Aeropuerto",
          activities: ["Retorno a Arequipa", "Tiempo libre", "Traslado al aeropuerto"],
        },
      ],
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
      destinations: ["Lima", "Cusco", "Aguas Calientes", "Valle Sagrado"],
      activities: ["Tren a Machu Picchu", "Sitios arqueológicos", "Gastronomía", "Compras"],
      dayByDay: [
        {
          day: 1,
          title: "LLEGADA A LIMA",
          location: "Lima",
          activities: ["Recepción en aeropuerto", "City tour Lima colonial", "Cena de bienvenida"],
        },
        {
          day: 2,
          title: "LIMA MODERNA",
          location: "Lima",
          activities: ["Miraflores y Barranco", "Museos", "Tour gastronómico"],
        },
        {
          day: 3,
          title: "LIMA - CUSCO",
          location: "Cusco",
          activities: ["Vuelo a Cusco", "Aclimatación", "Caminata suave por la ciudad"],
        },
        {
          day: 4,
          title: "CITY TOUR CUSCO",
          location: "Cusco",
          activities: ["Qorikancha", "Sacsayhuamán", "Mercados locales"],
        },
        {
          day: 5,
          title: "VALLE SAGRADO",
          location: "Valle Sagrado",
          activities: ["Pisac", "Ollantaytambo", "Noche en el Valle"],
        },
        {
          day: 6,
          title: "MACHU PICCHU",
          location: "Machu Picchu",
          activities: ["Tren a Aguas Calientes", "Tour guiado Machu Picchu", "Retorno a Cusco"],
        },
        {
          day: 7,
          title: "DESPEDIDA",
          location: "Cusco - Lima",
          activities: ["Vuelo Cusco-Lima", "Conexión internacional"],
        },
      ],
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
      destinations: ["Trujillo", "Chiclayo", "Lambayeque", "Huanchaco"],
      activities: ["Sitios arqueológicos", "Museos", "Playa", "Artesanía"],
      dayByDay: [
        {
          day: 1,
          title: "LLEGADA A TRUJILLO",
          location: "Trujillo",
          activities: ["Recepción", "City tour Trujillo", "Centro histórico"],
        },
        {
          day: 2,
          title: "HUACAS DEL SOL Y LUNA",
          location: "Trujillo",
          activities: ["Huacas Moche", "Museo Huacas de Moche", "Playa Huanchaco"],
        },
        {
          day: 3,
          title: "CHAN CHAN",
          location: "Trujillo",
          activities: ["Ciudadela de Chan Chan", "Museo de sitio", "Huanchaco"],
        },
        {
          day: 4,
          title: "TRUJILLO - CHICLAYO",
          location: "Chiclayo",
          activities: ["Traslado a Chiclayo", "Mercado de Chiclayo", "City tour"],
        },
        {
          day: 5,
          title: "SEÑOR DE SIPÁN",
          location: "Lambayeque",
          activities: ["Museo Tumbas Reales", "Huaca Rajada", "Túcume"],
        },
        {
          day: 6,
          title: "DESPEDIDA",
          location: "Chiclayo - Lima",
          activities: ["Vuelo a Lima", "Conexión internacional"],
        },
      ],
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
      destinations: ["Iquitos", "Pacaya Samiria", "Río Ucayali", "Nauta"],
      activities: ["Navegación", "Observación de fauna", "Pesca", "Comunidades"],
      dayByDay: [
        {
          day: 1,
          title: "LLEGADA A IQUITOS",
          location: "Iquitos",
          activities: ["Recepción", "City tour Iquitos", "Mercado de Belén"],
        },
        {
          day: 2,
          title: "INICIO NAVEGACIÓN",
          location: "Río Amazonas",
          activities: ["Embarque", "Navegación río Amazonas", "Observación de delfines"],
        },
        {
          day: 3,
          title: "PACAYA SAMIRIA",
          location: "Reserva Nacional",
          activities: ["Ingreso a la reserva", "Caminatas en selva", "Pesca de pirañas"],
        },
        {
          day: 4,
          title: "COMUNIDADES NATIVAS",
          location: "Río Ucayali",
          activities: ["Visita comunidad nativa", "Intercambio cultural", "Artesanías"],
        },
        {
          day: 5,
          title: "OBSERVACIÓN NOCTURNA",
          location: "Selva Amazónica",
          activities: ["Caminata nocturna", "Sonidos de la selva", "Observación de caimanes"],
        },
        {
          day: 6,
          title: "RETORNO A IQUITOS",
          location: "Iquitos - Lima",
          activities: ["Retorno a Iquitos", "Vuelo a Lima"],
        },
      ],
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
      destinations: ["Lima", "Cusco", "Puno", "Arequipa", "Iquitos", "Paracas"],
      activities: ["Vuelo Nazca", "Tren Machu Picchu", "Navegación Titicaca", "Safari amazónico"],
      dayByDay: [
        {
          day: 1,
          title: "LLEGADA A LIMA",
          location: "Lima",
          activities: ["Recepción", "City tour Lima", "Cena de bienvenida"],
        },
        {
          day: 2,
          title: "LIMA - PARACAS",
          location: "Paracas",
          activities: ["Traslado a Paracas", "Islas Ballestas", "Reserva Nacional"],
        },
        {
          day: 3,
          title: "LÍNEAS DE NAZCA",
          location: "Nazca",
          activities: ["Sobrevuelo Líneas de Nazca", "Acueductos de Cantalloc"],
        },
        {
          day: 4,
          title: "NAZCA - AREQUIPA",
          location: "Arequipa",
          activities: ["Vuelo a Arequipa", "City tour", "Monasterio Santa Catalina"],
        },
        {
          day: 5,
          title: "CAÑÓN DEL COLCA",
          location: "Colca",
          activities: ["Ruta al Colca", "Pueblos tradicionales", "Chivay"],
        },
        {
          day: 6,
          title: "CRUZ DEL CÓNDOR",
          location: "Colca",
          activities: ["Observación de cóndores", "Aguas termales"],
        },
        {
          day: 7,
          title: "AREQUIPA - PUNO",
          location: "Puno",
          activities: ["Vuelo a Juliaca", "Traslado a Puno", "Lago Titicaca"],
        },
        {
          day: 8,
          title: "ISLAS DEL TITICACA",
          location: "Lago Titicaca",
          activities: ["Islas Uros", "Isla Taquile", "Textilería"],
        },
        {
          day: 9,
          title: "PUNO - CUSCO",
          location: "Cusco",
          activities: ["Tren turístico a Cusco", "Raqchi", "Andahuaylillas"],
        },
        {
          day: 10,
          title: "CITY TOUR CUSCO",
          location: "Cusco",
          activities: ["Qorikancha", "Sacsayhuamán", "San Pedro"],
        },
        {
          day: 11,
          title: "VALLE SAGRADO",
          location: "Valle Sagrado",
          activities: ["Pisac", "Ollantaytambo", "Noche en el Valle"],
        },
        {
          day: 12,
          title: "MACHU PICCHU",
          location: "Machu Picchu",
          activities: ["Tren a Machu Picchu", "Tour guiado", "Retorno a Cusco"],
        },
        {
          day: 13,
          title: "CUSCO - IQUITOS",
          location: "Iquitos",
          activities: ["Vuelo a Iquitos", "Inicio navegación amazónica"],
        },
        {
          day: 14,
          title: "AMAZONAS - LIMA",
          location: "Lima",
          activities: ["Experiencia amazónica", "Vuelo a Lima", "Despedida"],
        },
      ],
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
      destinations: ["Cusco", "Ollantaytambo", "Choquequirao", "Aguas Calientes"],
      activities: ["Trekking", "Camping", "Sitios arqueológicos", "Paisajes andinos"],
      dayByDay: [
        {
          day: 1,
          title: "LLEGADA A CUSCO",
          location: "Cusco",
          activities: ["Recepción", "Aclimatación", "Briefing del trek"],
        },
        {
          day: 2,
          title: "CUSCO - CACHORA",
          location: "Cachora",
          activities: ["Traslado a Cachora", "Inicio del trek", "Campamento Chiquisca"],
        },
        {
          day: 3,
          title: "CHOQUEQUIRAO",
          location: "Choquequirao",
          activities: ["Llegada a Choquequirao", "Exploración del sitio", "Campamento"],
        },
        {
          day: 4,
          title: "EXPLORACIÓN CHOQUEQUIRAO",
          location: "Choquequirao",
          activities: ["Tour completo del sitio", "Terrazas incas", "Llamas de piedra"],
        },
        {
          day: 5,
          title: "CHOQUEQUIRAO - MAIZAL",
          location: "Maizal",
          activities: ["Descenso al río", "Cruce del Apurímac", "Campamento Maizal"],
        },
        {
          day: 6,
          title: "MAIZAL - YANAMA",
          location: "Yanama",
          activities: ["Ascenso a Yanama", "Paisajes andinos", "Campamento"],
        },
        {
          day: 7,
          title: "YANAMA - TOTORA",
          location: "Totora",
          activities: ["Paso de montaña", "Descenso a Totora", "Campamento"],
        },
        {
          day: 8,
          title: "TOTORA - COLLPAPAMPA",
          location: "Collpapampa",
          activities: ["Caminata por selva de nubes", "Campamento final"],
        },
        {
          day: 9,
          title: "MACHU PICCHU",
          location: "Machu Picchu",
          activities: ["Llegada a Machu Picchu", "Tour guiado", "Tren a Cusco"],
        },
        {
          day: 10,
          title: "DESPEDIDA",
          location: "Cusco",
          activities: ["Tiempo libre", "Traslado al aeropuerto"],
        },
      ],
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
      destinations: ["Cusco", "Puno", "Ayacucho", "Huancayo", "Apurímac"],
      activities: ["Convivencia comunitaria", "Textilería", "Agricultura", "Ceremonias andinas"],
      dayByDay: [
        {
          day: 1,
          title: "LLEGADA A CUSCO",
          location: "Cusco",
          activities: ["Recepción", "Aclimatación", "Introducción cultural"],
        },
        {
          day: 2,
          title: "COMUNIDADES DEL CUSCO",
          location: "Maras - Moray",
          activities: ["Salineras de Maras", "Laboratorio agrícola Moray", "Comunidad local"],
        },
        {
          day: 3,
          title: "TEXTILERÍA ANDINA",
          location: "Chinchero",
          activities: ["Técnicas ancestrales", "Teñido natural", "Tejido tradicional"],
        },
        {
          day: 4,
          title: "CUSCO - PUNO",
          location: "Puno",
          activities: ["Ruta del Altiplano", "Paisajes andinos", "Llegada a Puno"],
        },
        {
          day: 5,
          title: "VIDA EN EL TITICACA",
          location: "Lago Titicaca",
          activities: ["Convivencia con familia Uros", "Pesca tradicional", "Totora"],
        },
        {
          day: 6,
          title: "ISLA TAQUILE",
          location: "Taquile",
          activities: ["Textilería masculina", "Organización social", "Reciprocidad"],
        },
        {
          day: 7,
          title: "PUNO - AYACUCHO",
          location: "Ayacucho",
          activities: ["Vuelo a Ayacucho", "Ciudad de las 33 iglesias"],
        },
        {
          day: 8,
          title: "ARTESANÍA AYACUCHANA",
          location: "Ayacucho",
          activities: ["Retablos", "Piedra de Huamanga", "Talleres artesanales"],
        },
        {
          day: 9,
          title: "AYACUCHO - HUANCAYO",
          location: "Huancayo",
          activities: ["Traslado a Huancayo", "Valle del Mantaro"],
        },
        {
          day: 10,
          title: "TRADICIONES DEL MANTARO",
          location: "Huancayo",
          activities: ["Convento de Ocopa", "Artesanías de Cochas", "Danzas folclóricas"],
        },
        {
          day: 11,
          title: "CEREMONIAS ANDINAS",
          location: "Comunidad Andina",
          activities: ["Pago a la Pachamama", "Medicina tradicional", "Cosmovisión andina"],
        },
        {
          day: 12,
          title: "RETORNO A LIMA",
          location: "Lima",
          activities: ["Vuelo a Lima", "Reflexión del viaje", "Despedida"],
        },
      ],
    },
  ],
}

const durations = ["Corta Duración", "Duración Media", "Larga Duración"]

export default function ItinerariesPage() {
  const [activeDuration, setActiveDuration] = useState("Corta Duración")

  const currentItineraries = itinerariesByDuration[activeDuration as keyof typeof itinerariesByDuration]

  const getDurationTitle = (duration: string) => {
    const titles = {
      "Corta Duración": "Escapadas Perfectas de 3-4 Días",
      "Duración Media": "Experiencias Completas de 5-7 Días",
      "Larga Duración": "Aventuras Épicas de 8+ Días",
    }
    return titles[duration as keyof typeof titles]
  }

  const getDurationDescription = (duration: string) => {
    const descriptions = {
      "Corta Duración": "Perfectos para fines de semana largos o vacaciones cortas",
      "Duración Media": "Ideales para conocer lo esencial con tiempo suficiente",
      "Larga Duración": "Para viajeros que buscan experiencias profundas e inmersivas",
    }
    return descriptions[duration as keyof typeof descriptions]
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header Section */}
      <div className="pt-32 pb-8 md:pb-12 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Main Title */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-8 md:mb-12"
          >
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-light text-black leading-none brand-text mb-4">
              Itinerarios del Perú
            </h1>
            <p className="text-lg md:text-xl text-gray-600 body-text max-w-3xl mx-auto">
              Descubre rutas cuidadosamente diseñadas que te llevarán por los destinos más increíbles del Perú. Cada
              itinerario está pensado para ofrecerte una experiencia completa y auténtica.
            </p>
          </motion.div>

          {/* Duration Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex justify-center mb-8"
          >
            <div className="flex flex-wrap justify-center gap-2 md:gap-0 bg-gray-100 p-1 rounded-lg">
              {durations.map((duration, index) => (
                <motion.button
                  key={duration}
                  onClick={() => setActiveDuration(duration)}
                  className={`px-4 md:px-8 py-3 md:py-4 text-sm md:text-base font-medium tracking-wider transition-all duration-300 rounded-md ${
                    activeDuration === duration
                      ? "bg-white text-black shadow-md"
                      : "text-gray-600 hover:text-black hover:bg-white/50"
                  }`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {duration}
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Section Title and Description */}
          <motion.div
            key={`section-title-${activeDuration}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-light text-black leading-tight mb-4 brand-text">
              {getDurationTitle(activeDuration)}
            </h2>
            <p className="text-base md:text-lg text-gray-600 body-text max-w-2xl mx-auto">
              {getDurationDescription(activeDuration)}
            </p>
          </motion.div>
        </div>
      </div>

      {/* Itineraries Grid */}
      <div className="px-4 md:px-8 pb-16">
        <div className="max-w-7xl mx-auto">
          <motion.div
            key={`itineraries-grid-${activeDuration}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 md:gap-12"
          >
            {currentItineraries.map((itinerary, index) => (
              <motion.div
                key={`itinerary-${itinerary.id}`}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
              >
                {/* Header Image */}
                <div className="relative h-64 md:h-80">
                  <Image
                    src={itinerary.image || "/placeholder.svg"}
                    alt={itinerary.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                  {/* Duration Badge */}
                  <div className="absolute top-4 left-4">
                    <div className="bg-white/95 backdrop-blur-sm px-3 py-1.5 flex items-center space-x-2">
                      <Clock size={14} className="text-peru-orange" />
                      <span className="text-xs font-medium text-gray-800 brand-text">{itinerary.duration}</span>
                    </div>
                  </div>

                  {/* Tour Type Badge */}
                  <div className="absolute top-4 right-4">
                    <span
                      className={`px-3 py-1.5 text-xs font-medium brand-text ${
                        itinerary.tourType === "Premium"
                          ? "bg-peru-gold text-white"
                          : itinerary.tourType === "Clásico"
                            ? "bg-peru-orange text-white"
                            : "bg-gray-600 text-white"
                      }`}
                    >
                      {itinerary.tourType}
                    </span>
                  </div>

                  {/* Title Overlay */}
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-xl md:text-2xl font-bold text-white brand-text mb-1">{itinerary.title}</h3>
                    <p className="text-white/90 text-sm md:text-base body-text">{itinerary.subtitle}</p>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 md:p-8">
                  {/* Description */}
                  <p className="text-gray-600 body-text leading-relaxed mb-6">{itinerary.description}</p>

                  {/* Destinations */}
                  <div className="mb-6">
                    <h4 className="text-sm font-medium text-gray-800 brand-text mb-3 flex items-center">
                      <MapPin size={16} className="mr-2 text-peru-orange" />
                      Destinos incluidos
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {itinerary.destinations.map((destination, idx) => (
                        <span key={idx} className="px-3 py-1 bg-gray-100 text-gray-700 text-sm body-text rounded-full">
                          {destination}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Activities */}
                  <div className="mb-6">
                    <h4 className="text-sm font-medium text-gray-800 brand-text mb-3 flex items-center">
                      <Camera size={16} className="mr-2 text-peru-orange" />
                      Actividades principales
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {itinerary.activities.map((activity, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-peru-orange/10 text-peru-orange text-sm body-text rounded-full"
                        >
                          {activity}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Day by Day Itinerary */}
                  <div>
                    <h4 className="text-lg font-medium text-gray-800 brand-text mb-4">Itinerario día a día</h4>
                    <div className="space-y-4">
                      {itinerary.dayByDay.map((day, dayIdx) => (
                        <motion.div
                          key={day.day}
                          className="border-l-3 border-peru-orange/30 pl-4 hover:border-peru-orange transition-colors duration-300"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.4, delay: dayIdx * 0.1 }}
                        >
                          <div className="flex items-center mb-2">
                            <span className="bg-peru-orange text-white px-2 py-1 text-xs brand-text mr-3 rounded">
                              DÍA {day.day}
                            </span>
                            <h5 className="font-medium text-gray-800 brand-text text-sm">{day.title}</h5>
                          </div>

                          <div className="flex items-center text-xs text-gray-500 mb-2">
                            <MapPin size={12} className="mr-1" />
                            <span className="body-text">{day.location}</span>
                          </div>

                          <ul className="space-y-1">
                            {day.activities.slice(0, 3).map((activity, actIdx) => (
                              <li key={actIdx} className="flex items-start text-xs text-gray-600">
                                <div className="w-1 h-1 bg-peru-orange rounded-full mt-2 mr-2 flex-shrink-0" />
                                <span className="body-text">{activity}</span>
                              </li>
                            ))}
                            {day.activities.length > 3 && (
                              <li className="text-xs text-gray-500 body-text ml-3">
                                +{day.activities.length - 3} actividades más
                              </li>
                            )}
                          </ul>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Difficulty Badge */}
                  <div className="mt-6 pt-6 border-t border-gray-200 flex justify-between items-center">
                    <span className="text-sm text-gray-600 body-text">Nivel de dificultad:</span>
                    <span
                      className={`px-3 py-1 text-xs brand-text rounded-full ${
                        itinerary.difficulty === "Fácil"
                          ? "bg-green-100 text-green-700"
                          : itinerary.difficulty === "Moderado"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                      }`}
                    >
                      {itinerary.difficulty}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-gray-50 py-16 md:py-24">
        <div className="max-w-4xl mx-auto text-center px-4 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-light text-black leading-tight mb-6 brand-text">
              ¿Listo para tu próxima aventura?
            </h2>
            <p className="text-lg md:text-xl text-gray-600 body-text mb-8 max-w-2xl mx-auto">
              Estos itinerarios son solo el comienzo. Podemos personalizar cualquier ruta según tus intereses,
              presupuesto y tiempo disponible.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                className="px-8 py-4 bg-peru-orange text-white brand-text text-lg hover:bg-peru-orange/90 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                CONSULTAR ITINERARIO
              </motion.button>
              <motion.button
                className="px-8 py-4 border-2 border-peru-dark text-peru-dark brand-text text-lg hover:bg-peru-dark hover:text-white transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                VER TODOS LOS TOURS
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
