"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useMobile } from "@/hooks/use-mobile"

interface Frame {
  id: number
  video: string
  defaultPos: { x: number; y: number; w: number; h: number }
  corner: string
  edgeHorizontal: string
  edgeVertical: string
  mediaSize: number
  borderThickness: number
  borderSize: number
  label: string
  sublabel?: string
  projectId?: string
}

// Reduced to just 3 frames
const initialFrames: Frame[] = [
  {
    id: 1,
    video: "https://static.cdn-luma.com/files/981e483f71aa764b/Company%20Thing%20Exported.mp4",
    defaultPos: { x: 0, y: 0, w: 4, h: 12 },
    corner: "https://static.cdn-luma.com/files/bcf576df9c38b05f/1_corner_update.png",
    edgeHorizontal: "https://static.cdn-luma.com/files/bcf576df9c38b05f/1_vert_update.png",
    edgeVertical: "https://static.cdn-luma.com/files/bcf576df9c38b05f/1_hori_update.png",
    mediaSize: 1,
    borderThickness: 0,
    borderSize: 80,
    label: "MACHU PICCHU",
    projectId: "[01444]",
  },
  {
    id: 2,
    video: "https://static.cdn-luma.com/files/58ab7363888153e3/WebGL%20Exported%20(1).mp4",
    defaultPos: { x: 4, y: 0, w: 4, h: 12 },
    corner: "https://static.cdn-luma.com/files/bcf576df9c38b05f/2_corner_update.png",
    edgeHorizontal: "https://static.cdn-luma.com/files/bcf576df9c38b05f/2_vert_update.png",
    edgeVertical: "https://static.cdn-luma.com/files/bcf576df9c38b05f/2_hori_update.png",
    mediaSize: 1,
    borderThickness: 0,
    borderSize: 80,
    label: "AMAZONAS",
    sublabel: "IQUITOS",
  },
  {
    id: 3,
    video: "https://static.cdn-luma.com/files/58ab7363888153e3/Jitter%20Exported%20Poster.mp4",
    defaultPos: { x: 8, y: 0, w: 4, h: 12 },
    corner: "https://static.cdn-luma.com/files/3d36d1e0dba2476c/3_Corner_update.png",
    edgeHorizontal: "https://static.cdn-luma.com/files/3d36d1e0dba2476c/3_hori_update.png",
    edgeVertical: "https://static.cdn-luma.com/files/3d36d1e0dba2476c/3_Vert_update.png",
    mediaSize: 1,
    borderThickness: 0,
    borderSize: 80,
    label: "CUSCO",
    sublabel: "CIUDAD IMPERIAL",
  },
]

