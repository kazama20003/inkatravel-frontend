"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Image from "next/image"

export default function OurServiceSection() {
  const [activeTab, setActiveTab] = useState("CHARITY COMMITMENT")

  const tabs = [
    "TAILOR-MADE",
    "EXPERT GUIDES",
    "PRICE PROMISE",
    "FAMILY OPERATED",
    "CARBON OFFSET",
    "CHARITY COMMITMENT",
  ]

  const tabContent = {
    "TAILOR-MADE": {
      title: "Tailor-Made",
      description:
        "Every journey is uniquely crafted to match your personal preferences, interests, and travel style. Our expert team designs bespoke itineraries that create unforgettable experiences tailored just for you.",
      image: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=1000&auto=format&fit=crop",
      buttonText: "PLAN YOUR JOURNEY",
    },
    "EXPERT GUIDES": {
      title: "Expert Guides",
      description:
        "Our carefully selected local guides bring destinations to life with their deep knowledge, passion, and insider access. Experience authentic cultural connections and hidden gems only locals know.",
      image: "https://images.unsplash.com/photo-1539650116574-75c0c6d73c6e?q=80&w=1000&auto=format&fit=crop",
      buttonText: "MEET OUR GUIDES",
    },
    "PRICE PROMISE": {
      title: "Price Promise",
      description:
        "We guarantee transparent pricing with no hidden costs. If you find a comparable trip at a lower price, we'll match it. Your investment goes directly into creating exceptional travel experiences.",
      image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=1000&auto=format&fit=crop",
      buttonText: "VIEW PRICING",
    },
    "FAMILY OPERATED": {
      title: "Family Operated",
      description:
        "As a family-run business, we bring personal care and attention to every detail of your journey. Our commitment to excellence spans generations, ensuring authentic and heartfelt service.",
      image: "https://images.unsplash.com/photo-1511895426328-dc8714191300?q=80&w=1000&auto=format&fit=crop",
      buttonText: "OUR STORY",
    },
    "CARBON OFFSET": {
      title: "Carbon Offset",
      description:
        "We're committed to responsible travel. Every trip includes carbon offsetting initiatives, supporting reforestation projects and renewable energy programs to minimize environmental impact.",
      image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=1000&auto=format&fit=crop",
      buttonText: "SUSTAINABILITY",
    },
    "CHARITY COMMITMENT": {
      title: "Charity Commitment",
      description:
        "We are proud to be the official travel partner for the ForRangers Foundation, supporting their critical conservation efforts and protecting endangered wildlife.",
      image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=1000&auto=format&fit=crop",
      buttonText: "FIND OUT MORE",
    },
  }

  const currentContent = tabContent[activeTab as keyof typeof tabContent]

  return (
    <section className="min-h-screen bg-[#1a1f3a] text-white py-16 px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-light mb-6">
            <span className="text-2xl">→</span> Our Service <span className="text-2xl">←</span>
          </h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">Tailor-made itineraries, crafted by our experts</p>
        </motion.div>

        {/* Tabs Navigation */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          viewport={{ once: true }}
        >
          <div className="flex flex-wrap justify-center gap-8 md:gap-12 border-b border-gray-600 pb-4">
            {tabs.map((tab, index) => (
              <motion.button
                key={tab}
                className={`text-sm md:text-base font-medium tracking-wider transition-all duration-300 pb-4 relative ${
                  activeTab === tab ? "text-white" : "text-gray-400 hover:text-gray-200"
                }`}
                onClick={() => setActiveTab(tab)}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.6,
                  ease: [0.16, 1, 0.3, 1],
                  delay: 0.4 + index * 0.1,
                }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {tab}
                {activeTab === tab && (
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-white"
                    layoutId="activeTab"
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  />
                )}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Content */}
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
          key={activeTab}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Image */}
          <motion.div
            className="relative h-80 lg:h-96 overflow-hidden"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          >
            <Image
              src={currentContent.image || "/placeholder.svg"}
              alt={currentContent.title}
              fill
              className="object-cover transition-transform duration-700 hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/20" />
          </motion.div>

          {/* Text Content */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
          >
            <h3 className="text-3xl md:text-4xl font-light">{currentContent.title}</h3>

            <p className="text-lg text-gray-300 leading-relaxed">{currentContent.description}</p>

            <motion.button
              className="border border-white px-8 py-3 text-sm font-medium tracking-wider hover:bg-white hover:text-[#1a1f3a] transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              {currentContent.buttonText}
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
