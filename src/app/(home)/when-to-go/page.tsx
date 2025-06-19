"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import { Sun, Cloud, CloudRain, Thermometer, Calendar, MapPin, Users, Camera, Umbrella, Info } from "lucide-react"

// Datos de las estaciones y regiones
const seasonalData = {
  "Temporada Seca": {
    months: "Mayo - Septiembre",
    description: "La mejor época para visitar la mayoría del Perú",
    icon: Sun,
    color: "text-yellow-500",
    bgColor: "bg-yellow-50",
    regions: [
      {
        name: "Costa",
        weather: "Soleado y seco",
        temperature: "18°C - 25°C",
        description: "Cielos despejados, ideal para actividades al aire libre",
        activities: ["Playas", "Deportes acuáticos", "Senderismo costero"],
        clothing: ["Ropa ligera", "Protector solar", "Sombrero"],
        image: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=1000&auto=format&fit=crop",
      },
      {
        name: "Sierra",
        weather: "Seco y fresco",
        temperature: "5°C - 20°C",
        description: "Días soleados, noches frías, perfectos para trekking",
        activities: ["Machu Picchu", "Camino Inca", "City tours"],
        clothing: ["Capas de ropa", "Chaqueta abrigada", "Zapatos de trekking"],
        image: "https://images.unsplash.com/photo-1587595431973-160d0d94add1?q=80&w=1000&auto=format&fit=crop",
      },
      {
        name: "Selva",
        weather: "Menos lluvias",
        temperature: "22°C - 32°C",
        description: "Menor precipitación, mejor para navegación",
        activities: ["Safari amazónico", "Observación de fauna", "Navegación"],
        clothing: ["Ropa ligera", "Repelente", "Botas impermeables"],
        image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=1000&auto=format&fit=crop",
      },
    ],
  },
  "Temporada de Lluvias": {
    months: "Octubre - Abril",
    description: "Paisajes verdes y menos turistas",
    icon: CloudRain,
    color: "text-blue-500",
    bgColor: "bg-blue-50",
    regions: [
      {
        name: "Costa",
        weather: "Nublado y húmedo",
        temperature: "15°C - 22°C",
        description: "Garúa limeña, ambiente romántico",
        activities: ["Museos", "Gastronomía", "Vida nocturna"],
        clothing: ["Ropa abrigada", "Chaqueta ligera", "Paraguas"],
        image: "https://images.unsplash.com/photo-1587595431973-160d0d94add1?q=80&w=1000&auto=format&fit=crop",
      },
      {
        name: "Sierra",
        weather: "Lluvioso",
        temperature: "3°C - 18°C",
        description: "Paisajes verdes, pero senderos difíciles",
        activities: ["Ciudades coloniales", "Museos", "Mercados"],
        clothing: ["Ropa impermeable", "Botas", "Poncho"],
        image: "https://images.unsplash.com/photo-1531065208531-4036c0dba3ca?q=80&w=1000&auto=format&fit=crop",
      },
      {
        name: "Selva",
        weather: "Muy lluvioso",
        temperature: "24°C - 35°C",
        description: "Ríos altos, exuberante vegetación",
        activities: ["Lodges", "Observación de aves", "Pesca"],
        clothing: ["Ropa impermeable", "Botas altas", "Poncho"],
        image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=1000&auto=format&fit=crop",
      },
    ],
  },
}

