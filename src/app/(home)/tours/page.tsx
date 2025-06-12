"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, Filter, MapPin, Clock, Calendar, Users, ChevronDown, Shield, Info } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface Tour {
  id: number
  title: string
  subtitle: string
  image: string
  price: number
  priceGroup?: number
  originalPrice?: number
  duration: string
  groupSize: string
  rating: number
  reviews: number
  location: string
  region: string
  category: string
  difficulty: "Fácil" | "Moderado" | "Difícil"
  highlights: string[]
  nextDeparture: string
  featured?: boolean
  tourType: "Premium" | "Clásico" | "Básico"
  transport: string
  route: string[]
}

// Actualizar los tours para tener mejor distribución por ciudades
const tours: Tour[] = [
  // CUSCO - CAT.1
  {
    id: 1,
    title: "MACHU PICCHU CLÁSICO",
    subtitle: "La ciudadela perdida de los Incas",
    image: "https://images.unsplash.com/photo-1587595431973-160d0d94add1?q=80&w=1000&auto=format&fit=crop",
    price: 899,
    priceGroup: 4999,
    originalPrice: 1199,
    duration: "4D/3N",
    groupSize: "Sin límite",
    rating: 4.9,
    reviews: 234,
    location: "Cusco",
    region: "Cusco",
    category: "Arqueología",
    difficulty: "Moderado",
    highlights: ["Tren a Machu Picchu", "Guía especializado", "Hotel 4 estrellas"],
    nextDeparture: "2025-06-05",
    featured: true,
    tourType: "Premium",
    transport: "Camioneta 4x4 con aire acondicionado",
    route: ["Cusco", "Valle Sagrado", "Aguas Calientes", "Machu Picchu"],
  },
  {
    id: 2,
    title: "CAMINO INCA TRADICIONAL",
    subtitle: "Trekking por la ruta ancestral",
    image: "https://images.unsplash.com/photo-1526392060635-9d6019884377?q=80&w=1000&auto=format&fit=crop",
    price: 1299,
    priceGroup: 6999,
    duration: "5D/4N",
    groupSize: "Sin límite",
    rating: 4.8,
    reviews: 189,
    location: "Cusco",
    region: "Cusco",
    category: "Trekking",
    difficulty: "Difícil",
    highlights: ["Camping incluido", "Porteadores", "Entrada Machu Picchu"],
    nextDeparture: "2025-06-10",
    tourType: "Premium",
    transport: "Camioneta 4x4 con aire acondicionado",
    route: ["Cusco", "Km 82", "Huayllabamba", "Pacaymayo", "Wiñayhuayna", "Machu Picchu"],
  },
  {
    id: 5,
    title: "VALLE SAGRADO COMPLETO",
    subtitle: "Pisac, Ollantaytambo y más",
    image: "https://images.unsplash.com/photo-1531065208531-4036c0dba3ca?q=80&w=1000&auto=format&fit=crop",
    price: 799,
    priceGroup: 3999,
    duration: "3D/2N",
    groupSize: "Sin límite",
    rating: 4.8,
    reviews: 167,
    location: "Cusco",
    region: "Cusco",
    category: "Arqueología",
    difficulty: "Fácil",
    highlights: ["Mercado Pisac", "Fortaleza Ollantaytambo", "Moray"],
    nextDeparture: "2025-06-12",
    tourType: "Premium",
    transport: "Camioneta 4x4 con aire acondicionado",
    route: ["Cusco", "Pisac", "Urubamba", "Ollantaytambo", "Chinchero"],
  },

  // AREQUIPA - CAT.2
  {
    id: 6,
    title: "VALLE DEL COLCA",
    subtitle: "El cañón más profundo del Perú",
    image: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=1000&auto=format&fit=crop",
    price: 899,
    priceGroup: 4499,
    duration: "3D/2N",
    groupSize: "Sin límite",
    rating: 4.9,
    reviews: 87,
    location: "Arequipa",
    region: "Arequipa",
    category: "Trekking",
    difficulty: "Difícil",
    highlights: ["Mirador Cruz del Cóndor", "Baños termales", "Pueblos tradicionales"],
    nextDeparture: "2025-06-05",
    tourType: "Premium",
    transport: "Camioneta 4x4 con aire acondicionado",
    route: ["Arequipa", "Chivay", "Cabanaconde", "San Juan de Chuccho", "Oasis"],
  },
  {
    id: 7,
    title: "AREQUIPA COLONIAL",
    subtitle: "Ciudad Blanca del Perú",
    image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=1000&auto=format&fit=crop",
    price: 549,
    priceGroup: 2499,
    duration: "2D/1N",
    groupSize: "Sin límite",
    rating: 4.5,
    reviews: 123,
    location: "Arequipa",
    region: "Arequipa",
    category: "Cultural",
    difficulty: "Fácil",
    highlights: ["Centro histórico", "Monasterio Santa Catalina", "Gastronomía"],
    nextDeparture: "2025-06-20",
    tourType: "Clásico",
    transport: "Minivan turística",
    route: ["Arequipa", "Monasterio Santa Catalina", "Mirador de Yanahuara"],
  },
  {
    id: 8,
    title: "CAÑÓN DE COTAHUASI",
    subtitle: "El cuarto cañón más profundo del planeta",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=1000&auto=format&fit=crop",
    price: 899,
    priceGroup: 4499,
    duration: "4D/3N",
    groupSize: "Sin límite",
    rating: 4.7,
    reviews: 201,
    location: "Arequipa",
    region: "Arequipa",
    category: "Aventura",
    difficulty: "Moderado",
    highlights: ["Cascadas de Sipia", "Baños termales de Luicho", "Nevado Coropuna"],
    nextDeparture: "2025-06-15",
    tourType: "Clásico",
    transport: "Minivan turística",
    route: ["Arequipa", "Valle de Majes", "Cotahuasi", "Tomepampa", "Alca"],
  },

  // PUNO - CAT.3
  {
    id: 4,
    title: "LAGO TITICACA MÍSTICO",
    subtitle: "Islas flotantes y cultura viva",
    image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=1000&auto=format&fit=crop",
    price: 649,
    priceGroup: 3499,
    duration: "3D/2N",
    groupSize: "Sin límite",
    rating: 4.6,
    reviews: 98,
    location: "Puno",
    region: "Puno",
    category: "Cultural",
    difficulty: "Fácil",
    highlights: ["Islas Uros", "Isla Taquile", "Homestay"],
    nextDeparture: "2025-06-08",
    tourType: "Clásico",
    transport: "Minivan turística",
    route: ["Puno", "Islas Uros", "Isla Taquile", "Isla Amantani"],
  },
  {
    id: 9,
    title: "SILLUSTANI Y UMAYO",
    subtitle: "Torres funerarias pre-incas",
    image: "https://images.unsplash.com/photo-1587595431973-160d0d94add1?q=80&w=1000&auto=format&fit=crop",
    price: 299,
    priceGroup: 1499,
    duration: "1D",
    groupSize: "Sin límite",
    rating: 4.4,
    reviews: 145,
    location: "Puno",
    region: "Puno",
    category: "Arqueología",
    difficulty: "Fácil",
    highlights: ["Chullpas de Sillustani", "Laguna Umayo", "Cultura Colla"],
    nextDeparture: "2025-06-05",
    tourType: "Básico",
    transport: "Minivan turística",
    route: ["Puno", "Sillustani", "Laguna Umayo"],
  },

  // IQUITOS - CAT.4
  {
    id: 3,
    title: "AMAZONAS LODGE",
    subtitle: "Inmersión en la selva tropical",
    image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=1000&auto=format&fit=crop",
    price: 1599,
    priceGroup: 7999,
    duration: "6D/5N",
    groupSize: "Sin límite",
    rating: 4.7,
    reviews: 156,
    location: "Iquitos",
    region: "Loreto",
    category: "Naturaleza",
    difficulty: "Fácil",
    highlights: ["Lodge de lujo", "Avistamiento fauna", "Canopy walk"],
    nextDeparture: "2025-06-15",
    featured: true,
    tourType: "Premium",
    transport: "Bote privado y camioneta 4x4",
    route: ["Iquitos", "Río Amazonas", "Reserva Pacaya Samiria", "Comunidades nativas"],
  },
  {
    id: 10,
    title: "PACAYA SAMIRIA",
    subtitle: "Reserva Nacional del Amazonas",
    image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=1000&auto=format&fit=crop",
    price: 1299,
    priceGroup: 6499,
    duration: "4D/3N",
    groupSize: "Sin límite",
    rating: 4.8,
    reviews: 92,
    location: "Iquitos",
    region: "Loreto",
    category: "Naturaleza",
    difficulty: "Moderado",
    highlights: ["Observación de delfines", "Pesca de pirañas", "Comunidades ribereñas"],
    nextDeparture: "2025-06-20",
    tourType: "Clásico",
    transport: "Bote turístico",
    route: ["Iquitos", "Nauta", "Pacaya Samiria", "Río Marañón"],
  },
]

