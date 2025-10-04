"use client"
import { api } from "@/lib/axiosInstance"
import { notFound } from "next/navigation"
import Image from "next/image"
import {
  Calendar,
  Clock,
  MapPin,
  Star,
  Users,
  Phone,
  MessageCircle,
  Navigation,
  Shield,
  Award,
  Globe,
  ChevronLeft,
  ChevronRight,
  ShoppingCart,
} from "lucide-react"
import { useLanguage } from "@/contexts/LanguageContext"
import { useEffect, useState, useRef } from "react"
import { GoogleMap, LoadScript, DirectionsService, DirectionsRenderer } from "@react-google-maps/api"
import { type CreateCartDto, CartItemType } from "@/types/cart"
import { toast } from "sonner"
import Link from "next/link"

declare global {
  interface Window {
    google: typeof google
  }
}

interface TranslatedText {
  es?: string
  en?: string
  fr?: string
  de?: string
  it?: string
}

interface TourTransport {
  _id: string
  title: TranslatedText | string
  description: TranslatedText | string
  termsAndConditions: TranslatedText | string
  origin: {
    name: string
    lat: number
    lng: number
  }
  destination: {
    name: string
    lat: number
    lng: number
  }
  intermediateStops?: Array<{
    name: string
    lat: number
    lng: number
  }>
  availableDays: string[]
  departureTime?: string
  arrivalTime?: string
  durationInHours?: number
  duration?: string
  price: number
  rating?: number
  vehicleId?: string
  routeCode?: string
  isActive?: boolean
  slug?: string
  itinerary?: Array<{
    day: number
    title: TranslatedText | string
    description: TranslatedText | string
    imageUrl?: string
    imageId?: string
    route?: Array<{
      location: string
      description: TranslatedText | string
      imageUrl?: string
      imageId?: string
      stopTime?: string
    }>
  }>
  imageUrl?: string
  imageId?: string
  createdAt: string
  updatedAt: string
  __v: number
}

interface Props {
  params: Promise<{ slug: string }>
}

const getTranslatedText = (text: TranslatedText | string | undefined, language: string): string => {
  if (!text) return ""
  if (typeof text === "string") return text
  return text[language as keyof TranslatedText] || text.es || text.en || ""
}

