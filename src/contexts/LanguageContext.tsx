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
  readonly back: string
  readonly next: string
  readonly previous: string
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
  readonly upload_: string
  readonly download_: string
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
}

// Traducciones para cada idioma
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
    back: "ATRÁS",
    next: "SIGUIENTE",
    previous: "ANTERIOR",
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
    upload_: "SUBIR",
    download_: "DESCARGAR",
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
    aboutDescription: "Peru Travel es una empresa de viajes de lujo galardonada que se especializa en viajes a medida, lunas de miel y vacaciones familiares por Perú, América del Sur y más allá.",
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
tailorMadeDescription: "Cada viaje está diseñado únicamente para ti, adaptándose a tus preferencias personales, intereses y estilo de viaje. Nuestro equipo experto crea itinerarios personalizados que generan experiencias inolvidables.",
tailorMadeButton: "PLANIFICA TU VIAJE",
expertGuidesTitle: "Guías Expertos",
expertGuidesDescription: "Nuestros guías locales cuidadosamente seleccionados dan vida a los destinos con su profundo conocimiento, pasión y acceso exclusivo. Experimenta conexiones culturales auténticas y gemas ocultas que solo los locales conocen.",
expertGuidesButton: "CONOCE NUESTROS GUÍAS",
pricePromiseTitle: "Garantía de Precio",
pricePromiseDescription: "Garantizamos precios transparentes sin costos ocultos. Si encuentras un viaje comparable a un precio menor, lo igualamos. Tu inversión va directamente a crear experiencias de viaje excepcionales.",
pricePromiseButton: "VER PRECIOS",
familyOperatedTitle: "Empresa Familiar",
familyOperatedDescription: "Como empresa familiar, brindamos cuidado personal y atención a cada detalle de tu viaje. Nuestro compromiso con la excelencia abarca generaciones, asegurando un servicio auténtico y cordial.",
familyOperatedButton: "NUESTRA HISTORIA",
carbonOffsetTitle: "Compensación de Carbono",
carbonOffsetDescription: "Estamos comprometidos con el turismo responsable. Cada viaje incluye iniciativas de compensación de carbono, apoyando proyectos de reforestación y programas de energía renovable para minimizar el impacto ambiental.",
carbonOffsetButton: "SOSTENIBILIDAD",
charityCommitmentTitle: "Compromiso Benéfico",
charityCommitmentDescription: "Nos enorgullece ser el socio oficial de viajes de la Fundación ForRangers, apoyando sus esfuerzos críticos de conservación y protegiendo la vida silvestre en peligro de extinción.",
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
  } as const,
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
    refresh: "REFRESH",
    reload: "RELOAD",
    back: "BACK",
    next: "NEXT",
    previous: "PREVIOUS",
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
    restored: "RESTORED",
    backup: "BACKUP",
    restore: "RESTORE",
    sync: "SYNC",
    upload_: "UPLOAD",
    download_: "DOWNLOAD",
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
    departures: "DEPARTURES",
    regularPrice: "REGULAR PRICE",
    viewDetails: "VIEW DETAILS",
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
  aboutDescription: "Peru Travel is an award-winning luxury travel company specializing in tailor-made trips, honeymoons, and family holidays throughout Peru, South America, and beyond.",
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
tailorMadeDescription: "Each trip is uniquely designed for you, tailored to your personal preferences, interests, and travel style. Our expert team creates personalized itineraries that deliver unforgettable experiences.",
tailorMadeButton: "PLAN YOUR TRIP",
expertGuidesTitle: "Expert Guides",
expertGuidesDescription: "Our carefully selected local guides bring destinations to life with deep knowledge, passion, and exclusive access. Experience authentic cultural connections and hidden gems only locals know.",
expertGuidesButton: "MEET OUR GUIDES",
pricePromiseTitle: "Price Promise",
pricePromiseDescription: "We guarantee transparent pricing with no hidden fees. If you find a comparable trip at a lower price, we’ll match it. Your investment goes directly into creating exceptional travel experiences.",
pricePromiseButton: "VIEW PRICING",
familyOperatedTitle: "Family Operated",
familyOperatedDescription: "As a family-run company, we provide personal care and attention to every detail of your trip. Our commitment to excellence spans generations, ensuring genuine and warm service.",
familyOperatedButton: "OUR STORY",
carbonOffsetTitle: "Carbon Offset",
carbonOffsetDescription: "We are committed to responsible tourism. Each trip includes carbon offset initiatives, supporting reforestation projects and renewable energy programs to minimize environmental impact.",
carbonOffsetButton: "SUSTAINABILITY",
charityCommitmentTitle: "Charity Commitment",
charityCommitmentDescription: "We are proud to be the official travel partner of the ForRangers Foundation, supporting critical conservation efforts and protecting endangered wildlife.",
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
    locale: "fr-FR",
  } as const,
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
    back: "RETOUR",
    next: "SUIVANT",
    previous: "PRÉCÉDENT",
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
    permission: "PERMISSION",
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
    upload_: "TÉLÉVERSER",
    download_: "TÉLÉCHARGER",
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
    notification: "NOTIFICATION",
    alert: "ALERTE",
    warning: "AVERTISSEMENT",
    info: "INFO",
    success: "SUCCÈS",
    danger: "DANGER",
    primary: "PRIMAIRE",
    secondary: "SECONDAIRE",
    light: "CLAIR",
    dark: "SOMBRE",
    muted: "MUET",
    accent: "ACCENT",
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
    schedulesAndAvailability: "Horaires et Disponibilité",
    departureTime: "Heure de Départ",
    arriveEarly: "Nous recommandons d'arriver 15 minutes à l'avance",
    availableDays: "Jours Disponibles",
    regularDepartures: "Départs réguliers toute l'année",
    includes: "Inclus",
    notIncludes: "Non Inclus",
    selectAvailableDate: "Sélectionnez une date disponible",
    numberOfPassengers: "Nombre de passagers",
    passenger: "passager",
    passengers: "passagers",
    totalToPay: "Total à payer:",
    perPerson: "par personne",
    reserveNow: "Réserver Maintenant",
    consultWhatsApp: "Consulter via WhatsApp",
    callNow: "Appeler Maintenant",
    passengerInfo: "Informations Passager",
    fullName: "Nom Complet",
    nationality: "Nationalité",
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
    aboutDescription: "Peru Travel est une agence de voyages de luxe primée, spécialisée dans les voyages sur mesure, les lunes de miel et les vacances en famille à travers le Pérou, l’Amérique du Sud et au-delà.",
  atolTitle: "ATOL",
  atolSubtitle: "N° 12034",
  zeroTitle: "ZÉRO",
  zeroSubtitle: "FRAIS SUPPLÉMENTAIRES",
  carbonTitle: "100%",
  carbonSubtitle: "COMPENSATION CARBONE",
  //discoverySection
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
ourServicesSubtitle: "Itinéraires sur mesure créés par nos experts",
tailorMadeTab: "SUR MESURE",
expertGuidesTab: "GUIDES EXPERTS",
pricePromiseTab: "GARANTIE PRIX",
familyOperatedTab: "ENTREPRISE FAMILIALE",
carbonOffsetTab: "COMPENSATION CARBONE",
charityCommitmentTab: "ENGAGEMENT CARITATIF",
tailorMadeTitle: "Voyages sur Mesure",
tailorMadeDescription: "Chaque voyage est conçu uniquement pour vous, selon vos préférences personnelles, vos intérêts et votre style. Notre équipe experte crée des itinéraires personnalisés pour des expériences inoubliables.",
tailorMadeButton: "PLANIFIEZ VOTRE VOYAGE",
expertGuidesTitle: "Guides Experts",
expertGuidesDescription: "Nos guides locaux soigneusement sélectionnés donnent vie aux destinations grâce à leur connaissance approfondie, leur passion et leur accès exclusif. Découvrez des connexions culturelles authentiques et des joyaux cachés.",
expertGuidesButton: "RENCONTREZ NOS GUIDES",
pricePromiseTitle: "Garantie de Prix",
pricePromiseDescription: "Nous garantissons des prix transparents sans frais cachés. Si vous trouvez un voyage similaire à un prix inférieur, nous l’égalons. Votre investissement va directement à la création d’expériences exceptionnelles.",
pricePromiseButton: "VOIR LES PRIX",
familyOperatedTitle: "Entreprise Familiale",
familyOperatedDescription: "En tant qu’entreprise familiale, nous offrons un soin personnel et une attention à chaque détail de votre voyage. Notre engagement envers l’excellence se transmet depuis des générations.",
familyOperatedButton: "NOTRE HISTOIRE",
carbonOffsetTitle: "Compensation Carbone",
carbonOffsetDescription: "Nous nous engageons pour un tourisme responsable. Chaque voyage comprend des initiatives de compensation carbone, soutenant des projets de reforestation et des programmes d’énergie renouvelable.",
carbonOffsetButton: "DÉVELOPPEMENT DURABLE",
charityCommitmentTitle: "Engagement Caritatif",
charityCommitmentDescription: "Nous sommes fiers d’être le partenaire officiel de la fondation ForRangers, soutenant leurs efforts de conservation et la protection des espèces en voie de disparition.",
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
      "Professionnel, compétent et véritablement passionné par les voyages. Ils ont écouté nos besoins et créé un itinéraire qui dépassait nos rêves les plus fous. Hautement recommandé!",
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
  } as const,
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
    back: "ZURÜCK",
    next: "WEITER",
    previous: "VORHERIGE",
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
    optional: "OPTIONAL",
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
    published: "VERÖFFENTLICHT",
    archived: "ARCHIVIERT",
    deleted: "GELÖSCHT",
    restored: "WIEDERHERGESTELLT",
    backup: "SICHERUNG",
    restore: "WIEDERHERSTELLEN",
    sync: "SYNCHRONISIEREN",
    upload_: "HOCHLADEN",
    download_: "HERUNTERLADEN",
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
    alert: "WARNUNG",
    warning: "WARNUNG",
    info: "INFO",
    success: "ERFOLG",
    danger: "GEFAHR",
    primary: "PRIMÄR",
    secondary: "SEKUNDÄR",
    light: "HELL",
    dark: "DUNKEL",
    muted: "STUMM",
    accent: "AKZENT",
    background: "HINTERGRUND",
    foreground: "VORDERGRUND",
    border: "RAND",
    input: "EINGABE",
    ring: "RING",
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
    perPerson: "pro Person",
    reserveNow: "Jetzt Reservieren",
    consultWhatsApp: "Über WhatsApp konsultieren",
    callNow: "Jetzt Anrufen",
    passengerInfo: "Passagier-Informationen",
    fullName: "Vollständiger Name",
    nationality: "Nationalität",
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
    aboutDescription: "Peru Travel ist ein preisgekröntes Luxusreiseunternehmen, das sich auf maßgeschneiderte Reisen, Flitterwochen und Familienurlaube in Peru, Südamerika und darüber hinaus spezialisiert hat.",
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
tailorMadeDescription: "Jede Reise wird individuell für dich entworfen – angepasst an deine Vorlieben, Interessen und deinen Reisestil. Unser Expertenteam erstellt personalisierte Reiserouten für unvergessliche Erlebnisse.",
tailorMadeButton: "REISE PLANEN",
expertGuidesTitle: "Experten-Guides",
expertGuidesDescription: "Unsere sorgfältig ausgewählten lokalen Guides erwecken Reiseziele mit ihrem Wissen, ihrer Leidenschaft und exklusivem Zugang zum Leben. Erlebe authentische kulturelle Begegnungen und versteckte Juwelen.",
expertGuidesButton: "UNSERE GUIDES TREFFEN",
pricePromiseTitle: "Preisgarantie",
pricePromiseDescription: "Wir garantieren transparente Preise ohne versteckte Gebühren. Wenn du eine vergleichbare Reise günstiger findest, gleichen wir den Preis an. Deine Investition fließt direkt in außergewöhnliche Erlebnisse.",
pricePromiseButton: "PREISE ANZEIGEN",
familyOperatedTitle: "Familienunternehmen",
familyOperatedDescription: "Als Familienunternehmen bieten wir persönliche Betreuung und achten auf jedes Detail deiner Reise. Unser Engagement für Qualität reicht über Generationen hinweg.",
familyOperatedButton: "UNSERE GESCHICHTE",
carbonOffsetTitle: "CO₂-Kompensation",
carbonOffsetDescription: "Wir setzen auf verantwortungsvollen Tourismus. Jede Reise beinhaltet CO₂-Kompensationsmaßnahmen durch Aufforstungsprojekte und erneuerbare Energieprogramme.",
carbonOffsetButton: "NACHHALTIGKEIT",
charityCommitmentTitle: "Wohltätiges Engagement",
charityCommitmentDescription: "Wir sind stolzer offizieller Reisepartner der ForRangers-Stiftung, die wichtige Naturschutzarbeit leistet und bedrohte Tierarten schützt.",
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
      "Professionell, sachkundig und wirklich leidenschaftlich für Reisen. Sie hörten auf unsere Bedürfnisse und erstellten eine Reiseroute, die unsere wildesten Träume übertraf. Sehr empfehlenswert!",
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
  } as const,
}

// Información de idioma  s con banderas y nombres nativos
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
