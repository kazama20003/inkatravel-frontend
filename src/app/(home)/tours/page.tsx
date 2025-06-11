"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, Filter, MapPin, Clock, Users, Star, Calendar, ChevronDown } from "lucide-react"

interface Tour {
  id: number
  title: string
  subtitle: string
  image: string
  price: number
  originalPrice?: number
  duration: string
  groupSize: string
  rating: number
  reviews: number
  location: string
  category: string
  difficulty: "Fácil" | "Moderado" | "Difícil"
  highlights: string[]
  nextDeparture: string
  featured?: boolean
}

const tours: Tour[] = [
  {
    id: 1,
    title: "MACHU PICCHU CLÁSICO",
    subtitle: "La ciudadela perdida de los Incas",
    image: "https://images.unsplash.com/photo-1587595431973-160d0d94add1?q=80&w=1000&auto=format&fit=crop",
    price: 899,
    originalPrice: 1199,
    duration: "4 días",
    groupSize: "2-12 personas",
    rating: 4.9,
    reviews: 234,
    location: "Cusco",
    category: "Arqueología",
    difficulty: "Moderado",
    highlights: ["Tren a Machu Picchu", "Guía especializado", "Hotel 4 estrellas"],
    nextDeparture: "2024-03-15",
    featured: true,
  },
  {
    id: 2,
    title: "CAMINO INCA TRADICIONAL",
    subtitle: "Trekking por la ruta ancestral",
    image: "https://images.unsplash.com/photo-1526392060635-9d6019884377?q=80&w=1000&auto=format&fit=crop",
    price: 1299,
    duration: "5 días",
    groupSize: "4-16 personas",
    rating: 4.8,
    reviews: 189,
    location: "Cusco",
    category: "Trekking",
    difficulty: "Difícil",
    highlights: ["Camping incluido", "Porteadores", "Entrada Machu Picchu"],
    nextDeparture: "2024-03-20",
  },
  {
    id: 3,
    title: "AMAZONAS LODGE",
    subtitle: "Inmersión en la selva tropical",
    image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=1000&auto=format&fit=crop",
    price: 1599,
    duration: "6 días",
    groupSize: "2-8 personas",
    rating: 4.7,
    reviews: 156,
    location: "Iquitos",
    category: "Naturaleza",
    difficulty: "Fácil",
    highlights: ["Lodge de lujo", "Avistamiento fauna", "Canopy walk"],
    nextDeparture: "2024-03-18",
    featured: true,
  },
  {
    id: 4,
    title: "LAGO TITICACA MÍSTICO",
    subtitle: "Islas flotantes y cultura viva",
    image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=1000&auto=format&fit=crop",
    price: 649,
    duration: "3 días",
    groupSize: "2-15 personas",
    rating: 4.6,
    reviews: 98,
    location: "Puno",
    category: "Cultural",
    difficulty: "Fácil",
    highlights: ["Islas Uros", "Isla Taquile", "Homestay"],
    nextDeparture: "2024-03-22",
  },
  {
    id: 5,
    title: "VALLE SAGRADO COMPLETO",
    subtitle: "Pisac, Ollantaytambo y más",
    image: "https://images.unsplash.com/photo-1531065208531-4036c0dba3ca?q=80&w=1000&auto=format&fit=crop",
    price: 799,
    duration: "3 días",
    groupSize: "2-12 personas",
    rating: 4.8,
    reviews: 167,
    location: "Cusco",
    category: "Arqueología",
    difficulty: "Fácil",
    highlights: ["Mercado Pisac", "Fortaleza Ollantaytambo", "Moray"],
    nextDeparture: "2024-03-25",
  },
  {
    id: 6,
    title: "CHOQUEQUIRAO TREK",
    subtitle: "La hermana de Machu Picchu",
    image: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=1000&auto=format&fit=crop",
    price: 1899,
    duration: "7 días",
    groupSize: "4-10 personas",
    rating: 4.9,
    reviews: 87,
    location: "Cusco",
    category: "Trekking",
    difficulty: "Difícil",
    highlights: ["Sitio arqueológico exclusivo", "Camping", "Guías expertos"],
    nextDeparture: "2024-03-30",
  },
]

const categories = ["Todos", "Arqueología", "Trekking", "Naturaleza", "Cultural"]
const difficulties = ["Todos", "Fácil", "Moderado", "Difícil"]
const durations = ["Todos", "1-3 días", "4-6 días", "7+ días"]

