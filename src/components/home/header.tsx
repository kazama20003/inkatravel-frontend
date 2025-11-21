"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { Menu, X, Search, ChevronDown, LogIn, User, ShoppingCart, LogOut } from "lucide-react"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion"
import clsx from "clsx"
import { useLanguage } from "@/contexts/LanguageContext"
import { useCart } from "@/contexts/CartContext"

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [activeMenu, setActiveMenu] = useState<number | null>(null)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isLanguageOpen, setIsLanguageOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [activeMobileSubmenu, setActiveMobileSubmenu] = useState<number | null>(null)

  const pathname = usePathname()
  const router = useRouter()
  const { language, setLanguage } = useLanguage()
  const { cartCount } = useCart()

  const { scrollY } = useScroll()
  const headerY = useTransform(scrollY, [0, 100], [0, -10])
  const headerOpacity = useTransform(scrollY, [0, 50, 100], [1, 0.95, 0.9])

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    const checkAuth = () => {
      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("token="))
        ?.split("=")[1]

      if (token) {
        setIsAuthenticated(true)
        try {
          const payload = JSON.parse(atob(token.split(".")[1]))
          setUserEmail(payload.email)
        } catch (e) {
          console.error("Error decoding token:", e)
        }
      } else {
        setIsAuthenticated(false)
        setUserEmail(null)
      }
    }

    checkAuth()
  }, [pathname])

  const handleMenuEnter = (index: number) => {
    setActiveMenu(index)
  }

  const handleMenuLeave = () => {
    setActiveMenu(null)
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
    setActiveMobileSubmenu(null)
  }

  const handleLogout = () => {
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;"
    setIsAuthenticated(false)
    setUserEmail(null)
    setIsUserMenuOpen(false)
    router.refresh()
  }

  const showNotification = (message: string, type: "success" | "error" | "info" = "info") => {
    if (typeof window === "undefined") return
    const notification = document.createElement("div")
    const bgColor = type === "success" ? "bg-peru-green" : type === "error" ? "bg-destructive" : "bg-peru-orange"
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

    const currentPath = pathname.replace(/^\/(?:es|en|fr|de|it)(?=\/|$)/, "") || "/"

    let newPath: string
    if (targetLang.locale === "es") {
      newPath = currentPath === "/" ? "/" : currentPath
    } else {
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

  return (
    <>
      <AnimatePresence>
        {activeMenu !== null && navItems[activeMenu].submenu && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/10 z-[45]"
            onClick={handleMenuLeave}
          />
        )}
      </AnimatePresence>

      <motion.header
        style={{ y: headerY, opacity: headerOpacity }}
        className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-7xl pointer-events-none"
      >
        <motion.div
          animate={{
            backgroundColor: scrolled ? "rgba(255, 255, 255, 0.96)" : "rgba(255, 255, 255, 0.92)",
            boxShadow: scrolled ? "0 10px 30px rgba(230, 126, 34, 0.08)" : "0 5px 15px rgba(0, 0, 0, 0.05)",
          }}
          transition={{ duration: 0.3 }}
          className="backdrop-blur-2xl rounded-2xl border border-peru-orange/10 pointer-events-auto"
          onMouseLeave={handleMenuLeave}
        >
          <div className="px-6 py-3">
            <div className="flex items-center justify-between">
              <motion.div whileHover={{ scale: 1.05 }} className="flex items-center gap-2 flex-shrink-0">
                <Link href="/" className="flex items-center gap-2">
                  <div className="relative w-9 h-9">
                    <Image
                      src="https://res.cloudinary.com/dwvikvjrq/image/upload/v1758308769/ChatGPT_Image_1_jul_2025__15_21_51-removebg-preview_1_zi4adi.png"
                      alt="Inca Travel Peru Logo"
                      fill
                      className="object-contain"
                      priority
                    />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-peru-dark leading-tight">INCA TRAVEL</span>
                    <span className="text-xs font-semibold text-peru-orange -mt-0.5">PERU</span>
                  </div>
                </Link>
              </motion.div>

              {/* Desktop Navigation */}
              <nav className="hidden lg:flex items-center gap-0.5">
                {navItems.map((item, i) => (
                  <div key={i} className="relative" onMouseEnter={() => handleMenuEnter(i)}>
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    >
                      <Link
                        href={item.href}
                        className={clsx(
                          "px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 flex items-center gap-1.5 relative",
                          activeMenu === i || isActivePage(item.href)
                            ? "text-peru-orange"
                            : "text-foreground hover:text-peru-orange",
                        )}
                      >
                        {item.label}
                        {item.submenu && (
                          <motion.div
                            animate={{ rotate: activeMenu === i ? 180 : 0 }}
                            transition={{ duration: 0.3, type: "spring" }}
                          >
                            <ChevronDown size={16} />
                          </motion.div>
                        )}
                        {(activeMenu === i || isActivePage(item.href)) && (
                          <motion.div
                            layoutId="activeUnderline"
                            className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-peru-orange to-peru-gold rounded-full"
                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                          />
                        )}
                      </Link>
                    </motion.div>
                  </div>
                ))}
              </nav>

              <div className="flex items-center gap-2.5">
                <div className="relative hidden md:block">
                  <motion.button
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsLanguageOpen(!isLanguageOpen)}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-foreground hover:bg-peru-orange/10 transition-colors duration-300"
                  >
                    {getCurrentLanguageCode()}
                    <ChevronDown className="w-3.5 h-3.5" />
                  </motion.button>

                  <AnimatePresence>
                    {isLanguageOpen && (
                      <>
                        <div className="fixed inset-0 z-[60]" onClick={() => setIsLanguageOpen(false)} />
                        <motion.div
                          initial={{ opacity: 0, y: -8, scale: 0.94 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -8, scale: 0.94 }}
                          transition={{ type: "spring", stiffness: 300, damping: 20 }}
                          className="absolute top-full right-0 mt-2 bg-white rounded-xl shadow-lg border border-peru-orange/20 min-w-44 z-[70] overflow-hidden backdrop-blur-sm"
                        >
                          {languages.map((lang, idx) => (
                            <motion.button
                              key={lang.code}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: idx * 0.05 }}
                              whileHover={{ backgroundColor: "rgba(230, 126, 34, 0.08)", x: 4 }}
                              whileTap={{ scale: 0.97 }}
                              onClick={(e) => {
                                e.stopPropagation()
                                handleLanguageChange(lang.code)
                              }}
                              className={clsx(
                                "flex items-center gap-3 px-4 py-3 w-full text-left transition-all text-sm border-b border-peru-orange/10 last:border-b-0",
                                getCurrentLanguageCode() === lang.code
                                  ? "bg-peru-orange/15 text-peru-orange font-semibold"
                                  : "text-foreground hover:text-peru-orange",
                              )}
                            >
                              <div className="w-5 h-4 relative flex-shrink-0 rounded-sm overflow-hidden border border-peru-orange/20">
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

                {isAuthenticated ? (
                  <div className="relative hidden md:block">
                    <motion.button
                      whileHover={{ scale: 1.08 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                      className="flex items-center justify-center p-2 rounded-lg text-foreground hover:bg-peru-orange/10 transition-colors"
                    >
                      <User className="w-4 h-4" />
                    </motion.button>

                    <AnimatePresence>
                      {isUserMenuOpen && (
                        <>
                          <div className="fixed inset-0 z-[60]" onClick={() => setIsUserMenuOpen(false)} />
                          <motion.div
                            initial={{ opacity: 0, y: -8, scale: 0.94 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -8, scale: 0.94 }}
                            transition={{ type: "spring", stiffness: 300, damping: 20 }}
                            className="absolute top-full right-0 mt-2 bg-white rounded-xl shadow-lg border border-peru-orange/20 min-w-48 z-[70] overflow-hidden backdrop-blur-sm"
                          >
                            <div className="px-4 py-3 border-b border-peru-orange/10">
                              <p className="text-sm font-semibold text-foreground">{userEmail}</p>
                            </div>
                            <Link href="/users" onClick={() => setIsUserMenuOpen(false)}>
                              <motion.button
                                whileHover={{ backgroundColor: "rgba(230, 126, 34, 0.08)", x: 4 }}
                                whileTap={{ scale: 0.97 }}
                                className="flex items-center gap-3 px-4 py-3 w-full text-left text-sm text-foreground hover:text-peru-orange transition-all border-b border-peru-orange/10"
                              >
                                <User className="w-4 h-4" />
                                {language === "es" ? "Mi Perfil" : language === "en" ? "My Profile" : "Mon Profil"}
                              </motion.button>
                            </Link>
                            <motion.button
                              whileHover={{ backgroundColor: "rgba(230, 126, 34, 0.08)" }}
                              whileTap={{ scale: 0.97 }}
                              onClick={handleLogout}
                              className="flex items-center gap-3 px-4 py-3 w-full text-left text-sm text-destructive hover:bg-destructive/10 transition-all"
                            >
                              <LogOut className="w-4 h-4" />
                              {language === "es" ? "Cerrar Sesión" : language === "en" ? "Logout" : "Déconnexion"}
                            </motion.button>
                          </motion.div>
                        </>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <Link href="/login">
                    <motion.button
                      whileHover={{ scale: 1.05, boxShadow: "0 8px 16px rgba(230, 126, 34, 0.25)" }}
                      whileTap={{ scale: 0.95 }}
                      className="hidden md:flex items-center gap-2 px-4 py-2 rounded-lg bg-peru-orange text-white font-semibold text-sm shadow-md hover:shadow-lg transition-all duration-300 border border-peru-orange/30"
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
                )}

                <Link href="/checkout">
                  <motion.button
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.95 }}
                    className="hidden md:flex items-center justify-center p-2 rounded-lg text-foreground hover:bg-peru-orange/10 transition-colors relative"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    {cartCount > 0 && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute top-0 right-0 bg-peru-orange text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center"
                      >
                        {cartCount}
                      </motion.span>
                    )}
                  </motion.button>
                </Link>

                <motion.button
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsSearchOpen(!isSearchOpen)}
                  className="p-2 rounded-lg text-foreground hover:bg-peru-orange/10 transition-colors"
                >
                  <Search className="w-4 h-4" />
                </motion.button>

                {/* Mobile Menu Button */}
                <motion.button
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={toggleMobileMenu}
                  className="lg:hidden p-2 rounded-lg text-foreground hover:bg-peru-orange/10 transition-colors"
                >
                  {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
                </motion.button>
              </div>
            </div>
          </div>

          {/* Desktop Submenu */}
          <AnimatePresence>
            {activeMenu !== null && navItems[activeMenu].submenu && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 30, opacity: { duration: 0.2 } }}
                className="border-t border-peru-orange/10 bg-gradient-to-b from-peru-light/50 to-white/50 backdrop-blur-xl"
              >
                <div className="px-8 py-6">
                  <div className="grid grid-cols-2 gap-4 md:gap-6">
                    {navItems[activeMenu].submenu?.map((sub, j) => (
                      <motion.div
                        key={j}
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: j * 0.08 }}
                      >
                        <div className="group">
                          <h3 className="font-bold text-sm text-peru-dark mb-3 group-hover:text-peru-orange transition-colors">
                            {sub.title}
                          </h3>
                          <p className="text-xs text-muted-foreground mb-3">{sub.description}</p>
                          <div className="space-y-2">
                            {sub.countries?.map((country, k) => (
                              <motion.button
                                key={k}
                                whileHover={{ x: 4 }}
                                className="text-sm text-foreground hover:text-peru-orange transition-colors block"
                              >
                                {country}
                              </motion.button>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 bg-black/20 z-[40] top-20"
                onClick={() => setIsMobileMenuOpen(false)}
              />
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                className="absolute top-full left-0 right-0 mt-3 mx-auto w-[95%] max-w-7xl bg-white rounded-2xl border border-peru-orange/10 shadow-xl z-[50] max-h-[80vh] overflow-y-auto backdrop-blur-xl"
              >
                <div className="p-4">
                  {/* Mobile Navigation Items */}
                  <div className="space-y-1">
                    {navItems.map((item, i) => (
                      <div key={i}>
                        <motion.div
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.05 }}
                        >
                          {item.submenu ? (
                            <motion.button
                              onClick={() => setActiveMobileSubmenu(activeMobileSubmenu === i ? null : i)}
                              className={clsx(
                                "w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition-all",
                                isActivePage(item.href)
                                  ? "text-peru-orange bg-peru-orange/10"
                                  : "text-foreground hover:bg-peru-orange/5",
                              )}
                              whileHover={{ x: 4 }}
                            >
                              <span>{item.label}</span>
                              <motion.div
                                animate={{ rotate: activeMobileSubmenu === i ? 180 : 0 }}
                                transition={{ duration: 0.3 }}
                              >
                                <ChevronDown size={16} />
                              </motion.div>
                            </motion.button>
                          ) : (
                            <Link href={item.href}>
                              <motion.div
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={clsx(
                                  "w-full flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-all",
                                  isActivePage(item.href)
                                    ? "text-peru-orange bg-peru-orange/10"
                                    : "text-foreground hover:bg-peru-orange/5",
                                )}
                                whileHover={{ x: 4 }}
                              >
                                {item.label}
                              </motion.div>
                            </Link>
                          )}
                        </motion.div>

                        {/* Mobile Submenu */}
                        <AnimatePresence>
                          {item.submenu && activeMobileSubmenu === i && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ type: "spring", stiffness: 300, damping: 30 }}
                              className="bg-peru-orange/5 rounded-lg mt-1 overflow-hidden"
                            >
                              <div className="p-3 space-y-3">
                                {item.submenu?.map((sub, j) => (
                                  <motion.div
                                    key={j}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: j * 0.05 }}
                                    className="pl-3 border-l-2 border-peru-orange/30"
                                  >
                                    <h4 className="font-semibold text-xs text-peru-dark mb-2">{sub.title}</h4>
                                    <p className="text-xs text-muted-foreground mb-2">{sub.description}</p>
                                    <div className="space-y-1.5">
                                      {sub.countries?.map((country, k) => (
                                        <motion.button
                                          key={k}
                                          whileHover={{ x: 2 }}
                                          className="text-xs text-foreground hover:text-peru-orange transition-colors block text-left"
                                        >
                                          • {country}
                                        </motion.button>
                                      ))}
                                    </div>
                                  </motion.div>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ))}
                  </div>

                  {/* Mobile Language Selector */}
                  <div className="mt-4 pt-4 border-t border-peru-orange/10">
                    <motion.button
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: navItems.length * 0.05 }}
                      onClick={() => setActiveMobileSubmenu(activeMobileSubmenu === -1 ? null : -1)}
                      className="w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium text-foreground hover:bg-peru-orange/5 transition-all"
                      whileHover={{ x: 4 }}
                    >
                      <span>🌐 {getCurrentLanguageCode()}</span>
                      <motion.div
                        animate={{ rotate: activeMobileSubmenu === -1 ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <ChevronDown size={16} />
                      </motion.div>
                    </motion.button>

                    <AnimatePresence>
                      {activeMobileSubmenu === -1 && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ type: "spring", stiffness: 300, damping: 30 }}
                          className="bg-peru-orange/5 rounded-lg mt-2 overflow-hidden"
                        >
                          <div className="p-2 space-y-1">
                            {languages.map((lang, idx) => (
                              <motion.button
                                key={lang.code}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleLanguageChange(lang.code)
                                  setActiveMobileSubmenu(null)
                                  setIsMobileMenuOpen(false)
                                }}
                                className={clsx(
                                  "flex items-center gap-2 px-4 py-2 rounded text-xs font-medium transition-all w-full",
                                  getCurrentLanguageCode() === lang.code
                                    ? "bg-peru-orange/20 text-peru-orange"
                                    : "text-foreground hover:bg-peru-orange/10",
                                )}
                                whileHover={{ x: 2 }}
                              >
                                <div className="w-4 h-3 relative rounded-sm overflow-hidden border border-peru-orange/20 flex-shrink-0">
                                  <Image
                                    src={lang.flag || "/placeholder.svg"}
                                    alt={`${lang.name} flag`}
                                    fill
                                    className="object-cover"
                                    sizes="16px"
                                  />
                                </div>
                                <span>{lang.name}</span>
                              </motion.button>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Mobile Auth Buttons */}
                  <div className="mt-4 pt-4 border-t border-peru-orange/10 space-y-2">
                    {isAuthenticated ? (
                      <>
                        <motion.div
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: (navItems.length + 1) * 0.05 }}
                          className="px-4 py-2 text-xs text-muted-foreground"
                        >
                          {userEmail}
                        </motion.div>
                        <Link href="/users" onClick={() => setIsMobileMenuOpen(false)}>
                          <motion.button
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: (navItems.length + 2) * 0.05 }}
                            className="w-full flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-foreground hover:bg-peru-orange/5 transition-all"
                            whileHover={{ x: 4 }}
                          >
                            <User className="w-4 h-4" />
                            {language === "es" ? "Mi Perfil" : "My Profile"}
                          </motion.button>
                        </Link>
                        <motion.button
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: (navItems.length + 3) * 0.05 }}
                          onClick={() => {
                            handleLogout()
                            setIsMobileMenuOpen(false)
                          }}
                          className="w-full flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-destructive hover:bg-destructive/10 transition-all"
                          whileHover={{ x: 4 }}
                        >
                          <LogOut className="w-4 h-4" />
                          {language === "es" ? "Cerrar Sesión" : "Logout"}
                        </motion.button>
                      </>
                    ) : (
                      <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                        <motion.button
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: (navItems.length + 1) * 0.05 }}
                          className="w-full flex items-center gap-2 px-4 py-3 rounded-lg bg-peru-orange text-white font-semibold text-sm shadow-md hover:shadow-lg transition-all"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <LogIn className="w-4 h-4" />
                          {language === "es" ? "Iniciar Sesión" : "Login"}
                        </motion.button>
                      </Link>
                    )}
                  </div>

                  {/* Mobile Cart Link */}
                  <Link href="/checkout" onClick={() => setIsMobileMenuOpen(false)}>
                    <motion.button
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: (navItems.length + 4) * 0.05 }}
                      className="w-full flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium text-foreground hover:bg-peru-orange/5 transition-all mt-2 relative"
                      whileHover={{ x: 4 }}
                    >
                      <ShoppingCart className="w-4 h-4" />
                      {language === "es" ? "Carrito" : "Cart"}
                      {cartCount > 0 && (
                        <motion.span
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="ml-auto bg-peru-orange text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center"
                        >
                          {cartCount}
                        </motion.span>
                      )}
                    </motion.button>
                  </Link>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </motion.header>
    </>
  )
}