// Datos mensuales detallados
const monthlyData = [
  {
    month: "Enero",
    season: "Lluvias",
    coast: { temp: "20-26°C", weather: "Nublado", rain: "Baja", icon: Cloud },
    sierra: { temp: "5-18°C", weather: "Lluvioso", rain: "Alta", icon: CloudRain },
    jungle: { temp: "24-32°C", weather: "Muy lluvioso", rain: "Muy alta", icon: CloudRain },
    tourism: "Baja",
    highlights: ["Menos turistas", "Paisajes verdes", "Precios bajos"],
    avoid: ["Camino Inca cerrado", "Senderos difíciles"],
  },
  {
    month: "Febrero",
    season: "Lluvias",
    coast: { temp: "21-27°C", weather: "Nublado", rain: "Baja", icon: Cloud },
    sierra: { temp: "5-18°C", weather: "Lluvioso", rain: "Muy alta", icon: CloudRain },
    jungle: { temp: "24-32°C", weather: "Muy lluvioso", rain: "Muy alta", icon: CloudRain },
    tourism: "Baja",
    highlights: ["Carnavales", "Menos multitudes"],
    avoid: ["Camino Inca cerrado", "Inundaciones posibles"],
  },
  {
    month: "Marzo",
    season: "Lluvias",
    coast: { temp: "20-26°C", weather: "Nublado", rain: "Baja", icon: Cloud },
    sierra: { temp: "5-18°C", weather: "Lluvioso", rain: "Alta", icon: CloudRain },
    jungle: { temp: "24-32°C", weather: "Lluvioso", rain: "Alta", icon: CloudRain },
    tourism: "Baja",
    highlights: ["Fin de lluvias", "Paisajes verdes"],
    avoid: ["Senderos embarrados"],
  },
  {
    month: "Abril",
    season: "Transición",
    coast: { temp: "18-24°C", weather: "Mixto", rain: "Baja", icon: Cloud },
    sierra: { temp: "5-19°C", weather: "Mixto", rain: "Media", icon: Cloud },
    jungle: { temp: "23-31°C", weather: "Lluvioso", rain: "Media", icon: CloudRain },
    tourism: "Media",
    highlights: ["Transición", "Buen clima", "Pocos turistas"],
    avoid: ["Clima impredecible"],
  },
  {
    month: "Mayo",
    season: "Seca",
    coast: { temp: "16-22°C", weather: "Seco", rain: "Muy baja", icon: Sun },
    sierra: { temp: "3-20°C", weather: "Seco", rain: "Muy baja", icon: Sun },
    jungle: { temp: "22-30°C", weather: "Seco", rain: "Baja", icon: Sun },
    tourism: "Alta",
    highlights: ["Inicio temporada seca", "Excelente clima", "Camino Inca abierto"],
    avoid: ["Más turistas"],
  },
  {
    month: "Junio",
    season: "Seca",
    coast: { temp: "15-20°C", weather: "Seco", rain: "Muy baja", icon: Sun },
    sierra: { temp: "2-20°C", weather: "Seco", rain: "Muy baja", icon: Sun },
    jungle: { temp: "21-29°C", weather: "Seco", rain: "Baja", icon: Sun },
    tourism: "Muy alta",
    highlights: ["Mejor clima", "Inti Raymi", "Cielos despejados"],
    avoid: ["Multitudes", "Precios altos"],
  },
  {
    month: "Julio",
    season: "Seca",
    coast: { temp: "14-19°C", weather: "Seco", rain: "Muy baja", icon: Sun },
    sierra: { temp: "1-20°C", weather: "Seco", rain: "Muy baja", icon: Sun },
    jungle: { temp: "20-28°C", weather: "Seco", rain: "Baja", icon: Sun },
    tourism: "Muy alta",
    highlights: ["Temporada alta", "Clima perfecto"],
    avoid: ["Multitudes", "Reservas necesarias"],
  },
  {
    month: "Agosto",
    season: "Seca",
    coast: { temp: "14-19°C", weather: "Seco", rain: "Muy baja", icon: Sun },
    sierra: { temp: "2-21°C", weather: "Seco", rain: "Muy baja", icon: Sun },
    jungle: { temp: "21-29°C", weather: "Seco", rain: "Baja", icon: Sun },
    tourism: "Muy alta",
    highlights: ["Excelente clima", "Vientos fuertes en sierra"],
    avoid: ["Vientos en montaña", "Multitudes"],
  },
  {
    month: "Septiembre",
    season: "Seca",
    coast: { temp: "15-20°C", weather: "Seco", rain: "Muy baja", icon: Sun },
    sierra: { temp: "3-21°C", weather: "Seco", rain: "Muy baja", icon: Sun },
    jungle: { temp: "22-30°C", weather: "Seco", rain: "Baja", icon: Sun },
    tourism: "Alta",
    highlights: ["Fin temporada seca", "Menos turistas", "Buen clima"],
    avoid: ["Vientos ocasionales"],
  },
  {
    month: "Octubre",
    season: "Transición",
    coast: { temp: "16-22°C", weather: "Mixto", rain: "Baja", icon: Cloud },
    sierra: { temp: "5-20°C", weather: "Mixto", rain: "Media", icon: Cloud },
    jungle: { temp: "23-31°C", weather: "Lluvioso", rain: "Media", icon: CloudRain },
    tourism: "Media",
    highlights: ["Inicio lluvias", "Menos turistas", "Paisajes cambiantes"],
    avoid: ["Clima impredecible"],
  },
  {
    month: "Noviembre",
    season: "Lluvias",
    coast: { temp: "17-23°C", weather: "Nublado", rain: "Baja", icon: Cloud },
    sierra: { temp: "5-19°C", weather: "Lluvioso", rain: "Alta", icon: CloudRain },
    jungle: { temp: "24-32°C", weather: "Lluvioso", rain: "Alta", icon: CloudRain },
    tourism: "Baja",
    highlights: ["Paisajes verdes", "Menos turistas"],
    avoid: ["Senderos difíciles"],
  },
  {
    month: "Diciembre",
    season: "Lluvias",
    coast: { temp: "19-25°C", weather: "Nublado", rain: "Baja", icon: Cloud },
    sierra: { temp: "5-18°C", weather: "Lluvioso", rain: "Alta", icon: CloudRain },
    jungle: { temp: "24-32°C", weather: "Lluvioso", rain: "Alta", icon: CloudRain },
    tourism: "Media",
    highlights: ["Fiestas navideñas", "Menos turistas"],
    avoid: ["Lluvias frecuentes"],
  },
]

