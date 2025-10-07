"use client"

import { useLanguage } from "@/contexts/LanguageContext"
import type { TourTransport } from "@/types/tour-transport"
import TransportCard from "@/components/transport-card"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useRef, useState, useEffect } from "react"
import { motion } from "framer-motion"
import { api } from "@/lib/axiosInstance"

export function TransportToursSection() {
  const { language } = useLanguage()
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)
  const [tours, setTours] = useState<TourTransport[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const sectionTitles = {
    es: "Transportes Turísticos",
    en: "Tourist Transport",
    fr: "Transport Touristique",
    de: "Touristentransport",
    nl: "Toeristisch Vervoer",
    it: "Trasporto Turistico",
  }

  const sectionSubtitles = {
    es: "Descubre los mejores destinos del Perú",
    en: "Discover the best destinations in Peru",
    fr: "Découvrez les meilleures destinations du Pérou",
    de: "Entdecken Sie die besten Reiseziele in Peru",
    nl: "Ontdek de beste bestemmingen in Peru",
    it: "Scopri le migliori destinazioni del Perù",
  }

  useEffect(() => {
    const fetchFeaturedTours = async () => {
      try {
        setLoading(true)
        setError(null)

        // Map language codes to API expected format
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

        const response = await api.get(`/tour-transport/featured?lang=${langCode}`)

        console.log(`[v0] API Response:`, response.data)

        if (response.data && Array.isArray(response.data)) {
          setTours(response.data)
        } else {
          console.warn("[v0] API response is not an array, using empty array")
          setTours([])
        }
      } catch (err) {
        console.error("[v0] Error fetching featured tours:", err)
        setError("Failed to load transport tours")
        // Fallback to empty array on error
        setTours([])
      } finally {
        setLoading(false)
      }
    }

    fetchFeaturedTours()
  }, [language]) // Re-fetch when language changes

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
        id="transportes-turistico"
        className="py-16 bg-gradient-to-br from-slate-50 via-white to-amber-50/30 relative overflow-hidden"
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">
            {language === "es"
              ? "Cargando transportes..."
              : language === "en"
                ? "Loading transports..."
                : language === "fr"
                  ? "Chargement des transports..."
                  : language === "de"
                    ? "Transporte werden geladen..."
                    : language === "it"
                      ? "Caricamento trasporti..."
                      : "Cargando transportes..."}
          </p>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section
        id="transportes-turistico"
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
      id="transportes-turistico"
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
              ? "No hay transportes disponibles en este momento."
              : language === "en"
                ? "No transports available at the moment."
                : language === "fr"
                  ? "Aucun transport disponible pour le moment."
                  : language === "de"
                    ? "Derzeit sind keine Transporte verfügbar."
                    : language === "it"
                      ? "Nessun trasporto disponibile al momento."
                      : "No hay transportes disponibles en este momento."}
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
                <TransportCard tour={tour} index={index} />
              </div>
            ))}
          </div>

          <div className="flex justify-center items-center gap-4 mt-6">
            <motion.button
              onClick={() => scroll("left")}
              className={`w-12 h-12 rounded-full bg-gradient-to-br from-white to-gray-50 shadow-xl border-2 flex items-center justify-center transition-all duration-300 group ${
                !canScrollLeft
                  ? "opacity-40 cursor-not-allowed border-gray-200"
                  : "border-amber-300 hover:border-amber-400 hover:shadow-2xl hover:from-amber-50 hover:to-orange-50"
              }`}
              disabled={!canScrollLeft}
              whileHover={{ scale: canScrollLeft ? 1.15 : 1 }}
              whileTap={{ scale: canScrollLeft ? 0.9 : 1 }}
            >
              <ChevronLeft
                className={`w-5 h-5 transition-all duration-300 ${
                  canScrollLeft ? "text-amber-600 group-hover:text-orange-600" : "text-gray-400"
                }`}
                strokeWidth={3}
              />
            </motion.button>

            <motion.button
              onClick={() => scroll("right")}
              className={`w-12 h-12 rounded-full bg-gradient-to-br from-white to-gray-50 shadow-xl border-2 flex items-center justify-center transition-all duration-300 group ${
                !canScrollRight
                  ? "opacity-40 cursor-not-allowed border-gray-200"
                  : "border-amber-300 hover:border-amber-400 hover:shadow-2xl hover:from-amber-50 hover:to-orange-50"
              }`}
              disabled={!canScrollRight}
              whileHover={{ scale: canScrollRight ? 1.15 : 1 }}
              whileTap={{ scale: canScrollRight ? 0.9 : 1 }}
            >
              <ChevronRight
                className={`w-5 h-5 transition-all duration-300 ${
                  canScrollRight ? "text-amber-600 group-hover:text-orange-600" : "text-gray-400"
                }`}
                strokeWidth={3}
              />
            </motion.button>
          </div>
        </div>
      )}
    </section>
  )
}

export default TransportToursSection
