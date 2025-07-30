"use client"
import TourPackagesSection from "@/components/home/TourPackagesCarousel"
import AboutSection from "@/components/home/AboutSection"
import DiscoverSection from "@/components/home/DiscoverSection"
import OurServiceSection from "@/components/home/OurServiceSection"
import TestimonialsSection from "@/components/home/TestimonialsSection"
import ContactSection from "@/components/home/ContactSection"
import HeroSection from "@/components/home/hero-section"



export default function HomePage() {
  return (
    <div className="w-full">
        <div className="min-h-screen w-full">
        <HeroSection />
    </div>

      {/* Second Section - Tour Packages Section */}
      <div className="min-h-screen w-full">
        <TourPackagesSection />
      </div>

      {/* Third Section - About Section */}
      <div className="min-h-screen w-full">
        <AboutSection />
      </div>
      {/* Fourth Section - Discover Section */}
      <div className="min-h-screen w-full">
        <DiscoverSection />
      </div>

      {/* Fifth Section - Our Service Section */}
      <div className="min-h-screen w-full">
        <OurServiceSection />
      </div>

      {/* Sixth Section - Testimonials Section */}
      <div className="min-h-screen w-full">
        <TestimonialsSection />
      </div>

      {/* Seventh Section - Contact Section */}
      <div className="min-h-screen w-full">
        <ContactSection />
      </div>
    </div>
  )
}