// Destinos específicos y sus mejores épocas
const destinationData = [
  {
    name: "Machu Picchu",
    bestMonths: ["Mayo", "Junio", "Julio", "Agosto", "Septiembre"],
    avoidMonths: ["Enero", "Febrero"],
    description: "La ciudadela inca es mejor visitada durante la temporada seca",
    image: "https://images.unsplash.com/photo-1587595431973-160d0d94add1?q=80&w=1000&auto=format&fit=crop",
    tips: [
      "Reservar con 3-4 meses de anticipación",
      "El Camino Inca cierra en febrero",
      "Llevar ropa abrigada para las mañanas",
    ],
  },
  {
    name: "Amazonas",
    bestMonths: ["Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre"],
    avoidMonths: ["Enero", "Febrero", "Marzo"],
    description: "Mejor navegación y observación de fauna en temporada seca",
    image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=1000&auto=format&fit=crop",
    tips: [
      "Ríos más bajos facilitan la navegación",
      "Mayor concentración de animales",
      "Menos mosquitos en temporada seca",
    ],
  },
  {
    name: "Cañón del Colca",
    bestMonths: ["Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre"],
    avoidMonths: ["Diciembre", "Enero", "Febrero"],
    description: "Ideal para observar cóndores y hacer trekking",
    image: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=1000&auto=format&fit=crop",
    tips: ["Cóndores más activos en la mañana", "Llevar ropa abrigada", "Evitar época de lluvias para trekking"],
  },
  {
    name: "Líneas de Nazca",
    bestMonths: ["Todo el año"],
    avoidMonths: [],
    description: "El desierto ofrece condiciones estables todo el año",
    image: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=1000&auto=format&fit=crop",
    tips: ["Vuelos pueden cancelarse por vientos fuertes", "Mejor visibilidad en mañanas", "Llevar protector solar"],
  },
  {
    name: "Lago Titicaca",
    bestMonths: ["Mayo", "Junio", "Julio", "Agosto", "Septiembre"],
    avoidMonths: ["Diciembre", "Enero", "Febrero"],
    description: "Cielos despejados para disfrutar las islas flotantes",
    image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=1000&auto=format&fit=crop",
    tips: ["Noches muy frías en temporada seca", "Llevar ropa abrigada", "Protección solar por la altitud"],
  },
  {
    name: "Costa Norte",
    bestMonths: ["Diciembre", "Enero", "Febrero", "Marzo", "Abril"],
    avoidMonths: ["Junio", "Julio", "Agosto"],
    description: "Playas cálidas durante el verano costeño",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=1000&auto=format&fit=crop",
    tips: ["Temporada de playa en verano", "Evitar invierno costeño", "Ideal para deportes acuáticos"],
  },
]

