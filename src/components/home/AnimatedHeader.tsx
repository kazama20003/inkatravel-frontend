"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Globe } from "lucide-react"

interface AnimatedHeaderProps {
  customScrollPosition?: number
  customIsScrollingDown?: boolean
  useCustomScroll?: boolean
}

export default function AnimatedHeader({
  customScrollPosition = 0,
  customIsScrollingDown = false,
  useCustomScroll = false,
}: AnimatedHeaderProps) {
  const [browserScrollPosition, setBrowserScrollPosition] = useState(0)
  const [browserIsScrollingDown, setBrowserIsScrollingDown] = useState(false)
  const [isCompact, setIsCompact] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false)
  const [currentLanguage, setCurrentLanguage] = useState("ES")
  const [currentSection, setCurrentSection] = useState<
    "video" | "explore" | "about" | "discover" | "service" | "testimonials"
  >("video")
  const lastScrollPosition = useRef<number>(0)

  // Track browser scroll position for non-home pages
  useEffect(() => {
    if (useCustomScroll) return // Don't track browser scroll on home page

    const handleScroll = () => {
      const currentScrollY = window.scrollY
      setBrowserIsScrollingDown(currentScrollY > lastScrollPosition.current)
      lastScrollPosition.current = currentScrollY

      // Calculate scroll position as percentage for header animation
      const scrollPercentage = Math.min(100, (currentScrollY / 300) * 100)
      setBrowserScrollPosition(scrollPercentage)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [useCustomScroll])

  // Use the appropriate scroll values based on the page
  const scrollPosition = useCustomScroll ? customScrollPosition : browserScrollPosition
  const isScrollingDown = useCustomScroll ? customIsScrollingDown : browserIsScrollingDown

  // Determine current section and colors
  useEffect(() => {
    if (useCustomScroll) {
      // Custom scroll logic for home page
      if (scrollPosition < 50) {
        setCurrentSection("video")
      } else if (scrollPosition < 150) {
        setCurrentSection("explore")
      } else if (scrollPosition < 250) {
        setCurrentSection("about")
      } else if (scrollPosition < 350) {
        setCurrentSection("discover")
      } else if (scrollPosition < 450) {
        setCurrentSection("service")
      } else {
        setCurrentSection("testimonials")
      }
    } else {
      // Browser scroll logic for other pages
      setCurrentSection("explore") // Default for other pages
    }

    setIsCompact(isScrollingDown && scrollPosition > 10)
  }, [scrollPosition, isScrollingDown, useCustomScroll])

  // Simplified color scheme using CSS variables
  const colors = {
    video: {
      text: "var(--peru-gold)",
      border: "var(--peru-light)",
      secondary: "var(--peru-orange)",
    },
    explore: {
      text: "var(--peru-dark)",
      border: "var(--peru-dark)",
      secondary: "var(--peru-orange)",
    },
    about: {
      text: "var(--peru-dark)",
      border: "var(--peru-dark)",
      secondary: "var(--peru-orange)",
    },
    discover: {
      text: "var(--peru-dark)",
      border: "var(--peru-dark)",
      secondary: "var(--peru-orange)",
    },
    service: {
      text: "var(--peru-light)",
      border: "var(--peru-light)",
      secondary: "var(--peru-gold)",
    },
    testimonials: {
      text: "var(--peru-dark)",
      border: "var(--peru-dark)",
      secondary: "var(--peru-orange)",
    },
  }

  const currentColors = colors[currentSection]

  // Idiomas disponibles
  const languages = [
    { code: "ES", name: "Español" },
    { code: "EN", name: "English" },
    { code: "FR", name: "Français" },
    { code: "DE", name: "Deutsch" },
  ]

  // Close menu when clicking outside or on escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsMenuOpen(false)
        setIsLanguageMenuOpen(false)
      }
    }

    const handleClickOutside = (e: MouseEvent) => {
      // Cerrar menú de idiomas al hacer clic fuera
      if (isLanguageMenuOpen) {
        const target = e.target as HTMLElement
        if (!target.closest(".language-selector")) {
          setIsLanguageMenuOpen(false)
        }
      }
    }

    if (isMenuOpen) {
      document.addEventListener("keydown", handleEscape)
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }

    document.addEventListener("keydown", handleEscape)
    document.addEventListener("mousedown", handleClickOutside)

    return () => {
      document.removeEventListener("keydown", handleEscape)
      document.removeEventListener("mousedown", handleClickOutside)
      document.body.style.overflow = "unset"
    }
  }, [isMenuOpen, isLanguageMenuOpen])

  return (
    <>
      <motion.header
        className="fixed top-0 left-0 right-0 z-50"
        style={{
          background: "transparent",
        }}
        animate={{
          height: isCompact ? "60px" : "120px",
        }}
        transition={{
          duration: 0.8,
          ease: [0.16, 1, 0.3, 1],
        }}
      >
        {/* Desktop Header */}
        <div className="hidden md:block">
          {/* Main Header */}
          <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
            {/* Left - Hamburger Menu */}
            <motion.button
              className="w-12 h-12 rounded-full border-2 border-dotted flex items-center justify-center hover:bg-white/10 transition-colors"
              style={{
                borderColor: currentColors.border,
                color: currentColors.text,
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
              onClick={() => setIsMenuOpen(true)}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                style={{ color: currentColors.text }}
              >
                <line x1="3" y1="6" x2="21" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <line x1="3" y1="12" x2="21" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <line x1="3" y1="18" x2="21" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </motion.button>

            {/* Center - Logo/Brand */}
            <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center justify-center">
              <motion.div
                className="relative"
                animate={{
                  scale: isCompact ? 0.9 : 1,
                }}
                transition={{
                  duration: 0.5,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                {/* Full "Peru Travel" */}
                <motion.div
                  className="flex items-center space-x-2 whitespace-nowrap"
                  animate={{
                    opacity: isCompact ? 0 : 1,
                    scale: isCompact ? 0.8 : 1,
                  }}
                  transition={{
                    duration: 0.4,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  style={{
                    color: currentColors.text,
                    visibility: isCompact ? "hidden" : "visible",
                  }}
                >
                  <span className="text-lg body-text">→</span>
                  <span className="text-3xl brand-text">PERU TRAVEL</span>
                  <span className="text-lg body-text">←</span>
                </motion.div>

                {/* Compact "P" */}
                <motion.div
                  className="flex items-center justify-center space-x-2 absolute top-0 left-0 right-0"
                  animate={{
                    opacity: isCompact ? 1 : 0,
                    scale: isCompact ? 1 : 0.8,
                  }}
                  transition={{
                    duration: 0.4,
                    ease: [0.16, 1, 0.3, 1],
                    delay: isCompact ? 0.1 : 0,
                  }}
                  style={{
                    color: currentColors.text,
                    visibility: isCompact ? "visible" : "hidden",
                  }}
                >
                  <span className="text-lg body-text">→</span>
                  <span className="text-4xl brand-text">P</span>
                  <span className="text-lg body-text">←</span>
                </motion.div>
              </motion.div>
            </div>

            {/* Right - Language, Search and Reservar */}
            <div className="flex items-center space-x-3">
              {/* Language Selector */}
              <div className="relative language-selector">
                <motion.button
                  className="px-3 py-2 rounded-full border flex items-center space-x-2 transition-all duration-300 min-w-[60px] justify-center"
                  style={{
                    borderColor: currentColors.border,
                    color: currentColors.text,
                  }}
                  whileHover={{
                    scale: 1.05,
                    backgroundColor: currentColors.text,
                    color:
                      currentSection === "video" || currentSection === "service"
                        ? "var(--peru-dark)"
                        : "var(--peru-light)",
                  }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  onClick={() => setIsLanguageMenuOpen(!isLanguageMenuOpen)}
                >
                  <span className="text-sm font-medium brand-text">{currentLanguage}</span>
                  <Globe size={14} />
                </motion.button>

                {/* Language Dropdown */}
                <AnimatePresence>
                  {isLanguageMenuOpen && (
                    <motion.div
                      className="absolute top-full right-0 mt-2 bg-white shadow-lg rounded-md overflow-hidden z-50 w-24"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                    >
                      {languages.map((lang) => (
                        <button
                          key={lang.code}
                          className={`w-full text-center px-3 py-2 text-sm hover:bg-gray-100 transition-colors brand-text ${
                            currentLanguage === lang.code ? "font-medium bg-gray-50" : ""
                          }`}
                          onClick={() => {
                            setCurrentLanguage(lang.code)
                            setIsLanguageMenuOpen(false)
                          }}
                        >
                          {lang.code}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Search Button */}
              <motion.button
                className="w-12 h-12 rounded-full border flex items-center justify-center transition-all duration-300"
                style={{
                  borderColor: currentColors.border,
                  color: currentColors.secondary,
                }}
                whileHover={{
                  scale: 1.05,
                  backgroundColor: currentColors.secondary,
                  color:
                    currentSection === "video" || currentSection === "service"
                      ? "var(--peru-dark)"
                      : "var(--peru-light)",
                }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2" />
                  <path d="m21 21-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </motion.button>

              {/* Login Button */}
              <motion.a
                href="/login"
                className="px-4 py-2 rounded-full border flex items-center space-x-2 transition-all duration-300"
                style={{
                  borderColor: currentColors.border,
                  color: currentColors.text,
                }}
                whileHover={{
                  scale: 1.05,
                  backgroundColor: currentColors.text,
                  color:
                    currentSection === "video" || currentSection === "service"
                      ? "var(--peru-dark)"
                      : "var(--peru-light)",
                }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <circle
                    cx="12"
                    cy="7"
                    r="4"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span className="text-sm font-medium brand-text">INICIAR SESIÓN</span>
              </motion.a>

              {/* Reservar Button */}
              <motion.button
                className="px-6 py-3 rounded-full border flex items-center space-x-2 transition-all duration-300"
                style={{
                  borderColor: currentColors.border,
                  color: currentColors.text,
                }}
                whileHover={{
                  scale: 1.05,
                  backgroundColor: currentColors.text,
                  color: "var(--peru-dark)",
                }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <span className="text-sm font-medium brand-text">RESERVAR</span>
                <div
                  className="w-4 h-4 rounded-full border-2 border-dotted flex items-center justify-center"
                  style={{ borderColor: currentColors.border }}
                >
                  <div className="w-1 h-1 rounded-full" style={{ backgroundColor: currentColors.text }}></div>
                </div>
              </motion.button>
            </div>
          </div>

          {/* Secondary Navigation */}
          <motion.div
            className="overflow-hidden"
            style={{
              background: "transparent",
            }}
            initial={{ height: 0 }}
            animate={{
              height: isCompact ? 0 : "60px",
            }}
            transition={{
              duration: 0.8,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            <motion.div
              style={{
                background: "transparent",
              }}
              initial={{ y: -60, opacity: 0 }}
              animate={{
                y: isCompact ? -60 : 0,
                opacity: isCompact ? 0 : 1,
              }}
              transition={{
                duration: 0.8,
                ease: [0.16, 1, 0.3, 1],
                delay: isCompact ? 0 : 0.2,
              }}
            >
              <nav className="max-w-7xl mx-auto px-6 h-15 flex items-center justify-center">
                <div className="flex items-center">
                  {["DESTINOS", "TOURS", "ITINERARIOS", "CUÁNDO IR", "NOSOTROS"].map((item, index) => (
                    <div key={item} className="flex items-center">
                      <motion.a
                        href={item === "TOURS" ? "/tours" : item === "DESTINOS" ? "/" : "#"}
                        className="text-base font-medium hover:opacity-70 transition-colors px-6 py-3 brand-text"
                        style={{ color: currentColors.text }}
                        initial={{ y: -20, opacity: 0 }}
                        animate={{
                          y: isCompact ? -20 : 0,
                          opacity: isCompact ? 0 : 1,
                        }}
                        transition={{
                          duration: 0.6,
                          ease: [0.16, 1, 0.3, 1],
                          delay: isCompact ? 0 : 0.3 + index * 0.05,
                        }}
                        whileHover={{ scale: 1.05 }}
                      >
                        {item}
                      </motion.a>

                      {index < 4 && (
                        <motion.div
                          className="w-px h-6"
                          style={{ backgroundColor: `${currentColors.border}30` }}
                          initial={{ opacity: 0, scaleY: 0 }}
                          animate={{
                            opacity: isCompact ? 0 : 1,
                            scaleY: isCompact ? 0 : 1,
                          }}
                          transition={{
                            duration: 0.6,
                            ease: [0.16, 1, 0.3, 1],
                            delay: isCompact ? 0 : 0.35 + index * 0.05,
                          }}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </nav>
            </motion.div>
          </motion.div>
        </div>

        {/* Mobile Header */}
        <div className="md:hidden px-4 h-16 flex items-center justify-between">
          {/* Left - Hamburger Menu */}
          <motion.button
            className="w-12 h-12 rounded-full border-2 border-dotted flex items-center justify-center"
            style={{
              borderColor: currentColors.border,
              color: currentColors.text,
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
            onClick={() => setIsMenuOpen(true)}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <line x1="3" y1="6" x2="21" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <line x1="3" y1="12" x2="21" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <line x1="3" y1="18" x2="21" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </motion.button>

          {/* Center - Logo/Brand */}
          <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center justify-center">
            <motion.div
              className="relative"
              animate={{
                scale: isCompact ? 0.9 : 1,
              }}
              transition={{
                duration: 0.5,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              {/* Full "Peru Travel" */}
              <motion.div
                className="flex items-center whitespace-nowrap"
                animate={{
                  opacity: isCompact ? 0 : 1,
                  scale: isCompact ? 0.8 : 1,
                }}
                transition={{
                  duration: 0.4,
                  ease: [0.16, 1, 0.3, 1],
                }}
                style={{
                  color: currentColors.text,
                  visibility: isCompact ? "hidden" : "visible",
                }}
              >
                <span className="text-sm body-text mr-1">→</span>
                <span className="text-lg brand-text">PERU TRAVEL</span>
                <span className="text-sm body-text ml-1">←</span>
              </motion.div>

              {/* Compact "P" */}
              <motion.div
                className="flex items-center justify-center absolute top-0 left-0 right-0"
                animate={{
                  opacity: isCompact ? 1 : 0,
                  scale: isCompact ? 1 : 0.8,
                }}
                transition={{
                  duration: 0.4,
                  ease: [0.16, 1, 0.3, 1],
                  delay: isCompact ? 0.1 : 0,
                }}
                style={{
                  color: currentColors.text,
                  visibility: isCompact ? "visible" : "hidden",
                }}
              >
                <span className="text-sm body-text mr-1">→</span>
                <span className="text-2xl brand-text">P</span>
                <span className="text-sm body-text ml-1">←</span>
              </motion.div>
            </motion.div>
          </div>

          {/* Right - Language Selector */}
          <div className="flex items-center space-x-2">
            <div className="relative language-selector">
              <motion.button
                className="px-2 py-1 rounded-full border flex items-center space-x-1"
                style={{
                  borderColor: currentColors.border,
                  color: currentColors.text,
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2 }}
                onClick={() => setIsLanguageMenuOpen(!isLanguageMenuOpen)}
              >
                <span className="text-sm brand-text">{currentLanguage}</span>
                <Globe size={12} />
              </motion.button>

              {/* Language Dropdown - Mobile */}
              <AnimatePresence>
                {isLanguageMenuOpen && (
                  <motion.div
                    className="absolute top-full right-0 mt-2 bg-white shadow-lg rounded-md overflow-hidden z-50 w-20"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        className={`w-full text-center px-2 py-2 text-sm hover:bg-gray-100 transition-colors brand-text ${
                          currentLanguage === lang.code ? "font-medium bg-gray-50" : ""
                        }`}
                        onClick={() => {
                          setCurrentLanguage(lang.code)
                          setIsLanguageMenuOpen(false)
                        }}
                      >
                        {lang.code}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Login Button - Mobile */}
            <motion.a
              href="/login"
              className="w-10 h-10 rounded-full border-2 border-dotted flex items-center justify-center"
              style={{
                borderColor: currentColors.border,
                color: currentColors.text,
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle
                  cx="12"
                  cy="7"
                  r="4"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </motion.a>

            <motion.button
              className="w-10 h-10 rounded-full border-2 border-dotted flex items-center justify-center"
              style={{
                borderColor: currentColors.border,
                color: currentColors.secondary,
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <polyline
                  points="22,6 12,13 2,6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </motion.button>
          </div>
        </div>
      </motion.header>

      {/* Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 z-[90] bg-black/50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setIsMenuOpen(false)}
            />

            {/* Menu Panel */}
            <motion.div
              className="fixed top-0 left-0 bottom-0 z-[100] bg-white shadow-2xl"
              style={{
                width: typeof window !== "undefined" && window.innerWidth >= 768 ? "480px" : "100%",
              }}
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{
                type: "spring",
                damping: 25,
                stiffness: 200,
                duration: 0.6,
              }}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                {/* Logo */}
                <div className="flex items-center">
                  <div className="w-16 h-16 rounded-full border-2 border-dotted border-peru-orange flex items-center justify-center relative">
                    <span className="text-2xl brand-text text-peru-orange">P</span>
                    {/* Circular text around logo */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <svg className="w-20 h-20 -rotate-90" viewBox="0 0 100 100">
                        <defs>
                          <path id="circle" d="M 50, 50 m -35, 0 a 35,35 0 1,1 70,0 a 35,35 0 1,1 -70,0" />
                        </defs>
                        <text className="text-xs body-text tracking-widest fill-peru-green">
                          <textPath href="#circle">PERU • TRAVEL •</textPath>
                        </text>
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Right buttons */}
                <div className="flex items-center space-x-3">
                  {/* Language Selector in Menu */}
                  <div className="relative language-selector">
                    <button
                      className="px-3 py-2 rounded-full border border-peru-green text-peru-green flex items-center space-x-2 hover:opacity-70 transition-opacity"
                      onClick={() => setIsLanguageMenuOpen(!isLanguageMenuOpen)}
                    >
                      <span className="text-sm brand-text">{currentLanguage}</span>
                      <Globe size={14} />
                    </button>
                  </div>

                  {/* Search */}
                  <button className="w-12 h-12 rounded-full border border-peru-green text-peru-green flex items-center justify-center hover:opacity-70 transition-opacity">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2" />
                      <path d="m21 21-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  </button>

                  {/* Close */}
                  <button
                    className="w-12 h-12 rounded-full border-2 border-dotted border-peru-gold text-peru-gold flex items-center justify-center hover:opacity-70 transition-opacity"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Menu Content */}
              <div className="flex-1 overflow-y-auto">
                <div className="p-6">
                  {/* Current Language */}
                  <motion.div
                    className="mb-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1, duration: 0.5 }}
                  >
                    <div className="flex flex-wrap gap-2 mb-4">
                      {languages.map((lang) => (
                        <button
                          key={lang.code}
                          className={`px-3 py-1 text-sm rounded-full transition-all brand-text ${
                            currentLanguage === lang.code
                              ? "bg-peru-orange text-white"
                              : "border border-gray-300 text-gray-600 hover:border-peru-orange"
                          }`}
                          onClick={() => setCurrentLanguage(lang.code)}
                        >
                          {lang.code}
                        </button>
                      ))}
                    </div>
                  </motion.div>

                  {/* Discover Section */}
                  <motion.div
                    className="mb-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                  >
                    <h3 className="text-sm font-medium uppercase tracking-wider mb-4 body-text text-peru-dark/60">
                      DESCUBRIR
                    </h3>
                    <nav className="space-y-4">
                      {[
                        { name: "DESTINOS", hasArrow: true, href: "/" },
                        { name: "TOURS", hasArrow: true, href: "/tours" },
                        { name: "ITINERARIOS", hasArrow: false, href: "#" },
                        { name: "CUÁNDO IR", hasArrow: false, href: "#" },
                        { name: "NOSOTROS", hasArrow: false, href: "#" },
                      ].map((item, index) => (
                        <motion.a
                          key={item.name}
                          href={item.href}
                          className="block text-2xl hover:opacity-70 transition-opacity brand-text text-peru-dark"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
                        >
                          {item.name} {item.hasArrow && "›"}
                        </motion.a>
                      ))}
                    </nav>
                  </motion.div>

                  {/* Learn Section - Desktop only */}
                  <motion.div
                    className="hidden md:block mb-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7, duration: 0.5 }}
                  >
                    <h3 className="text-sm font-medium uppercase tracking-wider mb-4 body-text text-peru-green/60">
                      APRENDER
                    </h3>
                    <nav className="space-y-4">
                      {["POR QUÉ NOSOTROS", "BLOG", "SOSTENIBILIDAD", "CONTACTO"].map((item, index) => (
                        <motion.a
                          key={item}
                          href="#"
                          className="block text-2xl hover:opacity-70 transition-opacity brand-text text-peru-dark"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.8 + index * 0.1, duration: 0.5 }}
                        >
                          {item}
                        </motion.a>
                      ))}
                    </nav>
                  </motion.div>
                </div>

                {/* Bottom Section */}
                <motion.div
                  className="mt-auto p-6 border-t border-gray-200"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2, duration: 0.5 }}
                >
                  <button className="w-full py-4 text-center text-sm font-medium uppercase tracking-wider border border-peru-gold text-peru-gold rounded-full hover:opacity-70 transition-all duration-300 mb-6 brand-text">
                    CONTÁCTANOS
                  </button>
                  <p className="text-center body-text text-peru-dark/60">¡Hola! ¿Cómo podemos ayudarte?</p>
                </motion.div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
