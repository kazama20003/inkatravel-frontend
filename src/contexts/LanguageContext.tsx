"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

// Definir los idiomas soportados
export type SupportedLanguage = "es" | "en" | "fr" | "de"

// Definir la interfaz común para todas las traducciones
export interface Translations {
  readonly destinations: string
  readonly tours: string
  readonly itineraries: string
  readonly whenToGo: string
  readonly aboutUs: string
  readonly login: string
  readonly reserve: string
  readonly search: string
  readonly close: string
  readonly menu: string
  readonly language: string
  readonly loading: string
  readonly error: string
  readonly retry: string
  readonly reviews: string
  readonly departures: string
  readonly regularPrice: string
  readonly viewDetails: string
  readonly noResults: string
  readonly showMore: string
  readonly showLess: string
  readonly readMore: string
  readonly readLess: string
  readonly contact: string
  readonly email: string
  readonly phone: string
  readonly address: string
  readonly followUs: string
  readonly newsletter: string
  readonly subscribe: string
  readonly privacyPolicy: string
  readonly termsOfService: string
  readonly cookiePolicy: string
  readonly allRightsReserved: string
  readonly home: string
  readonly about: string
  readonly services: string
  readonly gallery: string
  readonly testimonials: string
  readonly faq: string
  readonly blog: string
  readonly news: string
  readonly events: string
  readonly promotions: string
  readonly packages: string
  readonly booking: string
  readonly confirmation: string
  readonly payment: string
  readonly checkout: string
  readonly cart: string
  readonly wishlist: string
  readonly profile: string
  readonly settings: string
  readonly logout: string
  readonly register: string
  readonly forgotPassword: string
  readonly resetPassword: string
  readonly changePassword: string
  readonly updateProfile: string
  readonly deleteAccount: string
  readonly save: string
  readonly cancel: string
  readonly edit: string
  readonly delete: string
  readonly add: string
  readonly remove: string
  readonly update: string
  readonly create: string
  readonly view: string
  readonly download: string
  readonly upload: string
  readonly share: string
  readonly copy: string
  readonly print: string
  readonly export: string
  readonly import: string
  readonly refresh: string
  readonly reload: string
  readonly continue: string
  readonly finish: string
  readonly submit: string
  readonly send: string
  readonly receive: string
  readonly accept: string
  readonly decline: string
  readonly approve: string
  readonly reject: string
  readonly confirm: string
  readonly verify: string
  readonly validate: string
  readonly authenticate: string
  readonly authorize: string
  readonly permission: string
  readonly access: string
  readonly denied: string
  readonly granted: string
  readonly expired: string
  readonly invalid: string
  readonly valid: string
  readonly required: string
  readonly optional: string
  readonly available: string
  readonly unavailable: string
  readonly online: string
  readonly offline: string
  readonly connected: string
  readonly disconnected: string
  readonly active: string
  readonly inactive: string
  readonly enabled: string
  readonly disabled: string
  readonly public: string
  readonly private: string
  readonly draft: string
  readonly published: string
  readonly archived: string
  readonly deleted: string
  readonly restored: string
  readonly backup: string
  readonly restore: string
  readonly sync: string
  readonly processing: string
  readonly completed: string
  readonly failed: string
  readonly pending: string
  readonly cancelled: string
  readonly scheduled: string
  readonly delayed: string
  readonly onTime: string
  readonly early: string
  readonly late: string
  readonly today: string
  readonly yesterday: string
  readonly tomorrow: string
  readonly thisWeek: string
  readonly lastWeek: string
  readonly nextWeek: string
  readonly thisMonth: string
  readonly lastMonth: string
  readonly nextMonth: string
  readonly thisYear: string
  readonly lastYear: string
  readonly nextYear: string
  readonly date: string
  readonly time: string
  readonly datetime: string
  readonly timezone: string
  readonly duration: string
  readonly startDate: string
  readonly endDate: string
  readonly startTime: string
  readonly endTime: string
  readonly allDay: string
  readonly recurring: string
  readonly reminder: string
  readonly notification: string
  readonly alert: string
  readonly warning: string
  readonly info: string
  readonly success: string
  readonly danger: string
  readonly primary: string
  readonly secondary: string
  readonly light: string
  readonly dark: string
  readonly muted: string
  readonly accent: string
  readonly background: string
  readonly foreground: string
  readonly border: string
  readonly input: string
  readonly ring: string
  readonly chart: string
  readonly sidebar: string
  readonly card: string
  readonly popover: string
  readonly destructive: string
  // Transport page specific translations
  readonly tourNotFound: string
  readonly backToHome: string
  readonly panoramicRoute: string
  readonly stopsOnRoute: string
  readonly stopOf: string
  readonly routeInfoNotAvailable: string
  readonly schedulesAndAvailability: string
  readonly departureTime: string
  readonly arriveEarly: string
  readonly availableDays: string
  readonly regularDepartures: string
  readonly includes: string
  readonly notIncludes: string
  readonly selectAvailableDate: string
  readonly numberOfPassengers: string
  readonly passenger: string
  readonly passengers: string
  readonly totalToPay: string
  readonly perPerson: string
  readonly reserveNow: string
  readonly consultWhatsApp: string
  readonly callNow: string
  readonly passengerInfo: string
  readonly fullName: string
  readonly nationality: string
  readonly backButton: string
  readonly confirmReservation: string
  readonly reservationSummary: string
  readonly orderCreatedSuccess: string
  readonly orderCreationError: string
  readonly completeRequiredFields: string
  readonly unlimitedCapacity: string
  readonly offer: string
  readonly monday: string
  readonly tuesday: string
  readonly wednesday: string
  readonly thursday: string
  readonly friday: string
  readonly saturday: string
  readonly sunday: string
  readonly discoverDestinations: string
  readonly mostPopularDestinations: string
  readonly explorePopular: string
  readonly viewAllTours: string
  readonly errorLoadingTours: string
  readonly noToursAvailable: string
  readonly featured: string
  readonly aboutDescription: string
  readonly atolTitle: string
  readonly atolSubtitle: string
  readonly zeroTitle: string
  readonly zeroSubtitle: string
  readonly carbonTitle: string
  readonly carbonSubtitle: string
  readonly howItWorks: string
  readonly howItWorksSubtitle: string
  readonly stepPlanTitle: string
  readonly stepPlanDescription: string
  readonly stepCustomizeTitle: string
  readonly stepCustomizeDescription: string
  readonly stepEnjoyTitle: string
  readonly stepEnjoyDescription: string
  readonly dontWaitText1: string
  readonly dontWaitText2: string
  readonly dontWaitText3: string
  readonly startAdventure: string
  readonly adventurerImageAlt: string
  readonly ourServices: string
  readonly ourServicesSubtitle: string
  readonly tailorMadeTab: string
  readonly expertGuidesTab: string
  readonly pricePromiseTab: string
  readonly familyOperatedTab: string
  readonly carbonOffsetTab: string
  readonly charityCommitmentTab: string
  readonly tailorMadeTitle: string
  readonly tailorMadeDescription: string
  readonly tailorMadeButton: string
  readonly expertGuidesTitle: string
  readonly expertGuidesDescription: string
  readonly expertGuidesButton: string
  readonly pricePromiseTitle: string
  readonly pricePromiseDescription: string
  readonly pricePromiseButton: string
  readonly familyOperatedTitle: string
  readonly familyOperatedDescription: string
  readonly familyOperatedButton: string
  readonly carbonOffsetTitle: string
  readonly carbonOffsetDescription: string
  readonly carbonOffsetButton: string
  readonly charityCommitmentTitle: string
  readonly charityCommitmentDescription: string
  readonly charityCommitmentButton: string
  // Testimonials Section
  readonly fromOurTravellers: string
  readonly testimonial1: string
  readonly testimonial2: string
  readonly testimonial3: string
  readonly testimonial4: string
  readonly testimonial5: string
  readonly testimonial6: string
  readonly testimonialName1: string
  readonly testimonialName2: string
  readonly testimonialName3: string
  readonly testimonialName4: string
  readonly testimonialName5: string
  readonly testimonialName6: string
  readonly enquireNow: string
  readonly startPlanningTitle: string
  readonly speakToSpecialist: string
  readonly enquireNowButton: string
  readonly callUsButton: string
  readonly availableNow: string
  readonly travelSpecialistAlt: string
  readonly contactImageAlt: string
  readonly locale: string
  // New keys for carousel header and dummy content
  readonly carouselTitle: string
  readonly carouselSubtitle: string
  readonly tripDetails: string
  readonly priceUSD: string
  readonly pricePEN: string
  readonly rating: string // Added rating key
  readonly originCity: string // Added originCity key
  readonly destinationCity: string // Added destinationCity key
  readonly hours: string // Added hours key
  readonly arrivalTime: string // Added arrivalTime key
  // New keys for tours page
  readonly peruToursTitle: string
  readonly peruToursSubtitle: string
  readonly toursAvailable: string
  readonly searchToursPlaceholder: string
  readonly filters: string
  readonly searchFilters: string
  readonly allCategories: string
  readonly category: string
  readonly difficulty: string
  readonly allDifficulties: string
  readonly packageType: string
  readonly allPackageTypes: string
  readonly region: string
  readonly regionPlaceholder: string
  readonly location: string
  readonly locationPlaceholder: string
  readonly clear: string
  readonly apply: string
  readonly activeFilters: string
  readonly toursFoundSingular: string
  readonly toursFoundPlural: string
  readonly noToursAvailableTitle: string
  readonly noToursAvailableMessage: string
  readonly transport: string
  readonly difficultyFacil: string
  readonly difficultyModerado: string
  readonly difficultyDificil: string
  readonly packageTypeBasico: string
  readonly packageTypePremium: string
  readonly errorLoadingToursMessage: string
  readonly previous: string // Kept for pagination
  readonly page: string
  readonly next: string // Kept for pagination
  readonly featuredTour: string
  readonly highlightedPlaces: string
  readonly allDays: string
  readonly notAvailable: string
  readonly route: string
  readonly schedule: string
  // New keys for footer
  readonly inspiration: string
  readonly whyUs: string
  readonly journal: string
  readonly bookingConditions: string
  readonly travelInsurance: string
  readonly preDepartureInfo: string
  readonly topPages: string
  readonly safariHoneymoons: string
  readonly safariBeachHoneymoons: string
  readonly familySafaris: string
  readonly luxurySafaris: string
  readonly callUs: string
  readonly emailUs: string
  // New keys for header
  readonly discover: string
  readonly learn: string
  readonly sustainability: string
  readonly howCanWeHelp: string
  // New keys for ItinerariesPage
  readonly peru: string
  readonly itinerariesHeroSubtitle: string
  readonly exploreItineraries: string
  readonly uniqueItineraries: string
  readonly yearsOfExperience: string
  readonly happyTravelers: string
  readonly averageRating: string
  readonly chooseYourAdventure: string
  readonly chooseAdventureSubtitle: string
  readonly shortDuration: string
  readonly mediumDuration: string
  readonly longDuration: string
  readonly from: string
  readonly mainHighlights: string
  readonly plusMore: string
  readonly group: string
  readonly whyChooseOurItineraries: string
  readonly exclusiveRoutes: string
  readonly exclusiveRoutesDescription: string
  readonly smallGroups: string
  readonly smallGroupsDescription: string
  readonly guaranteedQuality: string
  readonly guaranteedQualityDescription: string
  readonly totalFlexibility: string
  readonly totalFlexibilityDescription: string
  readonly allInclusive: string
  readonly allInclusiveDescription: string
  readonly uniqueExperiences: string
  readonly uniqueExperiencesDescription: string
  readonly readyForAdventure: string
  readonly readyForAdventureSubtitle: string
  readonly consultItinerary: string
  readonly speakToExpert: string
  // New keys for AboutUsPage
  readonly aboutHeroSubtitle: string
  readonly ourStoryButton: string
  readonly viewOurTeamButton: string
  readonly discoverMore: string
  readonly ourAchievements: string
  readonly achievementsSubtitle: string
  readonly creatingUnforgettableExperiences: string
  readonly fromOver50Countries: string
  readonly throughoutPeru: string
  readonly satisfaction: string
  readonly ourHistory: string
  readonly historySubtitle: string
  readonly foundation: string
  readonly foundationDescription: string
  readonly firstToursMachuPicchu: string
  readonly firstOfficeCusco: string
  readonly fiveInitialTours: string
  readonly teamOfThree: string
  readonly expansion: string
  readonly expansionDescription: string
  readonly thousandTravelersServed: string
  readonly newAmazonRoutes: string
  readonly officeInLima: string
  readonly fifteenSpecializedGuides: string
  readonly internationalCertification: string
  readonly iataCertificationDescription: string
  readonly iataCertification: string
  readonly officialRecognition: string
  readonly fiveThousandSatisfiedClients: string
  readonly sustainableTourismDescription: string
  readonly sustainableCertification: string
  readonly ecoFriendlyPrograms: string
  readonly communityPartnerships: string
  readonly greenCertification: string
  readonly digitalInnovation: string
  readonly digitalInnovationDescription: string
  readonly digitalPlatform: string
  readonly virtualTours: string
  readonly covidProtocols: string
  readonly industryLeaders: string
  readonly industryLeadersDescription: string
  readonly tenThousandPlusHappyTravelers: string
  readonly marketLeader: string
  readonly fiftyPlusDestinations: string
  readonly ninetyEightPercentSatisfaction: string
  readonly whyChooseUsSubtitle: string
  readonly localExperience: string
  readonly localExperienceDescription: string
  readonly responsibleTourism: string
  readonly responsibleTourismDescription: string
  readonly personalizedAttention: string
  readonly personalizedAttentionDescription: string
  readonly guaranteedSafety: string
  readonly guaranteedSafetyDescription: string
  readonly support247: string
  readonly support247Description: string
  readonly bestPriceGuaranteed: string
  readonly bestPriceGuaranteedDescription: string
  readonly ourValues: string
  readonly ourValuesSubtitle: string
  readonly authenticity: string
  readonly authenticityDescription: string
  readonly sustainabilityValueDescription: string
  readonly excellence: string
  readonly excellenceDescription: string
  readonly safety: string
  readonly safetyDescription: string
  readonly innovation: string
  readonly innovationDescription: string
  readonly passion: string
  readonly passionDescription: string
  readonly teamSubtitle: string
  readonly founderCEO: string
  readonly operationsDirector: string
  readonly headOfGuides: string
  readonly sustainabilityCoordinator: string
  readonly carlosDescription: string
  readonly mariaDescription: string
  readonly robertoDescription: string
  readonly anaDescription: string
  readonly spanish: string
  readonly english: string
  readonly quechua: string
  readonly aymara: string
  readonly french: string
  readonly portuguese: string
  readonly officialGuide: string
  readonly firstAid: string
  readonly sustainableTourism: string
  readonly anthropologist: string
  readonly specializedGuide: string
  readonly culturalHeritage: string
  readonly mountainGuide: string
  readonly highAltitudeRescue: string
  readonly wildernessFirstAid: string
  readonly biologist: string
  readonly conservation: string
  readonly certificationsAndRecognitions: string
  readonly certificationsSubtitle: string
  readonly iataDescription: string
  readonly sustainableTourismCertDescription: string
  readonly tripAdvisorExcellence: string
  readonly tripAdvisorExcellenceDescription: string
  readonly iso9001: string
  readonly iso9001Description: string
  readonly whatOurTravelersSay: string
  readonly travelerExperiencesSubtitle: string
  readonly unitedStates: string
  readonly germany: string
  readonly japan: string
  readonly testimonialText1: string
  readonly testimonialText2: string
  readonly testimonialText3: string
  readonly machuPicchuSacredValley: string
  readonly classicIncaTrail: string
  readonly amazonAdventure: string
  readonly readyForPeruvianAdventure: string
  readonly callToActionSubtitle: string
  readonly contactUs: string
  readonly uniqueDestinations: string
  readonly whyChooseUs: string
  readonly ourTeam: string
  readonly planYourTrip: string
  // When To Go Page specific translations
  readonly whenToGoTitle: string
  readonly whenToGoSubtitle: string
  readonly planYourTripButton: string
  readonly daysOfAdventure: string
  readonly climaticRegions: string
  readonly uniqueMonths: string
  readonly incredibleDestinations: string
  readonly exploreByCategory: string
  readonly chooseHowToPlan: string
  readonly bySeasons: string
  readonly monthByMonth: string
  readonly byDestinations: string
  readonly drySeason: string
  readonly drySeasonMonths: string
  readonly drySeasonDescription: string
  readonly rainySeason: string
  readonly rainySeasonMonths: string
  readonly rainySeasonDescription: string
  readonly climate: string
  readonly temperature: string
  readonly recommendedActivities: string
  readonly whatToWear: string
  readonly coastRegion: string
  readonly sierraRegion: string
  readonly jungleRegion: string
  readonly sunnyAndDry: string
  readonly dryAndCool: string
  readonly lessRain: string
  readonly cloudyAndHumid: string
  readonly rainyWeather: string
  readonly veryRainy: string
  readonly coastDryTemp: string
  readonly sierraDryTemp: string
  readonly jungleDryTemp: string
  readonly coastDryDescription: string
  readonly sierraDryDescription: string
  readonly jungleDryDescription: string
  readonly beaches: string
  readonly waterSports: string
  readonly coastalHiking: string
  readonly machuPicchuActivity: string
  readonly incaTrailActivity: string
  readonly cityToursActivity: string
  readonly amazonSafari: string
  readonly wildlifeObservation: string
  readonly navigation: string
  readonly lightClothing: string
  readonly sunscreen: string
  readonly hat: string
  readonly layersOfClothing: string
  readonly warmJacket: string
  readonly trekkingShoes: string
  readonly repellent: string
  readonly waterproofBoots: string
  readonly romanticAtmosphere: string
  readonly museums: string
  readonly gastronomy: string
  readonly nightlife: string
  readonly warmClothing: string
  readonly lightJacket: string
  readonly umbrella: string
  readonly greenLandscapes: string
  readonly difficultTrails: string
  readonly colonialCities: string
  readonly markets: string
  readonly waterproofClothing: string
  readonly highBoots: string
  readonly poncho: string
  readonly highRivers: string
  readonly lushVegetation: string
  readonly lodges: string
  readonly birdWatching: string
  readonly fishing: string
  readonly climateMonthByMonth: string
  readonly detailedClimateInfo: string
  readonly popularity: string
  readonly tourismLevel: string
  readonly advantages: string
  readonly consider: string
  readonly january: string
  readonly february: string
  readonly march: string
  readonly april: string
  readonly may: string
  readonly june: string
  readonly july: string
  readonly august: string
  readonly september: string
  readonly october: string
  readonly november: string
  readonly december: string
  readonly transitionSeason: string
  readonly lowRain: string
  readonly highRain: string
  readonly veryHighRain: string
  readonly lessTourists: string
  readonly lowPrices: string
  readonly incaTrailClosed: string
  readonly possibleFloods: string
  readonly endOfRains: string
  readonly muddyTrails: string
  readonly goodWeather: string
  readonly unpredictableWeather: string
  readonly startDrySeason: string
  readonly excellentClimate: string
  readonly incaTrailOpen: string
  readonly moreTourists: string
  readonly bestClimate: string
  readonly intiRaymi: string
  readonly clearSkies: string
  readonly crowds: string
  readonly highPrices: string
  readonly peakSeason: string
  readonly perfectClimate: string
  readonly reservationsNeeded: string
  readonly strongWindsSierra: string
  readonly mountainWinds: string
  readonly endDrySeason: string
  readonly occasionalWinds: string
  readonly startRains: string
  readonly changingLandscapes: string
  readonly christmasHolidays: string
  readonly frequentRains: string
  readonly bestTimeToVisitByDestination: string
  readonly eachDestinationIdealTime: string
  readonly bestMonthsToVisit: string
  readonly monthsToAvoid: string
  readonly expertTips: string
  readonly machuPicchuDestination: string
  readonly amazonDestination: string
  readonly colcaCanyonDestination: string
  readonly nazcaLinesDestination: string
  readonly lakeTiticacaDestination: string
  readonly northCoastDestination: string
  readonly machuPicchuDescription: string
  readonly amazonDescription: string
  readonly colcaCanyonDescription: string
  readonly nazcaLinesDescription: string
  readonly lakeTiticacaDescription: string
  readonly northCoastDescription: string
  readonly book3_4MonthsAhead: string
  readonly incaTrailClosesFeb: string
  readonly wearWarmClothesMornings: string
  readonly lowerRiversEasierNavigation: string
  readonly higherAnimalConcentration: string
  readonly lessMosquitoesDrySeason: string
  readonly condorsMoreActiveMorning: string
  readonly avoidRainySeasonTrekking: string
  readonly flightsCanceledStrongWinds: string
  readonly betterVisibilityMornings: string
  readonly wearSunscreen: string
  readonly veryColdNightsDrySeason: string
  readonly sunProtectionAltitude: string
  readonly beachSeasonSummer: string
  readonly avoidCoastalWinter: string
  readonly idealWaterSports: string
  readonly allYear: string
  readonly visitors: string
  readonly whyPlanWithUs: string
  readonly ourExperienceGuarantees: string
  readonly localExperts: string
  readonly localExpertsDescription: string
  readonly perfectPlanning: string
  readonly perfectPlanningDescription: string
  readonly guaranteedClimate: string
  readonly guaranteedClimateDescription: string
  readonly optimizedRoutes: string
  readonly optimizedRoutesDescription: string
  readonly uniqueMoments: string
  readonly uniqueMomentsDescription: string
  readonly yourPerfectAdventure: string
  readonly isWaitingForYou: string
  readonly nowThatYouKnow: string
  readonly bookNow: string
  readonly freeConsultation: string
  // New keys for TourDetailPage tabs
  readonly itinerary: string
  readonly bring: string
  readonly conditions: string
  readonly processingPayment: string
   readonly errorProcessingPayment: string
  readonly completeYourPayment: string
  readonly loadingPaymentForm: string
}

// Información de idioma con banderas y nombres nativos
export const languageInfo: Record<SupportedLanguage, { flag: string; code: string; name: string; nativeName: string }> =
  {
    es: { flag: "🇪🇸", code: "ES", name: "Spanish", nativeName: "Español" },
    en: { flag: "🇺🇸", code: "EN", name: "English", nativeName: "English" },
    fr: { flag: "🇫🇷", code: "FR", name: "French", nativeName: "Français" },
    de: { flag: "🇩🇪", code: "DE", name: "German", nativeName: "Deutsch" },
  }

