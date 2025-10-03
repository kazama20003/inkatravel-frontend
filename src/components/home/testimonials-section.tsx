"use client"

import { useState } from "react"
import { useLanguage } from "@/contexts/LanguageContext"
import { ChevronLeft, ChevronRight, Star } from "lucide-react"
import Image from "next/image"
export default function TestimonialsSection() {
  const { language } = useLanguage()
  const [currentTestimonial, setCurrentTestimonial] = useState(0)

  const content = {
  es: {
    title: "Lo que Dicen Nuestros Viajeros",
    subtitle: "Experiencias reales de quienes han viajado con nosotros",
    testimonials: [
      {
        name: "María González",
        location: "Madrid, España",
        rating: 5,
        text: "Una experiencia increíble. El tour a Machu Picchu superó todas mis expectativas. Los guías fueron excepcionales y el transporte muy cómodo.",
        image: "https://res.cloudinary.com/dwvikvjrq/image/upload/v1750432254/machupicchu-turista-wta_itauck.jpg",
      },
      {
        name: "John Smith",
        location: "New York, USA",
        rating: 5,
        text: "Perfect organization and amazing attention to detail. The Sacred Valley tour was breathtaking and our guide was incredibly knowledgeable.",
        image: "https://res.cloudinary.com/dwvikvjrq/image/upload/v1750188808/uploads/qjhgzjcohaz3jfzxku0o.jpg",
      },
      {
        name: "Sophie Dubois",
        location: "Paris, France",
        rating: 5,
        text: "Un voyage inoubliable au Pérou. L'équipe d'Inka Travel a rendu notre lune de miel parfaite. Service impeccable du début à la fin.",
        image: "https://res.cloudinary.com/dwvikvjrq/image/upload/v1748626604/vinincunca-mal-altura-full-scaled_ggnc9r.jpg",
      },
    ],
  },
  en: {
    title: "What Our Travelers Say",
    subtitle: "Real experiences from those who have traveled with us",
    testimonials: [
      {
        name: "María González",
        location: "Madrid, Spain",
        rating: 5,
        text: "An incredible experience. The Machu Picchu tour exceeded all my expectations. The guides were exceptional and the transport very comfortable.",
        image: "https://res.cloudinary.com/dwvikvjrq/image/upload/v1750432254/machupicchu-turista-wta_itauck.jpg",
      },
      {
        name: "John Smith",
        location: "New York, USA",
        rating: 5,
        text: "Perfect organization and amazing attention to detail. The Sacred Valley tour was breathtaking and our guide was incredibly knowledgeable.",
        image: "https://res.cloudinary.com/dwvikvjrq/image/upload/v1750188808/uploads/qjhgzjcohaz3jfzxku0o.jpg",
      },
      {
        name: "Sophie Dubois",
        location: "Paris, France",
        rating: 5,
        text: "An unforgettable trip to Peru. The Inka Travel team made our honeymoon perfect. Impeccable service from start to finish.",
        image: "https://res.cloudinary.com/dwvikvjrq/image/upload/v1748626604/vinincunca-mal-altura-full-scaled_ggnc9r.jpg",
      },
    ],
  },
  fr: {
    title: "Ce que Disent Nos Voyageurs",
    subtitle: "Expériences réelles de ceux qui ont voyagé avec nous",
    testimonials: [
      {
        name: "María González",
        location: "Madrid, Espagne",
        rating: 5,
        text: "Une expérience incroyable. Le tour du Machu Picchu a dépassé toutes mes attentes. Les guides étaient exceptionnels et le transport très confortable.",
        image: "https://res.cloudinary.com/dwvikvjrq/image/upload/v1750432254/machupicchu-turista-wta_itauck.jpg",
      },
      {
        name: "John Smith",
        location: "New York, USA",
        rating: 5,
        text: "Organisation parfaite et attention aux détails incroyable. Le tour de la Vallée Sacrée était à couper le souffle et notre guide était incroyablement compétent.",
        image: "https://res.cloudinary.com/dwvikvjrq/image/upload/v1750188808/uploads/qjhgzjcohaz3jfzxku0o.jpg",
      },
      {
        name: "Sophie Dubois",
        location: "Paris, France",
        rating: 5,
        text: "Un voyage inoubliable au Pérou. L'équipe d'Inka Travel a rendu notre lune de miel parfaite. Service impeccable du début à la fin.",
        image: "https://res.cloudinary.com/dwvikvjrq/image/upload/v1748626604/vinincunca-mal-altura-full-scaled_ggnc9r.jpg",
      },
    ],
  },
  de: {
    title: "Was Unsere Reisenden Sagen",
    subtitle: "Echte Erfahrungen von denen, die mit uns gereist sind",
    testimonials: [
      {
        name: "María González",
        location: "Madrid, Spanien",
        rating: 5,
        text: "Eine unglaubliche Erfahrung. Die Machu-Picchu-Tour hat all meine Erwartungen übertroffen. Die Guides waren außergewöhnlich und der Transport sehr komfortabel.",
        image: "https://res.cloudinary.com/dwvikvjrq/image/upload/v1750432254/machupicchu-turista-wta_itauck.jpg",
      },
      {
        name: "John Smith",
        location: "New York, USA",
        rating: 5,
        text: "Perfekte Organisation und erstaunliche Liebe zum Detail. Die Tour ins Heilige Tal war atemberaubend und unser Guide war unglaublich kompetent.",
        image: "/placeholder.svg?height=60&width=60",
      },
      {
        name: "Sophie Dubois",
        location: "Paris, Frankreich",
        rating: 5,
        text: "Eine unvergessliche Reise nach Peru. Das Inka-Travel-Team machte unsere Flitterwochen perfekt. Tadelloser Service von Anfang bis Ende.",
        image: "/placeholder.svg?height=60&width=60",
      },
    ],
  },
  it: {
    title: "Cosa Dicono i Nostri Viaggiatori",
    subtitle: "Esperienze reali di chi ha viaggiato con noi",
    testimonials: [
      {
        name: "María González",
        location: "Madrid, Spagna",
        rating: 5,
        text: "Un'esperienza incredibile. Il tour a Machu Picchu ha superato tutte le mie aspettative. Le guide erano eccezionali e il trasporto molto comodo.",
        image: "/placeholder.svg?height=60&width=60",
      },
      {
        name: "John Smith",
        location: "New York, USA",
        rating: 5,
        text: "Organizzazione perfetta e straordinaria attenzione ai dettagli. Il tour della Valle Sacra è stato mozzafiato e la nostra guida era incredibilmente preparata.",
        image: "/placeholder.svg?height=60&width=60",
      },
      {
        name: "Sophie Dubois",
        location: "Parigi, Francia",
        rating: 5,
        text: "Un viaggio indimenticabile in Perù. Il team di Inka Travel ha reso perfetta la nostra luna di miele. Servizio impeccabile dall'inizio alla fine.",
        image: "/placeholder.svg?height=60&width=60",
      },
    ],
  },
};


  const currentContent = content[language as keyof typeof content] || content.es

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev === currentContent.testimonials.length - 1 ? 0 : prev + 1))
  }

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev === 0 ? currentContent.testimonials.length - 1 : prev - 1))
  }

  return (
    <section className="bg-gray-50 py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">{currentContent.title}</h2>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto">{currentContent.subtitle}</p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-8 md:p-12 relative">
            <button
              onClick={prevTestimonial}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-amber-500 hover:bg-amber-600 text-white p-3 rounded-full transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <button
              onClick={nextTestimonial}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-amber-500 hover:bg-amber-600 text-white p-3 rounded-full transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            <div className="text-center max-w-3xl mx-auto">
              <div className="flex justify-center mb-6">
                {[...Array(currentContent.testimonials[currentTestimonial].rating)].map((_, i) => (
                  <Star key={i} className="w-6 h-6 text-amber-400 fill-current" />
                ))}
              </div>

              <blockquote className="text-xl md:text-2xl text-slate-700 leading-relaxed mb-8 italic">
                {currentContent.testimonials[currentTestimonial].text}
              </blockquote>

              <div className="flex items-center justify-center gap-4">
                <Image
                  src={currentContent.testimonials[currentTestimonial].image || "/placeholder.svg"}
                  alt={currentContent.testimonials[currentTestimonial].name}
                  width={64}   // equivalente a w-16
                  height={64}  // equivalente a h-16
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div className="text-left">
                  <div className="font-bold text-slate-800 text-lg">
                    {currentContent.testimonials[currentTestimonial].name}
                  </div>
                  <div className="text-slate-500">{currentContent.testimonials[currentTestimonial].location}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-center mt-8 gap-2">
            {currentContent.testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentTestimonial(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentTestimonial ? "bg-amber-500" : "bg-slate-300"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