const translations = {
  es: {
    loading: "Cargando paquete turístico...",
    mapNotAvailable: "Mapa no disponible",
    mapApiKeyMissing: "La clave de API de Google Maps no está configurada.",
    origin: "Origen",
    destination: "Destino",
    loadingMap: "Cargando mapa...",
    interactiveMap: "Mapa Interactivo",
    roadRoute: "Ruta de Viaje",
    roadRouteCalculated: "Ruta por carretera calculada",
    showingLocations: "Mostrando ubicaciones",
    roadDistance: "Distancia por carretera",
    calculating: "Calculando...",
    estimatedTime: "Tiempo estimado",
    intermediateStops: "Paradas intermedias",
    yearsExperience: "Años de experiencia",
    satisfiedTourists: "Turistas satisfechos",
    safeReliable: "Seguro y confiable",
    supportAvailable: "Soporte disponible",
    packageDescription: "Descripción del Paquete",
    smallGroup: "Grupo Pequeño",
    smallGroupDesc: "Máximo 12 personas para una experiencia personalizada y cómoda",
    personalizedAttention: "Atención personalizada",
    flexibilityStops: "Más flexibilidad en paradas",
    familyEnvironment: "Ambiente familiar",
    expertGuide: "Guía Experto",
    expertGuideDesc: "Guía local certificado con conocimiento profundo de la región",
    officialCertification: "Certificación oficial",
    historicalKnowledge: "Conocimiento histórico",
    multilingual: "Multilingüe",
    allInclusive: "Todo Incluido",
    allInclusiveDesc: "Transporte, comidas, entradas y alojamiento incluidos",
    premiumTransport: "Transporte premium",
    typicalMeals: "Comidas típicas",
    siteEntries: "Entradas a sitios",
    travelInsurance: "Seguro de Viaje",
    travelInsuranceDesc: "Cobertura completa durante todo el recorrido",
    medicalInsurance: "Seguro médico",
    assistance24: "Asistencia 24/7",
    luggageCoverage: "Cobertura de equipaje",
    detailedItinerary: "Itinerario Detallado",
    dayStops: "Paradas del día",
    imageGallery: "Galería de Imágenes",
    perPerson: "por persona",
    specialPriceForForeigners: "¡Precio especial para extranjeros!",
    tourLanguage: "Idioma del tour",
    departureDate: "Fecha de Salida",
    numberOfTravelers: "Número de viajeros",
    person: "persona",
    people: "personas",
    availableDays: "Días Disponibles",
    reserveNow: "Reservar Ahora",
    consultWhatsApp: "Consultar por WhatsApp",
    callNow: "Llamar Ahora",
    schedules: "Horarios",
    departure: "Salida",
    arrival: "Llegada",
    securePayment: "Pago Seguro",
    certified: "Certificado",
    routeInfo: "Información de la Ruta",
    coordinates: "Coordenadas",
    duration: "Duración",
    hours: "horas",
    directTrip: "Viaje directo sin paradas intermedias",
    interactiveRouteMap: "Mapa interactivo de la ruta",
    travelHours: "horas de viaje",
    termsConditions: "Términos y Condiciones",
    monday: "Lunes",
    tuesday: "Martes",
    wednesday: "Miércoles",
    thursday: "Jueves",
    friday: "Viernes",
    saturday: "Sábado",
    sunday: "Domingo",
  },
  en: {
    loading: "Loading tour package...",
    mapNotAvailable: "Map not available",
    mapApiKeyMissing: "Google Maps API key is not configured.",
    origin: "Origin",
    destination: "Destination",
    loadingMap: "Loading map...",
    interactiveMap: "Interactive Map",
    roadRoute: "Travel Route",
    roadRouteCalculated: "Road route calculated",
    showingLocations: "Showing locations",
    roadDistance: "Road distance",
    calculating: "Calculating...",
    estimatedTime: "Estimated time",
    intermediateStops: "Intermediate stops",
    yearsExperience: "Years of experience",
    satisfiedTourists: "Satisfied tourists",
    safeReliable: "Safe and reliable",
    supportAvailable: "Support available",
    packageDescription: "Package Description",
    smallGroup: "Small Group",
    smallGroupDesc: "Maximum 12 people for a personalized and comfortable experience",
    personalizedAttention: "Personalized attention",
    flexibilityStops: "More flexibility in stops",
    familyEnvironment: "Family environment",
    expertGuide: "Expert Guide",
    expertGuideDesc: "Certified local guide with deep knowledge of the region",
    officialCertification: "Official certification",
    historicalKnowledge: "Historical knowledge",
    multilingual: "Multilingual",
    allInclusive: "All Inclusive",
    allInclusiveDesc: "Transport, meals, tickets and accommodation included",
    premiumTransport: "Premium transport",
    typicalMeals: "Typical meals",
    siteEntries: "Site entries",
    travelInsurance: "Travel Insurance",
    travelInsuranceDesc: "Complete coverage throughout the journey",
    medicalInsurance: "Medical insurance",
    assistance24: "24/7 assistance",
    luggageCoverage: "Luggage coverage",
    detailedItinerary: "Detailed Itinerary",
    dayStops: "Day stops",
    imageGallery: "Image Gallery",
    perPerson: "per person",
    specialPriceForForeigners: "Special price for foreigners!",
    tourLanguage: "Tour language",
    departureDate: "Departure Date",
    numberOfTravelers: "Number of travelers",
    person: "person",
    people: "people",
    availableDays: "Available Days",
    reserveNow: "Reserve Now",
    consultWhatsApp: "Consult via WhatsApp",
    callNow: "Call Now",
    schedules: "Schedules",
    departure: "Departure",
    arrival: "Arrival",
    securePayment: "Secure Payment",
    certified: "Certified",
    routeInfo: "Route Information",
    coordinates: "Coordinates",
    duration: "Duration",
    hours: "hours",
    directTrip: "Direct trip without intermediate stops",
    interactiveRouteMap: "Interactive route map",
    travelHours: "travel hours",
    termsConditions: "Terms and Conditions",
    monday: "Monday",
    tuesday: "Tuesday",
    wednesday: "Wednesday",
    thursday: "Thursday",
    friday: "Friday",
    saturday: "Saturday",
    sunday: "Sunday",
  },
  fr: {
    loading: "Chargement du forfait touristique...",
    mapNotAvailable: "Carte non disponible",
    mapApiKeyMissing: "La clé API Google Maps n'est pas configurée.",
    origin: "Origine",
    destination: "Destination",
    loadingMap: "Chargement de la carte...",
    interactiveMap: "Carte Interactive",
    roadRoute: "Itinéraire de Voyage",
    roadRouteCalculated: "Itinéraire routier calculé",
    showingLocations: "Affichage des emplacements",
    roadDistance: "Distance routière",
    calculating: "Calcul en cours...",
    estimatedTime: "Temps estimé",
    intermediateStops: "Arrêts intermédiaires",
    yearsExperience: "Années d'expérience",
    satisfiedTourists: "Touristes satisfaits",
    safeReliable: "Sûr et fiable",
    supportAvailable: "Support disponible",
    packageDescription: "Description du Forfait",
    smallGroup: "Petit Groupe",
    smallGroupDesc: "Maximum 12 personnes pour une expérience personnalisée et confortable",
    personalizedAttention: "Attention personnalisée",
    flexibilityStops: "Plus de flexibilité dans les arrêts",
    familyEnvironment: "Environnement familial",
    expertGuide: "Guide Expert",
    expertGuideDesc: "Guide local certifié avec une connaissance approfondie de la région",
    officialCertification: "Certification officielle",
    historicalKnowledge: "Connaissances historiques",
    multilingual: "Multilingue",
    allInclusive: "Tout Inclus",
    allInclusiveDesc: "Transport, repas, billets et hébergement inclus",
    premiumTransport: "Transport premium",
    typicalMeals: "Repas typiques",
    siteEntries: "Entrées de sites",
    travelInsurance: "Assurance Voyage",
    travelInsuranceDesc: "Couverture complète tout au long du voyage",
    medicalInsurance: "Assurance médicale",
    assistance24: "Assistance 24/7",
    luggageCoverage: "Couverture bagages",
    detailedItinerary: "Itinéraire Détaillé",
    dayStops: "Arrêts de la journée",
    imageGallery: "Galerie d'Images",
    perPerson: "par personne",
    specialPriceForForeigners: "Prix spécial pour les étrangers!",
    tourLanguage: "Langue du tour",
    departureDate: "Date de Départ",
    numberOfTravelers: "Nombre de voyageurs",
    person: "personne",
    people: "personnes",
    availableDays: "Jours Disponibles",
    reserveNow: "Réserver Maintenant",
    consultWhatsApp: "Consulter via WhatsApp",
    callNow: "Appeler Maintenant",
    schedules: "Horaires",
    departure: "Départ",
    arrival: "Arrivée",
    securePayment: "Paiement Sécurisé",
    certified: "Certifié",
    routeInfo: "Informations sur l'Itinéraire",
    coordinates: "Coordennées",
    duration: "Durée",
    hours: "heures",
    directTrip: "Voyage direct sans arrêts intermédiaires",
    interactiveRouteMap: "Carte interactive de l'itinéraire",
    travelHours: "heures de voyage",
    termsConditions: "Termes et Conditions",
    monday: "Lundi",
    tuesday: "Mardi",
    wednesday: "Mercredi",
    thursday: "Jeudi",
    friday: "Vendredi",
    saturday: "Samedi",
    sunday: "Dimanche",
  },
  de: {
    loading: "Tourpaket wird geladen...",
    mapNotAvailable: "Karte nicht verfügbar",
    mapApiKeyMissing: "Google Maps API-Schlüssel ist nicht konfiguriert.",
    origin: "Ursprung",
    destination: "Ziel",
    loadingMap: "Karte wird geladen...",
    interactiveMap: "Interaktive Karte",
    roadRoute: "Reiseroute",
    roadRouteCalculated: "Straßenroute berechnet",
    showingLocations: "Standorte anzeigen",
    roadDistance: "Straßenentfernung",
    calculating: "Berechnung...",
    estimatedTime: "Geschätzte Zeit",
    intermediateStops: "Zwischenstopps",
    yearsExperience: "Jahre Erfahrung",
    satisfiedTourists: "Zufriedene Touristen",
    safeReliable: "Sicher und zuverlässig",
    supportAvailable: "Support verfügbar",
    packageDescription: "Paketbeschreibung",
    smallGroup: "Kleine Gruppe",
    smallGroupDesc: "Maximal 12 Personen für ein personalisiertes und komfortables Erlebnis",
    personalizedAttention: "Persönliche Betreuung",
    flexibilityStops: "Mehr Flexibilität bei Stopps",
    familyEnvironment: "Familienumgebung",
    expertGuide: "Expertenführer",
    expertGuideDesc: "Zertifizierter lokaler Führer mit tiefem Wissen über die Region",
    officialCertification: "Offizielle Zertifizierung",
    historicalKnowledge: "Historisches Wissen",
    multilingual: "Mehrsprachig",
    allInclusive: "Alles Inklusive",
    allInclusiveDesc: "Transport, Mahlzeiten, Tickets und Unterkunft inklusive",
    premiumTransport: "Premium-Transport",
    typicalMeals: "Typische Mahlzeiten",
    siteEntries: "Standorteingänge",
    travelInsurance: "Reiseversicherung",
    travelInsuranceDesc: "Vollständige Abdeckung während der gesamten Reise",
    medicalInsurance: "Krankenversicherung",
    assistance24: "24/7 Unterstützung",
    luggageCoverage: "Gepäckabdeckung",
    detailedItinerary: "Detaillierter Reiseplan",
    dayStops: "Tagesstopps",
    imageGallery: "Bildergalerie",
    perPerson: "pro Person",
    specialPriceForForeigners: "Sonderpreis für Ausländer!",
    tourLanguage: "Tour-Sprache",
    departureDate: "Abfahrtsdatum",
    numberOfTravelers: "Anzahl der Reisenden",
    person: "Person",
    people: "Personen",
    availableDays: "Verfügbare Tage",
    reserveNow: "Jetzt Reservieren",
    consultWhatsApp: "Über WhatsApp konsultieren",
    callNow: "Jetzt Anrufen",
    schedules: "Zeitpläne",
    departure: "Abfahrt",
    arrival: "Ankunft",
    securePayment: "Sichere Zahlung",
    certified: "Zertifiziert",
    routeInfo: "Routeninformationen",
    coordinates: "Koordinaten",
    duration: "Dauer",
    hours: "Stunden",
    directTrip: "Direktreise ohne Zwischenstopps",
    interactiveRouteMap: "Interaktive Routenkarte",
    travelHours: "Reisestunden",
    termsConditions: "Geschäftsbedingungen",
    monday: "Montag",
    tuesday: "Dienstag",
    wednesday: "Mittwoch",
    thursday: "Donnerstag",
    friday: "Freitag",
    saturday: "Samstag",
    sunday: "Sonntag",
  },
  it: {
    loading: "Caricamento pacchetto turistico...",
    mapNotAvailable: "Mappa non disponibile",
    mapApiKeyMissing: "La chiave API di Google Maps non è configurata.",
    origin: "Origine",
    destination: "Destinazione",
    loadingMap: "Caricamento mappa...",
    interactiveMap: "Mappa Interattiva",
    roadRoute: "Percorso di Viaggio",
    roadRouteCalculated: "Percorso stradale calcolato",
    showingLocations: "Mostrando posizioni",
    roadDistance: "Distanza stradale",
    calculating: "Calcolando...",
    estimatedTime: "Tempo stimato",
    intermediateStops: "Fermate intermedie",
    yearsExperience: "Anni di esperienza",
    satisfiedTourists: "Turisti soddisfatti",
    safeReliable: "Sicuro e affidabile",
    supportAvailable: "Supporto disponibile",
    packageDescription: "Descrizione del Pacchetto",
    smallGroup: "Gruppo Piccolo",
    smallGroupDesc: "Massimo 12 persone per un'esperienza personalizzata e confortevole",
    personalizedAttention: "Attenzione personalizzata",
    flexibilityStops: "Più flessibilità nelle fermate",
    familyEnvironment: "Ambiente familiare",
    expertGuide: "Guida Esperta",
    expertGuideDesc: "Guida locale certificata con conoscenza approfondita della regione",
    officialCertification: "Certificazione ufficiale",
    historicalKnowledge: "Conoscenza storica",
    multilingual: "Multilingue",
    allInclusive: "Tutto Incluso",
    allInclusiveDesc: "Trasporto, pasti, biglietti e alloggio inclusi",
    premiumTransport: "Trasporto premium",
    typicalMeals: "Pasti tipici",
    siteEntries: "Ingressi ai siti",
    travelInsurance: "Assicurazione di Viaggio",
    travelInsuranceDesc: "Copertura completa durante tutto il viaggio",
    medicalInsurance: "Assicurazione medica",
    assistance24: "Assistenza 24/7",
    luggageCoverage: "Copertura bagagli",
    detailedItinerary: "Itinerario Dettagliato",
    dayStops: "Fermate del giorno",
    imageGallery: "Galleria di Immagini",
    perPerson: "per persona",
    specialPriceForForeigners: "Prezzo speciale per stranieri!",
    tourLanguage: "Lingua del tour",
    departureDate: "Data di Partenza",
    numberOfTravelers: "Numero di viaggiatori",
    person: "persona",
    people: "persone",
    availableDays: "Giorni Disponibili",
    reserveNow: "Prenota Ora",
    consultWhatsApp: "Consulta via WhatsApp",
    callNow: "Chiama Ora",
    schedules: "Orari",
    departure: "Partenza",
    arrival: "Arrivo",
    securePayment: "Pagamento Sicuro",
    certified: "Certificato",
    routeInfo: "Informazioni sul Percorso",
    coordinates: "Coordinate",
    duration: "Durata",
    hours: "ore",
    directTrip: "Viaggio diretto senza fermate intermedie",
    interactiveRouteMap: "Mappa interattiva del percorso",
    travelHours: "ore di viaggio",
    termsConditions: "Termini e Condizioni",
    monday: "Lunedì",
    tuesday: "Martedì",
    wednesday: "Mercoledì",
    thursday: "Giovedì",
    friday: "Venerdì",
    saturday: "Sabato",
    sunday: "Domenica",
  },
}

