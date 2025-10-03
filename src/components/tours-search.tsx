"use client"

import { useState } from "react"
import { Search, Filter, MapPin, Calendar, Users, Star } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Card } from "@/components/ui/card"
import { useLanguage } from "@/contexts/LanguageContext"
import { TourCategory, Difficulty, PackageType } from "@/types/tour"

interface SearchFilters {
  query: string
  category: TourCategory | "all"
  difficulty: Difficulty | "all"
  packageType: PackageType | "all"
  priceRange: [number, number]
  rating: number
  location: string
  date: string
  groupSize: number
}

interface ToursSearchProps {
  onSearch: (filters: SearchFilters) => void
  isLoading?: boolean
}

export function ToursSearch({ onSearch, isLoading }: ToursSearchProps) {
  const { language } = useLanguage()
  const [filters, setFilters] = useState<SearchFilters>({
    query: "",
    category: "all",
    difficulty: "all",
    packageType: "all",
    priceRange: [0, 1000],
    rating: 0,
    location: "",
    date: "",
    groupSize: 0,
  })
  const [showFilters, setShowFilters] = useState(false)

  const searchTexts = {
    es: {
      searchPlaceholder: "Buscar tours por nombre, destino...",
      searchButton: "Buscar",
      filters: "Filtros",
      category: "Categoría",
      difficulty: "Dificultad",
      packageType: "Tipo de Paquete",
      priceRange: "Rango de Precio",
      rating: "Calificación Mínima",
      location: "Ubicación",
      clearFilters: "Limpiar Filtros",
      all: "Todos",
      from: "Desde",
      to: "Hasta",
      stars: "estrellas",
      date: "Fecha",
      groupSize: "Tamaño del Grupo",
    },
    en: {
      searchPlaceholder: "Search tours by name, destination...",
      searchButton: "Search",
      filters: "Filters",
      category: "Category",
      difficulty: "Difficulty",
      packageType: "Package Type",
      priceRange: "Price Range",
      rating: "Minimum Rating",
      location: "Location",
      clearFilters: "Clear Filters",
      all: "All",
      from: "From",
      to: "To",
      stars: "stars",
      date: "Date",
      groupSize: "Group Size",
    },
    fr: {
      searchPlaceholder: "Rechercher des tours par nom, destination...",
      searchButton: "Rechercher",
      filters: "Filtres",
      category: "Catégorie",
      difficulty: "Difficulté",
      packageType: "Type de Forfait",
      priceRange: "Gamme de Prix",
      rating: "Note Minimale",
      location: "Emplacement",
      clearFilters: "Effacer les Filtres",
      all: "Tous",
      from: "De",
      to: "À",
      stars: "étoiles",
      date: "Date",
      groupSize: "Taille du Groupe",
    },
    de: {
      searchPlaceholder: "Touren nach Name, Ziel suchen...",
      searchButton: "Suchen",
      filters: "Filter",
      category: "Kategorie",
      difficulty: "Schwierigkeit",
      packageType: "Pakettyp",
      priceRange: "Preisbereich",
      rating: "Mindestbewertung",
      location: "Standort",
      clearFilters: "Filter Löschen",
      all: "Alle",
      from: "Von",
      to: "Bis",
      stars: "Sterne",
      date: "Datum",
      groupSize: "Gruppengröße",
    },
    it: {
      searchPlaceholder: "Cerca tour per nome, destinazione...",
      searchButton: "Cerca",
      filters: "Filtri",
      category: "Categoria",
      difficulty: "Difficoltà",
      packageType: "Tipo di Pacchetto",
      priceRange: "Fascia di Prezzo",
      rating: "Valutazione Minima",
      location: "Posizione",
      clearFilters: "Cancella Filtri",
      all: "Tutti",
      from: "Da",
      to: "A",
      stars: "stelle",
      date: "Data",
      groupSize: "Dimensione del Gruppo",
    },
  }

  const texts = searchTexts[language]

  const handleSearch = () => {
    onSearch(filters)
  }

  const clearFilters = () => {
    const resetFilters: SearchFilters = {
      query: "",
      category: "all",
      difficulty: "all",
      packageType: "all",
      priceRange: [0, 1000],
      rating: 0,
      location: "",
      date: "",
      groupSize: 0,
    }
    setFilters(resetFilters)
    onSearch(resetFilters)
  }

  const updateFilter = (key: keyof SearchFilters, value: SearchFilters[keyof SearchFilters]) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
  }

  return (
    <div className="space-y-6">
      {/* Main Search Bar */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder={texts.searchPlaceholder}
            value={filters.query}
            onChange={(e) => updateFilter("query", e.target.value)}
            className="pl-10 h-12 text-lg"
            onKeyPress={(e) => e.key === "Enter" && handleSearch()}
          />
        </div>
        <Button onClick={() => setShowFilters(!showFilters)} variant="outline" className="h-12 px-6">
          <Filter className="w-4 h-4 mr-2" />
          {texts.filters}
        </Button>
        <Button
          onClick={handleSearch}
          className="h-12 px-8 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
          disabled={isLoading}
        >
          <Search className="w-4 h-4 mr-2" />
          {texts.searchButton}
        </Button>
      </div>

      {/* Advanced Filters */}
      {showFilters && (
        <Card className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">{texts.filters}</h3>
            <Button variant="ghost" onClick={clearFilters} className="text-sm">
              {texts.clearFilters}
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Category Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium">{texts.category}</label>
              <Select
                value={filters.category}
                onValueChange={(value) => updateFilter("category", value as TourCategory | "all")}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{texts.all}</SelectItem>
                  <SelectItem value={TourCategory.ADVENTURE}>Adventure</SelectItem>
                  <SelectItem value={TourCategory.CULTURAL}>Cultural</SelectItem>
                  <SelectItem value={TourCategory.NATURE}>Nature</SelectItem>
                  <SelectItem value={TourCategory.HISTORICAL}>Historical</SelectItem>
                  <SelectItem value={TourCategory.GASTRONOMIC}>Gastronomic</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Difficulty Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium">{texts.difficulty}</label>
              <Select
                value={filters.difficulty}
                onValueChange={(value) => updateFilter("difficulty", value as Difficulty | "all")}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{texts.all}</SelectItem>
                  <SelectItem value={Difficulty.EASY}>Fácil</SelectItem>
                  <SelectItem value={Difficulty.MODERATE}>Moderado</SelectItem>
                  <SelectItem value={Difficulty.DIFFICULT}>Difícil</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Package Type Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium">{texts.packageType}</label>
              <Select
                value={filters.packageType}
                onValueChange={(value) => updateFilter("packageType", value as PackageType | "all")}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{texts.all}</SelectItem>
                  <SelectItem value={PackageType.PRIVATE}>Private</SelectItem>
                  <SelectItem value={PackageType.GROUP}>Group</SelectItem>
                  <SelectItem value={PackageType.SHARED}>Shared</SelectItem>
                  <SelectItem value={PackageType.BASIC}>Básico</SelectItem>
                  <SelectItem value={PackageType.PREMIUM}>Premium</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Location Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium">{texts.location}</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Cusco, Lima, Arequipa..."
                  value={filters.location}
                  onChange={(e) => updateFilter("location", e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Date Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium">{texts.date}</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  type="date"
                  value={filters.date}
                  onChange={(e) => updateFilter("date", e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Group Size Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium">{texts.groupSize}</label>
              <div className="relative">
                <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  type="number"
                  placeholder="Enter group size"
                  value={filters.groupSize}
                  onChange={(e) => updateFilter("groupSize", Number.parseInt(e.target.value))}
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          {/* Price Range */}
          <div className="space-y-4">
            <label className="text-sm font-medium">{texts.priceRange}</label>
            <div className="px-4">
              <Slider
                value={filters.priceRange}
                onValueChange={(value) => updateFilter("priceRange", value as [number, number])}
                max={1000}
                min={0}
                step={10}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-muted-foreground mt-2">
                <span>S/{filters.priceRange[0]}</span>
                <span>S/{filters.priceRange[1]}</span>
              </div>
            </div>
          </div>

          {/* Rating Filter */}
          <div className="space-y-4">
            <label className="text-sm font-medium">{texts.rating}</label>
            <div className="flex gap-2">
              {[0, 1, 2, 3, 4, 5].map((rating) => (
                <Button
                  key={rating}
                  variant={filters.rating === rating ? "default" : "outline"}
                  size="sm"
                  onClick={() => updateFilter("rating", rating)}
                  className="flex items-center gap-1"
                >
                  <Star className="w-3 h-3" />
                  {rating === 0 ? texts.all : `${rating}+`}
                </Button>
              ))}
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}
