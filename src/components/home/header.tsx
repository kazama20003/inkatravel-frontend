"use client"
import Link from "next/link"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Menu, X, Search, ChevronDown, MessageCircle, Calendar, LogIn } from "lucide-react"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion"
import clsx from "clsx"
import { useLanguage } from "@/contexts/LanguageContext"

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [activeMenu, setActiveMenu] = useState<number | null>(null)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isLanguageOpen, setIsLanguageOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  const pathname = usePathname()
  const router = useRouter()
  const { language, setLanguage } = useLanguage()

  const { scrollY } = useScroll()
  const headerY = useTransform(scrollY, [0, 100], [0, -10])
  const headerOpacity = useTransform(scrollY, [0, 50, 100], [1, 0.95, 0.9])
  const headerScale = useTransform(scrollY, [0, 100], [1, 0.98])
  const headerBlur = useTransform(scrollY, [0, 100], [0, 20])

  const navItems = [
    {
      label:
        language === "es"
          ? "Inicio"
          : language === "en"
            ? "Home"
            : language === "fr"
              ? "Accueil"
              : language === "de"
                ? "Startseite"
                : "Inizio",
      href: "/",
    },
    {
      label:
        language === "es"
          ? "Destinos"
          : language === "en"
            ? "Destinations"
            : language === "fr"
              ? "Destinations"
              : language === "de"
                ? "Reiseziele"
                : "Destinazioni",
      href: "/destinations",
      submenu: [
        {
          title: "Cusco",
          description: "Capital histórica del Imperio Inca",
          countries: ["Machu Picchu", "Valle Sagrado", "Pisac", "Ollantaytambo"],
        },
        {
          title: "Arequipa",
          description: "La ciudad blanca del sur",
          countries: ["Cañón del Colca", "Monasterio de Santa Catalina", "Volcán Misti"],
        },
        {
          title: "Lima",
          description: "Capital gastronómica de América",
          countries: ["Centro Histórico", "Miraflores", "Barranco", "Callao"],
        },
        {
          title: "Amazonía",
          description: "Selva peruana y biodiversidad",
          countries: ["Iquitos", "Puerto Maldonado", "Manu", "Tambopata"],
        },
      ],
    },
    {
      label:
        language === "es"
          ? "Tours"
          : language === "en"
            ? "Tours"
            : language === "fr"
              ? "Circuits"
              : language === "de"
                ? "Touren"
                : "Tour",
      href: "/tours",
      submenu: [
        {
          title: "Tours Clásicos",
          description: "Experiencias tradicionales del Perú",
          countries: ["Machu Picchu Clásico", "City Tour Cusco", "Valle Sagrado"],
        },
        {
          title: "Tours de Aventura",
          description: "Para los más aventureros",
          countries: ["Camino Inca", "Salkantay Trek", "Choquequirao"],
        },
        {
          title: "Tours Culturales",
          description: "Sumérgete en la cultura peruana",
          countries: ["Comunidades Andinas", "Textiles Tradicionales", "Gastronomía"],
        },
        {
          title: "Tours Gastronómicos",
          description: "Descubre la cocina peruana",
          countries: ["Lima Gourmet", "Mercados Locales", "Cooking Class"],
        },
      ],
    },
    {
      label:
        language === "es"
          ? "Transportes"
          : language === "en"
            ? "Transport"
            : language === "fr"
              ? "Transport"
              : language === "de"
                ? "Transport"
                : "Trasporti",
      href: "/transport",
      submenu: [
        {
          title: "Bus Turístico",
          description: "Transporte cómodo y seguro",
          countries: ["Cusco-Machu Picchu", "Lima-Paracas", "Arequipa-Colca"],
        },
        {
          title: "Tren Panorámico",
          description: "Experiencia panorámica única",
          countries: ["Hiram Bingham", "Vistadome", "Expedition"],
        },
        {
          title: "Transfers Privados",
          description: "Servicio exclusivo",
          countries: ["Aeropuerto", "Hoteles", "Estaciones"],
        },
      ],
    },
    {
      label:
        language === "es"
          ? "Cuándo Ir"
          : language === "en"
            ? "When to Go"
            : language === "fr"
              ? "Quand Partir"
              : language === "de"
                ? "Wann Reisen"
                : "Quando Andare",
      href: "/when-to-go",
    },
    {
      label:
        language === "es"
          ? "Nosotros"
          : language === "en"
            ? "About Us"
            : language === "fr"
              ? "À Propos"
              : language === "de"
                ? "Über Uns"
                : "Chi Siamo",
      href: "/about-us",
    },
  ]

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleMenuEnter = (index: number) => {
    setActiveMenu(index)
  }

  const handleMenuLeave = () => {
    setActiveMenu(null)
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  const languages = [
    {
      code: "ES",
      name: "Español",
      flag: "https://res.cloudinary.com/dwvikvjrq/image/upload/v1753815963/Flag_of_Peru__281825_E2_80_931884_29_b7d2jf.svg",
      locale: "es",
      path: "/",
    },
    {
      code: "EN",
      name: "English",
      flag: "https://res.cloudinary.com/dwvikvjrq/image/upload/v1753815974/Englis_ktl98f.png",
      locale: "en",
      path: "/en",
    },
    {
      code: "FR",
      name: "Français",
      flag: "https://res.cloudinary.com/dwvikvjrq/image/upload/v1759108218/flag-of-france-1447582035olj_eybxbt.jpg",
      locale: "fr",
      path: "/fr",
    },
    {
      code: "DE",
      name: "Deutsch",
      flag: "https://res.cloudinary.com/dwvikvjrq/image/upload/v1753816030/250px-Flag_of_Germany.svg_xry8ba.png",
      locale: "de",
      path: "/de",
    },
    {
      code: "IT",
      name: "Italiano",
      flag: "https://res.cloudinary.com/dwvikvjrq/image/upload/v1753816016/66d81ab725414fff42aeefdf5fc79aa8-icono-de-idioma-de-la-bandera-de-italia_xhqtgc.png",
      locale: "it",
      path: "/it",
    },
  ]

  const showNotification = (message: string, type: "success" | "error" | "info" = "info") => {
    if (typeof window === "undefined") return
    const notification = document.createElement("div")
    const bgColor = type === "success" ? "bg-green-600" : type === "error" ? "bg-red-600" : "bg-orange-600"
    notification.className = `fixed top-24 right-4 ${bgColor} text-white px-4 py-3 rounded-lg shadow-lg z-[100] font-bold text-sm max-w-sm animate-in slide-in-from-right duration-300`
    notification.textContent = message
    document.body.appendChild(notification)
    setTimeout(() => {
      notification.classList.add("animate-out", "slide-out-to-right")
      setTimeout(() => notification.remove(), 300)
    }, 4000)
  }

  const handleLanguageChange = (newLanguage: string) => {
    const targetLang = languages.find((lang) => lang.code === newLanguage)
    if (!targetLang) return

    setLanguage(targetLang.locale as "es" | "en" | "fr" | "de" | "it")
    showNotification(`🌐 Idioma cambiado a ${targetLang.name}`, "success")
    setIsLanguageOpen(false)

    // Remove any existing language prefix from current path
    const currentPath = pathname.replace(/^\/(?:es|en|fr|de|it)(?=\/|$)/, "") || "/"

    // Construct new path with proper language prefix
    let newPath: string
    if (targetLang.locale === "es") {
      // Spanish is the default, no prefix needed
      newPath = currentPath === "/" ? "/" : currentPath
    } else {
      // Other languages need prefix
      newPath = `/${targetLang.locale}${currentPath === "/" ? "" : currentPath}`
    }

    router.push(newPath)
  }

  const getCurrentLanguageCode = () => {
    const langMap: Record<string, string> = { es: "ES", en: "EN", fr: "FR", de: "DE", it: "IT" }
    return langMap[language] || "ES"
  }

  const isActivePage = (href: string) => {
    const cleanPathname = pathname.replace(/^\/?(es|en|fr|de|it)/, "") || "/"
    const cleanHref = href === "/" ? "/" : href
    return cleanPathname === cleanHref || (cleanHref !== "/" && cleanPathname.startsWith(cleanHref))
  }

  return (
    <>
      <AnimatePresence>
        {activeMenu !== null && navItems[activeMenu].submenu && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[45]"
            onClick={handleMenuLeave}
          />
        )}
      </AnimatePresence>

      <motion.header
        style={{
          y: headerY,
          opacity: headerOpacity,
          scale: headerScale,
        }}
        className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-7xl pointer-events-none"
      >
        <motion.div
          style={{
            backdropFilter: `blur(${headerBlur}px)`,
          }}
          animate={{
            backgroundColor: scrolled ? "rgba(255, 255, 255, 0.95)" : "rgba(255, 255, 255, 0.9)",
            borderColor: scrolled ? "rgba(0, 0, 0, 0.1)" : "rgba(0, 0, 0, 0.05)",
          }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="bg-white/90 backdrop-blur-xl rounded-full border border-gray-200/50 shadow-lg hover:shadow-xl transition-all duration-500 pointer-events-auto"
          onMouseLeave={handleMenuLeave}
        >
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <motion.div whileHover={{ scale: 1.02 }} className="flex items-center gap-3">
                <Link href="/" className="flex items-center gap-3">
                  <div className="relative w-10 h-10 flex-shrink-0">
                    <Image
                      src="https://res.cloudinary.com/dwvikvjrq/image/upload/v1758308769/ChatGPT_Image_1_jul_2025__15_21_51-removebg-preview_1_zi4adi.png"
                      alt="Inca Travel Peru Logo"
                      fill
                      className="object-contain rounded-full"
                      priority
                    />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-gray-900 text-lg font-bold leading-tight">INCA TRAVEL</span>
                    <span className="text-gray-600 text-xs font-medium -mt-1">PERU</span>
                  </div>
                </Link>
              </motion.div>

              <nav className="hidden lg:flex items-center gap-1 bg-gray-50/60 rounded-full px-2 py-1">
                {navItems.map((item, i) => (
                  <div key={i} className="relative" onMouseEnter={() => handleMenuEnter(i)}>
                    <Link
                      href={item.href}
                      className={clsx(
                        "flex items-center gap-1 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300",
                        activeMenu === i || isActivePage(item.href)
                          ? "bg-white text-gray-900 shadow-md"
                          : "text-gray-600 hover:text-gray-900 hover:bg-white/70",
                      )}
                    >
                      {item.label}
                      {item.submenu && (
                        <motion.div animate={{ rotate: activeMenu === i ? 180 : 0 }} transition={{ duration: 0.2 }}>
                          <ChevronDown size={12} />
                        </motion.div>
                      )}
                    </Link>
                  </div>
                ))}
              </nav>

              <div className="flex items-center gap-3">
                <div className="relative hidden md:block">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsLanguageOpen(!isLanguageOpen)}
                    className="flex items-center gap-1 px-3 py-2 rounded-full bg-gray-50/60 text-gray-600 hover:text-gray-900 hover:bg-white/70 transition-all duration-300 text-sm font-medium"
                  >
                    {getCurrentLanguageCode()}
                    <ChevronDown className="w-3 h-3" />
                  </motion.button>

                  <AnimatePresence>
                    {isLanguageOpen && (
                      <>
                        <div className="fixed inset-0 z-[60]" onClick={() => setIsLanguageOpen(false)} />
                        <motion.div
                          initial={{ opacity: 0, y: -10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -10, scale: 0.95 }}
                          transition={{ duration: 0.2 }}
                          className="absolute top-full right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-200 min-w-40 z-[70] overflow-hidden"
                        >
                          {languages.map((lang) => (
                            <motion.button
                              key={lang.code}
                              whileHover={{ backgroundColor: "#f9fafb" }}
                              whileTap={{ scale: 0.95 }}
                              onClick={(e) => {
                                e.stopPropagation()
                                handleLanguageChange(lang.code)
                              }}
                              className={clsx(
                                "flex items-center gap-3 px-4 py-3 w-full text-left transition-colors text-sm",
                                getCurrentLanguageCode() === lang.code
                                  ? "bg-gray-50 text-gray-900 font-medium"
                                  : "text-gray-600 hover:bg-gray-50",
                              )}
                            >
                              <div className="w-5 h-4 relative flex-shrink-0 rounded-sm overflow-hidden">
                                <Image
                                  src={lang.flag || "/placeholder.svg"}
                                  alt={`${lang.name} flag`}
                                  fill
                                  className="object-cover"
                                  sizes="20px"
                                />
                              </div>
                              <span>{lang.name}</span>
                            </motion.button>
                          ))}
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>

                <Link href="/login">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500 text-white hover:bg-orange-600 transition-all duration-300 text-sm font-medium shadow-md hover:shadow-lg"
                  >
                    <LogIn className="w-4 h-4" />
                    {language === "es"
                      ? "Iniciar Sesión"
                      : language === "en"
                        ? "Login"
                        : language === "fr"
                          ? "Connexion"
                          : language === "de"
                            ? "Anmelden"
                            : "Accedi"}
                  </motion.button>
                </Link>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsSearchOpen(!isSearchOpen)}
                  className="p-2 rounded-full bg-gray-50/60 text-gray-600 hover:text-gray-900 hover:bg-white/70 transition-all duration-300"
                >
                  <Search className="w-4 h-4" />
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={toggleMobileMenu}
                  className="lg:hidden p-2 rounded-full bg-gray-50/60 text-gray-600 hover:text-gray-900 hover:bg-white/70 transition-all duration-300"
                >
                  <Menu className="w-4 h-4" />
                </motion.button>
              </div>
            </div>
          </div>

          <AnimatePresence>
            {activeMenu !== null && navItems[activeMenu].submenu && (
              <motion.div
                initial={{ opacity: 0, height: 0, y: -20 }}
                animate={{ opacity: 1, height: "auto", y: 0 }}
                exit={{ opacity: 0, height: 0, y: -20 }}
                transition={{
                  duration: 0.5,
                  ease: [0.25, 0.46, 0.45, 0.94],
                  height: { duration: 0.4 },
                  opacity: { duration: 0.3 },
                }}
                className="border-t border-gray-200/50 bg-white/98 backdrop-blur-xl rounded-b-3xl overflow-hidden shadow-2xl pointer-events-auto relative z-[46]"
              >
                <div className="absolute inset-0 bg-gradient-to-b from-white/50 via-transparent to-orange-50/30 pointer-events-none" />

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                  className="px-8 py-8 relative z-10"
                >
                  <div className="flex gap-8">
                    <div className="flex-1">
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.2 }}
                        className="grid grid-cols-2 gap-6"
                      >
                        {navItems[activeMenu].submenu?.map((sub, j) => (
                          <motion.div
                            key={j}
                            initial={{ opacity: 0, x: -30, scale: 0.95 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            transition={{
                              duration: 0.4,
                              delay: 0.1 + j * 0.1,
                              ease: [0.25, 0.46, 0.45, 0.94],
                            }}
                            whileHover={{
                              scale: 1.02,
                              y: -2,
                              transition: { duration: 0.2 },
                            }}
                          >
                            <Link
                              href={activeMenu === 1 ? "/destinations" : "#"}
                              className="group flex items-start gap-4 p-6 rounded-2xl hover:bg-gradient-to-br hover:from-orange-50/80 hover:to-amber-50/60 transition-all duration-400 border border-gray-200/50 hover:border-orange-300/60 hover:shadow-lg backdrop-blur-sm bg-white/60"
                            >
                              <div className="flex-1">
                                <motion.h3
                                  className="font-bold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors text-lg leading-tight"
                                  whileHover={{ x: 2 }}
                                  transition={{ duration: 0.2 }}
                                >
                                  {sub.title}
                                </motion.h3>
                                <p className="text-sm text-gray-600 mb-4 leading-relaxed group-hover:text-gray-700 transition-colors">
                                  {sub.description}
                                </p>
                                <div className="flex flex-wrap gap-2">
                                  {sub.countries?.map((country, k) => (
                                    <motion.span
                                      key={k}
                                      whileHover={{ scale: 1.05, y: -1 }}
                                      transition={{ duration: 0.2 }}
                                      className="text-xs px-3 py-1.5 bg-gray-100/80 text-gray-600 rounded-full hover:bg-orange-100 hover:text-orange-700 transition-all duration-300 font-medium border border-gray-300/50 hover:border-orange-400/60 backdrop-blur-sm"
                                    >
                                      {country}
                                    </motion.span>
                                  ))}
                                </div>
                              </div>
                            </Link>
                          </motion.div>
                        ))}
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="mt-8 pt-6 border-t border-gray-200/50"
                      >
                        <Link href={navItems[activeMenu].href}>
                          <motion.div
                            whileHover={{ scale: 1.02, y: -1 }}
                            whileTap={{ scale: 0.98 }}
                            transition={{ duration: 0.2 }}
                          >
                            <Button className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-orange-400/30 backdrop-blur-sm">
                              Ver todos los {navItems[activeMenu].label.toLowerCase()}
                              <motion.div
                                animate={{ x: [0, 4, 0] }}
                                transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                              >
                                <ChevronDown className="w-4 h-4 ml-2 rotate-[-90deg]" />
                              </motion.div>
                            </Button>
                          </motion.div>
                        </Link>
                      </motion.div>
                    </div>

                    <motion.div
                      initial={{ opacity: 0, scale: 0.9, x: 30 }}
                      animate={{ opacity: 1, scale: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
                      whileHover={{ scale: 1.02, y: -4 }}
                      className="w-80 h-80 bg-gradient-to-br from-orange-100 to-amber-100 rounded-2xl p-6 relative overflow-hidden shadow-xl border border-orange-200/50 backdrop-blur-sm"
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-amber-500/10 to-orange-500/20 rounded-2xl" />
                      <motion.div
                        className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(255,255,255,0.4),transparent_50%)]"
                        animate={{
                          background: [
                            "radial-gradient(circle at 30% 40%, rgba(255,255,255,0.4), transparent 50%)",
                            "radial-gradient(circle at 70% 60%, rgba(255,255,255,0.3), transparent 50%)",
                            "radial-gradient(circle at 30% 40%, rgba(255,255,255,0.4), transparent 50%)",
                          ],
                        }}
                        transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                      />
                      <div className="relative z-10">
                        <motion.h4
                          className="font-bold text-orange-800 text-xl mb-2"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4, delay: 0.5 }}
                        >
                          PERÚ
                        </motion.h4>
                        <motion.p
                          className="text-sm text-orange-700/80 mb-6 leading-relaxed"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4, delay: 0.6 }}
                        >
                          Descubre la magia de {navItems[activeMenu].label.toLowerCase()} en el corazón de los Andes
                        </motion.p>
                        <motion.div
                          className="absolute bottom-6 right-6"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.4, delay: 0.7 }}
                        >
                          <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }}>
                            <Button
                              variant="outline"
                              size="sm"
                              className="border border-orange-500 text-orange-600 hover:bg-orange-500 hover:text-white bg-white/90 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 font-semibold"
                            >
                              Visualizar en el mapa →
                            </Button>
                          </motion.div>
                        </motion.div>
                      </div>

                      <motion.div
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-36 h-44 opacity-20"
                        animate={{
                          rotate: [0, 2, -2, 0],
                          scale: [1, 1.02, 1],
                        }}
                        transition={{ duration: 6, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                      >
                        <svg viewBox="0 0 100 120" className="w-full h-full fill-orange-600">
                          <path d="M20,15 L80,15 L85,35 L90,50 L85,65 L80,80 L75,95 L70,105 L30,105 L25,95 L20,80 L15,65 L20,50 L25,35 Z" />
                          <motion.circle
                            cx="45"
                            cy="45"
                            r="3"
                            className="fill-amber-500"
                            animate={{ opacity: [0.6, 1, 0.6] }}
                            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, delay: 0 }}
                          />
                          <motion.circle
                            cx="60"
                            cy="60"
                            r="2"
                            className="fill-amber-500"
                            animate={{ opacity: [0.6, 1, 0.6] }}
                            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, delay: 0.7 }}
                          />
                          <motion.circle
                            cx="35"
                            cy="70"
                            r="2"
                            className="fill-amber-500"
                            animate={{ opacity: [0.6, 1, 0.6] }}
                            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, delay: 1.4 }}
                          />
                        </svg>
                      </motion.div>
                    </motion.div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.header>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 z-[60] lg:hidden"
              onClick={closeMobileMenu}
            />
            <motion.div
              initial={{ x: -320 }}
              animate={{ x: 0 }}
              exit={{ x: -320 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 w-[min(320px,85vw)] h-full bg-gradient-to-b from-white to-orange-50 shadow-xl z-[70] overflow-y-auto border-r border-orange-200/50"
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-8">
                  <div className="flex items-center gap-3">
                    <div className="relative w-12 h-12">
                      <Image
                        src="https://res.cloudinary.com/dwvikvjrq/image/upload/v1758308769/ChatGPT_Image_1_jul_2025__15_21_51-removebg-preview_1_zi4adi.png"
                        alt="Inca Travel Peru Logo"
                        fill
                        className="object-contain rounded-full border border-orange-300"
                      />
                    </div>
                    <div>
                      <div className="text-orange-600 font-bold text-lg">INCA TRAVEL</div>
                      <div className="text-orange-800 text-sm -mt-1">PERU</div>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={closeMobileMenu}
                    className="p-2 hover:bg-orange-100 rounded-lg border border-orange-200"
                  >
                    <X className="w-6 h-6 text-orange-700" />
                  </motion.button>
                </div>

                <nav className="space-y-3 mb-6">
                  {navItems.map((item, index) => (
                    <motion.div
                      key={item.label}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <Link
                        href={item.href}
                        onClick={closeMobileMenu}
                        className={clsx(
                          "flex items-center justify-between px-4 py-3 rounded-xl font-semibold transition-all text-sm border",
                          isActivePage(item.href)
                            ? "bg-orange-500 text-white shadow-md border-orange-600"
                            : "text-orange-800 hover:bg-orange-100 hover:text-orange-600 border-orange-200 hover:border-orange-300",
                        )}
                      >
                        <span>{item.label}</span>
                        <ChevronDown className="w-4 h-4" />
                      </Link>
                    </motion.div>
                  ))}
                </nav>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.5 }}
                  className="mb-6 pt-4 border-t border-orange-200"
                >
                  <h3 className="text-sm font-bold text-orange-800 mb-3">Idioma / Language</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {languages.map((lang) => (
                      <motion.button
                        key={lang.code}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          handleLanguageChange(lang.code)
                          closeMobileMenu()
                        }}
                        className={clsx(
                          "flex items-center gap-2 px-3 py-2 rounded-lg border transition-all duration-300 text-left text-sm",
                          getCurrentLanguageCode() === lang.code
                            ? "border-orange-500 bg-orange-100 text-orange-700"
                            : "border-orange-200 hover:border-orange-400 hover:bg-orange-50 text-orange-800",
                        )}
                      >
                        <div className="w-6 h-4 relative flex-shrink-0 rounded-sm overflow-hidden">
                          <Image
                            src={lang.flag || "/placeholder.svg"}
                            alt={`${lang.name} flag`}
                            fill
                            className="object-cover"
                            sizes="24px"
                          />
                        </div>
                        <div>
                          <div className="font-medium">{lang.code}</div>
                          <div className="text-xs opacity-75">{lang.name}</div>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.6 }}
                  className="space-y-3"
                >
                  <Link href="/login">
                    <Button
                      variant="outline"
                      className="w-full justify-center border-orange-500 text-orange-600 hover:bg-orange-500 hover:text-white font-semibold py-3 bg-transparent border"
                    >
                      <LogIn className="w-4 h-4 mr-2" />
                      {language === "es"
                        ? "Iniciar Sesión"
                        : language === "en"
                          ? "Login"
                          : language === "fr"
                            ? "Connexion"
                            : language === "de"
                              ? "Anmelden"
                              : "Accedi"}
                    </Button>
                  </Link>
                  <Button className="w-full justify-center bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold py-3 shadow-md border border-orange-400/30">
                    <Calendar className="w-4 h-4 mr-2" />
                    {language === "es"
                      ? "Reservar"
                      : language === "en"
                        ? "Book Now"
                        : language === "fr"
                          ? "Réserver"
                          : language === "de"
                            ? "Buchen"
                            : "Prenota"}
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-center border-green-500 text-green-600 hover:bg-green-500 hover:text-white font-semibold py-3 bg-transparent border"
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    WhatsApp
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