// Tipo del contexto
interface LanguageContextType {
  language: SupportedLanguage
  setLanguage: (language: SupportedLanguage) => void
  t: Translations
  isLoading: boolean
}

// Crear el contexto
const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

// Detectar idioma del navegador
const detectBrowserLanguage = (): SupportedLanguage => {
  if (typeof window === "undefined") return "es"
  const browserLang = navigator.language.toLowerCase()
  if (browserLang.startsWith("en")) return "en"
  if (browserLang.startsWith("fr")) return "fr"
  if (browserLang.startsWith("de")) return "de"
  return "es" // Default fallback
}

// Provider del contexto
export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<SupportedLanguage>("es")
  const [isLoading, setIsLoading] = useState(true)

  // Inicializar idioma
  useEffect(() => {
    const savedLanguage = localStorage.getItem("preferred-language") as SupportedLanguage
    const initialLanguage = savedLanguage || detectBrowserLanguage()
    setLanguageState(initialLanguage)
    setIsLoading(false)
  }, [])

  // Función para cambiar idioma
  const setLanguage = (newLanguage: SupportedLanguage) => {
    setLanguageState(newLanguage)
    localStorage.setItem("preferred-language", newLanguage)
  }

  // Obtener traducciones actuales
  const translations: Record<SupportedLanguage, Translations> = {
    es: {
      destinations: "DESTINOS",
      tours: "TOURS",
      itineraries: "ITINERARIOS",
      whenToGo: "CUÁNDO IR",
      aboutUs: "NOSOTROS",
      login: "INICIAR SESIÓN",
      reserve: "RESERVAR",
      search: "BUSCAR",
      close: "CERRAR",
      menu: "MENÚ",
      language: "IDIOMA",
      loading: "CARGANDO",
      error: "ERROR",
      retry: "REINTENTAR",
      reviews: "reseñas",
      noResults: "SIN RESULTADOS",
      showMore: "MOSTRAR MÁS",
      showLess: "MOSTRAR MENOS",
      readMore: "LEER MÁS",
      readLess: "LEER MENOS",
      contact: "CONTACTO",
      email: "EMAIL",
      phone: "TELÉFONO",
      address: "DIRECCIÓN",
      followUs: "SÍGUENOS",
      newsletter: "BOLETÍN",
      subscribe: "SUSCRIBIRSE",
      privacyPolicy: "POLÍTICA DE PRIVACIDAD",
      termsOfService: "TÉRMINOS DE SERVICIO",
      cookiePolicy: "POLÍTICA DE COOKIES",
      allRightsReserved: "TODOS LOS DERECHOS RESERVADOS",
      home: "INICIO",
      about: "ACERCA DE",
      services: "SERVICIOS",
      gallery: "GALERÍA",
      testimonials: "TESTIMONIOS",
      faq: "PREGUNTAS FRECUENTES",
      blog: "BLOG",
      news: "NOTICIAS",
      events: "EVENTOS",
      promotions: "PROMOCIONES",
      packages: "PAQUETES",
      booking: "RESERVA",
      confirmation: "CONFIRMACIÓN",
      payment: "PAGO",
      checkout: "FINALIZAR COMPRA",
      cart: "CARRITO",
      wishlist: "LISTA DE DESEOS",
      profile: "PERFIL",
      settings: "CONFIGURACIÓN",
      logout: "CERRAR SESIÓN",
      register: "REGISTRARSE",
      forgotPassword: "OLVIDÉ MI CONTRASEÑA",
      resetPassword: "RESTABLECER CONTRASEÑA",
      changePassword: "CAMBIAR CONTRASEÑA",
      updateProfile: "ACTUALIZAR PERFIL",
      deleteAccount: "ELIMINAR CUENTA",
      save: "GUARDAR",
      cancel: "CANCELAR",
      edit: "EDITAR",
      delete: "ELIMINAR",
      add: "AGREGAR",
      remove: "QUITAR",
      update: "ACTUALIZAR",
      create: "CREAR",
      view: "VER",
      download: "DESCARGAR",
      upload: "SUBIR",
      share: "COMPARTIR",
      copy: "COPIAR",
      print: "IMPRIMIR",
      export: "EXPORTAR",
      import: "IMPORTAR",
      refresh: "ACTUALIZAR",
      reload: "RECARGAR",
      continue: "CONTINUAR",
      finish: "FINALIZAR",
      submit: "ENVIAR",
      send: "ENVIAR",
      receive: "RECIBIR",
      accept: "ACEPTAR",
      decline: "RECHAZAR",
      approve: "APROBAR",
      reject: "RECHAZAR",
      confirm: "CONFIRMAR",
      verify: "VERIFICAR",
      validate: "VALIDAR",
      authenticate: "AUTENTICAR",
      authorize: "AUTORIZAR",
      permission: "PERMISO",
      access: "ACCESO",
      denied: "DENEGADO",
      granted: "CONCEDIDO",
      expired: "EXPIRADO",
      invalid: "INVÁLIDO",
      valid: "VÁLIDO",
      required: "REQUERIDO",
      optional: "OPCIONAL",
      available: "DISPONIBLE",
      unavailable: "NO DISPONIBLE",
      online: "EN LÍNEA",
      offline: "FUERA DE LÍNEA",
      connected: "CONECTADO",
      disconnected: "DESCONECTADO",
      active: "ACTIVO",
      inactive: "INACTIVO",
      enabled: "HABILITADO",
      disabled: "DESHABILITADO",
      public: "PÚBLICO",
      private: "PRIVADO",
      draft: "BORRADOR",
      published: "PUBLICADO",
      archived: "ARCHIVADO",
      deleted: "ELIMINADO",
      restored: "RESTAURADO",
      backup: "RESPALDO",
      restore: "RESTAURAR",
      sync: "SINCRONIZAR",
      processing: "PROCESANDO",
      completed: "COMPLETADO",
      failed: "FALLIDO",
      pending: "PENDIENTE",
      cancelled: "CANCELADO",
      scheduled: "PROGRAMADO",
      delayed: "RETRASADO",
      onTime: "A TIEMPO",
      early: "TEMPRANO",
      late: "TARDE",
      today: "HOY",
      yesterday: "AYER",
      tomorrow: "MAÑANA",
      thisWeek: "ESTA SEMANA",
      lastWeek: "SEMANA PASADA",
      nextWeek: "PRÓXIMA SEMANA",
      thisMonth: "ESTE MES",
      lastMonth: "MES PASADO",
      nextMonth: "PRÓXIMO MES",
      thisYear: "ESTE AÑO",
      lastYear: "AÑO PASADO",
      nextYear: "PRÓXIMO AÑO",
      date: "FECHA",
      time: "HORA",
      datetime: "FECHA Y HORA",
      timezone: "ZONA HORARIA",
      duration: "DURACIÓN",
      startDate: "FECHA DE INICIO",
      endDate: "FECHA DE FIN",
      startTime: "HORA DE INICIO",
      endTime: "HORA DE FIN",
      allDay: "TODO EL DÍA",
      recurring: "RECURRENTE",
      reminder: "RECORDATORIO",
      notification: "NOTIFICACIÓN",
      alert: "ALERTA",
      warning: "ADVERTENCIA",
      info: "INFORMACIÓN",
      success: "ÉXITO",
      danger: "PELIGRO",
      primary: "PRIMARIO",
      secondary: "SECUNDARIO",
      light: "CLARO",
      dark: "OSCURO",
      muted: "SILENCIADO",
      accent: "ACENTO",
      background: "FONDO",
      foreground: "PRIMER PLANO",
      border: "BORDE",
      input: "ENTRADA",
      ring: "ANILLO",
      chart: "GRÁFICO",
      sidebar: "BARRA LATERAL",
      card: "TARJETA",
      popover: "VENTANA EMERGENTE",
      destructive: "DESTRUCTIVO",
      departures: "SALIDAS",
      regularPrice: "PRECIO REGULAR",
      viewDetails: "VER DETALLES",
      // Transport page specific
      tourNotFound: "Tour no encontrado",
      backToHome: "Volver al inicio",
      panoramicRoute: "Ruta Panorámica",
      stopsOnRoute: "Paradas en el trayecto",
      stopOf: "de",
      routeInfoNotAvailable: "Información de ruta no disponible en este momento.",
      schedulesAndAvailability: "Horarios y Días Disponibles",
      departureTime: "Hora de Salida",
      arriveEarly: "Se recomienda llegar 15 minutos antes",
      availableDays: "Días Disponibles",
      regularDepartures: "Salidas regulares durante todo el año",
      includes: "Incluye",
      notIncludes: "No Incluye",
      selectAvailableDate: "Selecciona una fecha disponible",
      numberOfPassengers: "Número de pasajeros",
      passenger: "pasajero",
      passengers: "pasajeros",
      totalToPay: "Total a pagar:",
      perPerson: "por persona",
      reserveNow: "Reservar Ahora",
      consultWhatsApp: "Consultar por WhatsApp",
      callNow: "Llamar Ahora",
      passengerInfo: "Información del Pasajero",
      fullName: "Nombre Completo",
      nationality: "Nacionalidad",
      backButton: "Volver",
      confirmReservation: "Confirmar Reserva",
      reservationSummary: "Resumen de tu reserva:",
      orderCreatedSuccess: "¡Orden creada exitosamente! Te contactaremos pronto.",
      orderCreationError: "Error al crear la orden. Por favor intenta de nuevo.",
      completeRequiredFields: "Por favor completa todos los campos requeridos",
      unlimitedCapacity: "Capacidad ilimitada",
      offer: "OFERTA",
      monday: "Lunes",
      tuesday: "Martes",
      wednesday: "Miércoles",
      thursday: "Jueves",
      friday: "Viernes",
      saturday: "Sábado",
      sunday: "Domingo",
      // Tour Packages Section
      discoverDestinations:
        "Descubre los destinos más elegidos por nuestros viajeros. Tours únicos que combinan aventura, cultura y naturaleza en experiencias inolvidables por todo el Perú.",
      mostPopularDestinations: "Destinos más",
      explorePopular: "EXPLORA LOS FAVORITOS",
      viewAllTours: "Ver todos los tours",
      errorLoadingTours: "Error al cargar los tours. Por favor, intenta de nuevo.",
      noToursAvailable: "No hay tours disponibles en este momento.",
      featured: "DESTACADO",
      //about
      aboutDescription:
        "Peru Travel es una empresa de viajes de lujo galardonada que se especializa en viajes a medida, lunas de miel y vacaciones familiares por Perú, América del Sur y más allá.",
      atolTitle: "ATOL",
      atolSubtitle: "NO 12034",
      zeroTitle: "CERO",
      zeroSubtitle: "CARGOS EXTRA",
      carbonTitle: "100%",
      carbonSubtitle: "COMPENSACIÓN CARBONO",
      //discover-section.tsx
      howItWorks: "Cómo Funciona",
      howItWorksSubtitle: "Tres simples pasos para comenzar tu aventura",
      stepPlanTitle: "Planifica",
      stepPlanDescription: "Completa el formulario de consulta y comparte tu historia de viaje soñada.",
      stepCustomizeTitle: "Personaliza",
      stepCustomizeDescription: "Obtén itinerarios personalizados y comienza a planificar tu aventura perfecta.",
      stepEnjoyTitle: "Disfruta",
      stepEnjoyDescription: "Vive experiencias únicas del 100% de los destinos más increíbles del Perú.",
      dontWaitText1: "No esperes—comienza tu aventura como",
      dontWaitText2: "viajero de próximo nivel hoy. Tu experiencia",
      dontWaitText3: "merece lo mejor, y tú mereces crecer con nosotros.",
      startAdventure: "Comenzar Aventura",
      adventurerImageAlt: "Aventurero contemplando cascada en la selva peruana",
      // Our Services Section
      ourServices: "NUESTROS SERVICIOS",
      ourServicesSubtitle: "Itinerarios a medida, creados por nuestros expertos",
      tailorMadeTab: "A MEDIDA",
      expertGuidesTab: "GUÍAS EXPERTOS",
      pricePromiseTab: "GARANTÍA PRECIO",
      familyOperatedTab: "EMPRESA FAMILIAR",
      carbonOffsetTab: "COMPENSACIÓN CARBONO",
      charityCommitmentTab: "COMPROMISO BENÉFICO",
      tailorMadeTitle: "Viajes a Medida",
      tailorMadeDescription:
        "Cada viaje está diseñado únicamente para ti, adaptándose a tus preferencias personales, intereses y estilo de viaje. Nuestro equipo experto crea itinerarios personalizados que generan experiencias inolvidables.",
      tailorMadeButton: "PLANIFICA TU VIAJE",
      expertGuidesTitle: "Guías Expertos",
      expertGuidesDescription:
        "Nuestros guías locales cuidadosamente seleccionados dan vida a los destinos con su profundo conocimiento, pasión y acceso exclusivo. Experimenta conexiones culturales auténticas y gemas ocultas que solo los locales conocen.",
      expertGuidesButton: "CONOCE NUESTROS GUÍAS",
      pricePromiseTitle: "Garantía de Precio",
      pricePromiseDescription:
        "Garantizamos precios transparentes sin costos ocultos. Si encuentras un viaje comparable a un precio menor, lo igualamos. Tu inversión va directamente a crear experiencias de viaje excepcionales.",
      pricePromiseButton: "VER PRECIOS",
      familyOperatedTitle: "Empresa Familiar",
      familyOperatedDescription:
        "Como empresa familiar, brindamos cuidado personal y atención a cada detalle de tu viaje. Nuestro compromiso con la excelencia abarca generaciones, asegurando un servicio auténtico y cordial.",
      familyOperatedButton: "NUESTRA HISTORIA",
      carbonOffsetTitle: "Compensación de Carbono",
      carbonOffsetDescription:
        "Estamos comprometidos con el turismo responsable. Cada viaje incluye iniciativas de compensación de carbono, apoyando proyectos de reforestación y programas de energía renovable para minimizar el impacto ambiental.",
      carbonOffsetButton: "SOSTENIBILIDAD",
      charityCommitmentTitle: "Compromiso Benéfico",
      charityCommitmentDescription:
        "Nos enorgullece ser el socio oficial de viajes de la Fundación ForRangers, apoyando sus esfuerzos críticos de conservación y protegiendo la vida silvestre en peligro de extinción.",
      charityCommitmentButton: "CONOCE MÁS",
      // Testimonials Section
      fromOurTravellers: "De nuestros viajeros",
      testimonial1:
        "No podría recomendar Peru Travel más altamente - tuvimos las vacaciones más increíbles - cada detalle había sido pensado y siempre estuvieron disponibles para responder cualquier pregunta de inmediato. Servicio muy personal.",
      testimonial2:
        "Quedé impresionado por nuestro safari en Tanzania, nunca esperé que fuera tan bueno - superó totalmente mis expectativas y fue todo sin complicaciones. Nuestro guía también fue absolutamente increíble. ¡No puedo esperar al próximo año!",
      testimonial3:
        "Fantástico servicio al cliente. Equipo súper amigable y ninguna pregunta sin respuesta y ninguna solicitud demasiado pequeña. Realmente aprecié cómo coordinaron a mi familia durante toda la fase de planificación. Gracias Peru Travel.",
      testimonial4:
        "La atención al detalle fue increíble. Desde el momento en que aterrizamos hasta nuestra partida, todo estaba perfectamente organizado. Las experiencias locales que organizaron fueron auténticas e inolvidables.",
      testimonial5:
        "Peru Travel hizo nuestra luna de miel absolutamente perfecta. Los toques románticos que agregaron a lo largo de nuestro viaje lo hicieron tan especial. Nos sentimos verdaderamente cuidados en cada paso del camino.",
      testimonial6:
        "Profesional, conocedor y genuinamente apasionado por los viajes. Escucharon nuestras necesidades y crearon un itinerario que estaba más allá de nuestros sueños más salvajes. ¡Altamente recomendado!",
      testimonialName1: "Camila",
      testimonialName2: "Jeremy",
      testimonialName3: "Jamie",
      testimonialName4: "Sarah",
      testimonialName5: "Michael",
      testimonialName6: "Emma",
      // Contact Section
      enquireNow: "CONSULTAR AHORA",
      startPlanningTitle: "Comienza a planificar tus vacaciones a medida",
      speakToSpecialist: "Habla con uno de nuestros especialistas en viajes",
      enquireNowButton: "CONSULTAR AHORA",
      callUsButton: "LLÁMANOS",
      availableNow: "DISPONIBLE AHORA",
      travelSpecialistAlt: "Especialista en viajes",
      contactImageAlt: "Turista en Cusco contemplando la arquitectura colonial",
      locale: "es-PE",
      // New keys for carousel header and dummy content
      carouselTitle: "Descubre nuestros destinos de transporte.",
      carouselSubtitle: "Viaja cómodamente por los destinos más increíbles del Perú. Experiencias únicas te esperan.",
      tripDetails: "Detalles del viaje",
      priceUSD: "Precio (USD)",
      pricePEN: "Precio (PEN)",
      rating: "Rating",
      originCity: "Ciudad de Origen",
      destinationCity: "Ciudad de Destino",
      hours: "horas",
      arrivalTime: "Hora de Llegada",
      // New keys for tours page
      peruToursTitle: "Tours del Perú",
      peruToursSubtitle: "Descubre los destinos más increíbles del Perú",
      toursAvailable: "tours disponibles",
      searchToursPlaceholder: "Buscar tours...",
      filters: "Filtros",
      searchFilters: "Filtros de Búsqueda",
      allCategories: "Todas las categorías",
      category: "Categoría",
      difficulty: "Dificultad",
      allDifficulties: "Todas las dificultades",
      packageType: "Tipo de Paquete",
      allPackageTypes: "Todos los tipos",
      region: "Región",
      regionPlaceholder: "Ej: Cusco, Lima, Arequipa...",
      location: "Ubicación",
      locationPlaceholder: "Ej: Machu Picchu, Iquitos...",
      clear: "Limpiar",
      apply: "Aplicar",
      activeFilters: "Filtros activos:",
      toursFoundSingular: "tour encontrado",
      toursFoundPlural: "tours encontrados",
      noToursAvailableTitle: "No hay tours disponibles",
      noToursAvailableMessage:
        "No encontramos tours que coincidan con tus filtros. Prueba ajustando los criterios de búsqueda.",
      transport: "Transporte",
      difficultyFacil: "Fácil",
      difficultyModerado: "Moderado",
      difficultyDificil: "Difícil",
      packageTypeBasico: "Básico",
      packageTypePremium: "Premium",
      errorLoadingToursMessage: "No pudimos cargar los tours. Por favor, intenta nuevamente.",
      previous: "Anterior",
      page: "Página",
      next: "Siguiente",
      featuredTour: "DESTACADO",
      highlightedPlaces: "Lugares destacados:",
      allDays: "Todos los días",
      notAvailable: "No disponible",
      route: "Ruta",
      schedule: "Horario",
      // New keys for footer
      inspiration: "INSPIRACIÓN",
      whyUs: "POR QUÉ NOSOTROS",
      journal: "DIARIO",
      bookingConditions: "CONDICIONES DE RESERVA",
      travelInsurance: "SEGURO DE VIAJE",
      preDepartureInfo: "INFORMACIÓN PRE-VIAJE",
      topPages: "PÁGINAS PRINCIPALES",
      safariHoneymoons: "LUNAS DE MIEL DE SAFARI",
      safariBeachHoneymoons: "LUNAS DE MIEL DE SAFARI Y PLAYA",
      familySafaris: "SAFARIS FAMILIARES",
      luxurySafaris: "SAFARIS DE LUJO",
      callUs: "LLÁMANOS",
      emailUs: "ENVÍANOS UN CORREO",
      // New keys for header
      discover: "DESCUBRIR",
      learn: "APRENDER",
      sustainability: "SOSTENIBILIDAD",
      howCanWeHelp: "¡Hola! ¿Cómo podemos ayudarte?",
      // New keys for ItinerariesPage
      peru: "del Perú",
      itinerariesHeroSubtitle: "Rutas cuidadosamente diseñadas para descubrir los tesoros más increíbles del Perú",
      exploreItineraries: "EXPLORAR ITINERARIOS",
      uniqueItineraries: "Itinerarios Únicos",
      yearsOfExperience: "Años de Experiencia",
      happyTravelers: "Viajeros Felices",
      averageRating: "Rating Promedio",
      chooseYourAdventure: "Elige tu Aventura",
      chooseAdventureSubtitle:
        "Desde escapadas de fin de semana hasta expediciones épicas, tenemos el itinerario perfecto para ti",
      shortDuration: "Corta Duración",
      mediumDuration: "Duración Media",
      longDuration: "Larga Duración",
      from: "Desde",
      mainHighlights: "Highlights principales:",
      plusMore: "+{count} más",
      group: "Grupo",
      whyChooseOurItineraries: "¿Por qué elegir nuestros Itinerarios?",
      exclusiveRoutes: "Rutas Exclusivas",
      exclusiveRoutesDescription: "Itinerarios únicos diseñados por expertos locales con acceso a lugares especiales",
      smallGroups: "Grupos Pequeños",
      smallGroupsDescription: "Máximo 16 personas para una experiencia más personalizada e íntima",
      guaranteedQuality: "Calidad Garantizada",
      guaranteedQualityDescription: "Hoteles seleccionados, guías certificados y servicios de primera clase",
      totalFlexibility: "Flexibilidad Total",
      totalFlexibilityDescription: "Adaptamos cualquier itinerario según tus preferencias y necesidades",
      allInclusive: "Todo Incluido",
      allInclusiveDescription: "Sin sorpresas: hoteles, traslados, tours y muchas comidas incluidas",
      uniqueExperiences: "Experiencias Únicas",
      uniqueExperiencesDescription: "Actividades exclusivas que no encontrarás en otros operadores",
      readyForAdventure: "¿Listo para tu próxima aventura peruana?",
      readyForAdventureSubtitle:
        "Nuestros expertos están listos para diseñar el itinerario perfecto según tus sueños y presupuesto",
      consultItinerary: "CONSULTAR ITINERARIO",
      speakToExpert: "HABLAR CON EXPERTO",
      // New keys for AboutUsPage
      aboutHeroSubtitle:
        "Somos una empresa familiar peruana dedicada a crear experiencias auténticas e inolvidables que conectan a los viajeros con la rica cultura, historia y naturaleza del Perú.",
      ourStoryButton: "CONOCE NUESTRA HISTORIA",
      viewOurTeamButton: "VER NUESTRO EQUIPO",
      discoverMore: "Descubre más",
      ourAchievements: "Nuestros Logros",
      achievementsSubtitle:
        "Números que reflejan nuestro compromiso con la excelencia y la satisfacción de nuestros viajeros.",
      creatingUnforgettableExperiences: "Creando experiencias inolvidables",
      fromOver50Countries: "De más de 50 países",
      throughoutPeru: "Por todo el Perú",
      satisfaction: "Satisfacción",
      ourHistory: "Nuestra Historia",
      historySubtitle: "Un viaje de 15 años construyendo experiencias inolvidables y conectando corazones con el Perú.",
      foundation: "Fundación",
      foundationDescription: "Carlos Mendoza funda Inka Travel con la visión de mostrar el verdadero Perú al mundo.",
      firstToursMachuPicchu: "Primeros tours a Machu Picchu",
      firstOfficeCusco: "Primera oficina en Cusco",
      fiveInitialTours: "5 tours iniciales",
      teamOfThree: "Equipo de 3 personas",
      expansion: "Expansión",
      expansionDescription: "Ampliamos nuestros servicios al Amazonas y la costa norte del Perú.",
      thousandTravelersServed: "1,000 viajeros atendidos",
      newAmazonRoutes: "Nuevas rutas amazónicas",
      officeInLima: "Oficina en Lima",
      fifteenSpecializedGuides: "15 guías especializados",
      internationalCertification: "Certificación Internacional",
      iataCertificationDescription: "Agencia de viajes certificada internacionalmente",
      iataCertification: "Certificación IATA",
      officialRecognition: "Reconocimiento oficial",
      fiveThousandSatisfiedClients: "5,000 clientes satisfechos",
      sustainableTourismDescription: "Implementamos programas de turismo responsable y sostenibilidad ambiental.",
      sustainableCertification: "Certificación Sostenible",
      ecoFriendlyPrograms: "Programas eco-friendly",
      communityPartnerships: "Alianzas comunitarias",
      greenCertification: "Certificación verde",
      digitalInnovation: "Innovación Digital",
      digitalInnovationDescription: "Adaptación a nuevas tecnologías y protocolos de seguridad post-pandemia.",
      digitalPlatform: "Plataforma digital",
      virtualTours: "Tours virtuales",
      covidProtocols: "Protocolos COVID-19",
      industryLeaders: "Líderes del Sector",
      industryLeadersDescription: "Reconocidos como una de las mejores agencias de turismo del Perú.",
      tenThousandPlusHappyTravelers: "10,000+ viajeros felices",
      marketLeader: "Líder del mercado",
      fiftyPlusDestinations: "50+ destinos",
      ninetyEightPercentSatisfaction: "98% satisfacción",
      whyChooseUsSubtitle: "Descubre las razones que nos convierten en la mejor opción para tu aventura peruana.",
      localExperience: "Experiencia Local",
      localExperienceDescription:
        "15 años de experiencia profunda en el turismo peruano con guías nativos especializados.",
      responsibleTourism: "Turismo Responsable",
      responsibleTourismDescription: "Comprometidos con la sostenibilidad y el beneficio de las comunidades locales.",
      personalizedAttention: "Atención Personalizada",
      personalizedAttentionDescription:
        "Cada viaje es único y diseñado específicamente para tus intereses y necesidades.",
      guaranteedSafety: "Seguridad Garantizada",
      guaranteedSafetyDescription:
        "Protocolos rigurosos y equipos especializados para garantizar la seguridad de nuestros viajeros.",
      support247: "Soporte 24/7",
      support247Description: "Asistencia completa antes, durante y después de tu viaje por el Perú.",
      bestPriceGuaranteed: "Mejor Precio Garantizado",
      bestPriceGuaranteedDescription: "Precios competitivos sin comprometer la calidad de nuestros servicios premium.",
      ourValues: "Nuestros Valores",
      ourValuesSubtitle:
        "Los principios que guían cada decisión y acción en Inka Travel, asegurando experiencias excepcionales y responsables.",
      authenticity: "Autenticidad",
      authenticityDescription:
        "Experiencias genuinas que conectan con la cultura local y las tradiciones ancestrales del Perú.",
      sustainabilityValueDescription:
        "Turismo responsable que protege el medio ambiente y beneficia a las comunidades locales.",
      excellence: "Excelencia",
      excellenceDescription: "Estándares de calidad superiores en cada detalle de nuestros servicios y experiencias.",
      safety: "Seguridad",
      safetyDescription:
        "Protocolos rigurosos y equipos especializados para garantizar la seguridad de nuestros viajeros.",
      innovation: "Innovación",
      innovationDescription:
        "Constantemente mejoramos nuestros servicios incorporando nuevas tecnologías y metodologías.",
      passion: "Pasión",
      passionDescription: "Amor genuino por el Perú y dedicación absoluta para compartir sus maravillas con el mundo.",
      teamSubtitle: "Conoce a los expertos apasionados que hacen posible cada experiencia única en el Perú.",
      founderCEO: "Fundador & CEO",
      operationsDirector: "Directora de Operaciones",
      headOfGuides: "Jefe de Guías",
      sustainabilityCoordinator: "Coordinadora de Sostenibilidad",
      carlosDescription:
        "Apasionado por mostrar la belleza del Perú al mundo, Carlos fundó Inka Travel con la visión de crear experiencias auténticas e inolvidables.",
      mariaDescription:
        "Experta en cultura andina y tradiciones ancestrales, María asegura que cada viaje sea una inmersión cultural auténtica.",
      robertoDescription:
        "Montañista experimentado y conocedor profundo de los Andes, Roberto lidera nuestro equipo de guías especializados.",
      anaDescription:
        "Bióloga y conservacionista, Ana desarrolla nuestros programas de turismo sostenible y responsabilidad social.",
      spanish: "Español",
      english: "Inglés",
      quechua: "Quechua",
      aymara: "Aymara",
      french: "Francés",
      portuguese: "Portugués",
      officialGuide: "Guía Oficial",
      firstAid: "Primeros Auxilios",
      sustainableTourism: "Turismo Sostenible",
      anthropologist: "Antropóloga",
      specializedGuide: "Guía Especializada",
      culturalHeritage: "Patrimonio Cultural",
      mountainGuide: "Guía de Montaña",
      highAltitudeRescue: "Rescate en Altura",
      wildernessFirstAid: "Wilderness First Aid",
      biologist: "Bióloga",
      conservation: "Conservación",
      certificationsAndRecognitions: "Certificaciones y Reconocimientos",
      certificationsSubtitle:
        "Nuestro compromiso con la excelencia está respaldado por certificaciones internacionales y reconocimientos de la industria.",
      iataDescription: "Agencia de viajes certificada internacionalmente",
      sustainableTourismCertDescription: "Certificado por el Ministerio de Turismo del Perú",
      tripAdvisorExcellence: "Excelencia TripAdvisor",
      tripAdvisorExcellenceDescription: "Certificado de Excelencia por 5 años consecutivos",
      iso9001: "ISO 9001",
      iso9001Description: "Sistema de gestión de calidad certificado",
      whatOurTravelersSay: "Lo Que Dicen Nuestros Viajeros",
      travelerExperiencesSubtitle:
        "Las experiencias de nuestros viajeros son nuestro mayor orgullo y motivación para seguir mejorando.",
      unitedStates: "Estados Unidos",
      germany: "Alemania",
      japan: "Japón",
      testimonialText1:
        "Inka Travel hizo que nuestro viaje a Perú fuera absolutamente mágico. Cada detalle estaba perfectamente planificado y nuestro guía Carlos fue increíble. ¡Definitivamente regresaremos!",
      testimonialText2:
        "La experiencia más auténtica que he tenido viajando. El equipo de Inka Travel realmente conoce el Perú y te hace sentir la cultura de una manera única.",
      testimonialText3:
        "Profesionalismo excepcional y atención a cada detalle. Inka Travel superó todas nuestras expectativas. El Amazonas fue una experiencia transformadora.",
      machuPicchuSacredValley: "Machu Picchu & Valle Sagrado",
      classicIncaTrail: "Camino Inca Clásico",
      amazonAdventure: "Aventura Amazónica",
      readyForPeruvianAdventure: "¿Listo para vivir tu aventura peruana?",
      callToActionSubtitle:
        "Únete a los miles de viajeros que han confiado en nosotros para descubrir las maravillas del Perú. Tu aventura inolvidable te está esperando.",
      contactUs: "CONTÁCTANOS",
      uniqueDestinations: "Destinos Únicos",
      whyChooseUs: "Por Qué Elegirnos",
      ourTeam: "Nuestro Equipo",
      planYourTrip: "PLANIFICA TU VIAJE",
      // When To Go Page specific translations
      whenToGoTitle: "Cuándo Viajar",
      whenToGoSubtitle:
        "Descubre el momento perfecto para cada destino y vive la experiencia de tu vida en el país de los incas",
      planYourTripButton: "PLANIFICA TU VIAJE",
      daysOfAdventure: "Días de aventura",
      climaticRegions: "Regiones climáticas",
      uniqueMonths: "Meses únicos",
      incredibleDestinations: "Destinos increíbles",
      exploreByCategory: "Explora por categoría",
      chooseHowToPlan: "Elige cómo quieres planificar tu viaje perfecto",
      bySeasons: "Por Estaciones",
      monthByMonth: "Mes a Mes",
      byDestinations: "Por Destinos",
      drySeason: "Temporada Seca",
      drySeasonMonths: "Mayo - Septiembre",
      drySeasonDescription: "La mejor época para visitar la mayoría del Perú",
      rainySeason: "Temporada de Lluvias",
      rainySeasonMonths: "Octubre - Abril",
      rainySeasonDescription: "Paisajes verdes y menos turistas",
      climate: "Clima",
      temperature: "Temperatura",
      recommendedActivities: "Actividades recomendadas",
      whatToWear: "Qué llevar",
      coastRegion: "Costa",
      sierraRegion: "Sierra",
      jungleRegion: "Selva",
      sunnyAndDry: "Soleado y seco",
      dryAndCool: "Seco y fresco",
      lessRain: "Menos lluvias",
      cloudyAndHumid: "Nublado y húmedo",
      rainyWeather: "Lluvioso",
      veryRainy: "Muy lluvioso",
      coastDryTemp: "18°C - 25°C",
      sierraDryTemp: "5°C - 20°C",
      jungleDryTemp: "22°C - 32°C",
      coastDryDescription: "Cielos despejados, ideal para actividades al aire libre",
      sierraDryDescription: "Días soleados, noches frías, perfectos para trekking",
      jungleDryDescription: "Menor precipitación, mejor para navegación",
      beaches: "Playas",
      waterSports: "Deportes acuáticos",
      coastalHiking: "Senderismo costero",
      machuPicchuActivity: "Machu Picchu",
      incaTrailActivity: "Camino Inca",
      cityToursActivity: "City tours",
      amazonSafari: "Safari amazónico",
      wildlifeObservation: "Observación de fauna",
      navigation: "Navegación",
      lightClothing: "Ropa ligera",
      sunscreen: "Protector solar",
      hat: "Sombrero",
      layersOfClothing: "Capas de ropa",
      warmJacket: "Chaqueta abrigada",
      trekkingShoes: "Zapatos de trekking",
      repellent: "Repelente",
      waterproofBoots: "Botas impermeables",
      romanticAtmosphere: "Garúa limeña, ambiente romántico",
      museums: "Museos",
      gastronomy: "Gastronomía",
      nightlife: "Vida nocturna",
      warmClothing: "Ropa abrigada",
      lightJacket: "Chaqueta ligera",
      umbrella: "Paraguas",
      greenLandscapes: "Paisajes verdes",
      difficultTrails: "Senderos difíciles",
      colonialCities: "Ciudades coloniales",
      markets: "Mercados",
      waterproofClothing: "Ropa impermeable",
      highBoots: "Botas altas",
      poncho: "Poncho",
      highRivers: "Ríos altos",
      lushVegetation: "Exuberante vegetación",
      lodges: "Lodges",
      birdWatching: "Observación de aves",
      fishing: "Pesca",
      climateMonthByMonth: "Clima Mes a Mes",
      detailedClimateInfo:
        "Información detallada del clima en cada región del Perú durante todo el año para planificar tu viaje perfecto.",
      popularity: "Popularidad",
      tourismLevel: "Nivel Turístico",
      advantages: "Ventajas",
      consider: "Considerar",
      january: "Enero",
      february: "Febrero",
      march: "Marzo",
      april: "Abril",
      may: "Mayo",
      june: "Junio",
      july: "Julio",
      august: "Agosto",
      september: "Septiembre",
      october: "Octubre",
      november: "Noviembre",
      december: "Diciembre",
      transitionSeason: "Transición",
      lowRain: "Baja",
      highRain: "Alta",
      veryHighRain: "Muy alta",
      lessTourists: "Menos turistas",
      lowPrices: "Precios bajos",
      incaTrailClosed: "Camino Inca cerrado",
      possibleFloods: "Inundaciones posibles",
      endOfRains: "Fin de lluvias",
      muddyTrails: "Senderos embarrados",
      goodWeather: "Buen clima",
      unpredictableWeather: "Clima impredecible",
      startDrySeason: "Inicio temporada seca",
      excellentClimate: "Excelente clima",
      incaTrailOpen: "Camino Inca abierto",
      moreTourists: "Más turistas",
      bestClimate: "Mejor clima",
      intiRaymi: "Inti Raymi",
      clearSkies: "Cielos despejados",
      crowds: "Multitudes",
      highPrices: "Precios altos",
      peakSeason: "Temporada alta",
      perfectClimate: "Clima perfecto",
      reservationsNeeded: "Reservas necesarias",
      strongWindsSierra: "Vientos fuertes en sierra",
      mountainWinds: "Vientos en montaña",
      endDrySeason: "Fin temporada seca",
      occasionalWinds: "Vientos ocasionales",
      startRains: "Inicio lluvias",
      changingLandscapes: "Paisajes cambiantes",
      christmasHolidays: "Fiestas navideñas",
      frequentRains: "Lluvias frecuentes",
      bestTimeToVisitByDestination: "Mejor Época por Destino",
      eachDestinationIdealTime:
        "Cada destino del Perú tiene su época ideal. Descubre cuándo visitar cada lugar para vivir la mejor experiencia.",
      bestMonthsToVisit: "Mejores meses para visitar",
      monthsToAvoid: "Meses a evitar",
      expertTips: "Consejos de expertos",
      machuPicchuDestination: "Machu Picchu",
      amazonDestination: "Amazonas",
      colcaCanyonDestination: "Cañón del Colca",
      nazcaLinesDestination: "Líneas de Nazca",
      lakeTiticacaDestination: "Lago Titicaca",
      northCoastDestination: "Costa Norte",
      machuPicchuDescription: "La ciudadela inca es mejor visitada durante la temporada seca",
      amazonDescription: "Mejor navegación y observación de fauna en temporada seca",
      colcaCanyonDescription: "Ideal para observar cóndores y hacer trekking",
      nazcaLinesDescription: "El desierto ofrece condiciones estables todo el año",
      lakeTiticacaDescription: "Cielos despejados para disfrutar las islas flotantes",
      northCoastDescription: "Playas cálidas durante el verano costeño",
      book3_4MonthsAhead: "Reservar con 3-4 meses de anticipación",
      incaTrailClosesFeb: "El Camino Inca cierra en febrero",
      wearWarmClothesMornings: "Llevar ropa abrigada para las mañanas",
      lowerRiversEasierNavigation: "Ríos más bajos facilitan la navegación",
      higherAnimalConcentration: "Mayor concentración de animales",
      lessMosquitoesDrySeason: "Menos mosquitos en temporada seca",
      condorsMoreActiveMorning: "Cóndores más activos en la mañana",
      avoidRainySeasonTrekking: "Evitar época de lluvias para trekking",
      flightsCanceledStrongWinds: "Vuelos pueden cancelarse por vientos fuertes",
      betterVisibilityMornings: "Mejor visibilidad en mañanas",
      wearSunscreen: "Llevar protector solar",
      veryColdNightsDrySeason: "Noches muy frías en temporada seca",
      sunProtectionAltitude: "Protección solar por la altitud",
      beachSeasonSummer: "Temporada de playa en verano",
      avoidCoastalWinter: "Evitar invierno costeño",
      idealWaterSports: "Ideal para deportes acuáticos",
      allYear: "Todo el año",
      visitors: "Visitantes",
      whyPlanWithUs: "¿Por qué planificar con nosotros?",
      ourExperienceGuarantees:
        "Nuestra experiencia y conocimiento local te garantizan el viaje perfecto en cualquier época del año",
      localExperts: "Expertos Locales",
      localExpertsDescription: "Guías certificados con más de 10 años de experiencia en cada región del Perú",
      perfectPlanning: "Planificación Perfecta",
      perfectPlanningDescription: "Te ayudamos a elegir las mejores fechas según tus intereses y preferencias",
      guaranteedClimate: "Clima Garantizado",
      guaranteedClimateDescription: "Monitoreamos las condiciones climáticas para asegurar tu mejor experiencia",
      optimizedRoutes: "Rutas Optimizadas",
      optimizedRoutesDescription: "Itinerarios diseñados para aprovechar al máximo cada destino en su mejor época",
      uniqueMoments: "Momentos Únicos",
      uniqueMomentsDescription: "Captura los mejores momentos con condiciones climáticas y de luz ideales",
      yourPerfectAdventure: "Tu aventura perfecta",
      isWaitingForYou: "te está esperando",
      nowThatYouKnow:
        "Ahora que conoces cuándo viajar, es momento de convertir tus sueños en realidad. Nuestros expertos están listos para diseñar tu experiencia única.",
      bookNow: "RESERVAR AHORA",
      freeConsultation: "CONSULTA GRATUITA",
      // New keys for TourDetailPage tabs
      itinerary: "Itinerario",
      bring: "Qué Llevar",
      conditions: "Condiciones",
      processingPayment: "Procesando pago...",
      errorProcessingPayment: "Error al procesar el pago. Por favor, inténtalo de nuevo.",
    completeYourPayment: "Completa tu pago",
    loadingPaymentForm: "Cargando formulario de pago...",
    },
    en: {
      destinations: "DESTINATIONS",
      tours: "TOURS",
      itineraries: "ITINERARIES",
      whenToGo: "WHEN TO GO",
      aboutUs: "ABOUT US",
      login: "LOGIN",
      reserve: "RESERVE",
      search: "SEARCH",
      close: "CLOSE",
      menu: "MENU",
      language: "LANGUAGE",
      loading: "LOADING",
      error: "ERROR",
      retry: "RETRY",
      reviews: "reviews",
      departures: "DEPARTURES",
      regularPrice: "REGULAR PRICE",
      viewDetails: "VIEW DETAILS",
      noResults: "NO RESULTS",
      showMore: "SHOW MORE",
      showLess: "SHOW LESS",
      readMore: "READ MORE",
      readLess: "READ LESS",
      contact: "CONTACT",
      email: "EMAIL",
      phone: "PHONE",
      address: "ADDRESS",
      followUs: "FOLLOW US",
      newsletter: "NEWSLETTER",
      subscribe: "SUBSCRIBE",
      privacyPolicy: "PRIVACY POLICY",
      termsOfService: "TERMS OF SERVICE",
      cookiePolicy: "COOKIE POLICY",
      allRightsReserved: "ALL RIGHTS RESERVED",
      home: "HOME",
      about: "ABOUT",
      services: "SERVICES",
      gallery: "GALLERY",
      testimonials: "TESTIMONIALS",
      faq: "FAQ",
      blog: "BLOG",
      news: "NEWS",
      events: "EVENTS",
      promotions: "PROMOTIONS",
      packages: "PACKAGES",
      booking: "BOOKING",
      confirmation: "CONFIRMATION",
      payment: "PAYMENT",
      checkout: "CHECKOUT",
      cart: "CART",
      wishlist: "WISHLIST",
      profile: "PROFILE",
      settings: "SETTINGS",
      logout: "LOGOUT",
      register: "REGISTER",
      forgotPassword: "FORGOT PASSWORD",
      resetPassword: "RESET PASSWORD",
      changePassword: "CHANGE PASSWORD",
      updateProfile: "UPDATE PROFILE",
      deleteAccount: "DELETE ACCOUNT",
      save: "SAVE",
      cancel: "CANCEL",
      edit: "EDIT",
      delete: "DELETE",
      add: "ADD",
      remove: "REMOVE",
      update: "UPDATE",
      create: "CREATE",
      view: "VIEW",
      download: "DOWNLOAD",
      upload: "UPLOAD",
      share: "SHARE",
      copy: "COPY",
      print: "PRINT",
      export: "EXPORT",
      import: "IMPORT",
      refresh: "RELOAD",
      reload: "RELOAD",
      continue: "CONTINUE",
      finish: "FINISH",
      submit: "SUBMIT",
      send: "SEND",
      receive: "RECEIVE",
      accept: "ACCEPT",
      decline: "DECLINE",
      approve: "APPROVE",
      reject: "REJECT",
      confirm: "CONFIRM",
      verify: "VERIFY",
      validate: "VALIDATE",
      authenticate: "AUTHENTICATE",
      authorize: "AUTHORIZE",
      permission: "PERMISSION",
      access: "ACCESS",
      denied: "DENIED",
      granted: "GRANTED",
      expired: "EXPIRED",
      invalid: "INVALID",
      valid: "VALID",
      required: "REQUIRED",
      optional: "OPTIONAL",
      available: "AVAILABLE",
      unavailable: "UNAVAILABLE",
      online: "ONLINE",
      offline: "OFFLINE",
      connected: "CONNECTED",
      disconnected: "DISCONNECTED",
      active: "ACTIVE",
      inactive: "INACTIVE",
      enabled: "ENABLED",
      disabled: "DISABLED",
      public: "PUBLIC",
      private: "PRIVATE",
      draft: "DRAFT",
      published: "PUBLISHED",
      archived: "ARCHIVED",
      deleted: "DELETED",
      restored: "RESTORATION",
      backup: "BACKUP",
      restore: "RESTORE",
      sync: "SYNC",
      processing: "PROCESSING",
      completed: "COMPLETED",
      failed: "FAILED",
      pending: "PENDING",
      cancelled: "CANCELLED",
      scheduled: "SCHEDULED",
      delayed: "DELAYED",
      onTime: "ON TIME",
      early: "EARLY",
      late: "LATE",
      today: "TODAY",
      yesterday: "YESTERDAY",
      tomorrow: "TOMORROW",
      thisWeek: "THIS WEEK",
      lastWeek: "LAST WEEK",
      nextWeek: "NEXT WEEK",
      thisMonth: "THIS MONTH",
      lastMonth: "LAST MONTH",
      nextMonth: "NEXT MONTH",
      thisYear: "THIS YEAR",
      lastYear: "LAST YEAR",
      nextYear: "NEXT YEAR",
      date: "DATE",
      time: "TIME",
      datetime: "DATETIME",
      timezone: "TIMEZONE",
      duration: "DURATION",
      startDate: "START DATE",
      endDate: "END DATE",
      startTime: "START TIME",
      endTime: "END TIME",
      allDay: "ALL DAY",
      recurring: "RECURRING",
      reminder: "REMINDER",
      notification: "NOTIFICATION",
      alert: "ALERT",
      warning: "WARNING",
      info: "INFO",
      success: "SUCCESS",
      danger: "DANGER",
      primary: "PRIMARY",
      secondary: "SECONDARY",
      light: "LIGHT",
      dark: "DARK",
      muted: "MUTED",
      accent: "ACCENT",
      background: "BACKGROUND",
      foreground: "FOREGROUND",
      border: "BORDER",
      input: "INPUT",
      ring: "RING",
      chart: "CHART",
      sidebar: "SIDEBAR",
      card: "CARD",
      popover: "POPOVER",
      destructive: "DESTRUCTIVE",
      // Transport page specific
      tourNotFound: "Tour not found",
      backToHome: "Back to home",
      panoramicRoute: "Panoramic Route",
      stopsOnRoute: "Stops on the route",
      stopOf: "of",
      routeInfoNotAvailable: "Route information not available at this time.",
      schedulesAndAvailability: "Schedules & Availability",
      departureTime: "Departure Time",
      arriveEarly: "We recommend arriving 15 minutes early",
      availableDays: "Available Days",
      regularDepartures: "Regular departures throughout the year",
      includes: "Includes",
      notIncludes: "Not Included",
      selectAvailableDate: "Select an available date",
      numberOfPassengers: "Number of passengers",
      passenger: "passenger",
      passengers: "passengers",
      totalToPay: "Total to pay:",
      perPerson: "per person",
      reserveNow: "Reserve Now",
      consultWhatsApp: "Consult via WhatsApp",
      callNow: "Call Now",
      passengerInfo: "Passenger Information",
      fullName: "Full Name",
      nationality: "Nationality",
      backButton: "Back",
      confirmReservation: "Confirm Reservation",
      reservationSummary: "Your reservation summary:",
      orderCreatedSuccess: "Order created successfully! We will contact you soon.",
      orderCreationError: "Error creating order. Please try again.",
      completeRequiredFields: "Please complete all required fields",
      unlimitedCapacity: "Unlimited capacity",
      offer: "OFFER",
      monday: "Monday",
      tuesday: "Tuesday",
      wednesday: "Wednesday",
      thursday: "Thursday",
      friday: "Friday",
      saturday: "Saturday",
      sunday: "Sunday",
      // Tour Packages Section
      discoverDestinations:
        "Discover the most popular destinations chosen by our travelers. Unique tours that blend adventure, culture, and nature into unforgettable experiences throughout Peru.",
      mostPopularDestinations: "Most popular destinations",
      explorePopular: "EXPLORE THE FAVORITES",
      viewAllTours: "View all tours",
      errorLoadingTours: "Error loading tours. Please try again.",
      noToursAvailable: "No tours available at the moment.",
      featured: "FEATURED",
      //about
      aboutDescription:
        "Peru Travel is an award-winning luxury travel company specializing in tailor-made trips, honeymoons, and family holidays throughout Peru, South America, and beyond.",
      atolTitle: "ATOL",
      atolSubtitle: "NO 12034",
      zeroTitle: "ZERO",
      zeroSubtitle: "EXTRA CHARGES",
      carbonTitle: "100%",
      carbonSubtitle: "CARBON OFFSET",
      //Discovery section
      howItWorks: "How It Works",
      howItWorksSubtitle: "Three simple steps to start your adventure",
      stepPlanTitle: "Plan",
      stepPlanDescription: "Fill out the inquiry form and share your dream travel story.",
      stepCustomizeTitle: "Customize",
      stepCustomizeDescription: "Get personalized itineraries and start planning your perfect adventure.",
      stepEnjoyTitle: "Enjoy",
      stepEnjoyDescription: "Live unique experiences in 100% of Peru’s most incredible destinations.",
      dontWaitText1: "Don’t wait—start your adventure as a",
      dontWaitText2: "next-level traveler today. Your experience",
      dontWaitText3: "deserves the best, and you deserve to grow with us.",
      startAdventure: "Start Adventure",
      adventurerImageAlt: "Adventurer contemplating a waterfall in the Peruvian jungle",
      // Our Services Section
      ourServices: "OUR SERVICES",
      ourServicesSubtitle: "Tailor-made itineraries created by our experts",
      tailorMadeTab: "TAILOR-MADE",
      expertGuidesTab: "EXPERT GUIDES",
      pricePromiseTab: "PRICE PROMISE",
      familyOperatedTab: "FAMILY OPERATED",
      carbonOffsetTab: "CARBON OFFSET",
      charityCommitmentTab: "CHARITY COMMITMENT",
      tailorMadeTitle: "Tailor-Made Trips",
      tailorMadeDescription:
        "Each trip is uniquely designed for you, tailored to your personal preferences, interests, and travel style. Our expert team creates personalized itineraries that deliver unforgettable experiences.",
      tailorMadeButton: "PLAN YOUR TRIP",
      expertGuidesTitle: "Expert Guides",
      expertGuidesDescription:
        "Our carefully selected local guides bring destinations to life with deep knowledge, passion, and exclusive access. Experience authentic cultural connections and hidden gems only locals know.",
      expertGuidesButton: "MEET OUR GUIDES",
      pricePromiseTitle: "Price Promise",
      pricePromiseDescription:
        "We guarantee transparent pricing with no hidden fees. If you find a comparable trip at a lower price, we’ll match it. Your investment goes directly into creating exceptional travel experiences.",
      pricePromiseButton: "VIEW PRICING",
      familyOperatedTitle: "Family Operated",
      familyOperatedDescription:
        "As a family-run company, we provide personal care and attention to every detail of your trip. Our commitment to excellence spans generations, ensuring genuine and warm service.",
      familyOperatedButton: "OUR STORY",
      carbonOffsetTitle: "Carbon Offset",
      carbonOffsetDescription:
        "We are committed to responsible tourism. Each trip includes carbon offset initiatives, supporting reforestation projects and renewable energy programs to minimize environmental impact.",
      carbonOffsetButton: "SUSTAINABILITY",
      charityCommitmentTitle: "Charity Commitment",
      charityCommitmentDescription:
        "We are proud to be the official travel partner of the ForRangers Foundation, supporting critical conservation efforts and protecting endangered wildlife.",
      charityCommitmentButton: "LEARN MORE",
      // Testimonials Section
      fromOurTravellers: "From our travellers",
      testimonial1:
        "I couldn't recommend Peru Travel more highly - we had the most incredible holiday - every detail had been thought of and they were always available to answer any question immediately. Very personal service.",
      testimonial2:
        "I was blown away by our Tanzania safari, never expected it to be so good - totally exceeded my expectations and it was all hassle-free. Our guide was also absolutely incredible. Can't wait for next year!",
      testimonial3:
        "Fantastic customer service. Super friendly team and no question unanswered and no request too small. Really appreciated how they coordinated my family throughout the entire planning phase. Thank you Peru Travel.",
      testimonial4:
        "The attention to detail was incredible. From the moment we landed to our departure, everything was perfectly organized. The local experiences they arranged were authentic and unforgettable.",
      testimonial5:
        "Peru Travel made our honeymoon absolutely perfect. The romantic touches they added throughout our trip made it so special. We felt truly cared for every step of the way.",
      testimonial6:
        "Professional, knowledgeable and genuinely passionate about travel. They listened to our needs and created an itinerary that was beyond our wildest dreams. Highly recommended!",
      testimonialName1: "Camila",
      testimonialName2: "Jeremy",
      testimonialName3: "Jamie",
      testimonialName4: "Sarah",
      testimonialName5: "Michael",
      testimonialName6: "Emma",
      // Contact Section
      enquireNow: "ENQUIRE NOW",
      startPlanningTitle: "Start planning your tailor-made holiday",
      speakToSpecialist: "Speak to one of our travel specialists",
      enquireNowButton: "ENQUIRE NOW",
      callUsButton: "CALL US",
      availableNow: "AVAILABLE NOW",
      travelSpecialistAlt: "Travel specialist",
      contactImageAlt: "Tourist in Cusco contemplating colonial architecture",
      locale: "en-US",
      // New keys for carousel header and dummy content
      carouselTitle: "Discover our transport destinations.",
      carouselSubtitle:
        "Travel comfortably through the most incredible destinations in Peru. Unique experiences await you.",
      tripDetails: "Trip Details",
      priceUSD: "Price (USD)",
      pricePEN: "Price (PEN)",
      rating: "Rating",
      originCity: "Origin City",
      destinationCity: "Destination City",
      hours: "hours",
      arrivalTime: "Arrival Time",
      // New keys for tours page
      peruToursTitle: "Tours of Peru",
      peruToursSubtitle: "Discover the most incredible destinations in Peru",
      toursAvailable: "tours available",
      searchToursPlaceholder: "Search tours...",
      filters: "Filters",
      searchFilters: "Search Filters",
      allCategories: "All categories",
      category: "Category",
      difficulty: "Difficulty",
      allDifficulties: "All difficulties",
      packageType: "Package Type",
      allPackageTypes: "All types",
      region: "Region",
      regionPlaceholder: "Ex: Cusco, Lima, Arequipa...",
      location: "Location",
      locationPlaceholder: "Ex: Machu Picchu, Iquitos...",
      clear: "Clear",
      apply: "Apply",
      activeFilters: "Active filters:",
      toursFoundSingular: "tour found",
      toursFoundPlural: "tours found",
      noToursAvailableTitle: "No tours available",
      noToursAvailableMessage: "We couldn't find any tours matching your filters. Try adjusting your search criteria.",
      transport: "Transport",
      difficultyFacil: "Easy",
      difficultyModerado: "Moderate",
      difficultyDificil: "Difficult",
      packageTypeBasico: "Basic",
      packageTypePremium: "Premium",
      errorLoadingToursMessage: "Error loading tours. Please try again.",
      previous: "Previous",
      page: "Page",
      next: "Next",
      featuredTour: "FEATURED",
      highlightedPlaces: "Highlighted places:",
      allDays: "All Days",
      notAvailable: "Not Available",
      route: "Route",
      schedule: "Schedule",
      // New keys for footer
      inspiration: "INSPIRATION",
      whyUs: "WHY US",
      journal: "JOURNAL",
      bookingConditions: "BOOKING CONDITIONS",
      travelInsurance: "TRAVEL INSURANCE",
      preDepartureInfo: "PRE-DEPARTURE INFO",
      topPages: "TOP PAGES",
      safariHoneymoons: "SAFARI HONEYMOONS",
      safariBeachHoneymoons: "SAFARI & BEACH HONEYMOONS",
      familySafaris: "FAMILY SAFARIS",
      luxurySafaris: "LUXURY SAFARIS",
      callUs: "CALL US",
      emailUs: "EMAIL US",
      // New keys for header
      discover: "DISCOVER",
      learn: "LEARN",
      sustainability: "SUSTAINABILITY",
      howCanWeHelp: "Hello! How can we help you?",
      // New keys for ItinerariesPage
      peru: "of Peru",
      itinerariesHeroSubtitle: "Carefully designed routes to discover the most incredible treasures of Peru",
      exploreItineraries: "EXPLORE ITINERARIES",
      uniqueItineraries: "Unique Itineraries",
      yearsOfExperience: "Years of Experience",
      happyTravelers: "Happy Travelers",
      averageRating: "Average Rating",
      chooseYourAdventure: "Choose Your Adventure",
      chooseAdventureSubtitle: "From weekend getaways to epic expeditions, we have the perfect itinerary for you",
      shortDuration: "Short Duration",
      mediumDuration: "Medium Duration",
      longDuration: "Long Duration",
      from: "From",
      mainHighlights: "Main Highlights:",
      plusMore: "+{count} more",
      group: "Group",
      whyChooseOurItineraries: "Why Choose Our Itineraries?",
      exclusiveRoutes: "Exclusive Routes",
      exclusiveRoutesDescription: "Unique itineraries designed by local experts with access to special places",
      smallGroups: "Small Groups",
      smallGroupsDescription: "Maximum 16 people for a more personalized and intimate experience",
      guaranteedQuality: "Guaranteed Quality",
      guaranteedQualityDescription: "Selected hotels, certified guides, and first-class services",
      totalFlexibility: "Total Flexibility",
      totalFlexibilityDescription: "We adapt any itinerary according to your preferences and needs",
      allInclusive: "All Inclusive",
      allInclusiveDescription: "No surprises: hotels, transfers, tours, and many meals included",
      uniqueExperiences: "Unique Experiences",
      uniqueExperiencesDescription: "Exclusive activities you won't find with other operators",
      readyForAdventure: "Ready for your next Peruvian adventure?",
      readyForAdventureSubtitle:
        "Our experts are ready to design the perfect itinerary according to your dreams and budget",
      consultItinerary: "CONSULT ITINERARY",
      speakToExpert: "SPEAK TO EXPERT",
      // New keys for AboutUsPage
      aboutHeroSubtitle:
        "We are a Peruvian family-owned company dedicated to creating authentic and unforgettable experiences that connect travelers with the rich culture, history, and nature of Peru.",
      ourStoryButton: "LEARN OUR STORY",
      viewOurTeamButton: "VIEW OUR TEAM",
      discoverMore: "Discover more",
      ourAchievements: "Our Achievements",
      achievementsSubtitle: "Numbers that reflect our commitment to excellence and the satisfaction of our travelers.",
      creatingUnforgettableExperiences: "Creating unforgettable experiences",
      fromOver50Countries: "From over 50 countries",
      throughoutPeru: "Throughout Peru",
      satisfaction: "Satisfaction",
      ourHistory: "Our History",
      historySubtitle: "A 15-year journey building unforgettable experiences and connecting hearts with Peru.",
      foundation: "Foundation",
      foundationDescription: "Carlos Mendoza founds Inka Travel with the vision of showing the true Peru to the world.",
      firstToursMachuPicchu: "First tours to Machu Picchu",
      firstOfficeCusco: "First office in Cusco",
      fiveInitialTours: "5 initial tours",
      teamOfThree: "Team of 3 people",
      expansion: "Expansion",
      expansionDescription: "We expanded our services to the Amazon and the northern coast of Peru.",
      thousandTravelersServed: "1,000 travelers served",
      newAmazonRoutes: "New Amazon routes",
      officeInLima: "Office in Lima",
      fifteenSpecializedGuides: "15 specialized guides",
      internationalCertification: "International Certification",
      iataCertificationDescription: "Internationally certified travel agency",
      iataCertification: "IATA Certification",
      officialRecognition: "Official recognition",
      fiveThousandSatisfiedClients: "5,000 satisfied clients",
      sustainableTourismDescription: "We implement responsible tourism and environmental sustainability programs.",
      sustainableCertification: "Sustainable Certification",
      ecoFriendlyPrograms: "Eco-friendly programs",
      communityPartnerships: "Community partnerships",
      greenCertification: "Green certification",
      digitalInnovation: "Digital Innovation",
      digitalInnovationDescription: "Adaptation to new technologies and post-pandemic security protocols.",
      digitalPlatform: "Digital platform",
      virtualTours: "Virtual tours",
      covidProtocols: "COVID-19 protocols",
      industryLeaders: "Industry Leaders",
      industryLeadersDescription: "Recognized as one of the best tourism agencies in Peru.",
      tenThousandPlusHappyTravelers: "10,000+ happy travelers",
      marketLeader: "Market leader",
      fiftyPlusDestinations: "50+ destinations",
      ninetyEightPercentSatisfaction: "98% satisfaction",
      whyChooseUsSubtitle: "Discover the reasons that make us the best choice for your Peruvian adventure.",
      localExperience: "Local Experience",
      localExperienceDescription: "15 years of deep experience in Peruvian tourism with specialized native guides.",
      responsibleTourism: "Responsible Tourism",
      responsibleTourismDescription: "Committed to sustainability and the benefit of local communities.",
      personalizedAttention: "Personalized Attention",
      personalizedAttentionDescription: "Each trip is unique and designed specifically for your interests and needs.",
      guaranteedSafety: "Guaranteed Safety",
      guaranteedSafetyDescription: "Rigorous safety protocols and specialized equipment on every expedition.",
      support247: "24/7 Support",
      support247Description: "Full assistance before, during, and after your trip through Peru.",
      bestPriceGuaranteed: "Best Price Guaranteed",
      bestPriceGuaranteedDescription: "Competitive prices without compromising the quality of our premium services.",
      ourValues: "Our Values",
      ourValuesSubtitle:
        "The principles that guide every decision and action at Inka Travel, ensuring exceptional and responsible experiences.",
      authenticity: "Authenticity",
      authenticityDescription: "Genuine experiences that connect with local culture and ancestral traditions of Peru.",
      sustainabilityValueDescription:
        "Responsible tourism that protects the environment and benefits local communities.",
      excellence: "Excellence",
      excellenceDescription: "Superior quality standards in every detail of our services and experiences.",
      safety: "Safety",
      safetyDescription: "Rigorous protocols and specialized equipment to ensure the safety of our travelers.",
      innovation: "Innovation",
      innovationDescription: "We constantly improve our services by incorporating new technologies and methodologies.",
      passion: "Passion",
      passionDescription: "Genuine love for Peru and absolute dedication to sharing its wonders with the world.",
      teamSubtitle: "Meet the passionate experts who make every unique experience in Peru possible.",
      founderCEO: "Founder & CEO",
      operationsDirector: "Operations Director",
      headOfGuides: "Head of Guides",
      sustainabilityCoordinator: "Sustainability Coordinator",
      carlosDescription:
        "Passionate about showing the beauty of Peru to the world, Carlos founded Inka Travel with the vision of creating authentic and unforgettable experiences.",
      mariaDescription:
        "An expert in Andean culture and ancestral traditions, María ensures that every trip is an authentic cultural immersion.",
      robertoDescription:
        "An experienced mountaineer and deep connoisseur of the Andes, Roberto leads our team of specialized guides.",
      anaDescription:
        "A biologist and conservationist, Ana develops our sustainable tourism and social responsibility programs.",
      spanish: "Spanish",
      english: "English",
      quechua: "Quechua",
      aymara: "Aymara",
      french: "French",
      portuguese: "Portuguese",
      officialGuide: "Official Guide",
      firstAid: "First Aid",
      sustainableTourism: "Sustainable Tourism",
      anthropologist: "Anthropologist",
      specializedGuide: "Specialized Guide",
      culturalHeritage: "Cultural Heritage",
      mountainGuide: "Mountain Guide",
      highAltitudeRescue: "High Altitude Rescue",
      wildernessFirstAid: "Wilderness First Aid",
      biologist: "Biologist",
      conservation: "Conservation",
      certificationsAndRecognitions: "Certifications and Recognitions",
      certificationsSubtitle:
        "Our commitment to excellence is backed by international certifications and industry recognitions.",
      iataDescription: "Internationally certified travel agency",
      sustainableTourismCertDescription: "Certified by the Ministry of Tourism of Peru",
      tripAdvisorExcellence: "TripAdvisor Excellence",
      tripAdvisorExcellenceDescription: "Certificate of Excellence for 5 consecutive years",
      iso9001: "ISO 9001",
      iso9001Description: "Certified quality management system",
      whatOurTravelersSay: "What Our Travelers Say",
      travelerExperiencesSubtitle:
        "The experiences of our travelers are our greatest pride and motivation to keep improving.",
      unitedStates: "United States",
      germany: "Germany",
      japan: "Japan",
      testimonialText1:
        "Inka Travel made our trip to Peru absolutely magical. Every detail was perfectly planned and our guide Carlos was incredible. We will definitely be back!",
      testimonialText2:
        "The most authentic experience I've had traveling. The Inka Travel team truly knows Peru and makes you feel the culture in a unique way.",
      testimonialText3:
        "Exceptional professionalism and attention to every detail. Inka Travel exceeded all our expectations. The Amazon was a transformative experience.",
      machuPicchuSacredValley: "Machu Picchu & Sacred Valley",
      classicIncaTrail: "Classic Inca Trail",
      amazonAdventure: "Amazon Adventure",
      readyForPeruvianAdventure: "Ready for your Peruvian adventure?",
      callToActionSubtitle:
        "Join thousands of travelers who have trusted us to discover the wonders of Peru. Your unforgettable adventure awaits you.",
      contactUs: "CONTACT US",
      uniqueDestinations: "Unique Destinations",
      whyChooseUs: "Why Choose Us",
      ourTeam: "Our Team",
      planYourTrip: "PLAN YOUR TRIP",
      // When To Go Page specific translations
      whenToGoTitle: "When to Travel",
      whenToGoSubtitle:
        "Discover the perfect time for each destination and live the experience of a lifetime in the land of the Incas",
      planYourTripButton: "PLAN YOUR TRIP",
      daysOfAdventure: "Days of adventure",
      climaticRegions: "Climatic regions",
      uniqueMonths: "Unique months",
      incredibleDestinations: "Incredible destinations",
      exploreByCategory: "Explore by category",
      chooseHowToPlan: "Choose how you want to plan your perfect trip",
      bySeasons: "By Seasons",
      monthByMonth: "Month by Month",
      byDestinations: "By Destinations",
      drySeason: "Dry Season",
      drySeasonMonths: "May - September",
      drySeasonDescription: "The best time to visit most of Peru",
      rainySeason: "Rainy Season",
      rainySeasonMonths: "October - April",
      rainySeasonDescription: "Green landscapes and fewer tourists",
      climate: "Climate",
      temperature: "Temperature",
      recommendedActivities: "Recommended activities",
      whatToWear: "What to wear",
      coastRegion: "Coast",
      sierraRegion: "Highlands",
      jungleRegion: "Jungle",
      sunnyAndDry: "Sunny and dry",
      dryAndCool: "Dry and cool",
      lessRain: "Less rain",
      cloudyAndHumid: "Cloudy and humid",
      rainyWeather: "Rainy",
      veryRainy: "Very rainy",
      coastDryTemp: "18°C - 25°C",
      sierraDryTemp: "5°C - 20°C",
      jungleDryTemp: "22°C - 32°C",
      coastDryDescription: "Clear skies, ideal for outdoor activities",
      sierraDryDescription: "Sunny days, cold nights, perfect for trekking",
      jungleDryDescription: "Less precipitation, better for navigation",
      beaches: "Beaches",
      waterSports: "Water sports",
      coastalHiking: "Coastal hiking",
      machuPicchuActivity: "Machu Picchu",
      incaTrailActivity: "Inca Trail",
      cityToursActivity: "City tours",
      amazonSafari: "Amazon safari",
      wildlifeObservation: "Wildlife observation",
      navigation: "Navigation",
      lightClothing: "Light clothing",
      sunscreen: "Sunscreen",
      hat: "Hat",
      layersOfClothing: "Layers of clothing",
      warmJacket: "Warm jacket",
      trekkingShoes: "Trekking shoes",
      repellent: "Repellent",
      waterproofBoots: "Waterproof boots",
      romanticAtmosphere: "Lima drizzle, romantic atmosphere",
      museums: "Museums",
      gastronomy: "Gastronomy",
      nightlife: "Nightlife",
      warmClothing: "Warm clothing",
      lightJacket: "Light jacket",
      umbrella: "Umbrella",
      greenLandscapes: "Green landscapes",
      difficultTrails: "Difficult trails",
      colonialCities: "Colonial cities",
      markets: "Markets",
      waterproofClothing: "Waterproof clothing",
      highBoots: "High boots",
      poncho: "Poncho",
      highRivers: "High rivers",
      lushVegetation: "Lush vegetation",
      lodges: "Lodges",
      birdWatching: "Bird watching",
      fishing: "Fishing",
      climateMonthByMonth: "Climate Month by Month",
      detailedClimateInfo:
        "Detailed climate information for each region of Peru throughout the year to plan your perfect trip.",
      popularity: "Popularity",
      tourismLevel: "Tourism Level",
      advantages: "Advantages",
      consider: "Consider",
      january: "January",
      february: "February",
      march: "March",
      april: "April",
      may: "May",
      june: "June",
      july: "July",
      august: "August",
      september: "September",
      october: "October",
      november: "November",
      december: "December",
      transitionSeason: "Transition",
      lowRain: "Low",
      highRain: "High",
      veryHighRain: "Very High",
      lessTourists: "Fewer tourists",
      lowPrices: "Low prices",
      incaTrailClosed: "Inca Trail closed",
      possibleFloods: "Possible floods",
      endOfRains: "End of rains",
      muddyTrails: "Muddy trails",
      goodWeather: "Good weather",
      unpredictableWeather: "Unpredictable weather",
      startDrySeason: "Start of dry season",
      excellentClimate: "Excellent climate",
      incaTrailOpen: "Inca Trail open",
      moreTourists: "More tourists",
      bestClimate: "Best climate",
      intiRaymi: "Inti Raymi",
      clearSkies: "Clear skies",
      crowds: "Crowds",
      highPrices: "High prices",
      peakSeason: "Peak season",
      perfectClimate: "Perfect climate",
      reservationsNeeded: "Reservations needed",
      strongWindsSierra: "Strong winds in highlands",
      mountainWinds: "Mountain winds",
      endDrySeason: "End of dry season",
      occasionalWinds: "Occasional winds",
      startRains: "Start of rains",
      changingLandscapes: "Changing landscapes",
      christmasHolidays: "Christmas holidays",
      frequentRains: "Frequent rains",
      bestTimeToVisitByDestination: "Best Time to Visit by Destination",
      eachDestinationIdealTime:
        "Each destination in Peru has its ideal time. Discover when to visit each place for the best experience.",
      bestMonthsToVisit: "Best months to visit",
      monthsToAvoid: "Months to avoid",
      expertTips: "Expert tips",
      machuPicchuDestination: "Machu Picchu",
      amazonDestination: "Amazon",
      colcaCanyonDestination: "Colca Canyon",
      nazcaLinesDestination: "Nazca Lines",
      lakeTiticacaDestination: "Lake Titicaca",
      northCoastDestination: "North Coast",
      machuPicchuDescription: "The Inca citadel is best visited during the dry season",
      amazonDescription: "Better navigation and wildlife observation in dry season",
      colcaCanyonDescription: "Ideal for observing condors and trekking",
      nazcaLinesDescription: "The desert offers stable conditions all year round",
      lakeTiticacaDescription: "Clear skies to enjoy the floating islands",
      northCoastDescription: "Warm beaches during the coastal summer",
      book3_4MonthsAhead: "Book 3-4 months in advance",
      incaTrailClosesFeb: "Inca Trail closes in February",
      wearWarmClothesMornings: "Wear warm clothes for mornings",
      lowerRiversEasierNavigation: "Lower rivers facilitate navigation",
      higherAnimalConcentration: "Higher animal concentration",
      lessMosquitoesDrySeason: "Fewer mosquitoes in dry season",
      condorsMoreActiveMorning: "Condors more active in the morning",
      avoidRainySeasonTrekking: "Avoid rainy season for trekking",
      flightsCanceledStrongWinds: "Flights may be canceled due to strong winds",
      betterVisibilityMornings: "Better visibility in mornings",
      wearSunscreen: "Wear sunscreen",
      veryColdNightsDrySeason: "Very cold nights in dry season",
      sunProtectionAltitude: "Sun protection due to altitude",
      beachSeasonSummer: "Beach season in summer",
      avoidCoastalWinter: "Avoid coastal winter",
      idealWaterSports: "Ideal for water sports",
      allYear: "All year",
      visitors: "Visitors",
      whyPlanWithUs: "Why plan with us?",
      ourExperienceGuarantees:
        "Our experience and local knowledge guarantee you the perfect trip at any time of the year",
      localExperts: "Local Experts",
      localExpertsDescription: "Certified guides with over 10 years of experience in each region of Peru",
      perfectPlanning: "Perfect Planning",
      perfectPlanningDescription: "We help you choose the best dates according to your interests and preferences",
      guaranteedClimate: "Guaranteed Climate",
      guaranteedClimateDescription: "We monitor weather conditions to ensure your best experience",
      optimizedRoutes: "Optimized Routes",
      optimizedRoutesDescription: "Itineraries designed to make the most of each destination at its best time",
      uniqueMoments: "Unique Moments",
      uniqueMomentsDescription: "Capture the best moments with ideal weather and light conditions",
      yourPerfectAdventure: "Your perfect adventure",
      isWaitingForYou: "is waiting for you",
      nowThatYouKnow:
        "Now that you know when to travel, it's time to make your dreams come true. Our experts are ready to design your unique experience.",
      bookNow: "BOOK NOW",
      freeConsultation: "FREE CONSULTATION",
      // New keys for TourDetailPage tabs
      itinerary: "Itinerary",
      bring: "What to Bring",
      conditions: "Conditions",
      processingPayment: "Processing payment...",
      errorProcessingPayment: "Error processing payment. Please try again.",
    completeYourPayment: "Complete Your Payment",
    loadingPaymentForm: "Loading payment form...",
    },
    fr: {
      destinations: "DESTINATIONS",
      tours: "TOURS",
      itineraries: "ITINÉRAIRES",
      whenToGo: "QUAND PARTIR",
      aboutUs: "À PROPOS",
      login: "CONNEXION",
      reserve: "RÉSERVER",
      search: "RECHERCHER",
      close: "FERMER",
      menu: "MENU",
      language: "LANGUE",
      loading: "CHARGEMENT",
      error: "ERREUR",
      retry: "RÉESSAYER",
      reviews: "avis",
      noResults: "AUCUN RÉSULTAT",
      showMore: "VOIR PLUS",
      showLess: "VOIR MOINS",
      readMore: "LIRE PLUS",
      readLess: "LIRE MOINS",
      contact: "CONTACT",
      email: "EMAIL",
      phone: "TÉLÉPHONE",
      address: "ADRESSE",
      followUs: "SUIVEZ-NOUS",
      newsletter: "NEWSLETTER",
      subscribe: "S'ABONNER",
      privacyPolicy: "POLITIQUE DE CONFIDENTIALITÉ",
      termsOfService: "CONDITIONS D'UTILISATION",
      cookiePolicy: "POLITIQUE DES COOKIES",
      allRightsReserved: "TOUS DROITS RÉSERVÉS",
      home: "ACCUEIL",
      about: "À PROPOS",
      services: "SERVICES",
      gallery: "GALERIE",
      testimonials: "TÉMOIGNAGES",
      faq: "FAQ",
      blog: "BLOG",
      news: "ACTUALITÉS",
      events: "ÉVÉNEMENTS",
      promotions: "PROMOTIONS",
      packages: "FORFAITS",
      booking: "RÉSERVATION",
      confirmation: "CONFIRMATION",
      payment: "PAIEMENT",
      checkout: "FINALISER",
      cart: "PANIER",
      wishlist: "LISTE DE SOUHAITS",
      profile: "PROFIL",
      settings: "PARAMÈTRES",
      logout: "DÉCONNEXION",
      register: "S'INSCRIRE",
      forgotPassword: "MOT DE PASSE OUBLIÉ",
      resetPassword: "RÉINITIALISER LE MOT DE PASSE",
      changePassword: "CHANGER LE MOT DE PASSE",
      updateProfile: "METTRE À JOUR LE PROFIL",
      deleteAccount: "SUPPRIMER LE COMPTE",
      save: "ENREGISTRER",
      cancel: "ANNULER",
      edit: "MODIFIER",
      delete: "SUPPRIMER",
      add: "AJOUTER",
      remove: "RETIRER",
      update: "METTRE À JOUR",
      create: "CRÉER",
      view: "VOIR",
      download: "TÉLÉCHARGER",
      upload: "TÉLÉVERSER",
      share: "PARTAGER",
      copy: "COPIER",
      print: "IMPRIMER",
      export: "EXPORTER",
      import: "IMPORTER",
      refresh: "ACTUALISER",
      reload: "RECHARGER",
      continue: "CONTINUER",
      finish: "TERMINER",
      submit: "SOUMETTRE",
      send: "ENVOYER",
      receive: "RECEVOIR",
      accept: "ACCEPTER",
      decline: "DÉCLINER",
      approve: "APPROUVER",
      reject: "REJETER",
      confirm: "CONFIRMER",
      verify: "VÉRIFIER",
      validate: "VALIDER",
      authenticate: "AUTHENTIFIER",
      authorize: "AUTORISER",
      permission: "PERMISO",
      access: "ACCÈS",
      denied: "REFUSÉ",
      granted: "ACCORDÉ",
      expired: "EXPIRÉ",
      invalid: "INVALIDE",
      valid: "VALIDE",
      required: "REQUIS",
      optional: "OPTIONNEL",
      available: "DISPONIBLE",
      unavailable: "INDISPONIBLE",
      online: "EN LIGNE",
      offline: "HORS LIGNE",
      connected: "CONNECTÉ",
      disconnected: "DÉCONNECTÉ",
      active: "ACTIF",
      inactive: "INACTIF",
      enabled: "ACTIVÉ",
      disabled: "DÉSACTIVÉ",
      public: "PUBLIC",
      private: "PRIVÉ",
      draft: "BROUILLON",
      published: "PUBLIÉ",
      archived: "ARCHIVÉ",
      deleted: "SUPPRIMÉ",
      restored: "RESTAURÉ",
      backup: "SAUVEGARDE",
      restore: "RESTAURER",
      sync: "SYNCHRONISER",
      processing: "TRAITEMENT",
      completed: "TERMINÉ",
      failed: "ÉCHOUÉ",
      pending: "EN ATTENTE",
      cancelled: "ANNULÉ",
      scheduled: "PROGRAMMÉ",
      delayed: "RETARDÉ",
      onTime: "À L'HEURE",
      early: "EN AVANCE",
      late: "EN RETARD",
      today: "AUJOURD'HUI",
      yesterday: "HIER",
      tomorrow: "DEMAIN",
      thisWeek: "CETTE SEMAINE",
      lastWeek: "SEMAINE DERNIÈRE",
      nextWeek: "SEMAINE PROCHAINE",
      thisMonth: "CE MOIS",
      lastMonth: "MOIS DERNIER",
      nextMonth: "MOIS PROCHAIN",
      thisYear: "CETTE ANNÉE",
      lastYear: "ANNÉE DERNIÈRE",
      nextYear: "ANNÉE PROCHAINE",
      date: "DATE",
      time: "HEURE",
      datetime: "DATE ET HEURE",
      timezone: "FUSEAU HORAIRE",
      duration: "DURÉE",
      startDate: "DATE DE DÉBUT",
      endDate: "DATE DE FIN",
      startTime: "HEURE DE DÉBUT",
      endTime: "HEURE DE FIN",
      allDay: "TOUTE LA JOURNÉE",
      recurring: "RÉCURRENT",
      reminder: "RAPPEL",
      notification: "NOTIFICACIÓN",
      alert: "ALERTE",
      warning: "AVERTISSEMENT",
      info: "INFO",
      success: "SUCCÈS",
      danger: "PELIGRO",
      primary: "PRIMAIRE",
      secondary: "SECONDAIRE",
      light: "CLAIR",
      dark: "SOMBRE",
      muted: "MUET",
      accent: "ACENTO",
      background: "ARRIÈRE-PLAN",
      foreground: "PREMIER PLAN",
      border: "BORDURE",
      input: "ENTRÉE",
      ring: "ANNEAU",
      chart: "GRAPHIQUE",
      sidebar: "BARRE LATÉRALE",
      card: "CARTE",
      popover: "POPOVER",
      destructive: "DESTRUCTIF",
      departures: "DÉPARTS",
      regularPrice: "PRIX RÉGULIER",
      viewDetails: "VOIR DÉTAILS",
      // Transport page specific
      tourNotFound: "Circuit non trouvé",
      backToHome: "Retour à l'accueil",
      panoramicRoute: "Route Panoramique",
      stopsOnRoute: "Arrêts sur le trajet:",
      stopOf: "Arrêt",
      routeInfoNotAvailable: "Informations sur l'itinéraire non disponibles pour le moment.",
      schedulesAndAvailability: "Horaires et Disponibilidad",
      departureTime: "Heure de Départ",
      arriveEarly: "Nous recommandons d'arriver 15 minutes à l'avance",
      availableDays: "Jours Disponibles",
      regularDepartures: "Départs réguliers toute l'année",
      includes: "Inclus",
      notIncludes: "Non Inclus",
      selectAvailableDate: "Sélectionnez une date disponible",
      numberOfPassengers: "Nombre de passagers",
      passenger: "pasager",
      passengers: "pasagers",
      totalToPay: "Total à payer:",
      perPerson: "par personne",
      reserveNow: "Réserver Maintenant",
      consultWhatsApp: "Consulter via WhatsApp",
      callNow: "Appeler Maintenant",
      passengerInfo: "Informations Passager",
      fullName: "Nom Complet",
      nationality: "Nacionalité",
      backButton: "Retour",
      confirmReservation: "Confirmer la Réservation",
      reservationSummary: "Résumé de votre réservation:",
      orderCreatedSuccess: "Commande créée avec succès! Nous vous contacterons bientôt.",
      orderCreationError: "Erreur lors de la création de la commande. Veuillez réessayer.",
      completeRequiredFields: "Veuillez compléter tous les champs requis",
      unlimitedCapacity: "Capacité illimitée",
      offer: "OFFRE",
      monday: "Lundi",
      tuesday: "Mardi",
      wednesday: "Mercredi",
      thursday: "Jeudi",
      friday: "Vendredi",
      saturday: "Samedi",
      sunday: "Dimanche",
      // Section des forfaits touristiques
      discoverDestinations:
        "Découvrez les destinations les plus prisées par nos voyageurs. Des circuits uniques mêlant aventure, culture et nature pour des expériences inoubliables à travers tout le Pérou.",
      mostPopularDestinations: "Destinations les plus populaires",
      explorePopular: "EXPLORER LES FAVORIS",
      viewAllTours: "Voir tous les circuits",
      errorLoadingTours: "Erreur lors du chargement des circuits. Veuillez réessayer.",
      noToursAvailable: "Aucun circuit disponible pour le moment.",
      featured: "EN VEDETTE",
      //about
      aboutDescription:
        "Peru Travel est une agence de voyages de luxe primée, spécialisée dans les voyages sur mesure, les lunes de miel et les vacances en famille à travers le Pérou, l’Amérique du Sud et au-delà.",
      atolTitle: "ATOL",
      atolSubtitle: "N° 12034",
      zeroTitle: "ZÉRO",
      zeroSubtitle: "FRAIS SUPPLÉMENTAIRES",
      carbonTitle: "100%",
      carbonSubtitle: "COMPENSATION CARBONE",
      //DiscoverySection
      howItWorks: "Comment ça marche",
      howItWorksSubtitle: "Trois étapes simples pour commencer votre aventure",
      stepPlanTitle: "Planifier",
      stepPlanDescription: "Remplissez le formulaire de demande et partagez votre histoire de voyage de rêve.",
      stepCustomizeTitle: "Personnaliser",
      stepCustomizeDescription: "Recevez des itinéraires personnalisés et commencez à planifier votre aventure idéale.",
      stepEnjoyTitle: "Profiter",
      stepEnjoyDescription: "Vivez des expériences uniques dans 100% des destinations les plus incroyables du Pérou.",
      dontWaitText1: "N'attendez pas—commencez votre aventure en tant que",
      dontWaitText2: "voyageur de niveau supérieur dès aujourd'hui. Votre expérience",
      dontWaitText3: "mérite le meilleur, et vous méritez de grandir avec nous.",
      startAdventure: "Commencer l'Aventure",
      adventurerImageAlt: "Aventurier contemplant une cascade dans la jungle péruvienne",
      // Our Services Section
      ourServices: "NOS SERVICES",
      ourServicesSubtitle: "Itinerarios sur mesure créés par nos experts",
      tailorMadeTab: "SUR MESURE",
      expertGuidesTab: "GUIDES EXPERTS",
      pricePromiseTab: "GARANTIE PRIX",
      familyOperatedTab: "ENTREPRISE FAMILIALE",
      carbonOffsetTab: "COMPENSATION CARBONE",
      charityCommitmentTab: "ENGAGEMENT CARITATIF",
      tailorMadeTitle: "Voyages sur Mesure",
      tailorMadeDescription:
        "Chaque viaje está diseñado únicamente pour vous, selon vos préférences personnelles, vos intérêts et votre style. Notre équipe experte crée des itinéraires personnalisés pour des expériences inoubliables.",
      tailorMadeButton: "PLANIFIEZ VOTRE VOYAGE",
      expertGuidesTitle: "Guides Experts",
      expertGuidesDescription:
        "Nos guides locaux soigneusement sélectionnés donnent vie aux destinations grâce à leur connaissance approfondie, leur passion et leur accès exclusivo. Découvrez des connexions culturelles authentiques et des joyaux cachés.",
      expertGuidesButton: "RENCONTREZ NOS GUIDES",
      pricePromiseTitle: "Garantie de Prix",
      pricePromiseDescription:
        "Nous garantissons des prix transparents sans frais cachés. Si vous trouvez un viaje similar a un precio inferior, nous l’égalons. Votre investissement va directamente a la creación d’expériences exceptionnelles.",
      pricePromiseButton: "VOIR LES PRIX",
      familyOperatedTitle: "Entreprise Familiale",
      familyOperatedDescription:
        "En tant qu’entreprise familiale, nous offrons un soin personal y une attention à chaque détail de votre voyage. Notre engagement envers l’excellence se transmet depuis des générations.",
      familyOperatedButton: "NOTRE HISTOIRE",
      carbonOffsetTitle: "Compensation Carbone",
      carbonOffsetDescription:
        "Nous nous engageons pour un tourisme responsable. Chaque voyage comprend des initiatives de compensation carbone, soutenant des projets de reforestación y des programmes d’énergie renouvelable.",
      carbonOffsetButton: "DÉVELOPPEMENT DURABLE",
      charityCommitmentTitle: "Engagement Caritatif",
      charityCommitmentDescription:
        "Nous sommes fiers d’être le partenaire officiel de la fondation ForRangers, soutenant leurs efforts de conservation et la protection des espèces en voie de disparition.",
      charityCommitmentButton: "EN SAVOIR PLUS",
      // Testimonials Section
      fromOurTravellers: "De nos voyageurs",
      testimonial1:
        "Je ne pourrais pas recommander Peru Travel plus fortement - nous avons eu les vacances les plus incroyables - chaque détail avait été pensé et ils étaient toujours disponibles pour répondre à toute question immédiatement. Service très personnel.",
      testimonial2:
        "J'ai été époustouflé par notre safari en Tanzanie, je ne m'attendais jamais à ce que ce soit si bon - cela a totalement dépassé mes attentes et tout s'est passé sans tracas. Notre guide était aussi absolument incroyable. J'ai hâte d'être à l'année prochaine!",
      testimonial3:
        "Service client fantastique. Équipe super amicale et aucune question sans réponse et aucune demande trop petite. J'ai vraiment apprécié la façon dont ils ont coordonné ma famille tout au long de la phase de planification. Merci Peru Travel.",
      testimonial4:
        "L'attention aux détails était incroyable. Dès notre atterrissage jusqu'à notre départ, tout était parfaitement organisé. Les expériences locales qu'ils ont organisées étaient authentiques et inoubliables.",
      testimonial5:
        "Peru Travel a rendu notre lune de miel absolument parfaite. Les touches romantiques qu'ils ont ajoutées tout au long de notre voyage l'ont rendu si spécial. Nous nous sommes sentis vraiment choyés à chaque étape.",
      testimonial6:
        "Profesional, compétent et véritablement passionné par les voyages. Ils ont écouté nos besoins et créé un itinéraire qui dépassait nos rêves les plus fous. Hautement recommandé!",
      testimonialName1: "Camila",
      testimonialName2: "Jeremy",
      testimonialName3: "Jamie",
      testimonialName4: "Sarah",
      testimonialName5: "Michael",
      testimonialName6: "Emma",
      // Contact Section
      enquireNow: "DEMANDER MAINTENANT",
      startPlanningTitle: "Commencez à planifier vos vacances sur mesure",
      speakToSpecialist: "Parlez à l'un de nos spécialistes du voyage",
      enquireNowButton: "DEMANDER MAINTENANT",
      callUsButton: "APPELEZ-NOUS",
      availableNow: "DISPONIBLE MAINTENANT",
      travelSpecialistAlt: "Spécialiste du voyage",
      contactImageAlt: "Touriste à Cusco contemplant l'architecture coloniale",
      locale: "fr-FR",
      // New keys for carousel header and dummy content
      carouselTitle: "Découvrez nos destinations de transport.",
      carouselSubtitle:
        "Voyagez confortablement à travers les destinations les plus increíbles del Perú. Des expériences uniques vous attendent.",
      tripDetails: "Détails du voyage",
      priceUSD: "Prix (USD)",
      pricePEN: "Prix (PEN)",
      rating: "Évaluation",
      originCity: "Ville d'origine",
      destinationCity: "Ville de destination",
      hours: "heures",
      arrivalTime: "Heure d'arrivée",
      // New keys for tours page
      peruToursTitle: "Tours du Pérou",
      peruToursSubtitle: "Découvrez les destinations les plus incroyables du Pérou",
      toursAvailable: "tours disponibles",
      searchToursPlaceholder: "Rechercher des circuits...",
      filters: "Filtres",
      searchFilters: "Filtres de recherche",
      allCategories: "Toutes les catégories",
      category: "Catégorie",
      difficulty: "Difficulté",
      allDifficulties: "Toutes les difficultés",
      packageType: "Type de forfait",
      allPackageTypes: "Tous les types",
      region: "Région",
      regionPlaceholder: "Ex: Cusco, Lima, Arequipa...",
      location: "Emplacement",
      locationPlaceholder: "Ex: Machu Picchu, Iquitos...",
      clear: "Effacer",
      apply: "Appliquer",
      activeFilters: "Filtres actifs:",
      toursFoundSingular: "circuit trouvé",
      toursFoundPlural: "circuits trouvés",
      noToursAvailableTitle: "Aucun circuit disponible",
      noToursAvailableMessage:
        "Nous n'avons trouvé aucun circuit correspondant à vos filtres. Essayez d'ajuster vos critères de recherche.",
      transport: "Transport",
      difficultyFacil: "Facile",
      difficultyModerado: "Modéré",
      difficultyDificil: "Difficile",
      packageTypeBasico: "Basique",
      packageTypePremium: "Premium",
      errorLoadingToursMessage: "Erreur lors du chargement des circuits. Veuillez réessayer.",
      previous: "Précédent",
      page: "Page",
      next: "Suivant",
      featuredTour: "EN VEDETTE",
      highlightedPlaces: "Lieux mis en évidence:",
      allDays: "Tous les jours",
      notAvailable: "Non disponible",
      route: "Itinéraire",
      schedule: "Horaire",
      // New keys for footer
      inspiration: "INSPIRATION",
      whyUs: "POURQUOI NOUS",
      journal: "JOURNAL",
      bookingConditions: "CONDITIONS DE RÉSERVATION",
      travelInsurance: "ASSURANCE VOYAGE",
      preDepartureInfo: "INFORMATIONS PRÉ-DÉPART",
      topPages: "PAGES PRINCIPALES",
      safariHoneymoons: "LUNES DE MIEL SAFARI",
      safariBeachHoneymoons: "LUNES DE MIEL SAFARI & PLAGE",
      familySafaris: "SAFARIS FAMILIAUX",
      luxurySafaris: "SAFARIS DE LUXE",
      callUs: "APPELEZ-NOUS",
      emailUs: "ENVOYEZ-NOUS UN E-MAIL",
      // New keys for header
      discover: "DÉCOUVRIR",
      learn: "APPRENDRE",
      sustainability: "DURABILITÉ",
      howCanWeHelp: "Bonjour! Comment pouvons-nous vous aider?",
      // New keys for ItinerariesPage
      peru: "du Pérou",
      itinerariesHeroSubtitle:
        "Itinéraires soigneusement conçus pour découvrir les trésors les plus incroyables du Pérou",
      exploreItineraries: "EXPLORER LES ITINÉRAIRES",
      uniqueItineraries: "Itinéraires Uniques",
      yearsOfExperience: "Années d'Expérience",
      happyTravelers: "Voyageurs Heureux",
      averageRating: "Note Moyenne",
      chooseYourAdventure: "Choisissez votre Aventure",
      chooseAdventureSubtitle:
        "Des escapades de week-end aux expéditions épiques, nous avons l'itinéraire parfait pour vous",
      shortDuration: "Courte Durée",
      mediumDuration: "Durée Moyenne",
      longDuration: "Longue Durée",
      from: "À partir de",
      mainHighlights: "Points Forts Principaux:",
      plusMore: "+{count} de plus",
      group: "Groupe",
      whyChooseOurItineraries: "Pourquoi choisir nos Itineraires?",
      exclusiveRoutes: "Routes Exclusives",
      exclusiveRoutesDescription: "Itinéraires uniques conçus par des experts locaux avec accès à des lieux spéciaux",
      smallGroups: "Petits Groupes",
      smallGroupsDescription: "Maximum 16 personnes pour une expérience plus personnalisée et intime",
      guaranteedQuality: "Qualité Garantie",
      guaranteedQualityDescription: "Hôtels sélectionnés, guides certifiés et services de première classe",
      totalFlexibility: "Flexibilité Totale",
      totalFlexibilityDescription: "Nous adaptons tout itinéraire selon vos préférences et besoins",
      allInclusive: "Tout Inclus",
      allInclusiveDescription: "Pas de surprises: hôtels, transferts, visites et de nombreux repas inclus",
      uniqueExperiences: "Expériences Uniques",
      uniqueExperiencesDescription: "Actividades exclusivas que you won't find with other operators",
      readyForAdventure: "Prêt pour votre prochaine aventure péruvienne?",
      readyForAdventureSubtitle:
        "Nos experts sont prêts à concevoir l'itinéraire parfait selon vos rêves et votre budget",
      consultItinerary: "CONSULTER L'ITINÉRAIRE",
      speakToExpert: "PARLER À UN EXPERT",
      // New keys for AboutUsPage
      aboutHeroSubtitle:
        "Nous sommes une entreprise familiale péruvienne dédiée à la création d'expériences authentiques et inoubliables qui connectent les voyageurs avec la riche culture, l'histoire et la nature du Pérou.",
      ourStoryButton: "DÉCOUVREZ NOTRE HISTOIRE",
      viewOurTeamButton: "VOIR NOTRE ÉQUIPE",
      discoverMore: "Découvrez plus",
      ourAchievements: "Nos Réalisations",
      achievementsSubtitle:
        "Des chiffres qui reflètent notre engagement envers l'excellence et la satisfaction de nos voyageurs.",
      creatingUnforgettableExperiences: "Créer des expériences inoubliables",
      fromOver50Countries: "De plus de 50 pays",
      throughoutPeru: "À travers le Pérou",
      satisfaction: "Satisfaction",
      ourHistory: "Notre Histoire",
      historySubtitle:
        "Un voyage de 15 ans à construire des expériences inoubliables et à connecter les cœurs avec le Pérou.",
      foundation: "Fondation",
      foundationDescription: "Carlos Mendoza fonde Inka Travel avec la vision de montrer le vrai Pérou au monde.",
      firstToursMachuPicchu: "Premiers tours à Machu Picchu",
      firstOfficeCusco: "Premier bureau à Cusco",
      fiveInitialTours: "5 tours initiaux",
      teamOfThree: "Équipe de 3 personnes",
      expansion: "Expansion",
      expansionDescription: "Nous avons étendu nos services à l'Amazonie et à la côte nord du Pérou.",
      thousandTravelersServed: "1 000 voyageurs servis",
      newAmazonRoutes: "Nouvelles routes amazoniennes",
      officeInLima: "Bureau à Lima",
      fifteenSpecializedGuides: "15 guías especializados",
      internationalCertification: "Certification Internationale",
      iataCertificationDescription: "Agence de voyages certifiée internationalement",
      iataCertification: "Certification IATA",
      officialRecognition: "Reconnaissance officielle",
      fiveThousandSatisfiedClients: "5 000 clients satisfaits",
      sustainableTourismDescription:
        "Nous mettons en œuvre des programmes de tourisme responsable et de durabilité environnementale.",
      sustainableCertification: "Certificación Durable",
      ecoFriendlyPrograms: "Programmes écologiques",
      communityPartnerships: "Partenariats communautaires",
      greenCertification: "Certificación verte",
      digitalInnovation: "Innovation Numérique",
      digitalInnovationDescription:
        "Adaptation aux nouvelles technologies et aux protocoles de sécurité post-pandémie.",
      digitalPlatform: "Plateforme numérique",
      virtualTours: "Tours virtuels",
      covidProtocols: "Protocoles COVID-19",
      industryLeaders: "Leaders du Secteur",
      industryLeadersDescription: "Reconnus comme l'une des meilleures agences de tourisme du Pérou.",
      tenThousandPlusHappyTravelers: "Plus de 10 000 voyageurs heureux",
      marketLeader: "Leader du marché",
      fiftyPlusDestinations: "Plus de 50 destinations",
      ninetyEightPercentSatisfaction: "98% de satisfaction",
      whyChooseUsSubtitle: "Découvrez les raisons qui font de nous le meilleur choix pour votre aventure péruvienne.",
      localExperience: "Expérience Locale",
      localExperienceDescription:
        "15 ans d'expérience approfondie dans le tourisme péruvien avec des guides natifs spécialisés.",
      responsibleTourism: "Tourisme Responsable",
      responsibleTourismDescription: "Engagés envers la durabilité et le bénéfice des communautés locales.",
      personalizedAttention: "Attention Personnalisée",
      personalizedAttentionDescription:
        "Chaque voyage est unique et conçu spécifiquement pour vos intérêts et vos besoins.",
      guaranteedSafety: "Sécurité Garantie",
      guaranteedSafetyDescription:
        "Protocoles de sécurité rigoureux et équipements spécialisés pour chaque expédition.",
      support247: "Support 24/7",
      support247Description: "Assistance complète avant, pendant et après votre voyage à travers le Pérou.",
      bestPriceGuaranteed: "Meilleur Prix Garanti",
      bestPriceGuaranteedDescription: "Prix compétitifs sans compromettre la qualité de nos services premium.",
      ourValues: "Nos Valeurs",
      ourValuesSubtitle:
        "Les principes qui guident chaque décision et action chez Inka Travel, assurant des expériences exceptionnelles et responsables.",
      authenticity: "Autenticidad",
      authenticityDescription:
        "Expériences authentiques qui connectent avec la culture locale et les traditions ancestrales du Pérou.",
      sustainabilityValueDescription:
        "Tourisme responsable qui protège l'environnement et bénéficie aux communautés locales.",
      excellence: "Excelencia",
      excellenceDescription: "Standards de qualité supérieurs dans chaque détail de nos services et expériences.",
      safety: "Sécurité",
      safetyDescription: "Protocoles rigoureux et équipements spécialisés pour garantir la sécurité de nos voyageurs.",
      innovation: "Innovation",
      innovationDescription:
        "Nous améliorons constamment nos services en intégrant de nouvelles technologies et méthodologies.",
      passion: "Passion",
      passionDescription: "Amour sincère pour le Pérou et dévouement absolu à partager ses merveilles avec le monde.",
      teamSubtitle: "Rencontrez les experts passionnés qui rendent possible chaque expérience unique au Pérou.",
      founderCEO: "Fondateur & PDG",
      operationsDirector: "Directrice des Opérations",
      headOfGuides: "Chef des Guides",
      sustainabilityCoordinator: "Coordinatrice du Développement Durable",
      carlosDescription:
        "Passionné par la présentation de la beauté du Pérou au monde, Carlos a fondé Inka Travel avec la vision de créer des expériences authentiques et inoubliables.",
      mariaDescription:
        "Experte en culture andine et traditions ancestrales, María veille à ce que chaque voyage soit une immersion culturelle authentique.",
      robertoDescription:
        "Alpiniste expérimenté et profond connaisseur des Andes, Roberto dirige notre équipe de guides spécialisés.",
      anaDescription:
        "Bióloga y conservatrice, Ana desarrolla nuestros programas de turismo sostenible y responsabilidad social.",
      spanish: "Español",
      english: "Anglais",
      quechua: "Quechua",
      aymara: "Aymara",
      french: "Français",
      portuguese: "Portugais",
      officialGuide: "Guide Officiel",
      firstAid: "Premiers Secours",
      sustainableTourism: "Tourisme Durable",
      anthropologist: "Anthropologue",
      specializedGuide: "Guide Spécialisé",
      culturalHeritage: "Patrimoine Culturel",
      mountainGuide: "Guide de Montaña",
      highAltitudeRescue: "Sauvetage en Haute Altitude",
      wildernessFirstAid: "Premiers Secours en Milieu Sauvage",
      biologist: "Biologiste",
      conservation: "Conservation",
      certificationsAndRecognitions: "Certifications et Reconnaissances",
      certificationsSubtitle:
        "Notre engagement envers l'excellence est soutenu par des certifications internationales et des reconnaissances de l'industrie.",
      iataDescription: "Agence de voyages certifiée internationalement",
      sustainableTourismCertDescription: "Certifié par le Ministère du Tourisme du Pérou",
      tripAdvisorExcellence: "Excellence TripAdvisor",
      tripAdvisorExcellenceDescription: "Certificat d'Excellence pendant 5 années consécutives",
      iso9001: "ISO 9001",
      iso9001Description: "Système de gestion de la qualité certifié",
      whatOurTravelersSay: "Ce que disent nos voyageurs",
      travelerExperiencesSubtitle:
        "Les expériences de nos voyageurs sont notre plus grande fierté et notre motivation pour continuer à nous améliorer.",
      unitedStates: "États-Unis",
      germany: "Allemagne",
      japan: "Japon",
      testimonialText1:
        "Inka Travel a rendu notre voyage au Pérou absolument magique. Chaque détail était parfaitement planifié et notre guide Carlos était incroyable. Nous reviendrons certainement !",
      testimonialText2:
        "L'expérience la plus authentique que j'aie jamais vécue en voyage. L'équipe d'Inka Travel connaît vraiment le Pérou et vous fait ressentir la culture d'une manière unique.",
      testimonialText3:
        "Professionnalisme exceptionnel et attention à chaque détail. Inka Travel a dépassé toutes nos attentes. L'Amazonie a été une expérience transformatrice.",
      machuPicchuSacredValley: "Machu Picchu & Vallée Sacrée",
      classicIncaTrail: "Chemin Inca Classique",
      amazonAdventure: "Aventure Amazonienne",
      readyForPeruvianAdventure: "Prêt pour votre aventure péruvienne ?",
      callToActionSubtitle:
        "Rejoignez les milliers de voyageurs qui nous ont fait confiance pour découvrir les merveilles du Pérou. Votre aventure inoubliable vous attend.",
      contactUs: "CONTACTEZ-NOUS",
      uniqueDestinations: "Destinations Uniques",
      whyChooseUs: "Pourquoi Nous Choisir",
      ourTeam: "Notre Équipe",
      planYourTrip: "PLANIFIEZ VOTRE VOYAGE",
      // When To Go Page specific translations
      whenToGoTitle: "Quand Partir",
      whenToGoSubtitle:
        "Découvrez le moment parfait pour chaque destination et vivez l'expérience de votre vie au pays des Incas",
      planYourTripButton: "PLANIFIEZ VOTRE VOYAGE",
      daysOfAdventure: "Jours d'aventure",
      climaticRegions: "Régions climatiques",
      uniqueMonths: "Mois uniques",
      incredibleDestinations: "Destinations incroyables",
      exploreByCategory: "Explorez par catégorie",
      chooseHowToPlan: "Choisissez how you want to plan your perfect trip",
      bySeasons: "Par Saisons",
      monthByMonth: "Mois par Mois",
      byDestinations: "Par Destinations",
      drySeason: "Saison Sèche",
      drySeasonMonths: "Mai - Septembre",
      drySeasonDescription: "La meilleure période pour visiter la majeure partie du Pérou",
      rainySeason: "Saison des Pluies",
      rainySeasonMonths: "Octobre - Avril",
      rainySeasonDescription: "Paysages verts et moins de touristes",
      climate: "Climat",
      temperature: "Température",
      recommendedActivities: "Activités recommandées",
      whatToWear: "Quoi porter",
      coastRegion: "Côte",
      sierraRegion: "Sierra",
      jungleRegion: "Jungle",
      sunnyAndDry: "Ensoleillé et sec",
      dryAndCool: "Sec et frais",
      lessRain: "Moins de pluies",
      cloudyAndHumid: "Nuageux et humide",
      rainyWeather: "Pluvieux",
      veryRainy: "Très pluvieux",
      coastDryTemp: "18°C - 25°C",
      sierraDryTemp: "5°C - 20°C",
      jungleDryTemp: "22°C - 32°C",
      coastDryDescription: "Ciel dégagé, idéal pour les activités de plein air",
      sierraDryDescription: "Journées ensoleillées, nuits froides, parfaites pour le trekking",
      jungleDryDescription: "Moins de précipitations, mieux pour la navigation",
      beaches: "Plages",
      waterSports: "Sports nautiques",
      coastalHiking: "Randonnée côtière",
      machuPicchuActivity: "Machu Picchu",
      incaTrailActivity: "Chemin Inca",
      cityToursActivity: "Visites de la ville",
      amazonSafari: "Safari amazonien",
      wildlifeObservation: "Observation de la faune",
      navigation: "Navigation",
      lightClothing: "Vêtements légers",
      sunscreen: "Crème solaire",
      hat: "Chapeau",
      layersOfClothing: "Couches de vêtements",
      warmJacket: "Veste chaude",
      trekkingShoes: "Chaussures de trekking",
      repellent: "Répulsif",
      waterproofBoots: "Bottes imperméables",
      romanticAtmosphere: "Brume de Lima, ambiance romantique",
      museums: "Musées",
      gastronomy: "Gastronomie",
      nightlife: "Vie nocturne",
      warmClothing: "Vêtements chauds",
      lightJacket: "Veste légère",
      umbrella: "Paraguas",
      greenLandscapes: "Paysages verts",
      difficultTrails: "Sentiers difficiles",
      colonialCities: "Villes coloniales",
      markets: "Marchés",
      waterproofClothing: "Vêtements imperméables",
      highBoots: "Bottes hautes",
      poncho: "Poncho",
      highRivers: "Rivières hautes",
      lushVegetation: "Végétation luxuriante",
      lodges: "Lodges",
      birdWatching: "Observation des oiseaux",
      fishing: "Pêche",
      climateMonthByMonth: "Climat Mois par Mois",
      detailedClimateInfo:
        "Informations détaillées sur le climat dans chaque région du Pérou tout au long de l'année pour planifier votre viaje perfecto.",
      popularity: "Popularité",
      tourismLevel: "Niveau Touristique",
      advantages: "Avantages",
      consider: "À considérer",
      january: "Janvier",
      february: "Février",
      march: "Mars",
      april: "Avril",
      may: "Mai",
      june: "Juin",
      july: "Juillet",
      august: "Août",
      september: "Septembre",
      october: "Octobre",
      november: "Novembre",
      december: "Décembre",
      transitionSeason: "Transition",
      lowRain: "Faible",
      highRain: "Élevée",
      veryHighRain: "Très élevée",
      lessTourists: "Moins de touristes",
      lowPrices: "Prix bas",
      incaTrailClosed: "Chemin Inca fermé",
      possibleFloods: "Inondations possibles",
      endOfRains: "Fin des pluies",
      muddyTrails: "Sentiers boueux",
      goodWeather: "Beau temps",
      unpredictableWeather: "Météo imprévisible",
      startDrySeason: "Début de la saison sèche",
      excellentClimate: "Excellent climat",
      incaTrailOpen: "Chemin Inca ouvert",
      moreTourists: "Plus de touristes",
      bestClimate: "Meilleur climat",
      intiRaymi: "Inti Raymi",
      clearSkies: "Ciel dégagé",
      crowds: "Foules",
      highPrices: "Prix élevés",
      peakSeason: "Haute saison",
      perfectClimate: "Climat perfecto",
      reservationsNeeded: "Réservations nécessaires",
      strongWindsSierra: "Vents forts en sierra",
      mountainWinds: "Vents en montagne",
      endDrySeason: "Fin de la saison sèche",
      occasionalWinds: "Vents occasionnels",
      startRains: "Début des pluies",
      changingLandscapes: "Paysages changeants",
      christmasHolidays: "Fêtes de Noël",
      frequentRains: "Pluies fréquentes",
      bestTimeToVisitByDestination: "Meilleure Période par Destination",
      eachDestinationIdealTime:
        "Chaque destination au Pérou a sa période idéale. Découvrez quand visiter chaque lieu pour la meilleure expérience.",
      bestMonthsToVisit: "Meilleurs mois pour visiter",
      monthsToAvoid: "Mois à éviter",
      expertTips: "Conseils d'experts",
      machuPicchuDestination: "Machu Picchu",
      amazonDestination: "Amazonie",
      colcaCanyonDestination: "Canyon de Colca",
      nazcaLinesDestination: "Lignes de Nazca",
      lakeTiticacaDestination: "Lac Titicaca",
      northCoastDestination: "Côte Nord",
      machuPicchuDescription: "La citadelle inca est mieux visitée pendant la saison sèche",
      amazonDescription: "Meilleure navigation et observation de la faune en saison sèche",
      colcaCanyonDescription: "Idéal pour observer les condors et faire du trekking",
      nazcaLinesDescription: "El desierto ofrece condiciones estables toda el año",
      lakeTiticacaDescription: "Ciel dégagé pour profiter des îles flottantes",
      northCoastDescription: "Plages chaudes pendant l'été côtier",
      book3_4MonthsAhead: "Réserver 3-4 mois à l'avance",
      incaTrailClosesFeb: "Le Chemin Inca ferme en février",
      wearWarmClothesMornings: "Porter des vêtements chauds pour les matins",
      lowerRiversEasierNavigation: "Des rivières plus basses facilitent la navigation",
      higherAnimalConcentration: "Plus grande concentration d'animaux",
      lessMosquitoesDrySeason: "Moins de moustiques en saison sèche",
      condorsMoreActiveMorning: "Condors plus actifs le matin",
      avoidRainySeasonTrekking: "Éviter la saison des pluies pour le trekking",
      flightsCanceledStrongWinds: "Les vols peuvent être annulés en raison de vents forts",
      betterVisibilityMornings: "Meilleure visibilité le matin",
      wearSunscreen: "Porter de la crème solaire",
      veryColdNightsDrySeason: "Nuits très froides en saison sèche",
      sunProtectionAltitude: "Protection solaire due à l'altitude",
      beachSeasonSummer: "Saison balnéaire en été",
      avoidCoastalWinter: "Éviter l'hiver côtier",
      idealWaterSports: "Idéal pour les sports nautiques",
      allYear: "Toute l'année",
      visitors: "Visiteurs",
      whyPlanWithUs: "Pourquoi planifier avec nous?",
      ourExperienceGuarantees:
        "Notre expérience et nos connaissances locales vous garantissent le voyage parfait à tout moment de l'année",
      localExperts: "Experts Locaux",
      localExpertsDescription: "Guides certifiés avec plus de 10 ans d'expérience dans chaque région du Pérou",
      perfectPlanning: "Planification Parfaite",
      perfectPlanningDescription:
        "Nous vous aidons à choisir les meilleures dates en fonction de vos intérêts et préférences",
      guaranteedClimate: "Climat Garanti",
      guaranteedClimateDescription:
        "Nous surveillons les conditions climatiques pour assurer votre meilleure expérience",
      optimizedRoutes: "Routes Optimisées",
      optimizedRoutesDescription:
        "Itinéraires conçus pour profiter au maximum de chaque destination à sa meilleure période",
      uniqueMoments: "Moments Únicos",
      uniqueMomentsDescription: "Capturez les meilleurs moments avec des conditions climatiques et de lumière idéales",
      yourPerfectAdventure: "Votre aventure parfaite",
      isWaitingForYou: "vous attend",
      nowThatYouKnow:
        "Maintenant que vous savez quand voyager, il est temps de concrétiser vos rêves. Nos experts sont prêts à concevoir votre expérience unique.",
      bookNow: "RÉSERVER MAINTENANT",
      freeConsultation: "CONSULTATION GRATUITE",
      // New keys for TourDetailPage tabs
      itinerary: "Itinéraire",
      bring: "Quoi Apporter",
      conditions: "Conditions",
      processingPayment: "Traitement du paiement...",
      errorProcessingPayment: "Erreur lors du traitement du paiement. Veuillez réessayer.",
    completeYourPayment: "Complétez votre paiement",
    loadingPaymentForm: "Chargement du formulaire de paiement...",
    },
    de: {
      destinations: "REISEZIELE",
      tours: "TOUREN",
      itineraries: "REISEROUTEN",
      whenToGo: "WANN REISEN",
      aboutUs: "ÜBER UNS",
      login: "ANMELDEN",
      reserve: "RESERVIEREN",
      search: "SUCHEN",
      close: "SCHLIESSEN",
      menu: "MENÜ",
      language: "SPRACHE",
      loading: "LADEN",
      error: "FEHLER",
      retry: "WIEDERHOLEN",
      reviews: "Bewertungen",
      noResults: "KEINE ERGEBNISSE",
      showMore: "MEHR ANZEIGEN",
      showLess: "WENIGER ANZEIGEN",
      readMore: "MEHR LESEN",
      readLess: "WENIGER LESEN",
      contact: "KONTAKT",
      email: "E-MAIL",
      phone: "TELEFON",
      address: "ADRESSE",
      followUs: "FOLGEN SIE UNS",
      newsletter: "NEWSLETTER",
      subscribe: "ABONNIEREN",
      privacyPolicy: "DATENSCHUTZRICHTLINIE",
      termsOfService: "NUTZUNGSBEDINGUNGEN",
      cookiePolicy: "COOKIE-RICHTLINIE",
      allRightsReserved: "ALLE RECHTE VORBEHALTEN",
      home: "STARTSEITE",
      about: "ÜBER",
      services: "DIENSTLEISTUNGEN",
      gallery: "GALERIE",
      testimonials: "TESTIMONIALS",
      faq: "FAQ",
      blog: "BLOG",
      news: "NACHRICHTEN",
      events: "VERANSTALTUNGEN",
      promotions: "AKTIONEN",
      packages: "PAKETE",
      booking: "BUCHUNG",
      confirmation: "BESTÄTIGUNG",
      payment: "ZAHLUNG",
      checkout: "KASSE",
      cart: "WARENKORB",
      wishlist: "WUNSCHLISTE",
      profile: "PROFIL",
      settings: "EINSTELLUNGEN",
      logout: "ABMELDEN",
      register: "REGISTRIEREN",
      forgotPassword: "PASSWORT VERGESSEN",
      resetPassword: "PASSWORT ZURÜCKSETZEN",
      changePassword: "PASSWORT ÄNDERN",
      updateProfile: "PROFIL AKTUALISIEREN",
      deleteAccount: "KONTO LÖSCHEN",
      save: "SPEICHERN",
      cancel: "ABBRECHEN",
      edit: "BEARBEITEN",
      delete: "LÖSCHEN",
      add: "HINZUFÜGEN",
      remove: "ENTFERNEN",
      update: "AKTUALISIEREN",
      create: "ERSTELLEN",
      view: "ANZEIGEN",
      download: "HERUNTERLADEN",
      upload: "HOCHLADEN",
      share: "TEILEN",
      copy: "KOPIEREN",
      print: "DRUCKEN",
      export: "EXPORTIEREN",
      import: "IMPORTIEREN",
      refresh: "AKTUALISIEREN",
      reload: "NEU LADEN",
      continue: "FORTFAHREN",
      finish: "BEENDEN",
      submit: "SENDEN",
      send: "SENDEN",
      receive: "EMPFANGEN",
      accept: "AKZEPTIEREN",
      decline: "ABLEHNEN",
      approve: "GENEHMIGEN",
      reject: "ABLEHNEN",
      confirm: "BESTÄTIGEN",
      verify: "ÜBERPRÜFEN",
      validate: "VALIDIEREN",
      authenticate: "AUTHENTIFIZIEREN",
      authorize: "AUTORISIEREN",
      permission: "BERECHTIGUNG",
      access: "ZUGANG",
      denied: "VERWEIGERT",
      granted: "GEWÄHRT",
      expired: "ABGELAUFEN",
      invalid: "UNGÜLTIG",
      valid: "GÜLTIG",
      required: "ERFORDERLICH",
      optional: "OPTIONNEL",
      available: "VERFÜGBAR",
      unavailable: "NICHT VERFÜGBAR",
      online: "ONLINE",
      offline: "OFFLINE",
      connected: "VERBUNDEN",
      disconnected: "GETRENNT",
      active: "AKTIV",
      inactive: "INAKTIV",
      enabled: "AKTIVIERT",
      disabled: "DEAKTIVIERT",
      public: "ÖFFENTLICH",
      private: "PRIVAT",
      draft: "ENTWURF",
      published: "VERÖFFENTLICH",
      archived: "ARCHIVIERT",
      deleted: "GELÖSCHT",
      restored: "WIEDERHERGESTELLT",
      backup: "SICHERUNG",
      restore: "WIEDERHERSTELLEN",
      sync: "SYNCHRONISIEREN",
      processing: "VERARBEITUNG",
      completed: "ABGESCHLOSSEN",
      failed: "FEHLGESCHLAGEN",
      pending: "AUSSTEHEND",
      cancelled: "STORNIERT",
      scheduled: "GEPLANT",
      delayed: "VERSPÄTET",
      onTime: "PÜNKTLICH",
      early: "FRÜH",
      late: "SPÄT",
      today: "HEUTE",
      yesterday: "GESTERN",
      tomorrow: "MORGEN",
      thisWeek: "DIESE WOCHE",
      lastWeek: "LETZTE WOCHE",
      nextWeek: "NÄCHSTE WOCHE",
      thisMonth: "DIESER MONAT",
      lastMonth: "LETZTER MONAT",
      nextMonth: "NÄCHSTER MONAT",
      thisYear: "DIESES JAHR",
      lastYear: "LETZTES JAHR",
      nextYear: "NÄCHSTES JAHR",
      date: "DATUM",
      time: "ZEIT",
      datetime: "DATUM UND ZEIT",
      timezone: "ZEITZONE",
      duration: "DAUER",
      startDate: "STARTDATUM",
      endDate: "ENDDATUM",
      startTime: "STARTZEIT",
      endTime: "ENDZEIT",
      allDay: "GANZTÄGIG",
      recurring: "WIEDERKEHREND",
      reminder: "ERINNERUNG",
      notification: "BENACHRICHTIGUNG",
      alert: "ALERTE",
      warning: "WARNUNG",
      info: "INFORMATION",
      success: "ERFOLG",
      danger: "PELIGRO",
      primary: "PRIMÄR",
      secondary: "SEKUNDÄR",
      light: "HELL",
      dark: "OSCURO",
      muted: "STUMM",
      accent: "AKZENT",
      background: "HINTERGRUND",
      foreground: "VORDERGRUND",
      border: "RAND",
      input: "EINGABE",
      ring: "ANILLO",
      chart: "DIAGRAMM",
      sidebar: "SEITENLEISTE",
      card: "KARTE",
      popover: "POPOVER",
      destructive: "DESTRUKTIV",
      departures: "ABFAHRTEN",
      regularPrice: "REGULÄRER PREIS",
      viewDetails: "DETAILS ANZEIGEN",
      // Transport page specific
      tourNotFound: "Tour nicht gefunden",
      backToHome: "Zurück zur Startseite",
      panoramicRoute: "Panorama-Route",
      stopsOnRoute: "Haltestellen auf der Strecke:",
      stopOf: "Haltestelle",
      routeInfoNotAvailable: "Routeninformationen sind derzeit nicht verfügbar.",
      schedulesAndAvailability: "Fahrpläne & Verfügbarkeit",
      departureTime: "Abfahrtszeit",
      arriveEarly: "Wir empfehlen, 15 Minuten früher zu kommen",
      availableDays: "Verfügbare Tage",
      regularDepartures: "Regelmäßige Abfahrten das ganze Jahr über",
      includes: "Inbegriffen",
      notIncludes: "Nicht Inbegriffen",
      selectAvailableDate: "Wählen Sie ein verfügbares Datum",
      numberOfPassengers: "Anzahl der Passagiere",
      passenger: "Passagier",
      passengers: "Passagiere",
      totalToPay: "Gesamtbetrag:",
      perPerson: "pro Persona",
      reserveNow: "Jetzt Reservieren",
      consultWhatsApp: "Über WhatsApp konsultieren",
      callNow: "Jetzt Anrufen",
      passengerInfo: "Passagier-Informationen",
      fullName: "Vollständiger Name",
      nationality: "Nacionalität",
      backButton: "Zurück",
      confirmReservation: "Reservierung Bestätigen",
      reservationSummary: "Ihre Reservierungsübersicht:",
      orderCreatedSuccess: "Bestellung erfolgreich erstellt! Wir werden Sie bald kontaktieren.",
      orderCreationError: "Fehler beim Erstellen der Bestellung. Bitte versuchen Sie es erneut.",
      completeRequiredFields: "Bitte füllen Sie alle Pflichtfelder aus",
      unlimitedCapacity: "Unbegrenzte Kapazität",
      offer: "ANGEBOT",
      monday: "Montag",
      tuesday: "Dienstag",
      wednesday: "Mittwoch",
      thursday: "Donnerstag",
      friday: "Freitag",
      saturday: "Samstag",
      sunday: "Sonntag",
      // Tourpaket-Sektion
      discoverDestinations:
        "Entdecke die beliebtesten Reiseziele unserer Reisenden. Einzigartige Touren, die Abenteuer, Kultur und Natur zu unvergesslichen Erlebnissen in ganz Peru vereinen.",
      mostPopularDestinations: "Beliebteste Reiseziele",
      explorePopular: "BELIEBTE TOUREN ENTDECKEN",
      viewAllTours: "Alle Touren anzeigen",
      errorLoadingTours: "Fehler beim Laden der Touren. Bitte versuche es erneut.",
      noToursAvailable: "Derzeit sind keine Touren verfügbar.",
      featured: "HERVORGEHOBEN",
      //about
      aboutDescription:
        "Peru Travel ist ein preisgekröntes Luxusreiseunternehmen, das sich auf maßgeschneiderte Reisen, Flitterwochen und Familienurlaube in Peru, Südamerika und darüber hinaus spezialisiert hat.",
      atolTitle: "ATOL",
      atolSubtitle: "NR. 12034",
      zeroTitle: "NULL",
      zeroSubtitle: "ZUSÄTZLICHE GEBÜHREN",
      carbonTitle: "100%",
      carbonSubtitle: "CO₂-KOMPENSATION",
      //DiscoverySection
      howItWorks: "Wie es funktioniert",
      howItWorksSubtitle: "Drei einfache Schritte, um dein Abenteuer zu starten",
      stepPlanTitle: "Planen",
      stepPlanDescription: "Fülle das Anfrageformular aus und teile deine Traumreisegeschichte.",
      stepCustomizeTitle: "Anpassen",
      stepCustomizeDescription: "Erhalte personalisierte Reiserouten und beginne dein perfektes Abenteuer zu planen.",
      stepEnjoyTitle: "Genießen",
      stepEnjoyDescription: "Erlebe einzigartige Momente an 100 % der beeindruckendsten Orte Perus.",
      dontWaitText1: "Warte nicht – starte dein Abenteuer als",
      dontWaitText2: "Next-Level-Reisender noch heute. Deine Erfahrung",
      dontWaitText3: "verdient das Beste – und du verdienst es, mit uns zu wachsen.",
      startAdventure: "Abenteuer starten",
      adventurerImageAlt: "Abenteurer betrachtet einen Wasserfall im peruanischen Dschungel",
      //// Our Services Section
      ourServices: "UNSERE DIENSTLEISTUNGEN",
      ourServicesSubtitle: "Maßgeschneiderte Reiserouten von unseren Experten",
      tailorMadeTab: "MAßGESCHNEIDERT",
      expertGuidesTab: "EXPERTEN-GUIDES",
      pricePromiseTab: "PREISGARANTIE",
      familyOperatedTab: "FAMILIENUNTERNEHMEN",
      carbonOffsetTab: "CO₂-KOMPENSATION",
      charityCommitmentTab: "WOHLTÄTIGES ENGAGEMENT",
      tailorMadeTitle: "Maßgeschneiderte Reisen",
      tailorMadeDescription:
        "Jede Reise wird individuell für dich entworfen – angepasst an deine Vorlieben, Interessen und deinen Reisestil. Unser Expertenteam erstellt personalisierte Reiserouten für unvergessliche Erlebnisse.",
      tailorMadeButton: "REISE PLANEN",
      expertGuidesTitle: "Experten-Guides",
      expertGuidesDescription:
        "Unsere sorgfältig ausgewählten lokalen Guides erwecken Reiseziele mit ihrem Wissen, ihrer Leidenschaft und exklusivem Zugang zum Leben. Erlebe authentische kulturelle Begegnungen und versteckte Juwelen.",
      expertGuidesButton: "UNSERE GUIDES TREFFEN",
      pricePromiseTitle: "Preisgarantie",
      pricePromiseDescription:
        "Wir garantieren transparente Preise ohne versteckte Gebühren. Wenn du eine vergleichbare Reise günstiger findest, gleichen wir den Preis an. Deine Investition fließt direkt in außergewöhnliche Erlebnisse.",
      pricePromiseButton: "PREISE ANZEIGEN",
      familyOperatedTitle: "Familienunternehmen",
      familyOperatedDescription:
        "Als Familienunternehmen bieten wir persönliche Betreuung und achten auf jedes Detail deiner Reise. Unser Engagement für Qualität reicht über Generationen hinweg.",
      familyOperatedButton: "UNSERE GESCHICHTE",
      carbonOffsetTitle: "CO₂-Kompensation",
      carbonOffsetDescription:
        "Wir setzen auf verantwortungsvollen Tourismus. Jede Reise beinhaltet CO₂-Kompensationsmaßnahmen durch Aufforstungsprojekte und erneuerbare Energieprogramme.",
      carbonOffsetButton: "NACHHALTIGKEIT",
      charityCommitmentTitle: "Wohltätiges Engagement",
      charityCommitmentDescription:
        "Wir sind stolzer offizieller Reisepartner der ForRangers-Stiftung, die wichtige Naturschutzarbeit leistet und bedrohte Tierarten schützt.",
      charityCommitmentButton: "MEHR ERFAHREN",
      // Testimonials Section
      fromOurTravellers: "Von unseren Reisenden",
      testimonial1:
        "Ich könnte Peru Travel nicht mehr empfehlen - wir hatten den unglaublichsten Urlaub - jedes Detail war durchdacht und sie waren immer verfügbar, um jede Frage sofort zu beantworten. Sehr persönlicher Service.",
      testimonial2:
        "Ich war begeistert von unserer Tansania-Safari, hätte nie erwartet, dass sie so gut sein würde - hat meine Erwartungen völlig übertroffen und alles war problemlos. Unser Guide war auch absolut unglaublich. Kann es kaum erwarten bis nächstes Jahr!",
      testimonial3:
        "Fantastischer Kundenservice. Super freundliches Team und keine Frage unbeantwortet und keine Bitte zu klein. Habe wirklich geschätzt, wie sie meine Familie während der gesamten Planungsphase koordiniert haben. Danke Peru Travel.",
      testimonial4:
        "Die Aufmerksamkeit für Details war unglaublich. Vom Moment unserer Landung bis zu unserer Abreise war alles perfekt organisiert. Die lokalen Erfahrungen, die sie arrangierten, waren authentisch und unvergesslich.",
      testimonial5:
        "Peru Travel machte unsere Flitterwochen absolut perfekt. Die romantischen Details, die sie während unserer Reise hinzufügten, machten sie so besonders. Wir fühlten uns bei jedem Schritt wirklich umsorgt.",
      testimonial6:
        "Profesional, sachkundig und wirklich leidenschaftlich für Reisen. Sie hörten auf unsere Bedürfnisse und erstellten eine Reiseroute, die unsere wildesten Träume übertraf. Sehr empfohlen!",
      testimonialName1: "Camila",
      testimonialName2: "Jeremy",
      testimonialName3: "Jamie",
      testimonialName4: "Sarah",
      testimonialName5: "Michael",
      testimonialName6: "Emma",
      // Contact Section
      enquireNow: "JETZT ANFRAGEN",
      startPlanningTitle: "Beginnen Sie mit der Planung Ihres maßgeschneiderten Urlaubs",
      speakToSpecialist: "Sprechen Sie mit einem unserer Reisespezialisten",
      enquireNowButton: "JETZT ANFRAGEN",
      callUsButton: "RUFEN SIE UNS AN",
      availableNow: "JETZT VERFÜGBAR",
      travelSpecialistAlt: "Reisespezialist",
      contactImageAlt: "Tourist in Cusco betrachtet koloniale Architektur",
      locale: "de-DE",
      // New keys for carousel header and dummy content
      carouselTitle: "Entdecken Sie unsere Transportziele.",
      carouselSubtitle:
        "Reisen Sie bequem durch die unglaublichsten Reiseziele Perus. Einzigartige Erlebnisse erwarten Sie.",
      tripDetails: "Reisedetails",
      priceUSD: "Preis (USD)",
      pricePEN: "Preis (PEN)",
      rating: "Bewertung",
      originCity: "Ursprungsstadt",
      destinationCity: "Zielstadt",
      hours: "Stunden",
      arrivalTime: "Ankunftszeit",
      // New keys for tours page
      peruToursTitle: "Touren in Peru",
      peruToursSubtitle: "Entdecken Sie die unglaublichsten Reiseziele in Peru",
      toursAvailable: "Touren verfügbar",
      searchToursPlaceholder: "Touren suchen...",
      filters: "Filter",
      searchFilters: "Suchfilter",
      allCategories: "Alle Kategorien",
      category: "Kategorie",
      difficulty: "Schwierigkeit",
      allDifficulties: "Alle Schwierigkeiten",
      packageType: "Pakettyp",
      allPackageTypes: "Alle Typen",
      region: "Region",
      regionPlaceholder: "Z.B.: Cusco, Lima, Arequipa...",
      location: "Ort",
      locationPlaceholder: "Z.B.: Machu Picchu, Iquitos...",
      clear: "Löschen",
      apply: "Anwenden",
      activeFilters: "Aktive Filter:",
      toursFoundSingular: "Tour gefunden",
      toursFoundPlural: "Touren gefunden",
      noToursAvailableTitle: "Keine Touren verfügbar",
      noToursAvailableMessage:
        "Wir konnten keine Touren finden, die Ihren Filtern entsprechen. Versuchen Sie, Ihre Suchkriterien anzupassen.",
      transport: "Transport",
      difficultyFacil: "Leicht",
      difficultyModerado: "Mittel",
      difficultyDificil: "Schwer",
      packageTypeBasico: "Basic",
      packageTypePremium: "Premium",
      errorLoadingToursMessage: "Fehler beim Laden der Touren. Bitte versuchen Sie es erneut.",
      previous: "Zurück",
      page: "Seite",
      next: "Weiter",
      featuredTour: "HERVORGEHOBEN",
      highlightedPlaces: "Hervorgehobene Orte:",
      allDays: "Alle Tage",
      notAvailable: "Nicht verfügbar",
      route: "Fahrplan",
      schedule: "Fahrplan",
      // New keys for footer
      inspiration: "INSPIRATION",
      whyUs: "WARUM WIR",
      journal: "JOURNAL",
      bookingConditions: "BUCHUNGSBEDINGUNGEN",
      travelInsurance: "REISEVERSICHERUNG",
      preDepartureInfo: "INFORMATIONEN VOR DER ABREISE",
      topPages: "TOP-SEITEN",
      safariHoneymoons: "SAFARI-HOCHZEITSREISEN",
      safariBeachHoneymoons: "SAFARI- & STRAND-HOCHZEITSREISEN",
      familySafaris: "FAMILIEN-SAFARIS",
      luxurySafaris: "LUXUS-SAFARIS",
      callUs: "RUFEN SIE UNS AN",
      emailUs: "SCHREIBEN SIE UNS EINE E-MAIL",
      // New keys for header
      discover: "ENTDECKEN",
      learn: "LERNEN",
      sustainability: "NACHHALTIGKEIT",
      howCanWeHelp: "Hallo! Wie können wir Ihnen helfen?",
      // New keys for ItinerariesPage
      peru: "Perus",
      itinerariesHeroSubtitle: "Sorgfältig entworfene Routen, um die unglaublichsten Schätze Perus zu entdecken",
      exploreItineraries: "REISEROUTEN ENTDECKEN",
      uniqueItineraries: "Einzigartige Reiserouten",
      yearsOfExperience: "Jahre Erfahrung",
      happyTravelers: "Zufriedene Reisende",
      averageRating: "Durchschnittliche Bewertung",
      chooseYourAdventure: "Wähle dein Abenteuer",
      chooseAdventureSubtitle:
        "Von Wochenendausflügen bis zu epischen Expeditionen haben wir die perfekte Reiseroute für Sie",
      shortDuration: "Kurze Dauer",
      mediumDuration: "Mittlere Dauer",
      longDuration: "Lange Dauer",
      from: "Ab",
      mainHighlights: "Haupt-Highlights:",
      plusMore: "+{count} mehr",
      group: "Gruppe",
      whyChooseOurItineraries: "Warum unsere Reiserouten wählen?",
      exclusiveRoutes: "Exklusive Routen",
      exclusiveRoutesDescription:
        "Einzigartige Reiserouten, entworfen von lokalen Experten mit Zugang zu besonderen Orten",
      smallGroups: "Kleine Gruppen",
      smallGroupsDescription: "Maximal 16 Personen für ein persönlicheres und intimeres Erlebnis",
      guaranteedQuality: "Garantierte Qualität",
      guaranteedQualityDescription: "Ausgewählte Hotels, zertifizierte Guides und erstklassige Dienstleistungen",
      totalFlexibility: "Totale Flexibilität",
      totalFlexibilityDescription: "Wir passen jede Reiseroute an Ihre Vorlieben und Bedürfnisse an",
      allInclusive: "All Inclusive",
      allInclusiveDescription: "Keine Überraschungen: Hotels, Transfers, Touren und viele Mahlzeiten inklusive",
      uniqueExperiences: "Einzigartige Erlebnisse",
      uniqueExperiencesDescription: "Exklusive Aktivitäten, die Sie bei anderen Anbietern nicht finden werden",
      readyForAdventure: "Bereit für Ihr peruanisches Abenteuer?",
      readyForAdventureSubtitle:
        "Unsere Experten sind bereit, die perfekte Reiseroute nach Ihren Träumen und Ihrem Budget zu gestalten",
      consultItinerary: "REISEROUTE ANFRAGEN",
      speakToExpert: "MIT EINEM EXPERTEN SPRECHEN",
      // New keys for AboutUsPage
      aboutHeroSubtitle:
        "Wir sind ein peruanisches Familienunternehmen, das sich der Schaffung authentischer und unvergesslicher Erlebnisse verschrieben hat, die Reisende mit der reichen Kultur, Geschichte und Natur Perus verbinden.",
      ourStoryButton: "UNSERE GESCHICHTE ERFAHREN",
      viewOurTeamButton: "UNSER TEAM ANSEHEN",
      discoverMore: "Mehr entdecken",
      ourAchievements: "Unsere Erfolge",
      achievementsSubtitle:
        "Zahlen, die unser Engagement für Exzellenz und die Zufriedenheit unserer Reisenden widerspiegeln.",
      creatingUnforgettableExperiences: "Unvergessliche Erlebnisse schaffen",
      fromOver50Countries: "Aus über 50 Ländern",
      throughoutPeru: "In ganz Peru",
      satisfaction: "Zufriedenheit",
      ourHistory: "Unsere Geschichte",
      historySubtitle:
        "Eine 15-jährige Reise, um unvergessliche Erlebnisse zu schaffen und Herzen mit Peru zu verbinden.",
      foundation: "Gründung",
      foundationDescription: "Carlos Mendoza gründet Inka Travel mit der Vision, das wahre Peru der Welt zu zeigen.",
      firstToursMachuPicchu: "Erste Touren nach Machu Picchu",
      firstOfficeCusco: "Erstes Büro in Cusco",
      fiveInitialTours: "5 erste Touren",
      teamOfThree: "Team von 3 Personen",
      expansion: "Expansion",
      expansionDescription: "Wir erweiterten unsere Dienstleistungen auf den Amazonas und die Nordküste Perus.",
      thousandTravelersServed: "1.000 Reisende betreut",
      newAmazonRoutes: "Neue Amazonas-Routen",
      officeInLima: "Büro in Lima",
      fifteenSpecializedGuides: "15 spezialisierte Guides",
      internationalCertification: "Internationale Zertifizierung",
      iataCertificationDescription: "International zertifiziertes Reisebüro",
      iataCertification: "IATA-Zertifizierung",
      officialRecognition: "Offizielle Anerkennung",
      fiveThousandSatisfiedClients: "5.000 zufriedene Kunden",
      sustainableTourismDescription:
        "Wir implementieren Programme für verantwortungsvollen Tourismus und ökologische Nachhaltigkeit.",
      sustainableCertification: "Nachhaltigkeitszertifizierung",
      ecoFriendlyPrograms: "Umweltfreundliche Programme",
      communityPartnerships: "Gemeinschaftspartnerschaften",
      greenCertification: "Grüne Zertifizierung",
      digitalInnovation: "Digitale Innovation",
      digitalInnovationDescription: "Anpassung an neue Technologien und Sicherheitsprotokolle nach der Pandemie.",
      digitalPlatform: "Digitale Plattform",
      virtualTours: "Virtuelle Touren",
      covidProtocols: "COVID-19-Protokolle",
      industryLeaders: "Branchenführer",
      industryLeadersDescription: "Als eine der besten Tourismusagenturen in Peru anerkannt.",
      tenThousandPlusHappyTravelers: "Über 10.000 zufriedene Reisende",
      marketLeader: "Marktführer",
      fiftyPlusDestinations: "Über 50 Reiseziele",
      ninetyEightPercentSatisfaction: "98% Zufriedenheit",
      whyChooseUsSubtitle: "Entdecken Sie die Gründe, die uns zur besten Wahl für Ihr peruanisches Abenteuer machen.",
      localExperience: "Lokale Erfahrung",
      localExperienceDescription:
        "15 Jahre tiefgreifende Erfahrung im peruanischen Tourismus mit spezialisierten einheimischen Guides.",
      responsibleTourism: "Verantwortungsvoller Tourismus",
      responsibleTourismDescription: "Engagiert für Nachhaltigkeit und den Nutzen lokaler Gemeinschaften.",
      personalizedAttention: "Personalisierte Betreuung",
      personalizedAttentionDescription:
        "Jede Reise ist einzigartig und speziell auf Ihre Interessen und Bedürfnisse zugeschnitten.",
      guaranteedSafety: "Garantierte Sicherheit",
      guaranteedSafetyDescription: "Strenge Sicherheitsprotokolle und spezialisierte Ausrüstung bei jeder Expedition.",
      support247: "24/7 Support",
      support247Description: "Umfassende Unterstützung vor, während und nach Ihrer Reise durch Peru.",
      bestPriceGuaranteed: "Bester Preis Garantiert",
      bestPriceGuaranteedDescription:
        "Wettbewerbsfähige Preise ohne Kompromisse bei der Qualität unserer Premium-Dienstleistungen.",
      ourValues: "Unsere Werte",
      ourValuesSubtitle:
        "Die Prinzipien, die jede Entscheidung und Handlung bei Inka Travel leiten und außergewöhnliche und verantwortungsvolle Erlebnisse gewährleisten.",
      authenticity: "Autentizität",
      authenticityDescription:
        "Echte Erlebnisse, die mit der lokalen Kultur und den alten Traditionen Perus verbinden.",
      sustainabilityValueDescription:
        "Verantwortungsvoller Tourismus, der die Umwelt schützt und lokalen Gemeinschaften zugutekommt.",
      excellence: "Exzellenz",
      excellenceDescription: "Höchste Qualitätsstandards in jedem Detail unserer Dienstleistungen und Erlebnisse.",
      safety: "Sicherheit",
      safetyDescription:
        "Strenge Protokolle und spezialisierte Ausrüstung, um die Sicherheit unserer Reisenden zu gewährleisten.",
      innovation: "Innovation",
      innovationDescription:
        "Wir verbessern unsere Dienstleistungen ständig durch die Integration neuer Technologien und Methoden.",
      passion: "Leidenschaft",
      passionDescription: "Echte Liebe zu Peru und absolute Hingabe, seine Wunder mit der Welt zu teilen.",
      teamSubtitle:
        "Lernen Sie die leidenschaftlichen Experten kennen, die jedes einzigartige Erlebnis in Peru ermöglichen.",
      founderCEO: "Gründer & CEO",
      operationsDirector: "Betriebsleiterin",
      headOfGuides: "Leiter der Guides",
      sustainabilityCoordinator: "Nachhaltigkeitskoordinatorin",
      carlosDescription:
        "Carlos, leidenschaftlich daran interessiert, die Schönheit Perus der Welt zu zeigen, gründete Inka Travel mit der Vision, authentische und unvergessliche Erlebnisse zu schaffen.",
      mariaDescription:
        "Als Expertin für Andenkultur und alte Traditionen sorgt María dafür, dass jede Reise ein authentisches kulturelles Eintauchen ist.",
      robertoDescription:
        "Als erfahrener Bergsteiger und Kenner der Anden leitet Roberto unser Team spezialisierter Guides.",
      anaDescription:
        "Als Biologin und Naturschützerin entwickelt Ana unsere Programme für nachhaltigen Tourismus und soziale Verantwortung.",
      spanish: "Spanisch",
      english: "Englisch",
      quechua: "Quechua",
      aymara: "Aymara",
      french: "Französisch",
      portuguese: "Portugiesisch",
      officialGuide: "Offizieller Guide",
      firstAid: "Erste Hilfe",
      sustainableTourism: "Nachhaltiger Tourismus",
      anthropologist: "Anthropologe",
      specializedGuide: "Spezialisierter Guide",
      culturalHeritage: "Kulturerbe",
      mountainGuide: "Bergführer",
      highAltitudeRescue: "Höhenrettung",
      wildernessFirstAid: "Wildnis-Erste-Hilfe",
      biologist: "Biologe",
      conservation: "Naturschutz",
      certificationsAndRecognitions: "Zertifizierungen und Auszeichnungen",
      certificationsSubtitle:
        "Unser Engagement für Exzellenz wird durch internationale Zertifizierungen und Branchenauszeichnungen untermauert.",
      iataDescription: "International zertifiziertes Reisebüro",
      sustainableTourismCertDescription: "Zertifiziert vom peruanischen Tourismusministerium",
      tripAdvisorExcellence: "TripAdvisor Exzellenz",
      tripAdvisorExcellenceDescription: "Exzellenzzertifikat für 5 aufeinanderfolgende Jahre",
      iso9001: "ISO 9001",
      iso9001Description: "Zertifiziertes Qualitätsmanagementsystem",
      whatOurTravelersSay: "Was unsere Reisenden sagen",
      travelerExperiencesSubtitle:
        "Die Erfahrungen unserer Reisenden sind unser größter Stolz und unsere Motivation, uns ständig zu verbessern.",
      unitedStates: "Vereinigte Staaten",
      germany: "Deutschland",
      japan: "Japan",
      testimonialText1:
        "Inka Travel hat unsere Reise nach Peru absolut magisch gemacht. Jedes Detail war perfekt geplant und unser Guide Carlos war unglaublich. Wir werden auf jeden Fall wiederkommen!",
      testimonialText2:
        "Das authentischste Reiseerlebnis, das ich je hatte. Das Inka Travel Team kennt Peru wirklich und lässt einen die Kultur auf einzigartige Weise spüren.",
      testimonialText3:
        "Außergewöhnliche Professionalität und Liebe zum Detail. Inka Travel hat alle unsere Erwartungen übertroffen. Der Amazonas war eine transformative Erfahrung.",
      machuPicchuSacredValley: "Machu Picchu & Heiliges Tal",
      classicIncaTrail: "Klassischer Inka-Pfad",
      amazonAdventure: "Amazonas-Abenteuer",
      readyForPeruvianAdventure: "Bereit für Ihr peruanisches Abenteuer?",
      callToActionSubtitle:
        "Schließen Sie sich Tausenden von Reisenden an, die uns vertraut haben, um die Wunder Perus zu entdecken. Ihr unvergessliches Abenteuer wartet auf Sie.",
      contactUs: "KONTAKTIEREN SIE UNS",
      uniqueDestinations: "Einzigartige Reiseziele",
      whyChooseUs: "Warum Uns Wählen",
      ourTeam: "Unser Team",
      planYourTrip: "REISE PLANEN",
      // When To Go Page specific translations
      whenToGoTitle: "Wann Reisen",
      whenToGoSubtitle:
        "Entdecken Sie die perfekte Zeit für jedes Reiseziel und erleben Sie das Abenteuer Ihres Lebens im Land der Incas",
      planYourTripButton: "PLANEN SIE IHRE REISE",
      daysOfAdventure: "Tage voller Abenteuer",
      climaticRegions: "Klimazonen",
      uniqueMonths: "Einzigartige Monate",
      incredibleDestinations: "Unglaubliche Reiseziele",
      exploreByCategory: "Nach Kategorie erkunden",
      chooseHowToPlan: "Wählen Sie, wie Sie Ihre perfekte Reise planen möchten",
      bySeasons: "Nach Jahreszeiten",
      monthByMonth: "Monat für Monat",
      byDestinations: "Nach Reisezielen",
      drySeason: "Trockenzeit",
      drySeasonMonths: "Mai - September",
      drySeasonDescription: "Die beste Zeit, um den größten Teil Perus zu besuchen",
      rainySeason: "Regenzeit",
      rainySeasonMonths: "Oktober - April",
      rainySeasonDescription: "Grüne Landschaften und weniger Touristen",
      climate: "Klima",
      temperature: "Temperatur",
      recommendedActivities: "Empfohlene Aktivitäten",
      whatToWear: "Was mitnehmen",
      coastRegion: "Küste",
      sierraRegion: "Sierra",
      jungleRegion: "Dschungel",
      sunnyAndDry: "Sonnig und trocken",
      dryAndCool: "Trocken und kühl",
      lessRain: "Weniger Regen",
      cloudyAndHumid: "Bewölkt und feucht",
      rainyWeather: "Regnerisch",
      veryRainy: "Sehr regnerisch",
      coastDryTemp: "18°C - 25°C",
      sierraDryTemp: "5°C - 20°C",
      jungleDryTemp: "22°C - 32°C",
      coastDryDescription: "Klarer Himmel, ideal für Outdoor-Aktivitäten",
      sierraDryDescription: "Sonnige Tage, kalte Nächte, perfekt zum Trekking",
      jungleDryDescription: "Weniger Niederschlag, besser für die Navigation",
      beaches: "Strände",
      waterSports: "Wassersport",
      coastalHiking: "Küstenwanderungen",
      machuPicchuActivity: "Machu Picchu",
      incaTrailActivity: "Inka-Pfad",
      cityToursActivity: "Stadtrundfahrten",
      amazonSafari: "Amazonas-Safari",
      wildlifeObservation: "Tierbeobachtung",
      navigation: "Navigation",
      lightClothing: "Leichte Kleidung",
      sunscreen: "Sonnenschutz",
      hat: "Hut",
      layersOfClothing: "Kleidungsschichten",
      warmJacket: "Warme Jacke",
      trekkingShoes: "Trekkingschuhe",
      repellent: "Insektenschutzmittel",
      waterproofBoots: "Wasserdichte Stiefel",
      romanticAtmosphere: "Lima-Nieselregen, romantische Atmosphäre",
      museums: "Museen",
      gastronomy: "Gastronomie",
      nightlife: "Nachtleben",
      warmClothing: "Warme Kleidung",
      lightJacket: "Leichte Jacke",
      umbrella: "Regenschirm",
      greenLandscapes: "Grüne Landschaften",
      difficultTrails: "Schwierige Wanderwege",
      colonialCities: "Kolonialstädte",
      markets: "Märkte",
      waterproofClothing: "Wasserdichte Kleidung",
      highBoots: "Hohe Stiefel",
      poncho: "Poncho",
      highRivers: "Hohe Flüsse",
      lushVegetation: "Üppige Vegetation",
      lodges: "Lodges",
      birdWatching: "Vogelbeobachtung",
      fishing: "Angeln",
      climateMonthByMonth: "Klima Monat für Monat",
      detailedClimateInfo:
        "Detaillierte Klimainformationen für jede Region Perus das ganze Jahr über, um Ihre perfekte Reise zu planen.",
      popularity: "Beliebtheit",
      tourismLevel: "Tourismusniveau",
      advantages: "Vorteile",
      consider: "Zu beachten",
      january: "Januar",
      february: "Februar",
      march: "März",
      april: "April",
      may: "Mai",
      june: "Juni",
      july: "Juli",
      august: "August",
      september: "September",
      october: "Oktober",
      november: "November",
      december: "Dezember",
      transitionSeason: "Übergang",
      lowRain: "Niedrig",
      highRain: "Hoch",
      veryHighRain: "Sehr hoch",
      lessTourists: "Weniger Touristen",
      lowPrices: "Niedrige Preise",
      incaTrailClosed: "Inka-Pfad geschlossen",
      possibleFloods: "Mögliche Überschwemmungen",
      endOfRains: "Ende der Regenzeit",
      muddyTrails: "Schlammige Wege",
      goodWeather: "Gutes Wetter",
      unpredictableWeather: "Unvorhersehbares Wetter",
      startDrySeason: "Beginn der Trockenzeit",
      excellentClimate: "Ausgezeichnetes Klima",
      incaTrailOpen: "Inka-Pfad geöffnet",
      moreTourists: "Mehr Touristen",
      bestClimate: "Bestes Klima",
      intiRaymi: "Inti Raymi",
      clearSkies: "Klarer Himmel",
      crowds: "Menschenmassen",
      highPrices: "Hohe Preise",
      peakSeason: "Hochsaison",
      perfectClimate: "Perfektes Klima",
      reservationsNeeded: "Reservierungen erforderlich",
      strongWindsSierra: "Starke Winde in der Sierra",
      mountainWinds: "Bergwinde",
      endDrySeason: "Ende der Trockenzeit",
      occasionalWinds: "Gelegentliche Winde",
      startRains: "Beginn der Regenzeit",
      changingLandscapes: "Wechselnde Landschaften",
      christmasHolidays: "Weihnachtsferien",
      frequentRains: "Häufige Regenfälle",
      bestTimeToVisitByDestination: "Beste Reisezeit nach Reiseziel",
      eachDestinationIdealTime:
        "Jedes Reiseziel in Peru hat seine ideale Zeit. Entdecken Sie, wann Sie jeden Ort besuchen sollten, um das beste Erlebnis zu haben.",
      bestMonthsToVisit: "Beste Monate für einen Besuch",
      monthsToAvoid: "Zu vermeidende Monate",
      expertTips: "Expertentipps",
      machuPicchuDestination: "Machu Picchu",
      amazonDestination: "Amazonas",
      colcaCanyonDestination: "Colca Canyon",
      nazcaLinesDestination: "Nazca-Linien",
      lakeTiticacaDestination: "Titicacasee",
      northCoastDestination: "Nordküste",
      machuPicchuDescription: "Die Inka-Zitadelle wird am besten während der Trockenzeit besucht",
      amazonDescription: "Bessere Navigation und Tierbeobachtung in der Trockenzeit",
      colcaCanyonDescription: "Ideal zur Beobachtung von Kondoren und zum Trekking",
      nazcaLinesDescription: "Die Wüste bietet das ganze Jahr über stabile Bedingungen",
      lakeTiticacaDescription: "Klarer Himmel, um die schwimmenden Inseln zu genießen",
      northCoastDescription: "Warme Strände während des Küstensommers",
      book3_4MonthsAhead: "3-4 Monate im Voraus buchen",
      incaTrailClosesFeb: "Inka-Pfad schließt im Februar",
      wearWarmClothesMornings: "Warme Kleidung für die Morgenstunden mitnehmen",
      lowerRiversEasierNavigation: "Niedrigere Flüsse erleichtern die Navigation",
      higherAnimalConcentration: "Höhere Tierkonzentration",
      lessMosquitoesDrySeason: "Weniger Mücken in der Trockenzeit",
      condorsMoreActiveMorning: "Kondore morgens aktiver",
      avoidRainySeasonTrekking: "Regenzeit für Trekking vermeiden",
      flightsCanceledStrongWinds: "Flüge können wegen starker Winde annulliert werden",
      betterVisibilityMornings: "Bessere Sicht am Morgen",
      wearSunscreen: "Sonnenschutzmittel mitnehmen",
      veryColdNightsDrySeason: "Sehr kalte Nächte in der Trockenzeit",
      sunProtectionAltitude: "Sonnenschutz wegen der Höhe",
      beachSeasonSummer: "Strandsaison im Sommer",
      avoidCoastalWinter: "Küstenwinter vermeiden",
      idealWaterSports: "Ideal für Wassersport",
      allYear: "Ganzjährig",
      visitors: "Besucher",
      whyPlanWithUs: "Warum mit uns planen?",
      ourExperienceGuarantees:
        "Unsere Erfahrung und lokales Wissen garantieren Ihnen die perfekte Reise zu jeder Jahreszeit",
      localExperts: "Lokale Experten",
      localExpertsDescription: "Zertifizierte Guides mit über 10 Jahren Erfahrung in jeder Region Perus",
      perfectPlanning: "Perfekte Planung",
      perfectPlanningDescription: "Wir helfen Ihnen, die besten Termine nach Ihren Interessen und Vorlieben zu wählen",
      guaranteedClimate: "Garantiertes Klima",
      guaranteedClimateDescription: "Wir überwachen die Wetterbedingungen, um Ihr bestes Erlebnis zu gewährleisten",
      optimizedRoutes: "Optimierte Routen",
      optimizedRoutesDescription:
        "Reiserouten, die darauf ausgelegt sind, jedes Ziel zur besten Zeit optimal zu nutzen",
      uniqueMoments: "Einzigartige Momente",
      uniqueMomentsDescription: "Fangen Sie die besten Momente mit idealen Wetter- und Lichtverhältnissen ein",
      yourPerfectAdventure: "Ihr perfektes Abenteuer",
      isWaitingForYou: "wartet auf Sie",
      nowThatYouKnow:
        "Nachdem Sie nun wissen, wann Sie reisen sollten, ist es an der Zeit, Ihre Träume Wirklichkeit werden zu lassen. Unsere Experten sind bereit, Ihr einzigartiges Erlebnis zu gestalten.",
      bookNow: "JETZT BUCHEN",
      freeConsultation: "KOSTENLOSE BERATUNG",
      // New keys for TourDetailPage tabs
      itinerary: "Reiseroute",
      bring: "Was mitnehmen",
      conditions: "Bedingungen",
      processingPayment: "Zahlung wird verarbeitet...",
      errorProcessingPayment: "Fehler bei der Zahlungsabwicklung. Bitte versuchen Sie es erneut.",
    completeYourPayment: "Schließen Sie Ihre Zahlung ab",
    loadingPaymentForm: "Zahlungsformular wird geladen...",
    },
  }
  // Obtener traducciones actuales
  const t = translations[language]
  const value: LanguageContextType = {
    language,
    setLanguage,
    t,
    isLoading,
  }
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

// Hook para usar el contexto
export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
