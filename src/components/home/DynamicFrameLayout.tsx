"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useIsMobile } from "@/hooks/use-mobile"
import { useRouter } from "next/navigation"

interface Frame {
  id: number
  video: string
  defaultPos: { x: number; y: number; w: number; h: number }
  mediaSize: number
  borderThickness: number
  borderSize: number
  label: string
  sublabel?: string
  description: string
}

// Frames con descripciones más limpias
const initialFrames: Frame[] = [
  {
    id: 1,
    video: "https://res.cloudinary.com/dwvikvjrq/video/upload/v1750825533/12510930_2160_3840_32fps_wqwo4z.mp4",
    defaultPos: { x: 0, y: 0, w: 4, h: 12 },
    mediaSize: 1,
    borderThickness: 0,
    borderSize: 80,
    label: "MACHU PICCHU",
    sublabel: "Ciudadela Sagrada",
    description: "Descubre la maravilla del mundo",
  },
  {
    id: 2,
    video: "https://res.cloudinary.com/dwvikvjrq/video/upload/v1750825508/16754886-hd_1080_1920_30fps_yjhcem.mp4",
    defaultPos: { x: 4, y: 0, w: 4, h: 12 },
    mediaSize: 1,
    borderThickness: 0,
    borderSize: 80,
    label: "AMAZONAS",
    sublabel: "Selva Peruana",
    description: "Explora la biodiversidad única",
  },
  {
    id: 3,
    video: "https://res.cloudinary.com/dwvikvjrq/video/upload/v1750825546/20771551-uhd_3840_2160_30fps_cjhmva.mp4",
    defaultPos: { x: 8, y: 0, w: 4, h: 12 },
    mediaSize: 1,
    borderThickness: 0,
    borderSize: 80,
    label: "CUSCO",
    sublabel: "Corazón del Imperio",
    description: "Vive la historia inca",
  },
]