export default function ToursPage() {
  const [filteredTours, setFilteredTours] = useState(tours)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("Todos")
  const [selectedDifficulty, setSelectedDifficulty] = useState("Todos")
  const [selectedDuration, setSelectedDuration] = useState("Todos")
  const [priceRange, setPriceRange] = useState([0, 2000])
  const [showFilters, setShowFilters] = useState(false)
  const [sortBy, setSortBy] = useState("featured")

  // Filter tours based on criteria
  useEffect(() => {
    let filtered = tours.filter((tour) => {
      const matchesSearch =
        tour.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tour.subtitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tour.location.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesCategory = selectedCategory === "Todos" || tour.category === selectedCategory
      const matchesDifficulty = selectedDifficulty === "Todos" || tour.difficulty === selectedDifficulty

      const matchesDuration =
        selectedDuration === "Todos" ||
        (selectedDuration === "1-3 días" && Number.parseInt(tour.duration) <= 3) ||
        (selectedDuration === "4-6 días" &&
          Number.parseInt(tour.duration) >= 4 &&
          Number.parseInt(tour.duration) <= 6) ||
        (selectedDuration === "7+ días" && Number.parseInt(tour.duration) >= 7)

      const matchesPrice = tour.price >= priceRange[0] && tour.price <= priceRange[1]

      return matchesSearch && matchesCategory && matchesDifficulty && matchesDuration && matchesPrice
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
  }, [searchTerm, selectedCategory, selectedDifficulty, selectedDuration, priceRange, sortBy])

  return (
    <div className="min-h-screen bg-white pt-24">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white sticky top-24 z-40">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between mb-8">
            <div>
              <motion.h1
                className="text-4xl md:text-6xl lg:text-7xl text-peru-dark brand-text mb-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                TOURS SELECCIONADOS
              </motion.h1>
              <motion.p
                className="text-lg text-peru-dark/70 body-text max-w-2xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                Descubre nuestros paquetes turísticos cuidadosamente diseñados para ofrecerte las mejores experiencias
                en Perú.
              </motion.p>
            </div>

            <motion.div
              className="mt-4 lg:mt-0 text-right"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="text-2xl brand-text text-peru-orange">{filteredTours.length}</div>
              <div className="text-sm text-peru-dark/60 body-text uppercase tracking-wider">Tours disponibles</div>
            </motion.div>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col lg:flex-row gap-4">
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
                className="mt-6 p-6 bg-gray-50 border border-gray-200"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {/* Category Filter */}
                  <div>
                    <label className="block text-sm font-medium text-peru-dark mb-2 body-text">Categoría</label>
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 focus:border-peru-orange focus:ring-1 focus:ring-peru-orange outline-none body-text"
                    >
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category}
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

      {/* Tours Grid */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {filteredTours.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl brand-text text-peru-dark mb-2">No se encontraron tours</h3>
            <p className="text-peru-dark/70 body-text">Intenta ajustar tus filtros de búsqueda</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredTours.map((tour, index) => (
              <motion.div
                key={tour.id}
                className="group cursor-pointer"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                {/* Image */}
                <div className="relative h-64 mb-4 overflow-hidden">
                  <img
                    src={tour.image || "/placeholder.svg"}
                    alt={tour.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />

                  {/* Featured Badge */}
                  {tour.featured && (
                    <div className="absolute top-4 left-4 bg-peru-orange text-white px-3 py-1 text-xs brand-text">
                      DESTACADO
                    </div>
                  )}

                  {/* Price Badge */}
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-2">
                    <div className="text-lg font-bold text-peru-dark brand-text">${tour.price}</div>
                    {tour.originalPrice && (
                      <div className="text-sm text-gray-500 line-through body-text">${tour.originalPrice}</div>
                    )}
                  </div>

                  {/* Overlay Info */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="flex flex-wrap gap-2 mb-3">
                        {tour.highlights.slice(0, 2).map((highlight, idx) => (
                          <span
                            key={idx}
                            className="bg-white/20 backdrop-blur-sm text-white px-2 py-1 text-xs body-text"
                          >
                            {highlight}
                          </span>
                        ))}
                      </div>
                      <button className="w-full bg-peru-orange text-white py-2 px-4 brand-text hover:bg-peru-orange/90 transition-colors">
                        VER DETALLES
                      </button>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="space-y-3">
                  {/* Category and Location */}
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-peru-orange brand-text uppercase tracking-wider">{tour.category}</span>
                    <div className="flex items-center text-gray-500">
                      <MapPin size={14} className="mr-1" />
                      <span className="body-text">{tour.location}</span>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl brand-text text-peru-dark group-hover:text-peru-orange transition-colors">
                    {tour.title}
                  </h3>

                  {/* Subtitle */}
                  <p className="text-peru-dark/70 body-text">{tour.subtitle}</p>

                  {/* Meta Info */}
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center">
                        <Clock size={14} className="mr-1" />
                        <span className="body-text">{tour.duration}</span>
                      </div>
                      <div className="flex items-center">
                        <Users size={14} className="mr-1" />
                        <span className="body-text">{tour.groupSize}</span>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <Star size={14} className="mr-1 text-yellow-400 fill-current" />
                      <span className="body-text">
                        {tour.rating} ({tour.reviews})
                      </span>
                    </div>
                  </div>

                  {/* Next Departure */}
                  <div className="flex items-center text-sm text-peru-orange">
                    <Calendar size={14} className="mr-1" />
                    <span className="body-text">
                      Próxima salida: {new Date(tour.nextDeparture).toLocaleDateString("es-ES")}
                    </span>
                  </div>

                  {/* Difficulty */}
                  <div className="flex items-center justify-between">
                    <span
                      className={`px-2 py-1 text-xs brand-text ${
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
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* CTA Section */}
      <div className="bg-peru-light/30 py-16">
        <div className="max-w-4xl mx-auto text-center px-6">
          <motion.h2
            className="text-3xl md:text-4xl brand-text text-peru-dark mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            ¿NO ENCUENTRAS LO QUE BUSCAS?
          </motion.h2>
          <motion.p
            className="text-lg text-peru-dark/70 body-text mb-8"
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
            <button className="px-8 py-3 bg-peru-orange text-white brand-text hover:bg-peru-orange/90 transition-colors">
              TOUR PERSONALIZADO
            </button>
            <button className="px-8 py-3 border border-peru-dark text-peru-dark brand-text hover:bg-peru-dark hover:text-white transition-colors">
              HABLAR CON EXPERTO
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