export default function WhenToGoPage() {
  const [activeTab, setActiveTab] = useState<"seasons" | "monthly" | "destinations">("seasons")
  const [selectedSeason, setSelectedSeason] = useState<"Temporada Seca" | "Temporada de Lluvias">("Temporada Seca")

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative h-[60vh] md:h-[70vh]">
        <Image
          src="https://images.unsplash.com/photo-1587595431973-160d0d94add1?q=80&w=1000&auto=format&fit=crop"
          alt="Paisajes del Perú en diferentes estaciones"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12">
          <div className="max-w-7xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-light text-white leading-none brand-text mb-4">
                Cuándo Viajar al Perú
              </h1>
              <p className="text-lg md:text-xl text-white/90 body-text max-w-3xl">
                Descubre la mejor época para visitar cada región del Perú y planifica tu viaje perfecto según el clima,
                las actividades y tus preferencias.
              </p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="sticky top-32 bg-white/95 backdrop-blur-sm border-b border-gray-200 z-40">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <nav className="flex space-x-8">
            {[
              { key: "seasons" as const, label: "Por Estaciones", icon: Sun },
              { key: "monthly" as const, label: "Mes a Mes", icon: Calendar },
              { key: "destinations" as const, label: "Por Destinos", icon: MapPin },
            ].map((tab) => {
              const IconComponent = tab.icon
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`py-4 px-2 border-b-2 font-medium text-sm brand-text transition-colors flex items-center space-x-2 ${
                    activeTab === tab.key
                      ? "border-peru-orange text-peru-orange"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <IconComponent size={18} />
                  <span>{tab.label}</span>
                </button>
              )
            })}
          </nav>
        </div>
      </div>

      {/* Content Sections */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
        {/* Seasons Tab */}
        {activeTab === "seasons" && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            {/* Season Selector */}
            <div className="flex justify-center mb-12">
              <div className="flex bg-gray-100 p-1 rounded-lg">
                {Object.keys(seasonalData).map((season) => {
                  const seasonKey = season as keyof typeof seasonalData
                  const IconComponent = seasonalData[seasonKey].icon
                  return (
                    <button
                      key={season}
                      onClick={() => setSelectedSeason(seasonKey)}
                      className={`px-6 py-3 rounded-md flex items-center space-x-2 transition-all duration-300 ${
                        selectedSeason === season ? "bg-white shadow-md text-black" : "text-gray-600 hover:text-black"
                      }`}
                    >
                      <IconComponent size={20} className={seasonalData[seasonKey].color} />
                      <span className="brand-text font-medium">{season}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Season Content */}
            <div className="mb-12">
              <div className="text-center mb-8">
                <h2 className="text-3xl md:text-4xl font-light text-black brand-text mb-4">{selectedSeason}</h2>
                <div className="flex items-center justify-center space-x-4 mb-4">
                  <Calendar size={20} className="text-peru-orange" />
                  <span className="text-lg body-text text-gray-600">{seasonalData[selectedSeason].months}</span>
                </div>
                <p className="text-lg body-text text-gray-600 max-w-2xl mx-auto">
                  {seasonalData[selectedSeason].description}
                </p>
              </div>

              {/* Regions Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {seasonalData[selectedSeason].regions.map((region, index) => (
                  <motion.div
                    key={region.name}
                    className="bg-white shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    {/* Region Image */}
                    <div className="relative h-48">
                      <Image src={region.image || "/placeholder.svg"} alt={region.name} fill className="object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute bottom-4 left-4">
                        <h3 className="text-xl font-bold text-white brand-text">{region.name}</h3>
                      </div>
                    </div>

                    {/* Region Content */}
                    <div className="p-6">
                      {/* Weather Info */}
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <div className="flex items-center space-x-2 mb-1">
                            <Cloud size={16} className="text-gray-500" />
                            <span className="text-sm font-medium text-gray-700 brand-text">Clima</span>
                          </div>
                          <p className="text-sm text-gray-600 body-text">{region.weather}</p>
                        </div>
                        <div>
                          <div className="flex items-center space-x-2 mb-1">
                            <Thermometer size={16} className="text-gray-500" />
                            <span className="text-sm font-medium text-gray-700 brand-text">Temperatura</span>
                          </div>
                          <p className="text-sm text-gray-600 body-text">{region.temperature}</p>
                        </div>
                      </div>

                      <p className="text-gray-600 body-text mb-4">{region.description}</p>

                      {/* Activities */}
                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-700 brand-text mb-2 flex items-center">
                          <Camera size={14} className="mr-1" />
                          Actividades recomendadas
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {region.activities.map((activity, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-1 bg-peru-orange/10 text-peru-orange text-xs body-text rounded"
                            >
                              {activity}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Clothing */}
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 brand-text mb-2 flex items-center">
                          <Users size={14} className="mr-1" />
                          Qué llevar
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {region.clothing.map((item, idx) => (
                            <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs body-text rounded">
                              {item}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Monthly Tab */}
        {activeTab === "monthly" && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-light text-black brand-text mb-4">Clima Mes a Mes</h2>
              <p className="text-lg body-text text-gray-600 max-w-3xl mx-auto">
                Información detallada del clima en cada región del Perú durante todo el año para planificar tu viaje
                perfecto.
              </p>
            </div>

            {/* Monthly Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {monthlyData.map((month, index) => (
                <motion.div
                  key={month.month}
                  className="bg-white shadow-lg hover:shadow-xl transition-all duration-300 p-6"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.05 }}
                >
                  {/* Month Header */}
                  <div className="text-center mb-4">
                    <h3 className="text-xl font-bold text-black brand-text mb-1">{month.month}</h3>
                    <span
                      className={`px-3 py-1 text-xs brand-text rounded-full ${
                        month.season === "Seca"
                          ? "bg-yellow-100 text-yellow-700"
                          : month.season === "Lluvias"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {month.season}
                    </span>
                  </div>

                  {/* Regions Weather */}
                  <div className="space-y-3 mb-4">
                    {[
                      { name: "Costa", data: month.coast },
                      { name: "Sierra", data: month.sierra },
                      { name: "Selva", data: month.jungle },
                    ].map((region) => {
                      const IconComponent = region.data.icon
                      return (
                        <div key={region.name} className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <IconComponent size={16} className="text-gray-500" />
                            <span className="text-sm font-medium text-gray-700 brand-text">{region.name}</span>
                          </div>
                          <span className="text-xs text-gray-600 body-text">{region.data.temp}</span>
                        </div>
                      )
                    })}
                  </div>

                  {/* Tourism Level */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700 brand-text">Turismo</span>
                      <span
                        className={`px-2 py-1 text-xs brand-text rounded ${
                          month.tourism === "Muy alta"
                            ? "bg-red-100 text-red-700"
                            : month.tourism === "Alta"
                              ? "bg-orange-100 text-orange-700"
                              : month.tourism === "Media"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-green-100 text-green-700"
                        }`}
                      >
                        {month.tourism}
                      </span>
                    </div>
                  </div>

                  {/* Highlights */}
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 brand-text mb-2">Ventajas</h4>
                    <ul className="space-y-1">
                      {month.highlights.map((highlight, idx) => (
                        <li key={idx} className="flex items-start text-xs text-gray-600">
                          <div className="w-1 h-1 bg-green-500 rounded-full mt-2 mr-2 flex-shrink-0" />
                          <span className="body-text">{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Avoid */}
                  {month.avoid && month.avoid.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 brand-text mb-2">Considerar</h4>
                      <ul className="space-y-1">
                        {month.avoid.map((item, idx) => (
                          <li key={idx} className="flex items-start text-xs text-gray-600">
                            <div className="w-1 h-1 bg-orange-500 rounded-full mt-2 mr-2 flex-shrink-0" />
                            <span className="body-text">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Destinations Tab */}
        {activeTab === "destinations" && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-light text-black brand-text mb-4">Mejor Época por Destino</h2>
              <p className="text-lg body-text text-gray-600 max-w-3xl mx-auto">
                Cada destino del Perú tiene su época ideal. Descubre cuándo visitar cada lugar para vivir la mejor
                experiencia.
              </p>
            </div>

            {/* Destinations Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {destinationData.map((destination, index) => (
                <motion.div
                  key={destination.name}
                  className="bg-white shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  {/* Destination Image */}
                  <div className="relative h-64">
                    <Image
                      src={destination.image || "/placeholder.svg"}
                      alt={destination.name}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-4 left-4">
                      <h3 className="text-2xl font-bold text-white brand-text">{destination.name}</h3>
                    </div>
                  </div>

                  {/* Destination Content */}
                  <div className="p-6">
                    <p className="text-gray-600 body-text mb-6">{destination.description}</p>

                    {/* Best Months */}
                    <div className="mb-6">
                      <h4 className="text-sm font-medium text-gray-700 brand-text mb-3 flex items-center">
                        <Sun size={16} className="mr-2 text-green-500" />
                        Mejores meses
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {destination.bestMonths.map((month, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 bg-green-100 text-green-700 text-sm body-text rounded-full"
                          >
                            {month}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Avoid Months */}
                    {destination.avoidMonths.length > 0 && (
                      <div className="mb-6">
                        <h4 className="text-sm font-medium text-gray-700 brand-text mb-3 flex items-center">
                          <Umbrella size={16} className="mr-2 text-red-500" />
                          Meses a evitar
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {destination.avoidMonths.map((month, idx) => (
                            <span
                              key={idx}
                              className="px-3 py-1 bg-red-100 text-red-700 text-sm body-text rounded-full"
                            >
                              {month}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Tips */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 brand-text mb-3 flex items-center">
                        <Info size={16} className="mr-2 text-blue-500" />
                        Consejos útiles
                      </h4>
                      <ul className="space-y-2">
                        {destination.tips.map((tip, idx) => (
                          <li key={idx} className="flex items-start text-sm text-gray-600">
                            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0" />
                            <span className="body-text">{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
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
              ¿Listo para planificar tu viaje?
            </h2>
            <p className="text-lg md:text-xl text-gray-600 body-text mb-8 max-w-2xl mx-auto">
              Ahora que conoces la mejor época para viajar, es momento de elegir tu aventura perfecta por el Perú.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                className="px-8 py-4 bg-peru-orange text-white brand-text text-lg hover:bg-peru-orange/90 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                VER TOURS DISPONIBLES
              </motion.button>
              <motion.button
                className="px-8 py-4 border-2 border-peru-dark text-peru-dark brand-text text-lg hover:bg-peru-dark hover:text-white transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                CONSULTAR EXPERTO
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
