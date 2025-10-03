"use client"

import { useState, useEffect, useCallback } from "react"
import { motion } from "framer-motion"
import { Loader2, MapPin, Calendar, Users, Star, Filter } from "lucide-react"
import { TourCard } from "@/components/tour-card"
import { ToursSearch } from "@/components/tours-search"
import { useLanguage } from "@/contexts/LanguageContext"
import { api } from "@/lib/axiosInstance"
import type { Tour } from "@/types/tour"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

interface SearchFilters {
  query: string
  category: string
  difficulty: string
  packageType: string
  priceRange: [number, number]
  rating: number
  location: string
}

export default function ToursPage() {
  const { language } = useLanguage()
  const [tours, setTours] = useState<Tour[]>([])
  const [filteredTours, setFilteredTours] = useState<Tour[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentFilters, setCurrentFilters] = useState<SearchFilters | null>(null)

  const pageTexts = {
    es: {
      title: "Descubre Nuestros Tours",
      subtitle: "Experiencias únicas en el corazón del Perú ancestral",
      loading: "Cargando tours...",
      error: "Error al cargar los tours",
      noResults: "No se encontraron tours",
      noResultsDesc: "Intenta ajustar tus filtros de búsqueda",
      totalTours: "tours encontrados",
      featuredBadge: "Destacado",
      retry: "Reintentar",
      clearFilters: "Limpiar filtros",
    },
    en: {
      title: "Discover Our Tours",
      subtitle: "Unique experiences in the heart of ancient Peru",
      loading: "Loading tours...",
      error: "Error loading tours",
      noResults: "No tours found",
      noResultsDesc: "Try adjusting your search filters",
      totalTours: "tours found",
      featuredBadge: "Featured",
      retry: "Retry",
      clearFilters: "Clear filters",
    },
    fr: {
      title: "Découvrez Nos Tours",
      subtitle: "Expériences uniques au cœur du Pérou ancestral",
      loading: "Chargement des tours...",
      error: "Erreur lors du chargement des tours",
      noResults: "Aucun tour trouvé",
      noResultsDesc: "Essayez d'ajuster vos filtres de recherche",
      totalTours: "tours trouvés",
      featuredBadge: "Vedette",
      retry: "Réessayer",
      clearFilters: "Effacer les filtres",
    },
    de: {
      title: "Entdecken Sie Unsere Touren",
      subtitle: "Einzigartige Erlebnisse im Herzen des alten Peru",
      loading: "Touren werden geladen...",
      error: "Fehler beim Laden der Touren",
      noResults: "Keine Touren gefunden",
      noResultsDesc: "Versuchen Sie, Ihre Suchfilter anzupassen",
      totalTours: "Touren gefunden",
      featuredBadge: "Empfohlen",
      retry: "Wiederholen",
      clearFilters: "Filter löschen",
    },
    it: {
      title: "Scopri i Nostri Tour",
      subtitle: "Esperienze uniche nel cuore del Perù ancestrale",
      loading: "Caricamento tour...",
      error: "Errore nel caricamento dei tour",
      noResults: "Nessun tour trovato",
      noResultsDesc: "Prova ad aggiustare i tuoi filtri di ricerca",
      totalTours: "tour trovati",
      featuredBadge: "In Evidenza",
      retry: "Riprova",
      clearFilters: "Cancella filtri",
    },
  }

  const texts = pageTexts[language]

  const fetchTours = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      console.log("[v0] Fetching tours from API...")
      const response = await api.get("/tours", {
        params: { lang: language },
      })
      console.log("[v0] API Response:", response.data)

      const toursData = response.data.data || response.data || []
      console.log("[v0] Tours data:", toursData)

      setTours(toursData)
      setFilteredTours(toursData)
    } catch (err: unknown) {
      console.error("[v0] Error fetching tours from API:", err)

      const error = err as Error
      if (error.message === "Network Error" || (error as { code?: string }).code === "ERR_NETWORK") {
        setError("NETWORK_ERROR")
      } else {
        setError("GENERAL_ERROR")
      }
    } finally {
      setLoading(false)
    }
  }, [language]) // Added language as dependency

  const handleSearch = (filters: SearchFilters) => {
    setCurrentFilters(filters)
    let filtered = [...tours]

    if (filters.query.trim()) {
      const query = filters.query.toLowerCase()
      filtered = filtered.filter((tour) => {
        const title = typeof tour.title === "string" ? tour.title : String(tour.title)
        const subtitle = typeof tour.subtitle === "string" ? tour.subtitle : String(tour.subtitle)
        const location = typeof tour.location === "string" ? tour.location : String(tour.location)
        const region = typeof tour.region === "string" ? tour.region : String(tour.region)

        return (
          title.toLowerCase().includes(query) ||
          subtitle.toLowerCase().includes(query) ||
          location.toLowerCase().includes(query) ||
          region.toLowerCase().includes(query)
        )
      })
    }

    if (filters.category !== "all") {
      filtered = filtered.filter((tour) => tour.category === filters.category)
    }

    if (filters.difficulty !== "all") {
      filtered = filtered.filter((tour) => tour.difficulty === filters.difficulty)
    }

    if (filters.packageType !== "all") {
      filtered = filtered.filter((tour) => tour.packageType === filters.packageType)
    }

    filtered = filtered.filter((tour) => tour.price >= filters.priceRange[0] && tour.price <= filters.priceRange[1])

    if (filters.rating > 0) {
      filtered = filtered.filter((tour) => tour.rating >= filters.rating)
    }

    if (filters.location.trim()) {
      const location = filters.location.toLowerCase()
      filtered = filtered.filter((tour) => {
        const tourLocation = typeof tour.location === "string" ? tour.location : String(tour.location)
        const tourRegion = typeof tour.region === "string" ? tour.region : String(tour.region)

        return tourLocation.toLowerCase().includes(location) || tourRegion.toLowerCase().includes(location)
      })
    }

    setFilteredTours(filtered)
  }

  const clearAllFilters = () => {
    setCurrentFilters(null)
    setFilteredTours(tours)
  }

  useEffect(() => {
    fetchTours()
  }, [fetchTours])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 animate-spin text-amber-500 mx-auto" />
          <p className="text-lg text-muted-foreground">{texts.loading}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
      <div className="bg-gradient-to-r from-amber-600 to-orange-600 text-white py-16 pt-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center space-y-4"
          >
            <h1 className="text-4xl md:text-6xl font-bold text-balance">{texts.title}</h1>
            <p className="text-xl md:text-2xl text-amber-100 max-w-3xl mx-auto text-pretty">{texts.subtitle}</p>
            <div className="flex items-center justify-center gap-6 text-amber-200 mt-8">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                <span>15+ Destinos</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                <span>Tours Diarios</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                <span>Grupos Pequeños</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 fill-current" />
                <span>4.8+ Rating</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-8 relative z-10">
        <Card className="p-6 shadow-2xl bg-white/95 backdrop-blur-sm">
          <ToursSearch onSearch={handleSearch} isLoading={loading} />
        </Card>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-gray-900">
              {filteredTours.length} {texts.totalTours}
            </h2>
            {currentFilters && (
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm text-muted-foreground">Filtros activos:</span>
                {currentFilters.query && <Badge variant="secondary">{`"${currentFilters.query}"`}</Badge>}
                {currentFilters.category !== "all" && <Badge variant="secondary">{currentFilters.category}</Badge>}
                {currentFilters.difficulty !== "all" && <Badge variant="secondary">{currentFilters.difficulty}</Badge>}
                {currentFilters.location && <Badge variant="secondary">{currentFilters.location}</Badge>}
                <Button variant="ghost" size="sm" onClick={clearAllFilters} className="text-xs">
                  {texts.clearFilters}
                </Button>
              </div>
            )}
          </div>
        </div>

        {error && (
          <Card className="p-8 text-center">
            <div className="space-y-4">
              {error === "NETWORK_ERROR" ? (
                <>
                  <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto">
                    <MapPin className="w-8 h-8 text-orange-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">Error de conexión</h3>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    No se puede conectar con la API. Verifica que la URL sea correcta y que la API esté funcionando.
                  </p>
                </>
              ) : (
                <>
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                    <MapPin className="w-8 h-8 text-red-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">{texts.error}</h3>
                  <p className="text-muted-foreground">Ocurrió un error inesperado al cargar los tours.</p>
                </>
              )}
              <Button onClick={fetchTours} variant="outline">
                {texts.retry}
              </Button>
            </div>
          </Card>
        )}

        {!loading && !error && filteredTours.length === 0 && (
          <Card className="p-12 text-center">
            <div className="space-y-4">
              <Filter className="w-16 h-16 text-muted-foreground mx-auto" />
              <h3 className="text-2xl font-semibold text-gray-900">{texts.noResults}</h3>
              <p className="text-muted-foreground max-w-md mx-auto">{texts.noResultsDesc}</p>
              <Button onClick={clearAllFilters} variant="outline">
                {texts.clearFilters}
              </Button>
            </div>
          </Card>
        )}

        {!loading && !error && filteredTours.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredTours.map((tour, index) => {
              console.log("[v0] Rendering tour:", tour._id, tour.title)
              return <TourCard key={tour._id} tour={tour} index={index} />
            })}
          </div>
        )}
      </div>
    </div>
  )
}
