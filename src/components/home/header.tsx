"use client"
import Link from "next/link"
import { useState, useEffect } from "react"
import { Menu, X, Search, ChevronDown, MessageCircle, LogIn, User, ShoppingCart } from "lucide-react"
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

                <Link href="/users">
                  <motion.button
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.95 }}
                    className="hidden md:flex items-center justify-center p-2 rounded-lg text-foreground hover:bg-peru-orange/10 transition-colors"
                  >
                    <User className="w-4 h-4" />
                  </motion.button>
                </Link>

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

                <motion.button
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsSearchOpen(!isSearchOpen)}
                  className="p-2 rounded-lg text-foreground hover:bg-peru-orange/10 transition-colors"
                >
                  <Search className="w-4 h-4" />
                </motion.button>

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
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: j * 0.08, type: "spring", stiffness: 400 }}
                        whileHover={{ y: -2 }}
                      >
                        <Link href={activeMenu === 1 ? "/destinations" : "#"}>
                          <motion.div
                            className="p-4 rounded-xl border border-peru-orange/15 hover:border-peru-orange/40 bg-white/40 hover:bg-gradient-to-br hover:from-peru-light/60 hover:to-peru-gold/20 transition-all duration-300 cursor-pointer group"
                            whileHover={{ scale: 1.02 }}
                            transition={{ type: "spring", stiffness: 400 }}
                          >
                            <h3 className="font-bold text-sm text-peru-dark group-hover:text-peru-orange transition-colors mb-1">
                              {sub.title}
                            </h3>
                            <p className="text-xs text-foreground/60 group-hover:text-foreground/80 transition-colors mb-3">
                              {sub.description}
                            </p>
                            <div className="space-y-1">
                              {sub.countries.map((country, k) => (
                                <div
                                  key={k}
                                  className="text-xs text-foreground/50 group-hover:text-peru-orange transition-colors"
                                >
                                  • {country}
                                </div>
                              ))}
                            </div>
                          </motion.div>
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {isMobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="border-t border-peru-orange/10 bg-gradient-to-b from-white to-peru-light/50"
              >
                <div className="px-6 py-4 space-y-2">
                  {navItems.map((item, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <Link href={item.href}>
                        <motion.button
                          whileHover={{ x: 4, backgroundColor: "rgba(230, 126, 34, 0.08)" }}
                          whileTap={{ scale: 0.98 }}
                          onClick={closeMobileMenu}
                          className="w-full text-left px-4 py-3 rounded-lg text-sm font-medium text-foreground hover:text-peru-orange transition-all"
                        >
                          {item.label}
                        </motion.button>
                      </Link>
                    </motion.div>
                  ))}

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="space-y-3 pt-4 border-t border-peru-orange/20"
                  >
                    <Link href="/login">
                      <motion.button
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-peru-orange text-white font-semibold text-sm shadow-md hover:shadow-lg transition-all border border-peru-orange/40"
                      >
                        <LogIn className="w-4 h-4" />
                        Iniciar Sesión
                      </motion.button>
                    </Link>

                    <motion.button
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-peru-green text-white font-semibold text-sm shadow-md hover:shadow-lg transition-all border border-peru-green/40"
                    >
                      <MessageCircle className="w-4 h-4" />
                      WhatsApp
                    </motion.button>
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.header>
    </>
  )
}