const GOOGLE_MAPS_LIBRARIES: ("geometry" | "places")[] = ["geometry", "places"]

const GoogleMapComponent = ({
  origin,
  destination,
  intermediateStops,
}: {
  origin: { name: string; lat: number; lng: number }
  destination: { name: string; lat: number; lng: number }
  intermediateStops?: Array<{ name: string; lat: number; lng: number }>
}) => {
  const { language } = useLanguage()
  const t = translations[language as keyof typeof translations] || translations.es

  const [directionsResponse, setDirectionsResponse] = useState<google.maps.DirectionsResult | null>(null)
  const [routeDistance, setRouteDistance] = useState<string>("")
  const [routeDuration, setRouteDuration] = useState<string>("")
  const [mapError, setMapError] = useState<string | null>(null)
  const [routeCalculated, setRouteCalculated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isGoogleMapsLoaded, setIsGoogleMapsLoaded] = useState(false)
  const markersRef = useRef<google.maps.marker.AdvancedMarkerElement[]>([])
  const mapRef = useRef<google.maps.Map | null>(null)

  const center = {
    lat: (origin.lat + destination.lat) / 2,
    lng: (origin.lng + destination.lng) / 2,
  }

  const mapContainerStyle = {
    width: "100%",
    height: "400px",
  }

  const mapOptions = {
    zoom: 8,
    center: center,
    mapTypeId: "roadmap" as const,
    mapId: "DEMO_MAP_ID",
  }

  const createMarkerContent = (color: string, label: string, size = 32) => {
    const markerDiv = document.createElement("div")
    markerDiv.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      background-color: ${color};
      border: 3px solid white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      font-size: 14px;
      color: white;
      box-shadow: 0 2px 6px rgba(0,0,0,0.3);
      cursor: pointer;
    `
    markerDiv.textContent = label
    return markerDiv
  }

  const createMarkers = () => {
    if (!mapRef.current || !window.google?.maps?.marker?.AdvancedMarkerElement) {
      console.log("[v0] Map or AdvancedMarkerElement not available yet")
      return
    }

    markersRef.current.forEach((marker) => {
      marker.map = null
    })
    markersRef.current = []

    try {
      const originMarker = new window.google.maps.marker.AdvancedMarkerElement({
        position: { lat: origin.lat, lng: origin.lng },
        title: `${t.origin}: ${origin.name}`,
        content: createMarkerContent("#10b981", "O"),
        map: mapRef.current,
      })
      markersRef.current.push(originMarker)

      const destinationMarker = new window.google.maps.marker.AdvancedMarkerElement({
        position: { lat: destination.lat, lng: destination.lng },
        title: `${t.destination}: ${destination.name}`,
        content: createMarkerContent("#f97316", "D"),
        map: mapRef.current,
      })
      markersRef.current.push(destinationMarker)

      if (intermediateStops && intermediateStops.length > 0) {
        intermediateStops.forEach((stop, index) => {
          const stopMarker = new window.google.maps.marker.AdvancedMarkerElement({
            position: { lat: stop.lat, lng: stop.lng },
            title: `Parada ${index + 1}: ${stop.name}`,
            content: createMarkerContent("#eab308", (index + 1).toString(), 28),
            map: mapRef.current,
          })
          markersRef.current.push(stopMarker)
        })
      }

      console.log("[v0] Created", markersRef.current.length, "advanced markers")
    } catch (error) {
      console.error("[v0] Error creating markers:", error)
    }
  }

  const directionsCallback = (result: google.maps.DirectionsResult | null, status: google.maps.DirectionsStatus) => {
    console.log("[v0] Directions API response status:", status)

    if (status === "OK" && result) {
      console.log("[v0] Route calculated successfully")
      setDirectionsResponse(result)

      const route = result.routes[0]
      if (route) {
        let totalDistance = 0
        let totalDuration = 0

        route.legs.forEach((leg) => {
          totalDistance += leg.distance?.value || 0
          totalDuration += leg.duration?.value || 0
        })

        setRouteDistance(`${(totalDistance / 1000).toFixed(0)} km`)
        setRouteDuration(
          `${Math.floor(totalDuration / 3600)} ${t.hours} ${Math.round((totalDuration % 3600) / 60)} min`,
        )
      }

      setRouteCalculated(true)
      setMapError(null)
    } else {
      console.warn("[v0] Directions API failed:", status)
      setMapError("No se pudo calcular la ruta por carretera. Mostrando ubicaciones.")
      setRouteCalculated(false)
    }
  }

  const createWaypoints = (): Array<{ location: { lat: number; lng: number }; stopover: boolean }> => {
    if (!isGoogleMapsLoaded || !window.google?.maps) return []

    const waypoints: Array<{ location: { lat: number; lng: number }; stopover: boolean }> = []
    if (intermediateStops && intermediateStops.length > 0) {
      intermediateStops.forEach((stop) => {
        const latLng = new window.google.maps.LatLng(stop.lat, stop.lng)
        waypoints.push({
          location: { lat: latLng.lat(), lng: latLng.lng() },
          stopover: true,
        })
      })
    }
    return waypoints
  }

  const createDirectionsOptions = () => {
    if (!isGoogleMapsLoaded || !window.google?.maps) return null

    return {
      origin: new window.google.maps.LatLng(origin.lat, origin.lng),
      destination: new window.google.maps.LatLng(destination.lat, destination.lng),
      waypoints: createWaypoints(),
      optimizeWaypoints: false,
      travelMode: window.google.maps.TravelMode.DRIVING,
      unitSystem: window.google.maps.UnitSystem.METRIC,
    }
  }

  const handleMapLoad = (map: google.maps.Map) => {
    console.log("[v0] Google Map loaded successfully")
    mapRef.current = map
    setIsGoogleMapsLoaded(true)
    setIsLoading(false)

    setTimeout(() => {
      createMarkers()
    }, 500)
  }

  const handleLoadError = () => {
    console.error("[v0] Failed to load Google Maps")
    setMapError("Error al cargar Google Maps. Verifica tu conexión a internet.")
    setIsLoading(false)
  }

  useEffect(() => {
    return () => {
      markersRef.current.forEach((marker) => {
        marker.map = null
      })
      markersRef.current = []
    }
  }, [])

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
  if (!apiKey) {
    return (
      <div className="w-full h-96 rounded-xl overflow-hidden relative bg-white border border-gray-200 flex items-center justify-center">
        <div className="text-center p-8">
          <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">{t.mapNotAvailable}</h3>
          <p className="text-gray-500 mb-4">{t.mapApiKeyMissing}</p>
          <div className="bg-gray-50 rounded-lg p-4 border">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="font-semibold text-gray-700">
                {t.origin}: {origin.name}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="font-semibold text-gray-700">
                {t.destination}: {destination.name}
              </span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const directionsOptions = createDirectionsOptions()

  return (
    <div className="w-full h-96 rounded-xl overflow-hidden relative border border-gray-200">
      <LoadScript
        googleMapsApiKey={apiKey}
        libraries={GOOGLE_MAPS_LIBRARIES}
        onLoad={() => setIsGoogleMapsLoaded(true)}
        onError={handleLoadError}
      >
        {isLoading && (
          <div className="absolute inset-0 bg-white flex items-center justify-center z-10">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-2"></div>
              <p className="text-gray-600">{t.loadingMap}</p>
            </div>
          </div>
        )}

        <GoogleMap mapContainerStyle={mapContainerStyle} options={mapOptions} onLoad={handleMapLoad}>
          {isGoogleMapsLoaded && directionsOptions && !directionsResponse && !mapError && (
            <DirectionsService options={directionsOptions} callback={directionsCallback} />
          )}

          {isGoogleMapsLoaded && directionsResponse && (
            <DirectionsRenderer
              options={{
                directions: directionsResponse,
                suppressMarkers: true,
                polylineOptions: {
                  strokeColor: "#f97316",
                  strokeOpacity: 0.8,
                  strokeWeight: 4,
                },
              }}
            />
          )}
        </GoogleMap>
      </LoadScript>

      <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-sm rounded-lg p-4 border border-gray-200">
        <div className="flex items-center gap-2 mb-3">
          <MapPin className="w-5 h-5 text-orange-500" />
          <span className="font-bold text-gray-800">{t.roadRoute}</span>
          {routeCalculated && (
            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full border border-green-200">
              {t.roadRouteCalculated}
            </span>
          )}
          {mapError && (
            <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full border border-yellow-200">
              {t.showingLocations}
            </span>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="font-semibold text-gray-700">{t.origin}:</span>
            </div>
            <p className="text-gray-600 text-xs ml-5">{origin.name}</p>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
              <span className="font-semibold text-gray-700">{t.destination}:</span>
            </div>
            <p className="text-gray-600 text-xs ml-5">{destination.name}</p>
          </div>
        </div>

        <div className="mt-3 pt-3 border-t border-gray-200">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">{t.roadDistance}:</span>
            <span className="font-bold text-orange-500">{routeDistance || t.calculating}</span>
          </div>
          {routeDuration && (
            <div className="flex justify-between items-center text-sm mt-1">
              <span className="text-gray-600">{t.estimatedTime}:</span>
              <span className="font-bold text-green-600">{routeDuration}</span>
            </div>
          )}
          {intermediateStops && intermediateStops.length > 0 && (
            <div className="flex justify-between items-center text-sm mt-1">
              <span className="text-gray-600">{t.intermediateStops}:</span>
              <span className="font-bold text-yellow-600">{intermediateStops.length}</span>
            </div>
          )}
        </div>
      </div>

      <div className="absolute top-4 right-4 bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
        {t.interactiveMap}
      </div>

      {mapError && (
        <div className="absolute top-4 left-4 bg-yellow-100 border border-yellow-300 text-yellow-800 px-3 py-2 rounded-lg text-sm">
          {mapError}
        </div>
      )}
    </div>
  )
}

export default function TransportPage({ params }: Props) {
  const { language } = useLanguage()

  const t = translations[language as keyof typeof translations] || translations.es
  const [transport, setTransport] = useState<TourTransport | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [selectedDate, setSelectedDate] = useState<string>("")
  const [selectedTravelers, setSelectedTravelers] = useState<number>(1)
  const [bookingNotes] = useState<string>("")
  const [isBooking, setIsBooking] = useState(false)

  const translateDay = (day: string): string => {
    const dayTranslations: { [key: string]: { [key: string]: string } } = {
      Monday: { es: "Lunes", en: "Monday", fr: "Lundi", de: "Montag", it: "Lunedì" },
      Tuesday: { es: "Martes", en: "Tuesday", fr: "Mardi", de: "Dienstag", it: "Martedì" },
      Wednesday: { es: "Miércoles", en: "Wednesday", fr: "Mercredi", de: "Mittwoch", it: "Mercoledì" },
      Thursday: { es: "Jueves", en: "Thursday", fr: "Jeudi", de: "Donnerstag", it: "Giovedì" },
      Friday: { es: "Viernes", en: "Friday", fr: "Vendredi", de: "Freitag", it: "Venerdì" },
      Saturday: { es: "Sábado", en: "Saturday", fr: "Samedi", de: "Samstag", it: "Sabato" },
      Sunday: { es: "Domingo", en: "Sunday", fr: "Dimanche", de: "Sonntag", it: "Domenica" },
    }
    return dayTranslations[day]?.[language] || day
  }

  useEffect(() => {
    async function loadTransport() {
      try {
        const resolvedParams = await params
        const { slug: paramSlug } = resolvedParams

        const langParam = language !== "es" ? `?lang=${language}` : ""
        console.log("[v0] Fetching transport with language:", language)

        const response = await api.get<{ data: TourTransport[] }>(`/tour-transport${langParam}`)
        const transports = response.data.data
        console.log("[v0] All transports received:", transports?.length || 0)

        if (transports && transports.length > 0) {
          console.log(
            "[v0] Available transport slugs:",
            transports.map((t) => t.slug),
          )
          console.log("[v0] Looking for slug:", paramSlug)
        }

        const foundTransport = transports?.find((t) => t.slug === paramSlug)
        console.log(
          "[v0] Found transport:",
          foundTransport ? getTranslatedText(foundTransport.title, language) : "Not found",
        )

        if (!foundTransport) {
          notFound()
        }

        setTransport(foundTransport)
      } catch (error) {
        console.error("Error fetching transport:", error)
        notFound()
      } finally {
        setLoading(false)
      }
    }

    loadTransport()
  }, [params, language])

  if (loading) {
    return (
      <>
        <div className="min-h-screen bg-white flex items-center justify-center pt-24">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500 mx-auto mb-4"></div>
            <p className="text-gray-700 text-xl">{t.loading}</p>
          </div>
        </div>
      </>
    )
  }

  if (!transport) {
    notFound()
  }

  console.log("[v0] Transport data:", transport)

  const displayPrice = transport.price
  const originCoords = `${transport.origin.lat.toString()}, ${transport.origin.lng.toString()}`
  const destinationCoords = `${transport.destination.lat.toString()}, ${transport.destination.lng.toString()}`

  const galleryImages = []
  if (transport.imageUrl) {
    galleryImages.push({
      url: transport.imageUrl,
      title: getTranslatedText(transport.title, language),
      description: "Imagen principal del transporte",
    })
  }
  if (transport.itinerary) {
    transport.itinerary.forEach((day) => {
      if (day.imageUrl) {
        galleryImages.push({
          url: day.imageUrl,
          title: getTranslatedText(day.title, language),
          description: getTranslatedText(day.description, language),
        })
      }
    })
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % galleryImages.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length)
  }

  const handleReserveNow = async () => {
    if (!transport) return

    if (!selectedDate) {
      alert(language === "es" ? "Por favor selects una fecha" : "Please select a date")
      return
    }

    setIsBooking(true)

    try {
      const cartData: CreateCartDto = {
        items: [
          {
            productType: CartItemType.Transport,
            productId: transport._id,
            startDate: selectedDate,
            people: selectedTravelers,
            pricePerPerson: transport.price,
            total: transport.price * selectedTravelers,
            notes: bookingNotes || "",
            productTitle: getTranslatedText(transport.title, language),
            productImageUrl: transport.imageUrl,
            productSlug: transport.slug,
          },
        ],
        totalPrice: transport.price * selectedTravelers,
      }

      console.log("[v0] Sending cart data:", cartData)

      const response = await api.post("/cart", cartData)

      console.log("[v0] Cart created successfully:", response.data)

      toast.success(language === "es" ? "¡Agregado al carrito exitosamente!" : "Successfully added to cart!", {
        description:
          language === "es"
            ? `${selectedTravelers} ${selectedTravelers === 1 ? "persona" : "personas"} - S/ ${(displayPrice * selectedTravelers).toLocaleString()}`
            : `${selectedTravelers} ${selectedTravelers === 1 ? "person" : "people"} - S/ ${(displayPrice * selectedTravelers).toLocaleString()}`,
        duration: 5000,
        action: {
          label: language === "es" ? "Ver Carrito" : "View Cart",
          onClick: () => {
            window.location.href = "/checkout"
          },
        },
      })
    } catch (error) {
      console.error("[v0] Error creating cart:", error)
      let errorMessage = "Unknown error"
      if (error instanceof Error) {
        errorMessage = error.message
      } else if (typeof error === "object" && error !== null && "response" in error) {
        const responseError = error as { response?: { data?: { message?: string } } }
        errorMessage = responseError.response?.data?.message || "Unknown error"
      }

      toast.error(language === "es" ? "Error al agregar al carrito" : "Error adding to cart", {
        description: errorMessage,
        duration: 4000,
      })
    } finally {
      setIsBooking(false)
    }
  }

  return (
    <>
      <div className="min-h-screen bg-white pt-20">
        <section className="relative bg-white">
          <div className="relative z-10 container mx-auto px-4 py-16">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-6xl font-bold mb-6 text-gray-900 text-balance">
                {getTranslatedText(transport.title, language)}
              </h1>
              <p className="text-lg md:text-xl mb-8 text-gray-600 leading-relaxed text-pretty">
                {getTranslatedText(transport.description, language)}
              </p>
              <div className="flex flex-wrap justify-center items-center gap-6 mb-8">
                <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-full px-4 py-2 text-gray-700 shadow-sm">
                  <MapPin className="w-5 h-5 text-orange-500" />
                  <span className="font-semibold">
                    {transport.origin.name} → {transport.destination.name}
                  </span>
                </div>
                {transport.durationInHours && (
                  <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-full px-4 py-2 text-gray-700 shadow-sm">
                    <Clock className="w-5 h-5 text-green-600" />
                    <span className="font-semibold">
                      {transport.durationInHours.toString()} {t.hours}
                    </span>
                  </div>
                )}
                <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-full px-4 py-2 text-gray-700 shadow-sm">
                  <Star className="w-5 h-5 text-yellow-500" />
                  <span className="font-semibold">{(transport.rating || 4.8).toString()}/5</span>
                </div>
              </div>
              <div className="text-4xl font-bold py-4 px-8 rounded-full inline-block bg-orange-500 text-white shadow-lg">
                S/ {displayPrice.toLocaleString()} PEN
              </div>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 py-16">
          <div className="max-w-6xl mx-auto">
            {galleryImages.length > 0 && (
              <div className="bg-white border border-gray-200 rounded-xl p-8 mb-16 shadow-sm">
                <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">{t.imageGallery}</h2>
                <div className="relative">
                  <div className="relative h-96 rounded-xl overflow-hidden mb-4 border border-gray-200">
                    <Image
                      src={galleryImages[currentImageIndex].url || "/placeholder.jpg"}
                      alt={galleryImages[currentImageIndex].title}
                      fill
                      className="object-cover"
                      priority
                    />
                    {galleryImages.length > 1 && (
                      <>
                        <button
                          onClick={prevImage}
                          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-2 transition-colors shadow-lg"
                        >
                          <ChevronLeft className="w-6 h-6 text-gray-700" />
                        </button>
                        <button
                          onClick={nextImage}
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-2 transition-colors shadow-lg"
                        >
                          <ChevronRight className="w-6 h-6 text-gray-700" />
                        </button>
                      </>
                    )}
                    <div className="absolute bottom-4 left-4 right-4 bg-black/70 backdrop-blur-sm rounded-lg p-3 text-white">
                      <h3 className="font-bold text-lg">{galleryImages[currentImageIndex].title}</h3>
                      <p className="text-sm opacity-90">{galleryImages[currentImageIndex].description}</p>
                    </div>
                  </div>
                  {galleryImages.length > 1 && (
                    <div className="flex justify-center gap-2">
                      {galleryImages.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`w-3 h-3 rounded-full transition-colors ${
                            index === currentImageIndex ? "bg-orange-500" : "bg-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
              <div className="bg-white border border-gray-200 rounded-xl p-6 text-center shadow-sm">
                <Users className="w-12 h-12 text-orange-500 mx-auto mb-4" />
                <div className="text-2xl font-bold text-gray-900">12+</div>
                <p className="text-gray-600">{t.yearsExperience}</p>
              </div>
              <div className="bg-white border border-gray-200 rounded-xl p-6 text-center shadow-sm">
                <Award className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
                <div className="text-2xl font-bold text-gray-900">5000+</div>
                <p className="text-gray-600">{t.satisfiedTourists}</p>
              </div>
              <div className="bg-white border border-gray-200 rounded-xl p-6 text-center shadow-sm">
                <Shield className="w-12 h-12 text-green-600 mx-auto mb-4" />
                <div className="text-2xl font-bold text-gray-900">100%</div>
                <p className="text-gray-600">{t.safeReliable}</p>
              </div>
              <div className="bg-white border border-gray-200 rounded-xl p-6 text-center shadow-sm">
                <Globe className="w-12 h-12 text-orange-500 mx-auto mb-4" />
                <div className="text-2xl font-bold text-gray-900">24/7</div>
                <p className="text-gray-600">{t.supportAvailable}</p>
              </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8 mb-16">
              <div className="lg:col-span-2">
                <div className="bg-white border border-gray-200 rounded-xl p-8 mb-8 shadow-sm">
                  <h2 className="text-3xl font-bold text-gray-900 mb-6">{t.packageDescription}</h2>
                  <p className="text-lg leading-relaxed text-gray-700 mb-8">
                    {getTranslatedText(transport.description, language)}
                  </p>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                      <Users className="w-8 h-8 text-orange-500 mb-4" />
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{t.smallGroup}</h3>
                      <p className="text-gray-600 mb-3">{t.smallGroupDesc}</p>
                      <ul className="mt-3 text-sm text-gray-500 space-y-1">
                        <li>• {t.personalizedAttention}</li>
                        <li>• {t.flexibilityStops}</li>
                        <li>• {t.familyEnvironment}</li>
                      </ul>
                    </div>

                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                      <Navigation className="w-8 h-8 text-green-600 mb-4" />
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{t.expertGuide}</h3>
                      <p className="text-gray-600 mb-3">{t.expertGuideDesc}</p>
                      <ul className="mt-3 text-sm text-gray-500 space-y-1">
                        <li>• {t.officialCertification}</li>
                        <li>• {t.historicalKnowledge}</li>
                        <li>• {t.multilingual}</li>
                      </ul>
                    </div>

                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                      <Star className="w-8 h-8 text-yellow-500 mb-4" />
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{t.allInclusive}</h3>
                      <p className="text-gray-600 mb-3">{t.allInclusiveDesc}</p>
                      <ul className="mt-3 text-sm text-gray-500 space-y-1">
                        <li>• {t.premiumTransport}</li>
                        <li>• {t.typicalMeals}</li>
                        <li>• {t.siteEntries}</li>
                      </ul>
                    </div>

                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                      <Shield className="w-8 h-8 text-orange-500 mb-4" />
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{t.travelInsurance}</h3>
                      <p className="text-gray-600 mb-3">{t.travelInsuranceDesc}</p>
                      <ul className="mt-3 text-sm text-gray-500 space-y-1">
                        <li>• {t.medicalInsurance}</li>
                        <li>• {t.assistance24}</li>
                        <li>• {t.luggageCoverage}</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {transport.itinerary && transport.itinerary.length > 0 && (
                  <div className="bg-white border border-gray-200 rounded-xl p-8 mb-8 shadow-sm">
                    <h2 className="text-3xl font-bold text-gray-900 mb-8">{t.detailedItinerary}</h2>
                    <div className="space-y-6">
                      {transport.itinerary.map((day, index) => (
                        <div key={index} className="relative">
                          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                            <div className="flex items-center gap-3 mb-3">
                              <div className="bg-yellow-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">
                                {day.day.toString()}
                              </div>
                              <h3 className="text-xl font-bold text-gray-900">
                                {getTranslatedText(day.title, language)}
                              </h3>
                            </div>
                            <p className="text-gray-700 mb-4 leading-relaxed">
                              {getTranslatedText(day.description, language)}
                            </p>
                            {day.route && day.route.length > 0 && (
                              <div className="bg-white border border-gray-200 rounded-lg p-4">
                                <h4 className="font-semibold text-gray-900 mb-3">{t.dayStops}:</h4>
                                <div className="space-y-2">
                                  {day.route.map((stop, stopIndex) => (
                                    <div key={stopIndex} className="flex items-start gap-3 text-sm">
                                      <MapPin className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
                                      <div>
                                        <span className="font-semibold text-gray-800">{stop.location}</span>
                                        {stop.stopTime && (
                                          <span className="text-green-600 ml-2">({stop.stopTime})</span>
                                        )}
                                        {stop.description && (
                                          <p className="text-gray-600 mt-1">
                                            {getTranslatedText(stop.description, language)}
                                          </p>
                                        )}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="lg:col-span-1">
                <div className="bg-white border border-gray-200 rounded-xl p-6 sticky top-8 shadow-sm">
                  <div className="text-center mb-6">
                    <div className="text-4xl font-bold text-gray-900 mb-2">S/ {displayPrice.toLocaleString()}</div>
                    <div className="text-gray-600 mb-1">{t.perPerson}</div>
                    <div className="text-sm text-green-600 font-semibold">{t.specialPriceForForeigners}</div>
                    <div className="flex justify-center items-center gap-1 mt-3">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 fill-current text-yellow-500" />
                      ))}
                      <span className="ml-2 text-gray-600">({(transport.rating || 4.8).toString()})</span>
                    </div>
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-semibold text-gray-900 mb-2">{t.departureDate}</label>
                    <input
                      type="date"
                      min={new Date().toISOString().split("T")[0]}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                    />
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-semibold text-gray-900 mb-2">{t.numberOfTravelers}</label>
                    <select
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      value={selectedTravelers}
                      onChange={(e) => setSelectedTravelers(Number(e.target.value))}
                    >
                      <option value="1">1 {t.person}</option>
                      <option value="2">2 {t.people}</option>
                      <option value="3">3 {t.people}</option>
                      <option value="4">4 {t.people}</option>
                      <option value="5">5 {t.people}</option>
                      <option value="6">6 {t.people}</option>
                      <option value="7">7 {t.people}</option>
                      <option value="8">8 {t.people}</option>
                      <option value="9">9 {t.people}</option>
                      <option value="10">10 {t.people}</option>
                    </select>
                  </div>

                  {transport.availableDays && transport.availableDays.length > 0 && (
                    <div className="mb-6">
                      <h3 className="text-sm font-semibold text-gray-900 mb-2">{t.availableDays}</h3>
                      <div className="flex flex-wrap gap-2">
                        {transport.availableDays.map((day, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium border border-gray-200"
                          >
                            {translateDay(day)}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <button
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 px-4 rounded-lg font-semibold transition-colors mb-4 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={handleReserveNow}
                    disabled={isBooking || !selectedDate}
                  >
                    <Calendar className="w-5 h-5" />
                    {isBooking ? (language === "es" ? "Procesando..." : "Processing...") : t.reserveNow}
                  </button>

                  <Link
                    href="/checkout"
                    className="w-full bg-gray-900 hover:bg-gray-800 text-white py-3 px-4 rounded-lg font-semibold transition-colors mb-4 flex items-center justify-center gap-2"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    {language === "es" ? "Ver Carrito" : "View Cart"}
                  </Link>

                  <div className="space-y-3">
                    <button
                      className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                      onClick={() =>
                        window.open(
                          `https://wa.me/51987654321?text=Hola, estoy interesado en el tour: ${getTranslatedText(transport.title, language)}`,
                          "_blank",
                        )
                      }
                    >
                      <MessageCircle className="w-5 h-5" />
                      {t.consultWhatsApp}
                    </button>

                    <button
                      className="w-full flex items-center justify-center gap-2 bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-semibold hover:bg-gray-200 transition-colors border border-gray-200"
                      onClick={() => window.open("tel:+51987654321", "_self")}
                    >
                      <Phone className="w-5 h-5" />
                      {t.callNow}: +51 987 654 321
                    </button>
                  </div>

                  {(transport.departureTime || transport.arrivalTime) && (
                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <h3 className="font-semibold text-gray-900 mb-3">{t.schedules}</h3>
                      <div className="space-y-2 text-sm">
                        {transport.departureTime && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">{t.departure}:</span>
                            <span className="font-semibold">{transport.departureTime}</span>
                          </div>
                        )}
                        {transport.arrivalTime && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">{t.arrival}:</span>
                            <span className="font-semibold">{transport.arrivalTime}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div className="text-xs">
                        <Shield className="w-6 h-6 text-green-600 mx-auto mb-1" />
                        <span className="text-gray-600">{t.securePayment}</span>
                      </div>
                      <div className="text-xs">
                        <Award className="w-6 h-6 text-yellow-500 mx-auto mb-1" />
                        <span className="text-gray-600">{t.certified}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-8 mb-8 shadow-sm">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">{t.roadRoute}</h2>
              <div className="grid md:grid-cols-2 gap-8 mb-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">{t.routeInfo}</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <MapPin className="w-5 h-5 text-orange-500" />
                      <div>
                        <span className="font-semibold">{t.origin}:</span> {transport.origin.name}
                        <div className="text-sm text-gray-600">
                          {t.coordinates}: {originCoords}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <MapPin className="w-5 h-5 text-green-600" />
                      <div>
                        <span className="font-semibold">{t.destination}:</span> {transport.destination.name}
                        <div className="text-sm text-gray-600">
                          {t.coordinates}: {destinationCoords}
                        </div>
                      </div>
                    </div>
                    {transport.durationInHours && (
                      <div className="flex items-center gap-3">
                        <Clock className="w-5 h-5 text-yellow-500" />
                        <div>
                          <span className="font-semibold">{t.duration}:</span> {transport.durationInHours.toString()}{" "}
                          {t.hours}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">{t.intermediateStops}</h3>
                  {transport.intermediateStops && transport.intermediateStops.length > 0 ? (
                    <ul className="space-y-2">
                      {transport.intermediateStops.map((stop, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                          <span>{stop.name}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-600">{t.directTrip}</p>
                  )}
                </div>
              </div>
              <div className="rounded-lg overflow-hidden">
                <GoogleMapComponent
                  origin={transport.origin}
                  destination={transport.destination}
                  intermediateStops={transport.intermediateStops}
                />
              </div>
              <div className="mt-4 text-sm text-gray-600 text-center">
                {t.interactiveRouteMap}: {transport.origin.name} a {transport.destination.name}
                {transport.durationInHours && ` • ${transport.durationInHours.toString()} ${t.travelHours}`}
              </div>
            </div>

            {transport.termsAndConditions && (
              <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">{t.termsConditions}</h2>
                <div className="prose prose-gray max-w-none">
                  <p className="text-gray-700 leading-relaxed">
                    {getTranslatedText(transport.termsAndConditions, language)}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
