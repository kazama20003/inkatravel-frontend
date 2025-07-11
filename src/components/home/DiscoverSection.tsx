"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { useLanguage } from "@/contexts/LanguageContext"

export default function DiscoverSection() {
  const { t } = useLanguage()

  const steps = [
    {
      letter: "a",
      title: t.stepPlanTitle,
      description: t.stepPlanDescription,
    },
    {
      letter: "b",
      title: t.stepCustomizeTitle,
      description: t.stepCustomizeDescription,
    },
    {
      letter: "c",
      title: t.stepEnjoyTitle,
      description: t.stepEnjoyDescription,
    },
  ]

  return (
    <section className="w-full bg-white overflow-hidden">
      <div className="w-full">
        {/* Two Column Layout - Full Width */}
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen lg:min-h-[100vh]">
          {/* Left Column - Content */}
          <motion.div
            className="h-full flex flex-col justify-center px-6 md:px-12 lg:px-16 xl:px-20 py-12 md:py-16 lg:py-20 order-2 lg:order-1"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            viewport={{ once: true }}
          >
            <div className="space-y-6 md:space-y-8 lg:space-y-10 max-w-xl">
              {/* Main Title */}
              <div className="space-y-3 md:space-y-4">
                <h2 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black leading-none tracking-tight">
                  {t.howItWorks.split(" ").map((word, index) => (
                    <span key={index}>
                      {index === 1 ? <em>{word}</em> : word}
                      {index < t.howItWorks.split(" ").length - 1 && " "}
                    </span>
                  ))}
                </h2>
                <p className="text-base md:text-lg lg:text-xl">{t.howItWorksSubtitle}</p>
              </div>

              {/* Steps List */}
              <div className="space-y-0">
                {steps.map((step, index) => (
                  <motion.div
                    key={step.letter}
                    className="py-4 md:py-5 border-b border-black"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.6,
                      ease: [0.16, 1, 0.3, 1],
                      delay: 0.2 + index * 0.1,
                    }}
                    viewport={{ once: true }}
                  >
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <span className="font-bold text-base md:text-lg">({step.letter})</span>
                      </div>
                      <div className="flex-1">
                        <span className="font-bold text-base md:text-lg mr-2">{step.title}</span>
                        <span className="text-base md:text-lg">{step.description}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Bottom Section */}
              <motion.div
                className="space-y-6 md:space-y-8 pt-4 md:pt-6"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.6 }}
                viewport={{ once: true }}
              >
                <div className="space-y-2 md:space-y-3">
                  <p className="text-xl md:text-2xl lg:text-3xl xl:text-4xl leading-tight">
                    {t.dontWaitText1.split("esperes").length > 1 ? (
                      <>
                        {t.dontWaitText1.split("esperes")[0]}
                        <em>esperes</em>
                        {t.dontWaitText1.split("esperes")[1]}
                      </>
                    ) : t.dontWaitText1.split("wait").length > 1 ? (
                      <>
                        {t.dontWaitText1.split("wait")[0]}
                        <em>wait</em>
                        {t.dontWaitText1.split("wait")[1]}
                      </>
                    ) : t.dontWaitText1.split("attendez").length > 1 ? (
                      <>
                        {t.dontWaitText1.split("attendez")[0]}
                        <em>attendez</em>
                        {t.dontWaitText1.split("attendez")[1]}
                      </>
                    ) : t.dontWaitText1.split("Warten").length > 1 ? (
                      <>
                        {t.dontWaitText1.split("Warten")[0]}
                        <em>Warten</em>
                        {t.dontWaitText1.split("Warten")[1]}
                      </>
                    ) : (
                      t.dontWaitText1
                    )}
                  </p>
                  <p className="text-xl md:text-2xl lg:text-3xl xl:text-4xl leading-tight">{t.dontWaitText2}</p>
                  <p className="text-xl md:text-2xl lg:text-3xl xl:text-4xl leading-tight">
                    {t.dontWaitText3.split("crecer").length > 1 ? (
                      <>
                        {t.dontWaitText3.split("crecer")[0]}
                        <em>crecer</em>
                        {t.dontWaitText3.split("crecer")[1]}
                      </>
                    ) : t.dontWaitText3.split("grow").length > 1 ? (
                      <>
                        {t.dontWaitText3.split("grow")[0]}
                        <em>grow</em>
                        {t.dontWaitText3.split("grow")[1]}
                      </>
                    ) : t.dontWaitText3.split("grandir").length > 1 ? (
                      <>
                        {t.dontWaitText3.split("grandir")[0]}
                        <em>grandir</em>
                        {t.dontWaitText3.split("grandir")[1]}
                      </>
                    ) : t.dontWaitText3.split("wachsen").length > 1 ? (
                      <>
                        {t.dontWaitText3.split("wachsen")[0]}
                        <em>wachsen</em>
                        {t.dontWaitText3.split("wachsen")[1]}
                      </>
                    ) : (
                      t.dontWaitText3
                    )}
                  </p>
                </div>

                <button className="bg-black text-white px-6 md:px-8 py-3 md:py-4 text-sm md:text-base font-medium uppercase tracking-wider hover:bg-peru-dark transition-colors duration-300">
                  {t.startAdventure}
                </button>
              </motion.div>
            </div>
          </motion.div>

          {/* Right Column - Image */}
          <motion.div
            className="relative h-screen lg:h-full min-h-[60vh] lg:min-h-screen overflow-hidden order-1 lg:order-2"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
            viewport={{ once: true }}
          >
            <Image
              src="https://res.cloudinary.com/dwvikvjrq/image/upload/v1750432254/recorrido-gria-turistas-machu-picchu-full_fvrlcn.jpg"
              alt={t.adventurerImageAlt}
              fill
              className="object-cover"
            />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
