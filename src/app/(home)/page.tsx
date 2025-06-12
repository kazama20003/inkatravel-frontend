"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import DynamicFrameLayout from "@/components/home/DynamicFrameLayout"
import ExploreSection from "@/components/home/ExploreSection"
import AboutSection from "@/components/home/AboutSection"
import DiscoverSection from "@/components/home/DiscoverSection"
import OurServiceSection from "@/components/home/OurServiceSection"
import TestimonialsSection from "@/components/home/TestimonialsSection"
import Footer from "@/components/home/Footer"

export default function HomePage() {
  const [scrollPosition, setScrollPosition] = useState(0)
  const [isScrollingDown, setIsScrollingDown] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const lastScrollTime = useRef<number>(0)
  const scrolling = useRef<boolean>(false)
  const touchStartY = useRef<number>(0)
  const lastScrollPosition = useRef<number>(0)

  // Get current section based on scroll position
  const getCurrentSection = useCallback(() => {
    if (scrollPosition < 50) return 0 // Video
    if (scrollPosition < 150) return 1 // Explore
    if (scrollPosition < 250) return 2 // About
    if (scrollPosition < 350) return 3 // Discover
    if (scrollPosition < 450) return 4 // Our Service
    if (scrollPosition < 550) return 5 // Testimonials
    return 6 // Footer
  }, [scrollPosition])

  // Smooth scroll function with improved easing
  const smoothScroll = useCallback(
    (targetPosition: number) => {
      if (!scrollRef.current || scrolling.current) return

      scrolling.current = true
      const startPosition = scrollPosition
      const distance = targetPosition - startPosition
      const duration = 1200 // Increased duration for smoother animation
      let startTime: number | null = null

      const animation = (currentTime: number) => {
        if (startTime === null) startTime = currentTime
        const timeElapsed = currentTime - startTime
        const progress = Math.min(timeElapsed / duration, 1)

        // Improved easing function for smoother transitions
        const easeInOutQuart = (t: number) => (t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2)

        const newPosition = startPosition + distance * easeInOutQuart(progress)
        setScrollPosition(newPosition)

        // Track scroll direction
        const newIsScrollingDown = newPosition > lastScrollPosition.current
        setIsScrollingDown(newIsScrollingDown)
        lastScrollPosition.current = newPosition

        if (timeElapsed < duration) {
          requestAnimationFrame(animation)
        } else {
          setScrollPosition(targetPosition)
          scrolling.current = false
          lastScrollTime.current = Date.now()
        }
      }

      requestAnimationFrame(animation)
    },
    [scrollPosition],
  )

  // Handle wheel events with improved throttling
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault()

      // Improved throttling - prevent rapid scrolling
      const now = Date.now()
      if (now - lastScrollTime.current < 800 || scrolling.current) return // Increased throttle time

      const currentSection = getCurrentSection()
      const scrollDirection = e.deltaY > 0 ? "down" : "up"

      if (scrollDirection === "down") {
        // Scroll DOWN - go to NEXT section
        if (currentSection === 0) {
          smoothScroll(100) // Video -> Explore
        } else if (currentSection === 1) {
          smoothScroll(200) // Explore -> About
        } else if (currentSection === 2) {
          smoothScroll(300) // About -> Discover
        } else if (currentSection === 3) {
          smoothScroll(400) // Discover -> Our Service
        } else if (currentSection === 4) {
          smoothScroll(500) // Our Service -> Testimonials
        } else if (currentSection === 5) {
          smoothScroll(600) // Testimonials -> Footer
        }
      } else {
        // Scroll UP - go to PREVIOUS section
        if (currentSection === 6) {
          smoothScroll(500) // Footer -> Testimonials
        } else if (currentSection === 5) {
          smoothScroll(400) // Testimonials -> Our Service
        } else if (currentSection === 4) {
          smoothScroll(300) // Our Service -> Discover
        } else if (currentSection === 3) {
          smoothScroll(200) // Discover -> About
        } else if (currentSection === 2) {
          smoothScroll(100) // About -> Explore
        } else if (currentSection === 1) {
          smoothScroll(0) // Explore -> Video
        }
      }
    }

    const currentRef = scrollRef.current
    if (currentRef) {
      currentRef.addEventListener("wheel", handleWheel, { passive: false })
    }

    return () => {
      if (currentRef) {
        currentRef.removeEventListener("wheel", handleWheel)
      }
    }
  }, [getCurrentSection, smoothScroll])

  // Handle touch events for mobile with improved sensitivity
  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      touchStartY.current = e.touches[0].clientY
    }

    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault()

      if (scrolling.current) return

      const touchY = e.touches[0].clientY
      const diff = touchStartY.current - touchY
      const currentSection = getCurrentSection()

      // Reduced sensitivity threshold for better mobile experience
      if (diff > 30) {
        // Swipe UP - go to NEXT section
        if (currentSection === 0) {
          smoothScroll(100) // Video -> Explore
        } else if (currentSection === 1) {
          smoothScroll(200) // Explore -> About
        } else if (currentSection === 2) {
          smoothScroll(300) // About -> Discover
        } else if (currentSection === 3) {
          smoothScroll(400) // Discover -> Our Service
        } else if (currentSection === 4) {
          smoothScroll(500) // Our Service -> Testimonials
        } else if (currentSection === 5) {
          smoothScroll(600) // Testimonials -> Footer
        }
      } else if (diff < -30) {
        // Swipe DOWN - go to PREVIOUS section
        if (currentSection === 6) {
          smoothScroll(500) // Footer -> Testimonials
        } else if (currentSection === 5) {
          smoothScroll(400) // Testimonials -> Our Service
        } else if (currentSection === 4) {
          smoothScroll(300) // Our Service -> Discover
        } else if (currentSection === 3) {
          smoothScroll(200) // Discover -> About
        } else if (currentSection === 2) {
          smoothScroll(100) // About -> Explore
        } else if (currentSection === 1) {
          smoothScroll(0) // Explore -> Video
        }
      }
    }

    const currentRef = scrollRef.current
    if (currentRef) {
      currentRef.addEventListener("touchstart", handleTouchStart)
      currentRef.addEventListener("touchmove", handleTouchMove, { passive: false })
    }

    return () => {
      if (currentRef) {
        currentRef.removeEventListener("touchstart", handleTouchStart)
        currentRef.removeEventListener("touchmove", handleTouchMove)
      }
    }
  }, [getCurrentSection, smoothScroll])

  // Expose scroll data to parent via custom event
  useEffect(() => {
    const event = new CustomEvent("homeScrollChange", {
      detail: { scrollPosition, isScrollingDown },
    })
    window.dispatchEvent(event)
  }, [scrollPosition, isScrollingDown])

  return (
    <div ref={scrollRef} className="h-full w-full overflow-hidden relative">
      <div
        className="h-full transition-transform ease-out"
        style={{
          transform: `translateY(-${scrollPosition}vh)`,
          transitionDuration: scrolling.current ? "0ms" : "300ms", // Smooth CSS transition when not actively scrolling
        }}
      >
        {/* First Section - Video Layout */}
        <div className="h-screen w-full min-h-screen bg-black">
          <DynamicFrameLayout />
        </div>

        {/* Second Section - Explore Section */}
        <div className="h-screen w-full min-h-screen">
          <ExploreSection />
        </div>

        {/* Third Section - About Section */}
        <div className="h-screen w-full min-h-screen">
          <AboutSection />
        </div>

        {/* Fourth Section - Discover Section */}
        <div className="h-screen w-full min-h-screen">
          <DiscoverSection />
        </div>

        {/* Fifth Section - Our Service Section */}
        <div className="h-screen w-full min-h-screen">
          <OurServiceSection />
        </div>

        {/* Sixth Section - Testimonials Section */}
        <div className="h-screen w-full min-h-screen">
          <TestimonialsSection />
        </div>

        {/* Seventh Section - Footer */}
        <div className="h-screen w-full min-h-screen">
          <Footer />
        </div>
      </div>
    </div>
  )
}
