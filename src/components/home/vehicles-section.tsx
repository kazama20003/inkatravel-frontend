"use client"
import { motion } from "framer-motion"
import Image from "next/image"
import { useLanguage } from "@/contexts/LanguageContext"
import { Users } from "lucide-react"

export default function VehiclesSection() {
  const { language } = useLanguage()

  const translations = {
    es: {
      title: "Nuestra Flota",
      suv: {
        name: "Toyota Land Cruiser 4x4",
        capacity: "Hasta 7 pasajeros",
        service: "Servicio Premium",
      },
      van: {
        name: "Mercedes-Benz Sprinter",
        capacity: "Hasta 20 pasajeros",
        service: "Servicio Básico",
      },
    },
    en: {
      title: "Our Fleet",
      suv: {
        name: "Toyota Land Cruiser 4x4",
        capacity: "Up to 7 passengers",
        service: "Premium Service",
      },
      van: {
        name: "Mercedes-Benz Sprinter",
        capacity: "Up to 20 passengers",
        service: "Basic Service",
      },
    },
    fr: {
      title: "Notre Flotte",
      suv: {
        name: "Toyota Land Cruiser 4x4",
        capacity: "Jusqu'à 7 passagers",
        service: "Service Premium",
      },
      van: {
        name: "Mercedes-Benz Sprinter",
        capacity: "Jusqu'à 20 passagers",
        service: "Service Basique",
      },
    },
    de: {
      title: "Unsere Flotte",
      suv: {
        name: "Toyota Land Cruiser 4x4",
        capacity: "Bis zu 7 Passagiere",
        service: "Premium-Service",
      },
      van: {
        name: "Mercedes-Benz Sprinter",
        capacity: "Bis zu 20 Passagiere",
        service: "Basis-Service",
      },
    },
    it: {
      title: "La Nostra Flotta",
      suv: {
        name: "Toyota Land Cruiser 4x4",
        capacity: "Fino a 7 passeggeri",
        service: "Servizio Premium",
      },
      van: {
        name: "Mercedes-Benz Sprinter",
        capacity: "Fino a 20 passeggeri",
        service: "Servizio Base",
      },
    },
  }

  const t = translations[language] || translations.es

  const vehicles = [
    {
      name: t.suv.name,
      capacity: t.suv.capacity,
      service: t.suv.service,
      image: "https://res.cloudinary.com/dwvikvjrq/image/upload/v1760397864/Imagen_de_WhatsApp_2025-10-09_a_las_14.29.00_cdc00a58_brxbbo.jpg",
    },
    {
      name: t.van.name,
      capacity: t.van.capacity,
      service: t.van.service,
      image: "https://res.cloudinary.com/dwvikvjrq/image/upload/v1760397974/Used-2023-Mercedes-Benz-Sprinter-2500-Cargo-High-Roof-Extended-w170-WB-Extended-Van-3D-1739977823_byhnm2.jpg",
    },
  ]

  return (
    <section className="bg-background">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="py-12 text-center"
      >
        <h2 className="text-3xl md:text-4xl font-light text-foreground tracking-tight">{t.title}</h2>
        <div className="w-12 h-px bg-peru-gold mx-auto mt-4" />
      </motion.div>

      <div className="grid md:grid-cols-2 gap-0">
        {vehicles.map((vehicle, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: index * 0.15 }}
            className="group relative"
          >
            <div className="relative h-[90vh] overflow-hidden bg-muted">
              <Image
                src={vehicle.image || "/placeholder.svg"}
                alt={vehicle.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

              <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                <div className="inline-block px-4 py-1 mb-4 bg-peru-gold/20 backdrop-blur-sm border border-peru-gold/30">
                  <span className="text-xs font-light tracking-widest uppercase text-peru-gold">{vehicle.service}</span>
                </div>
                <h3 className="text-2xl font-light mb-3 tracking-wide">{vehicle.name}</h3>
                <div className="flex items-center gap-3 opacity-90">
                  <Users className="w-5 h-5 text-peru-gold" />
                  <span className="text-sm font-light tracking-wide">{vehicle.capacity}</span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
