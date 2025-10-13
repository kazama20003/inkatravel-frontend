"use client"
import CompanySection from "@/components/home/company-section"
import HeroSection from "@/components/home/hero-section"
import TransportToursSection from "@/components/home/transport-tours-section"
import ExperienceSection from "@/components/home/experience-section"
import ServicesSection from "@/components/home/services-section"
import TestimonialsSection from "@/components/home/testimonials-section"
import ToursSection from "@/components/home/tours-section"
import VehiclesSection from "@/components/home/vehicles-section"

export default function HomePage() {
  return (
    <div className="w-full">
        <div className="min-h-screen w-full">
        <HeroSection />
        <TransportToursSection />
        <VehiclesSection />
        <ToursSection />
        <CompanySection />
        <ExperienceSection />
        <ServicesSection />
        <TestimonialsSection />
        </div>
    </div>
  )
}
