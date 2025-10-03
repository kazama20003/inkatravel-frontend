"use client"

import { useState } from "react"
import {
  Search,
  MapPin,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  Filter,
  X,
  Star,
  Zap,
  Shield,
  Wifi,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { TransportCard } from "@/components/transport-card"
import { useLanguage } from "@/contexts/LanguageContext"
import { motion, AnimatePresence } from "framer-motion"
import useSWR from "swr"
import { api } from "@/lib/axiosInstance"
import type { TourTransportResponse, PackageType } from "@/types/tour"
import { Card } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"

const fetcher = async (url: string) => {
  const response = await api.get(url)
  return response.data
}

export default function TransportToursPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [showFilters, setShowFilters] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [limit] = useState(9)

  const [, setSelectedPackageTypes] = useState<PackageType[]>([])
  const [priceRange, setPriceRange] = useState([0, 500])
  const [selectedRating, setSelectedRating] = useState(0)
  const [selectedDuration, setSelectedDuration] = useState("")

  const { language } = useLanguage()

  const { data, error, isLoading } = useSWR<TourTransportResponse>(
    `/tour-transport?lang=${language}&page=${currentPage}&limit=${limit}`,
    fetcher,
    {
      fallbackData: {
        success: true,
        message: "Fallback data",
        data: [],
        meta: { total: 0, page: 1, limit: 9, totalPages: 0 },
      },
    },
  )

  const tours = data?.data || []

  const filteredTours = tours.filter((tour) => {
    const matchesSearch = searchQuery.trim()
      ? tour.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tour.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tour.origin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tour.destination.name.toLowerCase().includes(searchQuery.toLowerCase())
      : true

    const matchesPrice = tour.price >= priceRange[0] && tour.price <= priceRange[1]
    const matchesRating = selectedRating === 0 || tour.rating >= selectedRating
    const matchesDuration = selectedDuration === "" || tour.duration.includes(selectedDuration)

    return matchesSearch && matchesPrice && matchesRating && matchesDuration
  })

  const handleSearchChange = (value: string) => {
    setSearchQuery(value)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    setSearchQuery("")
  }

  const clearFilters = () => {
    setSelectedPackageTypes([])
    setPriceRange([0, 500])
    setSelectedRating(0)
    setSelectedDuration("")
    setSearchQuery("")
  }

  const searchTexts = {
    es: {
      title: "Tours de Transporte Premium",
      subtitle: "Descubre nuestros servicios de transporte de lujo con experiencias únicas",
      searchPlaceholder: "Buscar destinos, rutas o ciudades...",
      filterButton: "Filtros",
      resultsFound: "tours encontrados",
      noResults: "No se encontraron tours",
      noResultsDesc: "Intenta con otros términos de búsqueda o ajusta los filtros",
      loading: "Cargando tours...",
      error: "Error al cargar los tours",
      featured: "Destacados",
      allTours: "Todos los Tours",
      showAllTours: "Ver todos los tours",
      page: "Página",
      of: "de",
      previous: "Anterior",
      next: "Siguiente",
      filters: {
        title: "Filtros",
        clearAll: "Limpiar todo",
        packageType: "Tipo de Paquete",
        priceRange: "Rango de Precio",
        rating: "Calificación",
        duration: "Duración",
        apply: "Aplicar Filtros",
      },
    },
    en: {
      title: "Premium Transport Tours",
      subtitle: "Discover our luxury transport services with unique experiences",
      searchPlaceholder: "Search destinations, routes or cities...",
      filterButton: "Filters",
      resultsFound: "tours found",
      noResults: "No tours found",
      noResultsDesc: "Try different search terms or adjust filters",
      loading: "Loading tours...",
      error: "Error loading tours",
      featured: "Featured",
      allTours: "All Tours",
      showAllTours: "Show all tours",
      page: "Page",
      of: "of",
      previous: "Previous",
      next: "Next",
      filters: {
        title: "Filters",
        clearAll: "Clear all",
        packageType: "Package Type",
        priceRange: "Price Range",
        rating: "Rating",
        duration: "Duration",
        apply: "Apply Filters",
      },
    },
    fr: {
      title: "Tours de Transport Premium",
      subtitle: "Découvrez nos services de transport de luxe avec des expériences uniques",
      searchPlaceholder: "Rechercher destinations, routes ou villes...",
      filterButton: "Filtres",
      resultsFound: "tours trouvés",
      noResults: "Aucun tour trouvé",
      noResultsDesc: "Essayez d'autres termes de recherche ou ajustez les filtres",
      loading: "Chargement des tours...",
      error: "Erreur lors du chargement des tours",
      featured: "En vedette",
      allTours: "Tous les Tours",
      showAllTours: "Voir tous les tours",
      page: "Page",
      of: "de",
      previous: "Précédent",
      next: "Suivant",
      filters: {
        title: "Filtres",
        clearAll: "Tout effacer",
        packageType: "Type de Forfait",
        priceRange: "Gamme de Prix",
        rating: "Évaluation",
        duration: "Durée",
        apply: "Appliquer les Filtres",
      },
    },
    de: {
      title: "Premium Transport Touren",
      subtitle: "Entdecken Sie unsere Luxus-Transportdienste mit einzigartigen Erlebnissen",
      searchPlaceholder: "Ziele, Routen oder Städte suchen...",
      filterButton: "Filter",
      resultsFound: "Touren gefunden",
      noResults: "Keine Touren gefunden",
      noResultsDesc: "Versuchen Sie andere Suchbegriffe oder passen Sie die Filter an",
      loading: "Touren werden geladen...",
      error: "Fehler beim Laden der Touren",
      featured: "Empfohlen",
      allTours: "Alle Touren",
      showAllTours: "Alle Touren anzeigen",
      page: "Seite",
      of: "von",
      previous: "Zurück",
      next: "Weiter",
      filters: {
        title: "Filter",
        clearAll: "Alle löschen",
        packageType: "Pakettyp",
        priceRange: "Preisbereich",
        rating: "Bewertung",
        duration: "Dauer",
        apply: "Filter anwenden",
      },
    },
    it: {
      title: "Tour di Trasporto Premium",
      subtitle: "Scopri i nostri servizi di trasporto di lusso con esperienze uniche",
      searchPlaceholder: "Cerca destinazioni, rotte o città...",
      filterButton: "Filtri",
      resultsFound: "tour trovati",
      noResults: "Nessun tour trovato",
      noResultsDesc: "Prova altri termini di ricerca o regola i filtri",
      loading: "Caricamento tour...",
      error: "Errore nel caricamento dei tour",
      featured: "In evidenza",
      allTours: "Tutti i Tour",
      showAllTours: "Mostra tutti i tour",
      page: "Pagina",
      of: "di",
      previous: "Precedente",
      next: "Successivo",
      filters: {
        title: "Filtri",
        clearAll: "Cancella tutto",
        packageType: "Tipo di Pacchetto",
        priceRange: "Fascia di Prezzo",
        rating: "Valutazione",
        duration: "Durata",
        apply: "Applica Filtri",
      },
    },
  }

  const currentTexts = searchTexts[language as keyof typeof searchTexts] || searchTexts.es

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-orange-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-700 font-medium">{currentTexts.loading}</p>
        </div>
      </div>
    )
  }

  if (error && tours.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
        <div className="text-center">
          <p className="text-red-600 mb-2 font-medium">{currentTexts.error}</p>
          <p className="text-gray-600">{error.message}</p>
        </div>
      </div>
    )
  }

  const featuredTours = filteredTours.filter((tour) => tour.isFeatured)
  const regularTours = filteredTours.filter((tour) => !tour.isFeatured)

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      <div className="relative bg-gradient-to-br from-orange-600 via-amber-600 to-yellow-500 pt-16 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0 bg-[url('/peru-mountains-landscape-transport-tourism.jpg')] bg-cover bg-center opacity-20"></div>

        {/* Decorative elements */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-10 right-20 w-48 h-48 bg-yellow-300/20 rounded-full blur-2xl"></div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto mt-16"
          >
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">{currentTexts.title}</h1>
            <p className="text-xl text-white/90 mb-12 leading-relaxed">{currentTexts.subtitle}</p>

            <div className="max-w-2xl mx-auto">
              <div className="relative bg-white/95 backdrop-blur-sm rounded-2xl p-2 shadow-2xl">
                <div className="flex items-center gap-3">
                  <Search className="text-gray-400 w-6 h-6 ml-4" />
                  <Input
                    type="text"
                    placeholder={currentTexts.searchPlaceholder}
                    value={searchQuery}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    className="flex-1 border-0 bg-transparent text-lg placeholder:text-gray-500 focus:ring-0 focus:outline-none"
                  />
                  <Button
                    onClick={() => setShowFilters(!showFilters)}
                    className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg transition-all duration-300 hover:scale-105"
                  >
                    <SlidersHorizontal className="w-5 h-5 mr-2" />
                    {currentTexts.filterButton}
                  </Button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-2">500+</div>
                <div className="text-white/80 text-sm">Tours Realizados</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-2">4.9</div>
                <div className="text-white/80 text-sm">Calificación</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-2">24/7</div>
                <div className="text-white/80 text-sm">Soporte</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-2">15+</div>
                <div className="text-white/80 text-sm">Destinos</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white border-b border-gray-200 shadow-lg"
          >
            <div className="container mx-auto px-4 py-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                  <Filter className="w-6 h-6 text-orange-500" />
                  {currentTexts.filters.title}
                </h3>
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    onClick={clearFilters}
                    className="text-gray-600 hover:text-gray-900 bg-transparent"
                  >
                    <X className="w-4 h-4 mr-2" />
                    {currentTexts.filters.clearAll}
                  </Button>
                  <Button
                    onClick={() => setShowFilters(false)}
                    className="bg-orange-500 hover:bg-orange-600 text-white"
                  >
                    {currentTexts.filters.apply}
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Price Range Filter */}
                <Card className="p-6 border-2 border-gray-100 hover:border-orange-200 transition-colors">
                  <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                    {currentTexts.filters.priceRange}
                  </h4>
                  <div className="space-y-4">
                    <Slider
                      value={priceRange}
                      onValueChange={setPriceRange}
                      max={500}
                      min={0}
                      step={10}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>S/{priceRange[0]}</span>
                      <span>S/{priceRange[1]}</span>
                    </div>
                  </div>
                </Card>

                {/* Rating Filter */}
                <Card className="p-6 border-2 border-gray-100 hover:border-orange-200 transition-colors">
                  <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                    {currentTexts.filters.rating}
                  </h4>
                  <div className="space-y-3">
                    {[0, 3, 4, 4.5].map((rating) => (
                      <label key={rating} className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="radio"
                          name="rating"
                          value={rating}
                          checked={selectedRating === rating}
                          onChange={(e) => setSelectedRating(Number(e.target.value))}
                          className="text-orange-500 focus:ring-orange-500"
                        />
                        <div className="flex items-center gap-1">
                          {rating === 0 ? (
                            <span className="text-sm text-gray-600">Todas</span>
                          ) : (
                            <>
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-4 h-4 ${
                                    i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                                  }`}
                                />
                              ))}
                              <span className="text-sm text-gray-600 ml-1">y más</span>
                            </>
                          )}
                        </div>
                      </label>
                    ))}
                  </div>
                </Card>

                {/* Duration Filter */}
                <Card className="p-6 border-2 border-gray-100 hover:border-orange-200 transition-colors">
                  <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                    {currentTexts.filters.duration}
                  </h4>
                  <div className="space-y-3">
                    {["", "1 día", "2 días", "3+ días"].map((duration) => (
                      <label key={duration} className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="radio"
                          name="duration"
                          value={duration}
                          checked={selectedDuration === duration}
                          onChange={(e) => setSelectedDuration(e.target.value)}
                          className="text-orange-500 focus:ring-orange-500"
                        />
                        <span className="text-sm text-gray-700">{duration || "Todas las duraciones"}</span>
                      </label>
                    ))}
                  </div>
                </Card>

                {/* Features */}
                <Card className="p-6 border-2 border-gray-100 hover:border-orange-200 transition-colors">
                  <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                    Características
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Wifi className="w-4 h-4 text-blue-500" />
                      <span>WiFi Gratis</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Shield className="w-4 h-4 text-green-500" />
                      <span>Seguro Incluido</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Zap className="w-4 h-4 text-yellow-500" />
                      <span>Servicio Premium</span>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="container mx-auto px-4 py-12">
        {/* Results Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full flex items-center justify-center">
              <MapPin className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {filteredTours.length} {currentTexts.resultsFound}
              </h2>
              {searchQuery && (
                <p className="text-gray-600 mt-1">
                  Resultados para: <span className="font-semibold">{searchQuery}</span>
                </p>
              )}
            </div>
          </div>
        </div>

        {filteredTours.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 bg-gradient-to-r from-orange-100 to-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-12 h-12 text-orange-500" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">{currentTexts.noResults}</h3>
              <p className="text-gray-600 mb-6">{currentTexts.noResultsDesc}</p>
              <Button
                onClick={() => {
                  handleSearchChange("")
                  clearFilters()
                }}
                className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                {currentTexts.showAllTours}
              </Button>
            </div>
          </motion.div>
        ) : (
          <div className="space-y-12">
            {/* Featured Tours */}
            {featuredTours.length > 0 && (
              <motion.section
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="flex items-center gap-4 mb-8">
                  <Badge className="bg-gradient-to-r from-orange-500 to-amber-500 text-white px-4 py-2 text-sm font-semibold">
                    <Star className="w-4 h-4 mr-2" />
                    {currentTexts.featured}
                  </Badge>
                  <div className="h-px bg-gradient-to-r from-orange-200 to-transparent flex-1"></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {featuredTours.map((tour, index) => {
                    if (!tour) return null
                    return <TransportCard key={tour._id} tour={tour} index={index} />
                  })}
                </div>
              </motion.section>
            )}

            {/* Regular Tours */}
            {regularTours.length > 0 && (
              <motion.section
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <div className="flex items-center gap-4 mb-8">
                  <h3 className="text-2xl font-bold text-gray-900">{currentTexts.allTours}</h3>
                  <div className="h-px bg-gradient-to-r from-gray-200 to-transparent flex-1"></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {regularTours.map((tour, index) => {
                    if (!tour) return null
                    return <TransportCard key={tour._id} tour={tour} index={index + featuredTours.length} />
                  })}
                </div>
              </motion.section>
            )}

            {/* Pagination */}
            {!searchQuery && data?.meta && data.meta.totalPages > 1 && (
              <div className="flex items-center justify-center gap-6 mt-16 pb-8">
                <Button
                  variant="outline"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage <= 1}
                  className="flex items-center gap-2 px-6 py-3 border-2 border-orange-200 hover:border-orange-300 hover:bg-orange-50 transition-all duration-300"
                >
                  <ChevronLeft className="w-5 h-5" />
                  {currentTexts.previous}
                </Button>

                <div className="flex items-center gap-3 px-6 py-3 bg-white rounded-xl shadow-md border border-gray-200">
                  <span className="text-gray-700 font-medium">
                    {currentTexts.page} {currentPage} {currentTexts.of} {data.meta.totalPages}
                  </span>
                </div>

                <Button
                  variant="outline"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage >= data.meta.totalPages}
                  className="flex items-center gap-2 px-6 py-3 border-2 border-orange-200 hover:border-orange-300 hover:bg-orange-50 transition-all duration-300"
                >
                  {currentTexts.next}
                  <ChevronRight className="w-5 h-5" />
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