export default function DynamicFrameLayout() {
  const [frames] = useState<Frame[]>(initialFrames)
  const [hovered, setHovered] = useState<number | null>(null)
  const [showFrames] = useState(false)
  const [autoplayAll] = useState(true)
  const [activeFrame, setActiveFrame] = useState<number | null>(null)

  // Detectar si es móvil
  const isMobile = useMobile()

  // Handle video playback to prevent errors
  useEffect(() => {
    const videoElements = document.querySelectorAll("video")

    const setupVideos = () => {
      videoElements.forEach((video, index) => {
        const frameId = index + 1
        const isHovered = hovered === frameId || activeFrame === frameId

        if (autoplayAll || isHovered) {
          // Use muted attribute to allow autoplay
          video.muted = true

          // Only attempt to play if the video is not already playing
          if (video.paused) {
            const playPromise = video.play()

            if (playPromise !== undefined) {
              playPromise.catch(() => {
                // Autoplay was prevented, do nothing
              })
            }
          }
        } else if (!autoplayAll && !isHovered) {
          // Only pause if the video is actually playing
          if (!video.paused) {
            video.pause()
          }
        }
      })
    }

    // Initial setup
    setupVideos()

    // Setup interval to ensure videos play (helps with browser restrictions)
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

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* Desktop Layout - Horizontal */}
      {!isMobile && (
        <div className="w-full h-full flex">
          {frames.map((frame, index) => {
            const isActive = hovered === frame.id

            return (
              <motion.div
                key={frame.id}
                className="relative h-full"
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
                  />

                  {/* Content overlay */}
                  <div className="absolute inset-0 flex flex-col justify-between p-8">
                    {/* Top content - empty for header space */}
                    <div className="h-24"></div>

                    {/* Middle content */}
                    <div className="flex flex-col items-center justify-center">
                      {isActive && (
                        <div className="text-peru-gold font-bold text-xl brand-text">
                          {frame.label}
                          {frame.sublabel && <div className="text-peru-gold brand-text">{frame.sublabel}</div>}
                        </div>
                      )}
                    </div>

                    {/* Bottom content */}
                    <div className="text-peru-gold text-sm">
                      {isActive && (
                        <>
                          {frame.projectId && (
                            <div className="mb-2">
                              <span className="mr-2 brand-text">→DESCUBRE PERÚ</span>
                              <span className="brand-text">VIAJE {frame.projectId}</span>
                            </div>
                          )}
                          {index === 0 && (
                            <div className="text-xs">
                              <span className="mr-2 brand-text">{frame.label}</span>
                              <span className="opacity-70 body-text">[ver destino]</span>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>

                  {/* Frame borders (conditionally shown) */}
                  {showFrames && (
                    <div className="absolute inset-0 pointer-events-none">
                      {/* Corners */}
                      <div
                        className="absolute top-0 left-0 w-16 h-16 bg-contain bg-no-repeat"
                        style={{ backgroundImage: `url(${frame.corner})` }}
                      />
                      <div
                        className="absolute top-0 right-0 w-16 h-16 bg-contain bg-no-repeat"
                        style={{ backgroundImage: `url(${frame.corner})`, transform: "scaleX(-1)" }}
                      />
                      <div
                        className="absolute bottom-0 left-0 w-16 h-16 bg-contain bg-no-repeat"
                        style={{ backgroundImage: `url(${frame.corner})`, transform: "scaleY(-1)" }}
                      />
                      <div
                        className="absolute bottom-0 right-0 w-16 h-16 bg-contain bg-no-repeat"
                        style={{ backgroundImage: `url(${frame.corner})`, transform: "scale(-1, -1)" }}
                      />

                      {/* Edges */}
                      <div
                        className="absolute top-0 left-16 right-16 h-16"
                        style={{
                          backgroundImage: `url(${frame.edgeHorizontal})`,
                          backgroundSize: "auto 64px",
                          backgroundRepeat: "repeat-x",
                        }}
                      />
                      <div
                        className="absolute bottom-0 left-16 right-16 h-16"
                        style={{
                          backgroundImage: `url(${frame.edgeHorizontal})`,
                          backgroundSize: "auto 64px",
                          backgroundRepeat: "repeat-x",
                          transform: "rotate(180deg)",
                        }}
                      />
                      <div
                        className="absolute left-0 top-16 bottom-16 w-16"
                        style={{
                          backgroundImage: `url(${frame.edgeVertical})`,
                          backgroundSize: "64px auto",
                          backgroundRepeat: "repeat-y",
                        }}
                      />
                      <div
                        className="absolute right-0 top-16 bottom-16 w-16"
                        style={{
                          backgroundImage: `url(${frame.edgeVertical})`,
                          backgroundSize: "64px auto",
                          backgroundRepeat: "repeat-y",
                          transform: "scaleX(-1)",
                        }}
                      />
                    </div>
                  )}
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
                className="relative w-full"
                style={{
                  flex: isActive ? 2 : 1,
                  transition: "flex 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
                  height: isActive ? "60%" : "20%",
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
                  />
                </div>

                {/* Content overlay */}
                <div className="absolute inset-0 flex flex-col justify-between p-4">
                  {/* Top content - Empty space for header */}
                  <div className="h-6"></div>

                  {/* Middle content - Empty space */}
                  <div className="flex-1"></div>

                  {/* Bottom content - Label positioned in middle-bottom */}
                  <div className="flex flex-col items-center justify-end pb-8">
                    <div className="text-peru-gold text-center">
                      <div className="text-xl brand-text">{frame.label}</div>
                      {frame.sublabel && <div className="text-sm brand-text">{frame.sublabel}</div>}
                      {isActive && <div className="text-sm body-text mt-2">Toca para explorar</div>}
                    </div>

                    {/* Project ID - Only visible when active */}
                    {isActive && frame.projectId && (
                      <div className="text-peru-gold text-sm text-center mt-4">
                        <span className="mr-2 brand-text">→PERÚ</span>
                        <span className="brand-text">{frame.projectId}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Frame borders (conditionally shown) */}
                {showFrames && (
                  <div className="absolute inset-0 pointer-events-none">
                    {/* Corners */}
                    <div
                      className="absolute top-0 left-0 w-12 h-12 bg-contain bg-no-repeat"
                      style={{ backgroundImage: `url(${frame.corner})` }}
                    />
                    <div
                      className="absolute top-0 right-0 w-12 h-12 bg-contain bg-no-repeat"
                      style={{ backgroundImage: `url(${frame.corner})`, transform: "scaleX(-1)" }}
                    />
                    <div
                      className="absolute bottom-0 left-0 w-12 h-12 bg-contain bg-no-repeat"
                      style={{ backgroundImage: `url(${frame.corner})`, transform: "scaleY(-1)" }}
                    />
                    <div
                      className="absolute bottom-0 right-0 w-12 h-12 bg-contain bg-no-repeat"
                      style={{ backgroundImage: `url(${frame.corner})`, transform: "scale(-1, -1)" }}
                    />

                    {/* Edges */}
                    <div
                      className="absolute top-0 left-12 right-12 h-12"
                      style={{
                        backgroundImage: `url(${frame.edgeHorizontal})`,
                        backgroundSize: "auto 48px",
                        backgroundRepeat: "repeat-x",
                      }}
                    />
                    <div
                      className="absolute bottom-0 left-12 right-12 h-12"
                      style={{
                        backgroundImage: `url(${frame.edgeHorizontal})`,
                        backgroundSize: "auto 48px",
                        backgroundRepeat: "repeat-x",
                        transform: "rotate(180deg)",
                      }}
                    />
                    <div
                      className="absolute left-0 top-12 bottom-12 w-12"
                      style={{
                        backgroundImage: `url(${frame.edgeVertical})`,
                        backgroundSize: "48px auto",
                        backgroundRepeat: "repeat-y",
                      }}
                    />
                    <div
                      className="absolute right-0 top-12 bottom-12 w-12"
                      style={{
                        backgroundImage: `url(${frame.edgeVertical})`,
                        backgroundSize: "48px auto",
                        backgroundRepeat: "repeat-y",
                        transform: "scaleX(-1)",
                      }}
                    />
                  </div>
                )}

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