// Cambiar las categorías principales de actividades a ciudades/destinos
const mainCategories = ["Cusco", "Arequipa", "Puno", "Iquitos"]
const allCategories = ["Todos", ...mainCategories, "Lima", "Huancayo", "Trujillo"]

// Colores para las categorías por ciudad
const categoryColors = {
  Cusco: "bg-red-500",
  Arequipa: "bg-green-600",
  Puno: "bg-amber-500",
  Iquitos: "bg-blue-800",
}

// Información histórica/descriptiva para cada ciudad
const categoryPeriods = {
  Cusco: "Capital del Imperio Inca",
  Arequipa: "Ciudad Blanca del Perú",
  Puno: "Capital Folklórica",
  Iquitos: "Puerta de la Amazonía",
}

const difficulties = ["Todos", "Fácil", "Moderado", "Difícil"]
const durations = ["Todos", "1-3 días", "4-6 días", "7+ días"]
const tourTypes = ["Todos", "Premium", "Clásico", "Básico"]
const regions = ["Todos", "Cusco", "Arequipa", "Puno", "Lima", "Loreto"]

// Colores para las categorías
// const categoryColors = {
//   Arqueología: "bg-red-500",
//   Trekking: "bg-green-600",
//   Naturaleza: "bg-amber-500",
//   Cultural: "bg-blue-800",
// }

