"use client"

import { useLanguage } from "@/contexts/LanguageContext"
import type { Tour } from "@/types/tour"
import TourCard from "@/components/tour-card"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useRef, useState, useEffect, useCallback } from "react"
import { motion } from "framer-motion"
import { api } from "@/lib/axiosInstance"
import { TourCategory, Difficulty, PackageType } from "@/types/tour"

const mockTours: Tour[] = [
  {
    _id: "mock-1",
    title: {
      es: "Cañón del Colca Full Day",
      en: "Colca Canyon Full Day",
      fr: "Canyon de Colca Journée Complète",
      de: "Colca Canyon Ganztägig",
      it: "Canyon del Colca Giornata Intera",
    },
    subtitle: {
      es: "Una experiencia inolvidable en el Colca",
      en: "An unforgettable experience in Colca",
      fr: "Une expérience inoubliable à Colca",
      de: "Ein unvergessliches Erlebnis in Colca",
      it: "Un'esperienza indimenticabile a Colca",
    },
    imageUrl: "/machu-picchu-ancient-ruins.jpg",
    imageId: "z1hallunxkmjctm3ljqy",
    price: 50,
    originalPrice: 150,
    duration: {
      es: "1 día",
      en: "1 day",
      fr: "1 jour",
      de: "1 Tag",
      it: "1 giorno",
    },
    rating: 5,
    reviews: 5000,
    location: "Arequipa",
    region: "Chivay",
    category: TourCategory.AVENTURA,
    difficulty: Difficulty.EASY,
    packageType: PackageType.Basico,
    highlights: [
      {
        es: "Mirador Cruz del Cóndor",
        en: "Cruz del Condor Viewpoint",
        fr: "Point de vue Cruz del Condor",
        de: "Cruz del Condor Aussichtspunkt",
        it: "Punto panoramico Cruz del Condor",
      },
      {
        es: "Baños termales de la Calera",
        en: "La Calera Hot Springs",
        fr: "Sources chaudes de La Calera",
        de: "La Calera Thermalquellen",
        it: "Terme di La Calera",
      },
      {
        es: "Pueblos tradicionales",
        en: "Traditional villages",
        fr: "Villages traditionnels",
        de: "Traditionelle Dörfer",
        it: "Villaggi tradizionali",
      },
    ],
    featured: true,
    slug: "canon-del-colca-full-day",
    startTime: "08:00 AM",
    createdAt: "2025-09-20T22:17:06.843Z",
    updatedAt: "2025-09-20T22:17:06.843Z",
  },
  {
    _id: "mock-2",
    title: {
      es: "Machu Picchu 2 Días",
      en: "Machu Picchu 2 Days",
      fr: "Machu Picchu 2 Jours",
      de: "Machu Picchu 2 Tage",
      it: "Machu Picchu 2 Giorni",
    },
    subtitle: {
      es: "Descubre la ciudadela perdida de los Incas",
      en: "Discover the lost citadel of the Incas",
      fr: "Découvrez la citadelle perdue des Incas",
      de: "Entdecken Sie die verlorene Zitadelle der Inkas",
      it: "Scopri la cittadella perduta degli Incas",
    },
    imageUrl: "/lake-titicaca-floating-islands.jpg",
    imageId: "machu-picchu-2d",
    price: 280,
    originalPrice: 350,
    duration: {
      es: "2 días",
      en: "2 days",
      fr: "2 jours",
      de: "2 Tage",
      it: "2 giorni",
    },
    rating: 4.8,
    reviews: 3200,
    location: "Cusco",
    region: "Aguas Calientes",
    category: TourCategory.CULTURAL,
    difficulty: Difficulty.MODERATE,
    packageType: PackageType.Premium,
    highlights: [
      {
        es: "Tren a Aguas Calientes",
        en: "Train to Aguas Calientes",
        fr: "Train vers Aguas Calientes",
        de: "Zug nach Aguas Calientes",
        it: "Treno per Aguas Calientes",
      },
      {
        es: "Guía especializado",
        en: "Specialized guide",
        fr: "Guide spécialisé",
        de: "Spezialisierter Führer",
        it: "Guida specializzata",
      },
      {
        es: "Entrada a Machu Picchu",
        en: "Machu Picchu entrance",
        fr: "Entrée à Machu Picchu",
        de: "Machu Picchu Eintritt",
        it: "Ingresso a Machu Picchu",
      },
    ],
    featured: true,
    slug: "machu-picchu-2-dias",
    startTime: "05:00 AM",
    createdAt: "2025-09-20T22:17:06.843Z",
    updatedAt: "2025-09-20T22:17:06.843Z",
  },
]

