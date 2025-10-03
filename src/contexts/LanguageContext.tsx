"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

type Language = "es" | "en" | "fr" | "de" | "it"

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

const translations = {
  es: {
    "nav.transportes": "Transportes",
    "nav.tours": "Tours",
    "nav.itinerarios": "Destinations",
    "nav.cuando-ir": "¿Cuándo ir?",
    "nav.nosotros": "Nosotros",
    "button.login": "Iniciar Sesión",
    "button.book": "Reservar",
    "button.explore-tours": "Explorar Tours",
    "hero.title": "Descubre el Perú Ancestral",
    "hero.description":
      "Vive experiencias únicas en la tierra de los Incas. Tours auténticos, guías expertos y momentos inolvidables te esperan.",
    "hero.badge": "⭐ Agencia #1 en Perú",
    "hero.main-title": "Descubre la Magia",
    "hero.main-subtitle": "del Perú Ancestral",
    "hero.main-description":
      "Vive experiencias únicas en la tierra de los Incas con nuestros tours exclusivos. Desde Machu Picchu hasta la Amazonía, cada momento será inolvidable.",
    "hero.stats.years": "Años de experiencia",
    "hero.stats.travelers": "Viajeros felices",
    "hero.stats.rating": "Calificación promedio",
    "hero.cta.primary": "Explorar Destinos",
    "hero.cta.secondary": "Ver Video",
    "hero.floating.travelers": "Este mes",
    "transport.section.title": "Nuestros Transportes Premium",
    "transport.section.description":
      "Viaja con comodidad y seguridad por todo el Perú. Ofrecemos las mejores opciones de transporte para que tu experiencia sea perfecta.",
    "transport.bus.title": "Bus Turístico Premium",
    "transport.bus.description":
      "Buses de lujo con aire acondicionado, asientos reclinables y guía turístico a bordo para tu máxima comodidad.",
    "transport.bus.feature1": "Aire acondicionado y WiFi",
    "transport.bus.feature2": "Asientos reclinables premium",
    "transport.bus.feature3": "Guía turístico incluido",
    "transport.plane.title": "Vuelos Domésticos",
    "transport.plane.description":
      "Conexiones aéreas rápidas y seguras a los principales destinos turísticos del Perú con aerolíneas certificadas.",
    "transport.plane.feature1": "Vuelos directos principales destinos",
    "transport.plane.feature2": "Aerolíneas certificadas",
    "transport.plane.feature3": "Check-in prioritario incluido",
    "transport.car.title": "Transfer Privado",
    "transport.car.description":
      "Servicio exclusivo de transporte privado con conductor profesional para tu comodidad y privacidad total.",
    "transport.car.feature1": "Conductor profesional bilingüe",
    "transport.car.feature2": "Vehículos de lujo climatizados",
    "transport.car.feature3": "Servicio puerta a puerta",
    "transport.train.title": "Tren a Machu Picchu",
    "transport.train.description":
      "Viaje panorámico en tren de lujo hacia Machu Picchu a través del Valle Sagrado con vistas espectaculares.",
    "transport.train.feature1": "Vagones panorámicos de lujo",
    "transport.train.feature2": "Servicio gourmet a bordo",
    "transport.train.feature3": "Vistas del Valle Sagrado",
    "footer.aboutDescription":
      "Descubre la magia del Perú con nuestros tours exclusivos y experiencias auténticas que te conectarán con la rica cultura e historia ancestral.",
    "footer.email": "Tu correo electrónico",
    "footer.subscribe": "Suscribirse",
    "footer.carbonSubtitle": "Neutral en Carbono",
    "footer.availableNow": "Disponible Ahora",
    "footer.destinations": "Destinos",
    "footer.services": "Servicios",
    "footer.info": "Información",
    "footer.inspiration": "Inspiración",
    "footer.whyUs": "¿Por qué nosotros?",
    "footer.journal": "Blog de Viajes",
    "footer.sustainability": "Sostenibilidad",
    "footer.contact": "Contacto",
    "footer.bookingConditions": "Condiciones de Reserva",
    "footer.travelInsurance": "Seguro de Viaje",
    "footer.preDepartureInfo": "Información Pre-Viaje",
    "footer.privacyPolicy": "Política de Privacidad",
    "footer.termsOfService": "Términos de Servicio",
    "footer.cookiePolicy": "Política de Cookies",
    "footer.callUs": "Llámanos",
    "footer.emailUs": "Escríbenos",
    "footer.address": "Dirección",
    "footer.schedule": "Horarios",
    "footer.monday": "Lunes",
    "footer.friday": "Viernes",
    "footer.developedBy": "Desarrollado por",
    "footer.followUs": "Síguenos",
    "footer.allRightsReserved": "Todos los derechos reservados",
  },
  en: {
    "nav.transportes": "Transport",
    "nav.tours": "Tours",
    "nav.itinerarios": "Destinations",
    "nav.cuando-ir": "When to go?",
    "nav.nosotros": "About Us",
    "button.login": "Login",
    "button.book": "Book Now",
    "button.explore-tours": "Explore Tours",
    "hero.title": "Discover Ancient Peru",
    "hero.description":
      "Live unique experiences in the land of the Incas. Authentic tours, expert guides and unforgettable moments await you.",
    "hero.badge": "⭐ #1 Agency in Peru",
    "hero.main-title": "Discover the Magic",
    "hero.main-subtitle": "of Ancient Peru",
    "hero.main-description":
      "Live unique experiences in the land of the Incas with our exclusive tours. From Machu Picchu to the Amazon, every moment will be unforgettable.",
    "hero.stats.years": "Years of experience",
    "hero.stats.travelers": "Happy travelers",
    "hero.stats.rating": "Average rating",
    "hero.cta.primary": "Explore Destinations",
    "hero.cta.secondary": "Watch Video",
    "hero.floating.travelers": "This month",
    "transport.section.title": "Our Premium Transportation",
    "transport.section.description":
      "Travel in comfort and safety throughout Peru. We offer the best transportation options to make your experience perfect.",
    "transport.bus.title": "Premium Tourist Bus",
    "transport.bus.description":
      "Luxury buses with air conditioning, reclining seats and onboard tour guide for your maximum comfort.",
    "transport.bus.feature1": "Air conditioning and WiFi",
    "transport.bus.feature2": "Premium reclining seats",
    "transport.bus.feature3": "Tour guide included",
    "transport.plane.title": "Domestic Flights",
    "transport.plane.description":
      "Fast and safe air connections to Peru's main tourist destinations with certified airlines.",
    "transport.plane.feature1": "Direct flights main destinations",
    "transport.plane.feature2": "Certified airlines",
    "transport.plane.feature3": "Priority check-in included",
    "transport.car.title": "Private Transfer",
    "transport.car.description":
      "Exclusive private transportation service with professional driver for your comfort and total privacy.",
    "transport.car.feature1": "Professional bilingual driver",
    "transport.car.feature2": "Luxury air-conditioned vehicles",
    "transport.car.feature3": "Door-to-door service",
    "transport.train.title": "Train to Machu Picchu",
    "transport.train.description":
      "Panoramic luxury train journey to Machu Picchu through the Sacred Valley with spectacular views.",
    "transport.train.feature1": "Luxury panoramic cars",
    "transport.train.feature2": "Gourmet service onboard",
    "transport.train.feature3": "Sacred Valley views",
    "footer.aboutDescription":
      "Discover the magic of Peru with our exclusive tours and authentic experiences that will connect you with the rich ancestral culture and history.",
    "footer.email": "Your email address",
    "footer.subscribe": "Subscribe",
    "footer.carbonSubtitle": "Carbon Neutral",
    "footer.availableNow": "Available Now",
    "footer.destinations": "Destinations",
    "footer.services": "Services",
    "footer.info": "Information",
    "footer.inspiration": "Inspiration",
    "footer.whyUs": "Why Us?",
    "footer.journal": "Travel Journal",
    "footer.sustainability": "Sustainability",
    "footer.contact": "Contact",
    "footer.bookingConditions": "Booking Conditions",
    "footer.travelInsurance": "Travel Insurance",
    "footer.preDepartureInfo": "Pre-Departure Info",
    "footer.privacyPolicy": "Privacy Policy",
    "footer.termsOfService": "Terms of Service",
    "footer.cookiePolicy": "Cookie Policy",
    "footer.callUs": "Call Us",
    "footer.emailUs": "Email Us",
    "footer.address": "Address",
    "footer.schedule": "Schedule",
    "footer.monday": "Monday",
    "footer.friday": "Friday",
    "footer.developedBy": "Developed by",
    "footer.followUs": "Follow Us",
    "footer.allRightsReserved": "All rights reserved",
  },
  fr: {
    "nav.transportes": "Transport",
    "nav.tours": "Tours",
    "nav.itinerarios": "Destinations",
    "nav.cuando-ir": "Quand partir?",
    "nav.nosotros": "À propos",
    "button.login": "Connexion",
    "button.book": "Réserver",
    "button.explore-tours": "Explorer les Tours",
    "hero.title": "Découvrez le Pérou Ancestral",
    "hero.description":
      "Vivez des expériences uniques sur la terre des Incas. Des tours authentiques, des guides experts et des moments inoubliables vous attendent.",
    "hero.badge": "⭐ Agence #1 au Pérou",
    "hero.main-title": "Découvrez la Magie",
    "hero.main-subtitle": "du Pérou Ancestral",
    "hero.main-description":
      "Vivez des expériences uniques sur la terre des Incas avec nos tours exclusifs. De Machu Picchu à l'Amazonie, chaque moment sera inoubliable.",
    "hero.stats.years": "Années d'expérience",
    "hero.stats.travelers": "Voyageurs heureux",
    "hero.stats.rating": "Note moyenne",
    "hero.cta.primary": "Explorer les Destinations",
    "hero.cta.secondary": "Voir la Vidéo",
    "hero.floating.travelers": "Ce mois-ci",
    "transport.section.title": "Nos Transports Premium",
    "transport.section.description":
      "Voyagez dans le confort et la sécurité à travers le Pérou. Nous offrons les meilleures options de transport pour rendre votre expérience parfaite.",
    "transport.bus.title": "Bus Touristique Premium",
    "transport.bus.description":
      "Bus de luxe avec climatisation, sièges inclinables et guide touristique à bord pour votre confort maximum.",
    "transport.bus.feature1": "Climatisation et WiFi",
    "transport.bus.feature2": "Sièges inclinables premium",
    "transport.bus.feature3": "Guide touristique inclus",
    "transport.plane.title": "Vols Domestiques",
    "transport.plane.description":
      "Connexions aériennes rapides et sûres vers les principales destinations touristiques du Pérou avec des compagnies certifiées.",
    "transport.plane.feature1": "Vols directs destinations principales",
    "transport.plane.feature2": "Compagnies aériennes certifiées",
    "transport.plane.feature3": "Enregistrement prioritaire inclus",
    "transport.car.title": "Transfer Privé",
    "transport.car.description":
      "Service exclusif de transport privé avec chauffeur professionnel pour votre confort et intimité totale.",
    "transport.car.feature1": "Chauffeur professionnel bilingue",
    "transport.car.feature2": "Véhicules de luxe climatisés",
    "transport.car.feature3": "Service porte à porte",
    "transport.train.title": "Train vers Machu Picchu",
    "transport.train.description":
      "Voyage panoramique en train de luxe vers Machu Picchu à travers la Vallée Sacrée avec des vues spectaculaires.",
    "transport.train.feature1": "Wagons panoramiques de luxe",
    "transport.train.feature2": "Service gourmet à bord",
    "transport.train.feature3": "Vues de la Vallée Sacrée",
    "footer.aboutDescription":
      "Découvrez la magie du Pérou avec nos tours exclusifs et expériences authentiques qui vous connecteront à la riche culture et histoire ancestrale.",
    "footer.email": "Votre adresse email",
    "footer.subscribe": "S'abonner",
    "footer.carbonSubtitle": "Neutre en Carbone",
    "footer.availableNow": "Disponible Maintenant",
    "footer.destinations": "Destinations",
    "footer.services": "Services",
    "footer.info": "Information",
    "footer.inspiration": "Inspiration",
    "footer.whyUs": "Pourquoi Nous?",
    "footer.journal": "Journal de Voyage",
    "footer.sustainability": "Durabilité",
    "footer.contact": "Contact",
    "footer.bookingConditions": "Conditions de Réservation",
    "footer.travelInsurance": "Assurance Voyage",
    "footer.preDepartureInfo": "Info Pré-Départ",
    "footer.privacyPolicy": "Politique de Confidentialité",
    "footer.termsOfService": "Conditions de Service",
    "footer.cookiePolicy": "Politique des Cookies",
    "footer.callUs": "Appelez-nous",
    "footer.emailUs": "Écrivez-nous",
    "footer.address": "Adresse",
    "footer.schedule": "Horaires",
    "footer.monday": "Lundi",
    "footer.friday": "Vendredi",
    "footer.developedBy": "Développé par",
    "footer.followUs": "Suivez-nous",
    "footer.allRightsReserved": "Tous droits réservés",
  },
  de: {
    "nav.transportes": "Transport",
    "nav.tours": "Touren",
    "nav.itinerarios": "Destinazioni",
    "nav.cuando-ir": "Wann reisen?",
    "nav.nosotros": "Über uns",
    "button.login": "Anmelden",
    "button.book": "Buchen",
    "button.explore-tours": "Touren Erkunden",
    "hero.title": "Entdecke das Alte Peru",
    "hero.description":
      "Erlebe einzigartige Erfahrungen im Land der Inkas. Authentische Touren, Expertenführer und unvergessliche Momente erwarten dich.",
    "hero.badge": "⭐ #1 Agentur in Peru",
    "hero.main-title": "Entdecke die Magie",
    "hero.main-subtitle": "des Alten Peru",
    "hero.main-description":
      "Erlebe einzigartige Erfahrungen im Land der Inkas mit unseren exklusiven Touren. Von Machu Picchu bis zum Amazonas wird jeder Moment unvergesslich sein.",
    "hero.stats.years": "Jahre Erfahrung",
    "hero.stats.travelers": "Glückliche Reisende",
    "hero.stats.rating": "Durchschnittsbewertung",
    "hero.cta.primary": "Ziele Erkunden",
    "hero.cta.secondary": "Video Ansehen",
    "hero.floating.travelers": "Diesen Monat",
    "transport.section.title": "Unsere Premium-Transporte",
    "transport.section.description":
      "Reisen Sie komfortabel und sicher durch ganz Peru. Wir bieten die besten Transportoptionen, um Ihre Erfahrung perfekt zu machen.",
    "transport.bus.title": "Premium Touristenbus",
    "transport.bus.description":
      "Luxusbusse mit Klimaanlage, verstellbaren Sitzen und Reiseführer an Bord für Ihren maximalen Komfort.",
    "transport.bus.feature1": "Klimaanlage und WiFi",
    "transport.bus.feature2": "Premium verstellbare Sitze",
    "transport.bus.feature3": "Reiseführer inklusive",
    "transport.plane.title": "Inlandsflüge",
    "transport.plane.description":
      "Schnelle und sichere Flugverbindungen zu Perus wichtigsten Touristenzielen mit zertifizierten Fluggesellschaften.",
    "transport.plane.feature1": "Direktflüge Hauptziele",
    "transport.plane.feature2": "Zertifizierte Fluggesellschaften",
    "transport.plane.feature3": "Priority Check-in inklusive",
    "transport.car.title": "Privater Transfer",
    "transport.car.description":
      "Exklusiver privater Transportservice mit professionellem Fahrer für Ihren Komfort und absolute Privatsphäre.",
    "transport.car.feature1": "Professioneller zweisprachiger Fahrer",
    "transport.car.feature2": "Luxus-Klimafahrzeuge",
    "transport.car.feature3": "Tür-zu-Tür-Service",
    "transport.train.title": "Zug nach Machu Picchu",
    "transport.train.description":
      "Panorama-Luxuszugreise nach Machu Picchu durch das Heilige Tal mit spektakulären Aussichten.",
    "transport.train.feature1": "Luxus-Panoramawagen",
    "transport.train.feature2": "Gourmet-Service an Bord",
    "transport.train.feature3": "Blick auf das Heilige Tal",
    "footer.aboutDescription":
      "Entdecken Sie die Magie Perus mit unseren exklusiven Touren und authentischen Erfahrungen, die Sie mit der reichen Ahnenkultur und Geschichte verbinden.",
    "footer.email": "Ihre E-Mail-Adresse",
    "footer.subscribe": "Abonnieren",
    "footer.carbonSubtitle": "Klimaneutral",
    "footer.availableNow": "Jetzt Verfügbar",
    "footer.destinations": "Reiseziele",
    "footer.services": "Dienstleistungen",
    "footer.info": "Information",
    "footer.inspiration": "Inspiration",
    "footer.whyUs": "Warum Wir?",
    "footer.journal": "Reisetagebuch",
    "footer.sustainability": "Nachhaltigkeit",
    "footer.contact": "Kontakt",
    "footer.bookingConditions": "Buchungsbedingungen",
    "footer.travelInsurance": "Reiseversicherung",
    "footer.preDepartureInfo": "Vorab-Informationen",
    "footer.privacyPolicy": "Datenschutzrichtlinie",
    "footer.termsOfService": "Nutzungsbedingungen",
    "footer.cookiePolicy": "Cookie-Richtlinie",
    "footer.callUs": "Rufen Sie uns an",
    "footer.emailUs": "Schreiben Sie uns",
    "footer.address": "Adresse",
    "footer.schedule": "Öffnungszeiten",
    "footer.monday": "Montag",
    "footer.friday": "Freitag",
    "footer.developedBy": "Entwickelt von",
    "footer.followUs": "Folgen Sie uns",
    "footer.allRightsReserved": "Alle Rechte vorbehalten",
  },
  it: {
    "nav.transportes": "Trasporti",
    "nav.tours": "Tour",
    "nav.itinerarios": "Itinerari",
    "nav.cuando-ir": "Quando andare?",
    "nav.nosotros": "Chi siamo",
    "button.login": "Accedi",
    "button.book": "Prenota",
    "button.explore-tours": "Esplora Tour",
    "hero.title": "Scopri il Perù Ancestrale",
    "hero.description":
      "Vivi esperienze uniche nella terra degli Incas. Tour autentici, guide esperte e momenti indimenticabili ti aspettano.",
    "hero.badge": "⭐ Agenzia #1 in Perù",
    "hero.main-title": "Scopri la Magia",
    "hero.main-subtitle": "del Perù Ancestrale",
    "hero.main-description":
      "Vivi esperienze uniche nella terra degli Incas con i nostre tour esclusivi. Da Machu Picchu all'Amazzonia, ogni momento sarà indimenticabile.",
    "hero.stats.years": "Anni di esperienza",
    "hero.stats.travelers": "Viaggiatori felici",
    "hero.stats.rating": "Valutazione media",
    "hero.cta.primary": "Esplora Destinazioni",
    "hero.cta.secondary": "Guarda Video",
    "hero.floating.travelers": "Questo mese",
    "transport.section.title": "I Nostri Trasporti Premium",
    "transport.section.description":
      "Viaggia in comfort e sicurezza in tutto il Perù. Offriamo le migliori opzioni di trasporto per rendere perfetta la tua esperienza.",
    "transport.bus.title": "Bus Turistico Premium",
    "transport.bus.description":
      "Bus di lusso con aria condizionata, sedili reclinabili e guida turistica a bordo per il tuo massimo comfort.",
    "transport.bus.feature1": "Aria condizionata e WiFi",
    "transport.bus.feature2": "Sedili reclinabili premium",
    "transport.bus.feature3": "Guida turistica inclusa",
    "transport.plane.title": "Voli Domestici",
    "transport.plane.description":
      "Connessioni aeree veloci e sicure verso le principali destinazioni turistiche del Perù con compagnie certificate.",
    "transport.plane.feature1": "Voli diretti destinazioni principali",
    "transport.plane.feature2": "Compagnie aeree certificate",
    "transport.plane.feature3": "Check-in prioritario incluso",
    "transport.car.title": "Transfer Privato",
    "transport.car.description":
      "Servizio esclusivo di trasporto privato con autista professionale per il tuo comfort e privacy totale.",
    "transport.car.feature1": "Autista professionale bilingue",
    "transport.car.feature2": "Veicoli di lusso climatizzati",
    "transport.car.feature3": "Servizio porta a porta",
    "transport.train.title": "Treno per Machu Picchu",
    "transport.train.description":
      "Viaggio panoramico in treno di lusso verso Machu Picchu attraverso la Valle Sacra con viste spettacolari.",
    "transport.train.feature1": "Vagoni panoramici di lusso",
    "transport.train.feature2": "Servizio gourmet a bordo",
    "transport.train.feature3": "Viste della Valle Sacra",
    "footer.aboutDescription":
      "Scopri la magia del Perù con i nostre tour esclusivi ed esperienze autentiche che ti collegheranno alla ricca cultura e storia ancestrale.",
    "footer.email": "Il tuo indirizzo email",
    "footer.subscribe": "Iscriviti",
    "footer.carbonSubtitle": "Neutro al Carbonio",
    "footer.availableNow": "Disponibile Ora",
    "footer.destinations": "Destinazioni",
    "footer.services": "Servizi",
    "footer.info": "Informazioni",
    "footer.inspiration": "Ispirazione",
    "footer.whyUs": "Perché Noi?",
    "footer.journal": "Diario di Viaggio",
    "footer.sustainability": "Sostenibilità",
    "footer.contact": "Contatto",
    "footer.bookingConditions": "Condizioni di Prenotazione",
    "footer.travelInsurance": "Assicurazione Viaggio",
    "footer.preDepartureInfo": "Info Pre-Partenza",
    "footer.privacyPolicy": "Politica sulla Privacy",
    "footer.termsOfService": "Termini di Servizio",
    "footer.cookiePolicy": "Politica sui Cookie",
    "footer.callUs": "Chiamaci",
    "footer.emailUs": "Scrivici",
    "footer.address": "Indirizzo",
    "footer.schedule": "Orari",
    "footer.monday": "Lunedì",
    "footer.friday": "Venerdì",
    "footer.developedBy": "Sviluppato da",
    "footer.followUs": "Seguici",
    "footer.allRightsReserved": "Tutti i diritti riservati",
  },
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("es")

  useEffect(() => {
    const path = window.location.pathname
    const langFromPath = path.split("/")[1]

    if (langFromPath === "en") setLanguage("en")
    else if (langFromPath === "fr") setLanguage("fr")
    else if (langFromPath === "de") setLanguage("de")
    else if (langFromPath === "it") setLanguage("it")
    else setLanguage("es")

    const savedLanguage = localStorage.getItem("preferred-language") as Language
    if (savedLanguage && ["es", "en", "fr", "de", "it"].includes(savedLanguage)) {
      setLanguage(savedLanguage)
    }
  }, [])

  const updateLanguage = (newLanguage: Language) => {
    setLanguage(newLanguage)
    localStorage.setItem("preferred-language", newLanguage)
  }

  const t = (key: string): string => {
    return translations[language][key as keyof (typeof translations)[typeof language]] || key
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage: updateLanguage, t }}>{children}</LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