// Periodos históricos para cada categoría
// const categoryPeriods = {
//   Arqueología: "1200-1500 DC",
//   Trekking: "Rutas Ancestrales",
//   Naturaleza: "Biodiversidad",
//   Cultural: "Tradiciones Vivas",
// }

export default function ToursPage() {
  const [filteredTours, setFilteredTours] = useState(tours)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("Todos")
  const [selectedDifficulty, setSelectedDifficulty] = useState("Todos")
  const [selectedDuration, setSelectedDuration] = useState("Todos")
  const [selectedTourType, setSelectedTourType] = useState("Todos")
  const [selectedRegion, setSelectedRegion] = useState("Todos")
  const [priceRange, setPriceRange] = useState([0, 2000])
  const [showFilters, setShowFilters] = useState(false)
  const [sortBy, setSortBy] = useState("featured")

  // Filter tours based on criteria
  useEffect(() => {
    let filtered = tours.filter((tour) => {
      const matchesSearch =
        tour.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tour.subtitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tour.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tour.region.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesCategory = selectedCategory === "Todos" || tour.location === selectedCategory
      const matchesDifficulty = selectedDifficulty === "Todos" || tour.difficulty === selectedDifficulty
      const matchesTourType = selectedTourType === "Todos" || tour.tourType === selectedTourType
      const matchesRegion = selectedRegion === "Todos" || tour.region === selectedRegion

      const tourDurationDays = Number.parseInt(tour.duration.split("D")[0])
      const matchesDuration =
        selectedDuration === "Todos" ||
        (selectedDuration === "1-3 días" && tourDurationDays <= 3) ||
        (selectedDuration === "4-6 días" && tourDurationDays >= 4 && tourDurationDays <= 6) ||
        (selectedDuration === "7+ días" && tourDurationDays >= 7)

      const matchesPrice = tour.price >= priceRange[0] && tour.price <= priceRange[1]

      return (
        matchesSearch &&
        matchesCategory &&
        matchesDifficulty &&
        matchesDuration &&
        matchesPrice &&
        matchesTourType &&
        matchesRegion
      )
    })

    // Sort tours
    if (sortBy === "featured") {
      filtered = filtered.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0))
    } else if (sortBy === "price-low") {
      filtered = filtered.sort((a, b) => a.price - b.price)
    } else if (sortBy === "price-high") {
      filtered = filtered.sort((a, b) => b.price - a.price)
    } else if (sortBy === "rating") {
      filtered = filtered.sort((a, b) => b.rating - a.rating)
    }

    setFilteredTours(filtered)
  }, [
    searchTerm,
    selectedCategory,
    selectedDifficulty,
    selectedDuration,
    priceRange,
    sortBy,
    selectedTourType,
    selectedRegion,
  ])

  // En la función principal, cambiar la lógica de agrupación:
  // Organizar tours por ciudad en lugar de por categoría
  const toursByCategory = {
    Cusco: filteredTours.filter((tour) => tour.location === "Cusco"),
    Arequipa: filteredTours.filter((tour) => tour.location === "Arequipa"),
    Puno: filteredTours.filter((tour) => tour.location === "Puno"),
    Iquitos: filteredTours.filter((tour) => tour.location === "Iquitos"),
  }

  return (
    <div className="min-h-screen bg-cream-100">
      {/* Hero Section */}
      <div className="pt-32 pb-8 px-4 md:px-8 bg-cream-50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="mb-8 md:mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-end">
              <div className="lg:col-span-2">
                <h1 className="text-4xl md:text-6xl lg:text-8xl text-peru-dark brand-text leading-none">
                  TOURS DE
                  <br />
                  PERÚ
                </h1>
              </div>
              <div className="lg:col-span-1">
                <p className="text-lg text-peru-dark/70 body-text leading-relaxed">
                  Una selección de nuestros tours organizados por categorías para ayudarte a encontrar tu aventura
                  perfecta en Perú
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Filters Section */}
      <div className="sticky top-24 z-40 bg-white border-y border-gray-200">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <Search size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar tours por destino, actividad..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 focus:border-peru-orange focus:ring-2 focus:ring-peru-orange/20 outline-none transition-all body-text"
              />
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center justify-center px-6 py-3 border border-gray-300 hover:border-peru-orange transition-colors group"
            >
              <Filter size={20} className="mr-2 group-hover:text-peru-orange transition-colors" />
              <span className="body-text group-hover:text-peru-orange transition-colors">Filtros</span>
              <ChevronDown size={16} className={`ml-2 transition-transform ${showFilters ? "rotate-180" : ""}`} />
            </button>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 border border-gray-300 focus:border-peru-orange focus:ring-2 focus:ring-peru-orange/20 outline-none transition-all body-text"
            >
              <option value="featured">Destacados</option>
              <option value="price-low">Precio: Menor a Mayor</option>
              <option value="price-high">Precio: Mayor a Menor</option>
              <option value="rating">Mejor Valorados</option>
            </select>
          </div>

          {/* Filters Panel */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                className="mt-4 p-6 bg-gray-50 border border-gray-200"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Category Filter */}
                  <div>
                    <label className="block text-sm font-medium text-peru-dark mb-2 body-text">Categoría</label>
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 focus:border-peru-orange focus:ring-1 focus:ring-peru-orange outline-none body-text"
                    >
                      {allCategories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Region Filter */}
                  <div>
                    <label className="block text-sm font-medium text-peru-dark mb-2 body-text">Región</label>
                    <select
                      value={selectedRegion}
                      onChange={(e) => setSelectedRegion(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 focus:border-peru-orange focus:ring-1 focus:ring-peru-orange outline-none body-text"
                    >
                      {regions.map((region) => (
                        <option key={region} value={region}>
                          {region}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Tour Type Filter */}
                  <div>
                    <label className="block text-sm font-medium text-peru-dark mb-2 body-text">Tipo de Tour</label>
                    <select
                      value={selectedTourType}
                      onChange={(e) => setSelectedTourType(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 focus:border-peru-orange focus:ring-1 focus:ring-peru-orange outline-none body-text"
                    >
                      {tourTypes.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Difficulty Filter */}
                  <div>
                    <label className="block text-sm font-medium text-peru-dark mb-2 body-text">Dificultad</label>
                    <select
                      value={selectedDifficulty}
                      onChange={(e) => setSelectedDifficulty(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 focus:border-peru-orange focus:ring-1 focus:ring-peru-orange outline-none body-text"
                    >
                      {difficulties.map((difficulty) => (
                        <option key={difficulty} value={difficulty}>
                          {difficulty}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Duration Filter */}
                  <div>
                    <label className="block text-sm font-medium text-peru-dark mb-2 body-text">Duración</label>
                    <select
                      value={selectedDuration}
                      onChange={(e) => setSelectedDuration(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 focus:border-peru-orange focus:ring-1 focus:ring-peru-orange outline-none body-text"
                    >
                      {durations.map((duration) => (
                        <option key={duration} value={duration}>
                          {duration}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Price Range */}
                  <div>
                    <label className="block text-sm font-medium text-peru-dark mb-2 body-text">
                      Precio: ${priceRange[0]} - ${priceRange[1]}
                    </label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="range"
                        min="0"
                        max="2000"
                        step="100"
                        value={priceRange[0]}
                        onChange={(e) => setPriceRange([Number.parseInt(e.target.value), priceRange[1]])}
                        className="flex-1"
                      />
                      <input
                        type="range"
                        min="0"
                        max="2000"
                        step="100"
                        value={priceRange[1]}
                        onChange={(e) => setPriceRange([priceRange[0], Number.parseInt(e.target.value)])}
                        className="flex-1"
                      />
                    </div>
                  </div>
                </div>

                {/* Clear Filters */}
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={() => {
                      setSearchTerm("")
                      setSelectedCategory("Todos")
                      setSelectedDifficulty("Todos")
                      setSelectedDuration("Todos")
                      setSelectedTourType("Todos")
                      setSelectedRegion("Todos")
                      setPriceRange([0, 2000])
                    }}
                    className="text-peru-orange hover:text-peru-dark transition-colors body-text"
                  >
                    Limpiar filtros
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Main Content - Timeline Layout */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        {filteredTours.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl brand-text text-peru-dark mb-2">No se encontraron tours</h3>
            <p className="text-peru-dark/70 body-text">Intenta ajustar tus filtros de búsqueda</p>
          </div>
        ) : (
          <>
            {/* Category Headers */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              {mainCategories.map((city, index) => (
                <motion.div
                  key={city}
                  className="text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <h3 className="text-sm font-medium tracking-wider text-peru-dark/60 mb-2 body-text">
                    CAT.{index + 1}
                  </h3>
                  <h2 className="text-xl md:text-2xl font-bold text-peru-dark brand-text">{city.toUpperCase()}</h2>
                  <p className="text-xs text-peru-dark/50 mt-1">
                    {categoryPeriods[city as keyof typeof categoryPeriods]}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* Timeline Grid Layout */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-0 border-t border-gray-200">
              {mainCategories.map((city, index) => {
                const cityTours = toursByCategory[city as keyof typeof toursByCategory]
                const bgColor = categoryColors[city as keyof typeof categoryColors]

                return (
                  <div
                    key={city}
                    className={`${
                      index % 2 === 0 ? "bg-cream-50" : "bg-cream-100"
                    } border-r border-gray-200 last:border-r-0`}
                  >
                    {/* Category Header */}
                    <div className={`${bgColor} text-white p-4 md:p-6`}>
                      <h3 className="text-xl md:text-2xl font-bold brand-text mb-2">{cityTours.length} TOURS</h3>
                      <p className="text-white/80 text-sm body-text">
                        Desde ${Math.min(...(cityTours.length ? cityTours.map((t) => t.price) : [0]))}
                      </p>
                    </div>

                    {/* Tours in this city */}
                    <div className="p-4">
                      {cityTours.length === 0 ? (
                        <p className="text-center text-gray-500 py-8">No hay tours disponibles</p>
                      ) : (
                        <div className="space-y-12">
                          {cityTours.map((tour, tourIndex) => (
                            <motion.div
                              key={tour.id}
                              className="group"
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.6, delay: 0.2 + tourIndex * 0.1 }}
                            >
                              {/* Tour Image */}
                              <div className="relative h-56 md:h-64 mb-4 overflow-hidden">
                                <Image
                                  src={tour.image || "/placeholder.svg"}
                                  alt={tour.title}
                                  fill
                                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                                />

                                {/* Tour Type Badge */}
                                <div
                                  className={`absolute top-2 left-2 px-2 py-1 text-xs brand-text text-white ${
                                    tour.tourType === "Premium"
                                      ? "bg-peru-gold"
                                      : tour.tourType === "Clásico"
                                        ? "bg-peru-orange"
                                        : "bg-gray-600"
                                  }`}
                                >
                                  {tour.tourType}
                                </div>

                                {/* Featured Badge */}
                                {tour.featured && (
                                  <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 text-xs brand-text">
                                    DESTACADO
                                  </div>
                                )}
                              </div>

                              {/* Tour Info */}
                              <div className="space-y-3">
                                <h4 className="text-lg md:text-xl font-bold brand-text text-peru-dark group-hover:text-peru-orange transition-colors">
                                  {tour.title}
                                </h4>
                                <p className="text-sm text-peru-dark/70 body-text">{tour.subtitle}</p>

                                {/* Ruta */}
                                <div className="flex flex-wrap gap-1 text-xs">
                                  {tour.route.map((stop, idx) => (
                                    <span key={idx} className="inline-flex items-center">
                                      {idx > 0 && <span className="mx-1 text-gray-400">→</span>}
                                      <span className="text-gray-600">{stop}</span>
                                    </span>
                                  ))}
                                </div>

                                {/* Meta Info */}
                                <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                                  <div className="flex items-center">
                                    <Clock size={12} className="mr-1" />
                                    <span className="body-text">{tour.duration}</span>
                                  </div>
                                  <div className="flex items-center">
                                    <MapPin size={12} className="mr-1" />
                                    <span className="body-text">{tour.region}</span>
                                  </div>
                                  <div className="flex items-center">
                                    <Calendar size={12} className="mr-1" />
                                    <span className="body-text">
                                      {new Date(tour.nextDeparture).toLocaleDateString("es-ES", {
                                        day: "2-digit",
                                        month: "short",
                                        year: "numeric",
                                      })}
                                    </span>
                                  </div>
                                  <div className="flex items-center">
                                    <Users size={12} className="mr-1" />
                                    <span className="body-text">{tour.groupSize}</span>
                                  </div>
                                </div>

                                {/* Transporte */}
                                <div className="flex items-center text-xs text-gray-600">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="12"
                                    height="12"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="mr-1"
                                  >
                                    <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" />
                                    <circle cx="7" cy="17" r="2" />
                                    <path d="M9 17h6" />
                                    <circle cx="17" cy="17" r="2" />
                                  </svg>
                                  <span className="body-text">{tour.transport}</span>
                                </div>

                                {/* Difficulty */}
                                <div className="flex items-center">
                                  <span
                                    className={`px-2 py-0.5 text-xs brand-text ${
                                      tour.difficulty === "Fácil"
                                        ? "bg-green-100 text-green-800"
                                        : tour.difficulty === "Moderado"
                                          ? "bg-yellow-100 text-yellow-800"
                                          : "bg-red-100 text-red-800"
                                    }`}
                                  >
                                    {tour.difficulty}
                                  </span>
                                </div>

                                {/* Precio */}
                                <div className="flex justify-between items-center border-t border-gray-200 pt-3">
                                  <div>
                                    <p className="text-xs text-gray-500 body-text">Precio por persona</p>
                                    <p className="text-lg font-bold text-peru-dark brand-text">${tour.price}</p>
                                  </div>
                                  <Link href={`/tours/${tour.id}`}>
                                    <button className="bg-peru-dark text-white py-2 px-4 text-xs font-medium brand-text hover:bg-peru-orange transition-colors">
                                      VER DETALLES
                                    </button>
                                  </Link>
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </>
        )}
      </div>

      {/* Viaja Seguro Section */}
      <div className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="md:w-1/2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="flex items-center mb-4"
              >
                <Shield className="w-8 h-8 text-peru-green mr-3" />
                <h2 className="text-2xl md:text-3xl brand-text text-peru-dark">Viaja Seguro</h2>
              </motion.div>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                viewport={{ once: true }}
                className="text-peru-dark/70 body-text mb-6"
              >
                Perú Travels Tours, dispone de los protocolos de seguridad y salud, para hacer de tu viaje más seguro y
                placentero.
              </motion.p>
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
                className="px-6 py-2 border border-peru-green text-peru-green brand-text hover:bg-peru-green hover:text-white transition-colors"
              >
                CONOCE MÁS
              </motion.button>
            </div>
            <div className="md:w-1/2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                viewport={{ once: true }}
                className="flex items-center mb-4"
              >
                <Info className="w-8 h-8 text-peru-orange mr-3" />
                <h2 className="text-2xl md:text-3xl brand-text text-peru-dark">Recomendaciones</h2>
              </motion.div>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                viewport={{ once: true }}
                className="text-peru-dark/70 body-text mb-6"
              >
                En Perú puedes adquirir artesanías, textiles y souvenirs de primera calidad, y de todo tipo. Llévate un
                recuerdo.
              </motion.p>
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                viewport={{ once: true }}
                className="px-6 py-2 border border-peru-orange text-peru-orange brand-text hover:bg-peru-orange hover:text-white transition-colors"
              >
                CONSULTAR
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      {/* Adventure in Peru Section */}
      <div className="bg-peru-dark text-white py-12">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-8"
          >
            <h2 className="text-3xl md:text-5xl brand-text mb-4">Adventure IN PERÚ</h2>
            <p className="text-white/80 body-text max-w-3xl mx-auto">
              Descubre y visita el mágico Perú, desde su sierra, asombrándote con Machu Picchu, Amantani, EL Misti y
              Chachani, Alpamayo, etc. Prepárate para tu nuevo destino: ¡Perú!
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h3 className="text-xl brand-text text-peru-gold mb-4">Destinos recomendados</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {[
                { name: "Valle Sagrado", region: "Cusco" },
                { name: "Misti / Chachani", region: "Arequipa" },
                { name: "Tiahuanaco", region: "Puno" },
                { name: "Machu Picchu", region: "Cusco" },
                { name: "Lago Titicaca", region: "Puno" },
                { name: "Valle del Colca", region: "Arequipa" },
              ].map((destination, index) => (
                <motion.div
                  key={destination.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white/10 p-3 text-center hover:bg-white/20 transition-colors cursor-pointer"
                >
                  <p className="text-sm brand-text">{destination.name}</p>
                  <p className="text-xs text-white/60 body-text">{destination.region}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-peru-light/30 py-12 md:py-16">
        <div className="max-w-4xl mx-auto text-center px-6">
          <motion.h2
            className="text-2xl md:text-4xl brand-text text-peru-dark mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            ¿NO ENCUENTRAS LO QUE BUSCAS?
          </motion.h2>
          <motion.p
            className="text-base md:text-lg text-peru-dark/70 body-text mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            Creamos tours personalizados según tus intereses y presupuesto. Contáctanos para diseñar tu viaje ideal.
          </motion.p>
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <button className="px-6 md:px-8 py-3 bg-peru-orange text-white brand-text hover:bg-peru-orange/90 transition-colors">
              TOUR PERSONALIZADO
            </button>
            <button className="px-6 md:px-8 py-3 border border-peru-dark text-peru-dark brand-text hover:bg-peru-dark hover:text-white transition-colors">
              HABLAR CON EXPERTO
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