export function ToursSection() {
  const { language } = useLanguage()
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)
  const [tours, setTours] = useState<Tour[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const sectionTitles = {
    es: "Tours Destacados",
    en: "Featured Tours",
    fr: "Tours Vedettes",
    de: "Empfohlene Touren",
    nl: "Uitgelichte Tours",
    it: "Tour in Evidenza",
  }

  const sectionSubtitles = {
    es: "Descubre los mejores destinos del Perú",
    en: "Discover the best destinations in Peru",
    fr: "Découvrez les meilleures destinations du Pérou",
    de: "Entdecken Sie die besten Reiseziele in Peru",
    nl: "Ontdek de beste bestemmingen in Peru",
    it: "Scopri le migliori destinazioni del Perù",
  }

  interface ApiTourData {
    _id: string
    title: string
    subtitle: string
    imageUrl: string
    imageId: string
    price: number
    originalPrice: number
    duration: string
    rating: number
    reviews: number
    location: string
    region: string
    category: TourCategory
    difficulty: Difficulty
    packageType: PackageType
    highlights: string[]
    featured: boolean
    slug: string
    startTime: string
    createdAt: string
    updatedAt: string
  }

  const transformApiDataToTour = useCallback((apiTour: ApiTourData): Tour => {
    // Helper function to create TranslatedText from string
    const createTranslatedText = (text: string) => ({
      es: text,
      en: text,
      fr: text,
      de: text,
      it: text,
    })

    // Transform highlights array
    const transformedHighlights = Array.isArray(apiTour.highlights)
      ? apiTour.highlights.map((highlight: string) => createTranslatedText(highlight))
      : []

    return {
      _id: apiTour._id,
      title: createTranslatedText(apiTour.title),
      subtitle: createTranslatedText(apiTour.subtitle),
      imageUrl: apiTour.imageUrl,
      imageId: apiTour.imageId,
      price: apiTour.price,
      originalPrice: apiTour.originalPrice,
      duration: createTranslatedText(apiTour.duration),
      rating: apiTour.rating,
      reviews: apiTour.reviews,
      location: apiTour.location,
      region: apiTour.region,
      category: apiTour.category,
      difficulty: apiTour.difficulty,
      packageType: apiTour.packageType,
      highlights: transformedHighlights,
      featured: apiTour.featured,
      slug: apiTour.slug,
      startTime: apiTour.startTime,
      createdAt: apiTour.createdAt,
      updatedAt: apiTour.updatedAt,
    }
  }, [])

  useEffect(() => {
    const fetchFeaturedTours = async () => {
      try {
        setLoading(true)
        setError(null)

        const langCode =
          language === "es"
            ? "es"
            : language === "en"
              ? "en"
              : language === "fr"
                ? "fr"
                : language === "de"
                  ? "de"
                  : language === "it"
                    ? "it"
                    : "es"

        console.log(`[v0] Fetching featured tours for language: ${langCode}`)

        const response = await api.get(`/tours/top?lang=${langCode}`)

        console.log(`[v0] API Response:`, response.data)

        if (response.data && response.data.data && Array.isArray(response.data.data)) {
          const transformedTours = response.data.data.map(transformApiDataToTour)
          setTours(transformedTours)
        } else if (response.data && Array.isArray(response.data)) {
          const transformedTours = response.data.map(transformApiDataToTour)
          setTours(transformedTours)
        } else {
          console.warn("[v0] API response is not in expected format, using mock data")
          setTours(mockTours)
        }
      } catch (err) {
        console.error("[v0] Error fetching featured tours:", err)
        setError("Failed to load tours")
        setTours(mockTours)
      } finally {
        setLoading(false)
      }
    }

    fetchFeaturedTours()
  }, [language, transformApiDataToTour])

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 420
      const newScrollLeft =
        scrollContainerRef.current.scrollLeft + (direction === "right" ? scrollAmount : -scrollAmount)

      scrollContainerRef.current.scrollTo({
        left: newScrollLeft,
        behavior: "smooth",
      })
    }
  }

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current
      setCanScrollLeft(scrollLeft > 0)
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10)
    }
  }

  if (loading) {
    return (
      <section
        id="tours-destacados"
        className="py-16 bg-gradient-to-br from-slate-50 via-white to-amber-50/30 relative overflow-hidden"
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">
            {language === "es"
              ? "Cargando tours..."
              : language === "en"
                ? "Loading tours..."
                : language === "fr"
                  ? "Chargement des tours..."
                  : language === "de"
                    ? "Touren werden geladen..."
                    : language === "it"
                      ? "Caricamento tour..."
                      : "Cargando tours..."}
          </p>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section
        id="tours-destacados"
        className="py-16 bg-gradient-to-br from-slate-50 via-white to-amber-50/30 relative overflow-hidden"
      >
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
          >
            {language === "es"
              ? "Reintentar"
              : language === "en"
                ? "Retry"
                : language === "fr"
                  ? "Réessayer"
                  : language === "de"
                    ? "Wiederholen"
                    : language === "it"
                      ? "Riprova"
                      : "Reintentar"}
          </button>
        </div>
      </section>
    )
  }

  return (
    <section
      id="tours-destacados"
      className="py-16 bg-gradient-to-br from-slate-50 via-white to-amber-50/30 relative overflow-hidden"
    >
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-amber-200/20 to-orange-200/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-blue-200/20 to-cyan-200/20 rounded-full blur-3xl" />
      </div>

      <div className="text-center mb-12 px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <h2 className="text-4xl font-bold bg-gradient-to-r from-amber-600 via-orange-500 to-amber-700 bg-clip-text text-transparent mb-4 tracking-tight">
            {sectionTitles[language]}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">{sectionSubtitles[language]}</p>
        </motion.div>
      </div>

      {tours.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">
            {language === "es"
              ? "No hay tours disponibles en este momento."
              : language === "en"
                ? "No tours available at the moment."
                : language === "fr"
                  ? "Aucun tour disponible pour le moment."
                  : language === "de"
                    ? "Derzeit sind keine Touren verfügbar."
                    : language === "it"
                      ? "Nessun tour disponibile al momento."
                      : "No hay tours disponibles en este momento."}
          </p>
        </div>
      ) : (
        <div className="relative w-full">
          <div
            ref={scrollContainerRef}
            onScroll={handleScroll}
            className="flex gap-6 overflow-x-auto scrollbar-hide pb-6 pl-6 pr-6 scroll-smooth"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
              WebkitOverflowScrolling: "touch",
            }}
          >
            {tours.map((tour, index) => (
              <div key={tour._id} className="flex-none w-[380px]">
                <TourCard tour={tour} index={index} />
              </div>
            ))}
          </div>

          <div className="flex justify-center items-center gap-4 mt-6">
            <motion.button
              onClick={() => scroll("left")}
              className={`w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm shadow-lg border border-gray-200/50 flex items-center justify-center transition-all duration-300 group hover:bg-white hover:shadow-xl ${
                !canScrollLeft ? "opacity-40 cursor-not-allowed" : "hover:border-amber-300"
              }`}
              disabled={!canScrollLeft}
              whileHover={{ scale: canScrollLeft ? 1.1 : 1 }}
              whileTap={{ scale: canScrollLeft ? 0.95 : 1 }}
            >
              <ChevronLeft className="w-4 h-4 text-gray-600 group-hover:text-amber-600 transition-colors duration-300" />
            </motion.button>

            <motion.button
              onClick={() => scroll("right")}
              className={`w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm shadow-lg border border-gray-200/50 flex items-center justify-center transition-all duration-300 group hover:bg-white hover:shadow-xl ${
                !canScrollRight ? "opacity-40 cursor-not-allowed" : "hover:border-amber-300"
              }`}
              disabled={!canScrollRight}
              whileHover={{ scale: canScrollRight ? 1.1 : 1 }}
              whileTap={{ scale: canScrollRight ? 0.95 : 1 }}
            >
              <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-amber-600 transition-colors duration-300" />
            </motion.button>
          </div>
        </div>
      )}
    </section>
  )
}

export default ToursSection