export default function DynamicFrameLayout() {
  const [frames] = useState<Frame[]>(initialFrames)
  const [hovered, setHovered] = useState<number | null>(null)
  const [autoplayAll] = useState(true)
  const [activeFrame, setActiveFrame] = useState<number | null>(null)
  const router = useRouter()

  // Detectar si es móvil
  const isMobile = useIsMobile()

  // Handle video playback to prevent errors
  useEffect(() => {
    const videoElements = document.querySelectorAll("video")

    const setupVideos = () => {
      videoElements.forEach((video, index) => {
        const frameId = index + 1
        const isHovered = hovered === frameId || activeFrame === frameId

        if (autoplayAll || isHovered) {
          video.muted = true

          if (video.paused) {
            const playPromise = video.play()

            if (playPromise !== undefined) {
              playPromise.catch(() => {
                // Autoplay was prevented, do nothing
              })
            }
          }
        } else if (!autoplayAll && !isHovered) {
          if (!video.paused) {
            video.pause()
          }
        }
      })
    }

    setupVideos()
    const playInterval = setInterval(setupVideos, 1000)

    return () => {
      clearInterval(playInterval)
    }
  }, [hovered, autoplayAll, activeFrame])

  // Función para manejar clics en móvil
  const handleMobileClick = (frameId: number) => {
    if (isMobile) {
      setActiveFrame(activeFrame === frameId ? null : frameId)
    }
  }

  // Función para navegar a tours
  const handleViajar = () => {
    router.push("/tours")
  }

  // Función para hacer scroll a la sección de paquetes
  const handleReservar = () => {
    const tourPackagesSection = document.getElementById("tour-packages-section")
    if (tourPackagesSection) {
      tourPackagesSection.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
    }
  }

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      {/* Desktop Layout - Horizontal */}
      {!isMobile && (
        <div className="w-full h-full flex">
          {frames.map((frame) => {
            const isActive = hovered === frame.id

            return (
              <motion.div
                key={frame.id}
                className="relative h-full cursor-pointer"
                style={{
                  flex: isActive ? 2 : 1,
                  transition: "flex 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
                }}
                onMouseEnter={() => setHovered(frame.id)}
                onMouseLeave={() => setHovered(null)}
              >
                {/* Video with content overlay */}
                <div className="absolute inset-0 overflow-hidden">
                  <video
                    src={frame.video}
                    className="w-full h-full object-cover"
                    loop
                    muted
                    playsInline
                    preload="auto"
                    autoPlay
                  />

                  {/* Dark overlay for better text visibility */}
                  <div className="absolute inset-0 bg-black/40" />

                  {/* Content overlay */}
                  <div className="absolute inset-0 flex flex-col justify-between p-6 md:p-8 z-10">
                    {/* Top content - empty for header space */}
                    <div className="h-24"></div>

                    {/* Middle content */}
                    <div className="flex flex-col items-center justify-center flex-1">
                      <motion.div
                        className="text-center"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                      >
                        <div className="text-peru-gold font-bold text-2xl md:text-3xl lg:text-4xl brand-text mb-2">
                          {frame.label}
                        </div>
                        {frame.sublabel && (
                          <div className="text-peru-gold/90 text-lg md:text-xl brand-text mb-2">{frame.sublabel}</div>
                        )}
                        <div className="text-peru-gold/70 text-sm md:text-base body-text mb-6">{frame.description}</div>

                        {/* Botones de acción - Solo visible cuando está activo */}
                        {isActive && (
                          <motion.div
                            className="flex gap-3 justify-center"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: 0.2 }}
                          >
                            <motion.button
                              onClick={handleViajar}
                              className="px-4 py-2 bg-transparent border border-peru-gold/50 text-peru-gold text-xs font-medium rounded hover:bg-peru-gold hover:text-black transition-all duration-300"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              VIAJAR
                            </motion.button>
                            <motion.button
                              onClick={handleReservar}
                              className="px-4 py-2 bg-peru-gold text-black text-xs font-medium rounded hover:bg-peru-gold/90 transition-all duration-300"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              RESERVAR
                            </motion.button>
                          </motion.div>
                        )}
                      </motion.div>
                    </div>

                    {/* Bottom content */}
                    <div className="text-peru-gold/60 text-xs text-center">
                      {isActive && (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: 0.3 }}
                        >
                          <span className="brand-text">→ DESCUBRE PERÚ</span>
                        </motion.div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      )}

      {/* Mobile Layout - Vertical */}
      {isMobile && (
        <div className="w-full h-full flex flex-col">
          {frames.map((frame) => {
            const isActive = activeFrame === frame.id

            return (
              <motion.div
                key={frame.id}
                className="relative w-full cursor-pointer"
                style={{
                  flex: isActive ? 2 : 1,
                  transition: "flex 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
                  minHeight: isActive ? "60%" : "20%",
                }}
                onClick={() => handleMobileClick(frame.id)}
              >
                {/* Video with content overlay */}
                <div className="absolute inset-0 overflow-hidden">
                  <video
                    src={frame.video}
                    className="w-full h-full object-cover"
                    loop
                    muted
                    playsInline
                    preload="auto"
                    autoPlay
                  />

                  {/* Dark overlay for better text visibility */}
                  <div className="absolute inset-0 bg-black/40" />
                </div>

                {/* Content overlay */}
                <div className="absolute inset-0 flex flex-col justify-between p-4 z-10">
                  {/* Top content - Empty space for header */}
                  <div className="h-16"></div>

                  {/* Middle content - Centered when active */}
                  <div className="flex-1 flex flex-col justify-center items-center">
                    {isActive && (
                      <motion.div
                        className="text-center"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                      >
                        <div className="text-peru-gold font-bold text-xl md:text-2xl brand-text mb-1">
                          {frame.label}
                        </div>
                        {frame.sublabel && (
                          <div className="text-peru-gold/90 text-sm md:text-base brand-text mb-2">{frame.sublabel}</div>
                        )}
                        <div className="text-peru-gold/70 text-xs md:text-sm body-text mb-4">{frame.description}</div>

                        {/* Botones móviles */}
                        <motion.div
                          className="flex gap-2 justify-center"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: 0.2 }}
                        >
                          <motion.button
                            onClick={handleViajar}
                            className="px-3 py-1.5 bg-transparent border border-peru-gold/50 text-peru-gold text-xs font-medium rounded hover:bg-peru-gold hover:text-black transition-all duration-300"
                            whileTap={{ scale: 0.95 }}
                          >
                            VIAJAR
                          </motion.button>
                          <motion.button
                            onClick={handleReservar}
                            className="px-3 py-1.5 bg-peru-gold text-black text-xs font-medium rounded hover:bg-peru-gold/90 transition-all duration-300"
                            whileTap={{ scale: 0.95 }}
                          >
                            RESERVAR
                          </motion.button>
                        </motion.div>
                      </motion.div>
                    )}
                  </div>

                  {/* Bottom content - Label when not active */}
                  {!isActive && (
                    <div className="flex flex-col items-center justify-end pb-8">
                      <div className="text-peru-gold text-center">
                        <div className="text-lg md:text-xl brand-text">{frame.label}</div>
                        {frame.sublabel && (
                          <div className="text-sm md:text-base brand-text opacity-80">{frame.sublabel}</div>
                        )}
                        <div className="text-xs body-text mt-1 opacity-60">Toca para explorar</div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Overlay semi-transparente para indicar que es interactivo */}
                {!isActive && <div className="absolute inset-0 bg-black/20"></div>}
              </motion.div>
            )
          })}
        </div>
      )}
    </div>
  )
}
