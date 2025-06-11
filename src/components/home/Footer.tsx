"use client"

import { motion } from "framer-motion"
import { Facebook, Instagram, Twitter, Youtube, Linkedin, Mail, Phone } from "lucide-react"

export default function Footer() {
  const navigationLinks = {
    main: [
      { name: "DESTINATIONS", href: "#" },
      { name: "INSPIRATION", href: "#" },
      { name: "ABOUT US", href: "#" },
      { name: "WHY US", href: "#" },
      { name: "CONTACT US", href: "#" },
      { name: "JOURNAL", href: "#" },
    ],
    secondary: [
      { name: "BOOKING CONDITIONS", href: "#" },
      { name: "TRAVEL INSURANCE", href: "#" },
      { name: "PRE-DEPARTURE INFO", href: "#" },
    ],
    topPages: [
      { name: "SAFARI HONEYMOONS", href: "#" },
      { name: "SAFARI & BEACH HONEYMOONS", href: "#" },
      { name: "FAMILY SAFARIS", href: "#" },
      { name: "LUXURY SAFARIS", href: "#" },
    ],
  }

  const socialLinks = [
    { name: "Facebook", icon: Facebook, href: "#", color: "#1877f2" },
    { name: "Instagram", icon: Instagram, href: "#", color: "#e4405f" },
    { name: "Twitter", icon: Twitter, href: "#", color: "#1da1f2" },
    { name: "YouTube", icon: Youtube, href: "#", color: "#ff0000" },
    { name: "LinkedIn", icon: Linkedin, href: "#", color: "#0077b5" },
  ]

  return (
    <footer className="bg-[#1a1f3a] text-white py-16 px-8 min-h-screen flex flex-col justify-center">
      <div className="max-w-7xl mx-auto w-full">
        {/* Logo */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-light">
            <span className="text-xl">→</span> Nelson Travel <span className="text-xl">←</span>
          </h2>
        </motion.div>

        {/* Main Navigation */}
        <motion.div
          className="border-b border-gray-600 pb-8 mb-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          viewport={{ once: true }}
        >
          <nav className="flex flex-wrap justify-center gap-6 md:gap-12">
            {navigationLinks.main.map((link, index) => (
              <motion.a
                key={link.name}
                href={link.href}
                className="text-sm font-medium tracking-wider hover:text-gray-300 transition-colors duration-300"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.6,
                  ease: [0.16, 1, 0.3, 1],
                  delay: 0.4 + index * 0.1,
                }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
              >
                {link.name}
              </motion.a>
            ))}
          </nav>
        </motion.div>

        {/* Secondary Navigation */}
        <motion.div
          className="border-b border-gray-600 pb-8 mb-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
          viewport={{ once: true }}
        >
          <nav className="flex flex-wrap justify-center gap-6 md:gap-12">
            {navigationLinks.secondary.map((link, index) => (
              <motion.a
                key={link.name}
                href={link.href}
                className="text-sm font-medium tracking-wider hover:text-gray-300 transition-colors duration-300"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.6,
                  ease: [0.16, 1, 0.3, 1],
                  delay: 0.6 + index * 0.1,
                }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
              >
                {link.name}
              </motion.a>
            ))}
          </nav>
        </motion.div>

        {/* Top Pages */}
        <motion.div
          className="border-b border-gray-600 pb-8 mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="text-center mb-6">
            <h3 className="text-sm font-medium tracking-wider text-gray-400 mb-6">TOP PAGES</h3>
          </div>
          <nav className="flex flex-wrap justify-center gap-6 md:gap-12">
            {navigationLinks.topPages.map((link, index) => (
              <motion.a
                key={link.name}
                href={link.href}
                className="text-sm font-medium tracking-wider hover:text-gray-300 transition-colors duration-300"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.6,
                  ease: [0.16, 1, 0.3, 1],
                  delay: 0.8 + index * 0.1,
                }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
              >
                {link.name}
              </motion.a>
            ))}
          </nav>
        </motion.div>

        {/* Contact Information & Social Media */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.8 }}
          viewport={{ once: true }}
        >
          {/* Call Us */}
          <div className="text-center md:text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 1.0 }}
              viewport={{ once: true }}
            >
              <h4 className="text-sm font-medium tracking-wider text-gray-400 mb-3">CALL US</h4>
              <a
                href="tel:+441235635749"
                className="text-xl font-light hover:text-gray-300 transition-colors duration-300 flex items-center justify-center md:justify-start"
              >
                <Phone className="w-5 h-5 mr-3" />
                +44 (0) 1235 635749
              </a>
            </motion.div>
          </div>

          {/* Social Media */}
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 1.1 }}
              viewport={{ once: true }}
            >
              <h4 className="text-sm font-medium tracking-wider text-gray-400 mb-4">FOLLOW US</h4>
              <div className="flex justify-center space-x-4">
                {socialLinks.map((social, index) => {
                  const IconComponent = social.icon
                  return (
                    <motion.a
                      key={social.name}
                      href={social.href}
                      className="w-10 h-10 rounded-full border border-gray-600 flex items-center justify-center hover:border-gray-400 transition-all duration-300 group"
                      initial={{ opacity: 0, scale: 0 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{
                        duration: 0.4,
                        ease: [0.16, 1, 0.3, 1],
                        delay: 1.2 + index * 0.1,
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
            </motion.div>
          </div>

          {/* Email Us */}
          <div className="text-center md:text-right">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 1.2 }}
              viewport={{ once: true }}
            >
              <h4 className="text-sm font-medium tracking-wider text-gray-400 mb-3">EMAIL US</h4>
              <a
                href="mailto:hello@nelson.travel"
                className="text-xl font-light hover:text-gray-300 transition-colors duration-300 flex items-center justify-center md:justify-end"
              >
                <Mail className="w-5 h-5 mr-3" />
                hello@nelson.travel
              </a>
            </motion.div>
          </div>
        </motion.div>

        {/* Copyright */}
        <motion.div
          className="border-t border-gray-600 pt-8 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 1.4 }}
          viewport={{ once: true }}
        >
          <p className="text-sm text-gray-400">
            © {new Date().getFullYear()} Nelson Travel. All rights reserved. | Privacy Policy | Terms & Conditions
          </p>
        </motion.div>
      </div>
    </footer>
  )
}
