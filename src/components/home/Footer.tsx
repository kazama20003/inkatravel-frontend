"use client"
import { motion } from "framer-motion"
import { Facebook, Instagram, Mail, Phone, MapPin, Clock, Shield, Globe } from "lucide-react"
import { useLanguage } from "@/contexts/LanguageContext"

export default function Footer() {
  const { t } = useLanguage()

  // Main navigation links
  const mainNavLinks = [
    { name: t.transport, href: "/transport" },
    { name: t.tours, href: "/tours" },
    { name: t.itineraries, href: "/itineraries" },
    { name: t.whenToGo, href: "/when-to-go" },
    { name: t.aboutUs, href: "/about-us" },
  ]

  // Additional service links
  const serviceLinks = [
    { name: t.inspiration, href: "/inspiration" },
    { name: t.whyUs, href: "/why-us" },
    { name: t.journal, href: "/journal" },
    { name: t.sustainability, href: "/sustainability" },
    { name: t.contact, href: "/contact" },
  ]

  // Legal and support links
  const legalLinks = [
    { name: t.bookingConditions, href: "/booking-conditions" },
    { name: t.travelInsurance, href: "/travel-insurance" },
    { name: t.preDepartureInfo, href: "/pre-departure-info" },
    { name: t.privacyPolicy, href: "/privacy-policy" },
    { name: t.termsOfService, href: "/terms-of-service" },
  ]

  // Social media links
  const socialLinks = [
    { name: "Facebook", icon: Facebook, href: "https://www.facebook.com/IncaTravelPeru", color: "#1877f2" },
    { name: "Instagram", icon: Instagram, href: "https://www.instagram.com/incatravelperu", color: "#e4405f" },
  ]

  // Certifications/badges
  const certifications = [
    { name: "ATOL", subtitle: "NO 12034", icon: Shield },
    { name: "100%", subtitle: t.carbonSubtitle, icon: Globe },
    { name: "24/7", subtitle: t.availableNow, icon: Clock },
  ]

  return (
    <footer className="bg-[#1a1f3a] text-white py-20 px-8">
      <div className="max-w-7xl mx-auto w-full">
        {/* Logo and Newsletter Section */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-light mb-6">
            <span className="text-xl">→</span> Inka Travel Peru <span className="text-xl">←</span>
          </h2>
          <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">{t.aboutDescription}</p>

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
                placeholder={`${t.email}...`}
                className="flex-1 px-4 py-3 rounded-full bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-white/40 transition-colors"
              />
              <button className="px-6 py-3 bg-[#e67e22] hover:bg-[#d35400] rounded-full font-medium transition-colors duration-300">
                {t.subscribe}
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
                className="text-center p-6 rounded-lg bg-white/5 border border-white/10"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.6,
                  ease: [0.16, 1, 0.3, 1],
                  delay: 0.4 + index * 0.1,
                }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.08)" }}
              >
                <IconComponent className="w-8 h-8 mx-auto mb-3 text-[#e67e22]" />
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
            <h3 className="text-lg font-semibold mb-6 text-[#e67e22] uppercase tracking-wider">{t.destinations}</h3>
            <nav className="space-y-3">
              {mainNavLinks.map((link, index) => (
                <motion.a
                  key={link.name}
                  href={link.href}
                  className="block text-gray-300 hover:text-white transition-colors duration-300 text-sm"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{
                    duration: 0.5,
                    ease: [0.16, 1, 0.3, 1],
                    delay: 0.5 + index * 0.05,
                  }}
                  viewport={{ once: true }}
                  whileHover={{ x: 5 }}
                >
                  {link.name}
                </motion.a>
              ))}
            </nav>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-[#e67e22] uppercase tracking-wider">{t.services}</h3>
            <nav className="space-y-3">
              {serviceLinks.map((link, index) => (
                <motion.a
                  key={link.name}
                  href={link.href}
                  className="block text-gray-300 hover:text-white transition-colors duration-300 text-sm"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{
                    duration: 0.5,
                    ease: [0.16, 1, 0.3, 1],
                    delay: 0.6 + index * 0.05,
                  }}
                  viewport={{ once: true }}
                  whileHover={{ x: 5 }}
                >
                  {link.name}
                </motion.a>
              ))}
            </nav>
          </div>

          {/* Legal & Support */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-[#e67e22] uppercase tracking-wider">{t.info}</h3>
            <nav className="space-y-3">
              {legalLinks.map((link, index) => (
                <motion.a
                  key={link.name}
                  href={link.href}
                  className="block text-gray-300 hover:text-white transition-colors duration-300 text-sm"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{
                    duration: 0.5,
                    ease: [0.16, 1, 0.3, 1],
                    delay: 0.7 + index * 0.05,
                  }}
                  viewport={{ once: true }}
                  whileHover={{ x: 5 }}
                >
                  {link.name}
                </motion.a>
              ))}
            </nav>
          </div>
        </motion.div>

        {/* Contact Information */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-16 p-8 rounded-2xl bg-white/5 border border-white/10"
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
              <h4 className="text-sm font-medium tracking-wider text-[#e67e22] mb-4 uppercase flex items-center justify-center md:justify-start">
                <Phone className="w-4 h-4 mr-2" />
                {t.callUs}
              </h4>
              <div className="space-y-2">
                <a
                  href="tel:+51996407040"
                  className="block text-lg font-light hover:text-[#e67e22] transition-colors duration-300"
                >
                  +51 996 407 040
                </a>
                <a
                  href="tel:+51959748730"
                  className="block text-lg font-light hover:text-[#e67e22] transition-colors duration-300"
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
              <h4 className="text-sm font-medium tracking-wider text-[#e67e22] mb-4 uppercase flex items-center justify-center md:justify-start">
                <Mail className="w-4 h-4 mr-2" />
                {t.emailUs}
              </h4>
              <a
                href="mailto:incatravelperu21@gmail.com"
                className="text-lg font-light hover:text-[#e67e22] transition-colors duration-300 break-all"
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
              <h4 className="text-sm font-medium tracking-wider text-[#e67e22] mb-4 uppercase flex items-center justify-center md:justify-start">
                <MapPin className="w-4 h-4 mr-2" />
                {t.address}
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
              <h4 className="text-sm font-medium tracking-wider text-[#e67e22] mb-4 uppercase flex items-center justify-center md:justify-start">
                <Clock className="w-4 h-4 mr-2" />
                {t.schedule}
              </h4>
              <div className="text-sm space-y-1">
                <p>
                  {t.monday} - {t.friday}
                </p>
                <p className="font-light">8:00 AM - 6:00 PM</p>
                <p className="text-xs text-gray-400 mt-2">{t.availableNow}</p>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Social Media & Final Section */}
        <motion.div
          className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-gray-600"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 1.3 }}
          viewport={{ once: true }}
        >
          {/* Social Media */}
          <div className="flex items-center space-x-6 mb-6 md:mb-0">
            <h4 className="text-sm font-medium tracking-wider text-gray-400 uppercase">{t.followUs}</h4>
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => {
                const IconComponent = social.icon
                return (
                  <motion.a
                    key={social.name}
                    href={social.href}
                    className="w-12 h-12 rounded-full border border-gray-600 flex items-center justify-center hover:border-gray-400 transition-all duration-300 group"
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
              © {new Date().getFullYear()} Inka Travel Peru. {t.allRightsReserved}.
            </p>
            <div className="flex flex-wrap justify-center md:justify-end gap-4 text-xs text-gray-500">
              <a href="/privacy-policy" className="hover:text-gray-300 transition-colors">
                {t.privacyPolicy}
              </a>
              <span>|</span>
              <a href="/terms-of-service" className="hover:text-gray-300 transition-colors">
                {t.termsOfService}
              </a>
              <span>|</span>
              <a href="/cookie-policy" className="hover:text-gray-300 transition-colors">
                {t.cookiePolicy}
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  )
}
