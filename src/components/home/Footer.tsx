"use client"
import { motion } from "framer-motion"
import { Facebook, Instagram, Mail, Phone, MapPin, Clock, Shield, Globe, ExternalLink } from "lucide-react"
import { useLanguage } from "@/contexts/LanguageContext"

export default function Footer() {
  const { t } = useLanguage()

  // Main navigation links
  const mainNavLinks = [
    { name: t("nav.transportes"), href: "/transport" },
    { name: t("nav.tours"), href: "/tours" },
    { name: t("nav.itinerarios"), href: "/itineraries" },
    { name: t("nav.cuando-ir"), href: "/when-to-go" },
    { name: t("nav.nosotros"), href: "/about-us" },
  ]

  // Additional service links
  const serviceLinks = [
    { name: t("footer.inspiration"), href: "/inspiration" },
    { name: t("footer.whyUs"), href: "/why-us" },
    { name: t("footer.journal"), href: "/journal" },
    { name: t("footer.sustainability"), href: "/sustainability" },
    { name: t("footer.contact"), href: "/contact" },
  ]

  // Legal and support links
  const legalLinks = [
    { name: t("footer.bookingConditions"), href: "/booking-conditions" },
    { name: t("footer.travelInsurance"), href: "/travel-insurance" },
    { name: t("footer.preDepartureInfo"), href: "/pre-departure-info" },
    { name: t("footer.privacyPolicy"), href: "/privacy-policy" },
    { name: t("footer.termsOfService"), href: "/terms-of-service" },
  ]

  // Social media links
  const socialLinks = [
    { name: "Facebook", icon: Facebook, href: "https://www.facebook.com/IncaTravelPeru", color: "#1877f2" },
    { name: "Instagram", icon: Instagram, href: "https://www.instagram.com/incatravelperu", color: "#e4405f" },
  ]

  // Certifications/badges
  const certifications = [
    { name: "ATOL", subtitle: "NO 12034", icon: Shield },
    { name: "100%", subtitle: t("footer.carbonSubtitle"), icon: Globe },
    { name: "24/7", subtitle: t("footer.availableNow"), icon: Clock },
  ]

  return (
    <footer className="bg-gradient-to-br from-[#1a1f3a] via-[#1e2347] to-[#252b54] text-white py-20 px-8 relative overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-blue-500 to-purple-500 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto w-full relative z-10">
        {/* Logo and Newsletter Section */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-light mb-6 bg-gradient-to-r from-amber-400 via-orange-500 to-amber-600 bg-clip-text text-transparent">
            <span className="text-xl text-white">→</span> Inca Travel Peru <span className="text-xl text-white">←</span>
          </h2>
          <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto leading-relaxed">{t("footer.aboutDescription")}</p>

          {/* Newsletter Signup */}
          <motion.div
            className="max-w-md mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            viewport={{ once: true }}
          >
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder={`${t("footer.email")}...`}
                className="flex-1 px-4 py-3 rounded-full bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-amber-400/60 focus:ring-2 focus:ring-amber-400/20 transition-all duration-300 backdrop-blur-sm"
              />
              <button className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 rounded-full font-medium transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
                {t("footer.subscribe")}
              </button>
            </div>
          </motion.div>
        </motion.div>

        {/* Certifications */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
          viewport={{ once: true }}
        >
          {certifications.map((cert, index) => {
            const IconComponent = cert.icon
            return (
              <motion.div
                key={cert.name}
                className="text-center p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.6,
                  ease: [0.16, 1, 0.3, 1],
                  delay: 0.4 + index * 0.1,
                }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.02, y: -5 }}
              >
                <IconComponent className="w-8 h-8 mx-auto mb-3 text-amber-400" />
                <h3 className="text-2xl font-bold mb-1">{cert.name}</h3>
                <p className="text-sm text-gray-400 uppercase tracking-wider">{cert.subtitle}</p>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Navigation Links Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
          viewport={{ once: true }}
        >
          {/* Main Navigation */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-amber-400 uppercase tracking-wider">
              {t("footer.destinations")}
            </h3>
            <nav className="space-y-3">
              {mainNavLinks.map((link, index) => (
                <motion.a
                  key={link.name}
                  href={link.href}
                  className="block text-gray-300 hover:text-amber-400 transition-colors duration-300 text-sm hover:translate-x-2 transform"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{
                    duration: 0.5,
                    ease: [0.16, 1, 0.3, 1],
                    delay: 0.5 + index * 0.05,
                  }}
                  viewport={{ once: true }}
                >
                  {link.name}
                </motion.a>
              ))}
            </nav>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-amber-400 uppercase tracking-wider">
              {t("footer.services")}
            </h3>
            <nav className="space-y-3">
              {serviceLinks.map((link, index) => (
                <motion.a
                  key={link.name}
                  href={link.href}
                  className="block text-gray-300 hover:text-amber-400 transition-colors duration-300 text-sm hover:translate-x-2 transform"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{
                    duration: 0.5,
                    ease: [0.16, 1, 0.3, 1],
                    delay: 0.6 + index * 0.05,
                  }}
                  viewport={{ once: true }}
                >
                  {link.name}
                </motion.a>
              ))}
            </nav>
          </div>

          {/* Legal & Support */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-amber-400 uppercase tracking-wider">{t("footer.info")}</h3>
            <nav className="space-y-3">
              {legalLinks.map((link, index) => (
                <motion.a
                  key={link.name}
                  href={link.href}
                  className="block text-gray-300 hover:text-amber-400 transition-colors duration-300 text-sm hover:translate-x-2 transform"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{
                    duration: 0.5,
                    ease: [0.16, 1, 0.3, 1],
                    delay: 0.7 + index * 0.05,
                  }}
                  viewport={{ once: true }}
                >
                  {link.name}
                </motion.a>
              ))}
            </nav>
          </div>
        </motion.div>

        {/* Contact Information */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-16 p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.8 }}
          viewport={{ once: true }}
        >
          {/* Phone Numbers */}
          <div className="text-center md:text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.9 }}
              viewport={{ once: true }}
            >
              <h4 className="text-sm font-medium tracking-wider text-amber-400 mb-4 uppercase flex items-center justify-center md:justify-start">
                <Phone className="w-4 h-4 mr-2" />
                {t("footer.callUs")}
              </h4>
              <div className="space-y-2">
                <a
                  href="tel:+51996407040"
                  className="block text-lg font-light hover:text-amber-400 transition-colors duration-300"
                >
                  +51 996 407 040
                </a>
                <a
                  href="tel:+51959748730"
                  className="block text-lg font-light hover:text-amber-400 transition-colors duration-300"
                >
                  +51 959 748 730
                </a>
              </div>
            </motion.div>
          </div>

          {/* Email */}
          <div className="text-center md:text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 1.0 }}
              viewport={{ once: true }}
            >
              <h4 className="text-sm font-medium tracking-wider text-amber-400 mb-4 uppercase flex items-center justify-center md:justify-start">
                <Mail className="w-4 h-4 mr-2" />
                {t("footer.emailUs")}
              </h4>
              <a
                href="mailto:incatravelperu21@gmail.com"
                className="text-lg font-light hover:text-amber-400 transition-colors duration-300 break-all"
              >
                incatravelperu21@gmail.com
              </a>
            </motion.div>
          </div>

          {/* Location */}
          <div className="text-center md:text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 1.1 }}
              viewport={{ once: true }}
            >
              <h4 className="text-sm font-medium tracking-wider text-amber-400 mb-4 uppercase flex items-center justify-center md:justify-start">
                <MapPin className="w-4 h-4 mr-2" />
                {t("footer.address")}
              </h4>
              <p className="text-lg font-light">C. San Agustín 210, Arequipa 04012 - Peru</p>
            </motion.div>
          </div>

          {/* Business Hours */}
          <div className="text-center md:text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 1.2 }}
              viewport={{ once: true }}
            >
              <h4 className="text-sm font-medium tracking-wider text-amber-400 mb-4 uppercase flex items-center justify-center md:justify-start">
                <Clock className="w-4 h-4 mr-2" />
                {t("footer.schedule")}
              </h4>
              <div className="text-sm space-y-1">
                <p>
                  {t("footer.monday")} - {t("footer.friday")}
                </p>
                <p className="font-light">8:00 AM - 6:00 PM</p>
                <p className="text-xs text-gray-400 mt-2">{t("footer.availableNow")}</p>
              </div>
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          className="text-center mb-12 p-6 rounded-2xl bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-400/20 backdrop-blur-sm"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 1.25 }}
          viewport={{ once: true }}
        >
          <motion.div
            className="flex items-center justify-center gap-3 text-gray-300 hover:text-purple-400 transition-colors duration-300"
            whileHover={{ scale: 1.05 }}
          >
            <span className="text-sm font-medium">{t("footer.developedBy")}</span>
            <a
              href="https://phoenixsolutions.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-lg font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent hover:from-purple-300 hover:to-blue-300 transition-all duration-300"
            >
              Phoenix Solutions
              <ExternalLink className="w-4 h-4 text-purple-400" />
            </a>
          </motion.div>
        </motion.div>

        {/* Social Media & Final Section */}
        <motion.div
          className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-gray-600/50"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 1.3 }}
          viewport={{ once: true }}
        >
          {/* Social Media */}
          <div className="flex items-center space-x-6 mb-6 md:mb-0">
            <h4 className="text-sm font-medium tracking-wider text-gray-400 uppercase">{t("footer.followUs")}</h4>
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => {
                const IconComponent = social.icon
                return (
                  <motion.a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 rounded-full border border-gray-600 flex items-center justify-center hover:border-gray-400 transition-all duration-300 group backdrop-blur-sm"
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{
                      duration: 0.4,
                      ease: [0.16, 1, 0.3, 1],
                      delay: 1.4 + index * 0.1,
                    }}
                    viewport={{ once: true }}
                    whileHover={{
                      scale: 1.1,
                      backgroundColor: social.color,
                      borderColor: social.color,
                      y: -2,
                    }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <IconComponent className="w-5 h-5 group-hover:text-white transition-colors duration-300" />
                  </motion.a>
                )
              })}
            </div>
          </div>

          {/* Copyright */}
          <div className="text-center md:text-right">
            <p className="text-sm text-gray-400 mb-2">
              © {new Date().getFullYear()} Inka Travel Peru. {t("footer.allRightsReserved")}.
            </p>
            <div className="flex flex-wrap justify-center md:justify-end gap-4 text-xs text-gray-500">
              <a href="/privacy-policy" className="hover:text-amber-400 transition-colors">
                {t("footer.privacyPolicy")}
              </a>
              <span>|</span>
              <a href="/terms-of-service" className="hover:text-amber-400 transition-colors">
                {t("footer.termsOfService")}
              </a>
              <span>|</span>
              <a href="/cookie-policy" className="hover:text-amber-400 transition-colors">
                {t("footer.cookiePolicy")}
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  )
}
