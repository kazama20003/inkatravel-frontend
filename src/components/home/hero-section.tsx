"use client"
import { motion } from "framer-motion"
import { ArrowRight, MessageCircle } from "lucide-react"
import Image from "next/image"
import { useLanguage } from "@/contexts/LanguageContext"
import Link from "next/link"

export default function HeroSection() {
  const { language } = useLanguage()

  const translations = {
    es: {
      creator: "Expertos en",
      title: "TRANSPORTES\nY TURISMO",
      button: "Reservar",
      acceptPayment: "Aceptamos todas las tarjetas",
      whatsappContact: "WhatsApp Directo",
    },
    en: {
      creator: "Creator of",
      title: "TRANSPORT\n& TOURISM",
      button: "Book Now",
      acceptPayment: "We accept all cards",
      whatsappContact: "Direct WhatsApp",
    },
    fr: {
      creator: "Créateur de",
      title: "TRANSPORT\nET TOURISME",
      button: "Réserver",
      acceptPayment: "Nous acceptons toutes les cartes",
      whatsappContact: "WhatsApp Direct",
    },
    de: {
      creator: "Schöpfer von",
      title: "TRANSPORT\nUND TOURISMUS",
      button: "Buchen",
      acceptPayment: "Wir akzeptieren alle Karten",
      whatsappContact: "Direkter WhatsApp",
    },
    it: {
      creator: "Creatore di",
      title: "TRASPORTI\nE TURISMO",
      button: "Prenota",
      acceptPayment: "Accettiamo tutte le carte",
      whatsappContact: "WhatsApp Diretto",
    },
  }

  const t = translations[language] || translations.es

  // Payment methods
  const paymentMethods = [
    { name: "Visa", url: "https://img.icons8.com/color/96/000000/visa.png" },
    { name: "Mastercard", url: "https://img.icons8.com/color/96/000000/mastercard.png" },
    { name: "American Express", url: "https://img.icons8.com/color/96/000000/amex.png" },
  ]

  // WhatsApp numbers
  const whatsappNumbers = [
    { number: "+51996407040", flag: "🇵🇪" },
    { number: "+51959748730", flag: "🇵🇪" },
  ]

  return (
    <>
      <section className="hero-section relative h-screen w-full flex items-center justify-center overflow-hidden">
        {/* Video Background */}
        <div className="absolute inset-0 z-0">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover"
            poster="https://res.cloudinary.com/dkjaey6vv/video/upload/v1758308336/ssvid.net--Peru-Cinematic-Video-4K_1080p_wtzl6w.mp4"
          >
            <source
              src="https://res.cloudinary.com/dkjaey6vv/video/upload/v1758308336/ssvid.net--Peru-Cinematic-Video-4K_1080p_wtzl6w.mp4"
              type="video/mp4"
            />
            <Image
              src="https://res.cloudinary.com/dwvikvjrq/image/upload/v1758308769/ChatGPT_Image_1_jul_2025__15_21_51-removebg-preview_1_zi4adi.png"
              alt="Peru Landscape"
              fill
              className="object-cover"
              priority
            />
          </video>
          <div className="absolute inset-0 bg-black/50" />
        </div>

        {/* Centered Content */}
        <div className="hero-content relative z-10 text-center text-white px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-5xl mx-auto"
          >
            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="flex items-center justify-center gap-4 mb-12"
            >
              <div className="relative w-20 h-20 rounded-full overflow-hidden ring-4 ring-peru-gold/50 shadow-2xl">
                <Image
                  src="https://res.cloudinary.com/dwvikvjrq/image/upload/v1758308769/ChatGPT_Image_1_jul_2025__15_21_51-removebg-preview_1_zi4adi.png"
                  alt="Inca Travel Peru Logo"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              <div className="flex flex-col text-left">
                <span className="brand-text text-white text-3xl font-bold leading-tight tracking-wider">
                  INCA TRAVEL
                </span>
                <span className="text-peru-gold text-lg font-semibold -mt-1 tracking-widest">PERU</span>
              </div>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="body-text text-xl font-medium text-white/90 mb-6 tracking-wide"
            >
              {t.creator}
            </motion.h2>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="brand-text text-4xl md:text-6xl lg:text-7xl font-bold text-peru-orange mb-12 leading-none tracking-wider drop-shadow-2xl"
              style={{
                textShadow: "0 4px 20px rgba(0,0,0,0.8)",
              }}
            >
              {t.title.split("\\n").map((line, index) => (
                <div key={index}>{line}</div>
              ))}
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <Link href="/transport">
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: "0 8px 16px rgba(230, 126, 34, 0.25)" }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-peru-orange text-white font-bold px-12 py-6 rounded-2xl text-xl shadow-md hover:shadow-lg transition-all duration-300 border border-peru-orange/30 inline-flex items-center gap-3"
                >
                  {t.button}
                  <ArrowRight className="w-6 h-6 transition-transform" />
                </motion.button>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="mt-16 flex flex-col items-center gap-4"
            >
              <p className="text-white/70 text-sm tracking-wide">{t.acceptPayment}</p>
              <div className="flex items-center justify-center gap-8 flex-wrap">
                {paymentMethods.map((method) => (
                  <motion.div
                    key={method.name}
                    whileHover={{ scale: 1.1, opacity: 1 }}
                    className="opacity-75 hover:opacity-100 transition-opacity"
                  >
                    <Image
                      src={method.url || "/placeholder.svg"}
                      alt={method.name}
                      width={40}
                      height={40}
                      className="drop-shadow-lg"
                    />
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1 }}
              className="mt-12 flex flex-col items-center gap-3"
            >
              <p className="text-white/60 text-xs uppercase tracking-widest">{t.whatsappContact}</p>
              <div className="flex items-center justify-center gap-6 flex-wrap">
                {whatsappNumbers.map((contact) => (
                  <a
                    key={contact.number}
                    href={`https://wa.me/${contact.number.replace(/\D/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group"
                  >
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 hover:border-peru-green/50 transition-all duration-300 group-hover:bg-peru-green/10"
                    >
                      <MessageCircle className="w-4 h-4 text-peru-green" />
                      <span className="text-white/80 text-sm font-medium">
                        {contact.flag} {contact.number}
                      </span>
                    </motion.div>
                  </a>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Enhanced scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
        >
          <motion.div
            animate={{ y: [0, 15, 0] }}
            transition={{ duration: 2.5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
            className="w-8 h-12 border-2 border-white/60 rounded-full flex justify-center backdrop-blur-sm bg-white/10 shadow-lg"
          >
            <motion.div
              animate={{ y: [0, 16, 0] }}
              transition={{ duration: 2.5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
              className="w-1.5 h-4 bg-peru-orange rounded-full mt-2 shadow-sm"
            />
          </motion.div>
        </motion.div>
      </section>
    </>
  )
}
