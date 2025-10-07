"use client"

import { useLanguage } from "@/contexts/LanguageContext"
import { Star, Quote } from "lucide-react"
import Image from "next/image"

export default function TestimonialsSection() {
  const { language } = useLanguage()

  const content = {
    es: {
      title: "Lo que Dicen Nuestros Viajeros",
      subtitle: "Miles de viajeros han confiado en nosotros para crear sus experiencias inolvidables en Perú",
      testimonials: [
        {
          name: "María González",
          location: "Madrid, España",
          rating: 5,
          text: "Una experiencia increíble. El tour a Machu Picchu superó todas mis expectativas. Los guías fueron excepcionales y el transporte muy cómodo.",
          image: "https://res.cloudinary.com/dwvikvjrq/image/upload/v1750432254/machupicchu-turista-wta_itauck.jpg",
          tour: "Machu Picchu Clásico",
        },
        {
          name: "John Smith",
          location: "New York, USA",
          rating: 5,
          text: "Perfect organization and amazing attention to detail. The Sacred Valley tour was breathtaking and our guide was incredibly knowledgeable.",
          image: "https://res.cloudinary.com/dwvikvjrq/image/upload/v1750188808/uploads/qjhgzjcohaz3jfzxku0o.jpg",
          tour: "Valle Sagrado",
        },
        {
          name: "Sophie Dubois",
          location: "Paris, France",
          rating: 5,
          text: "Un voyage inoubliable au Pérou. L'équipe d'Inka Travel a rendu notre lune de miel parfaite. Service impeccable du début à la fin.",
          image:
            "https://res.cloudinary.com/dwvikvjrq/image/upload/v1748626604/vinincunca-mal-altura-full-scaled_ggnc9r.jpg",
          tour: "Montaña de Colores",
        },
        {
          name: "Carlos Rodríguez",
          location: "Buenos Aires, Argentina",
          rating: 5,
          text: "Excelente servicio desde la reserva hasta el final del viaje. El tour al Lago Titicaca fue mágico y los guías muy profesionales.",
          image: "/placeholder.svg?height=80&width=80",
          tour: "Lago Titicaca",
        },
        {
          name: "Emma Wilson",
          location: "London, UK",
          rating: 5,
          text: "Absolutely stunning experience! The Inca Trail trek was challenging but so rewarding. Our guide made sure everyone was safe and comfortable.",
          image: "/placeholder.svg?height=80&width=80",
          tour: "Camino Inca",
        },
        {
          name: "Hans Mueller",
          location: "Berlin, Germany",
          rating: 5,
          text: "Fantastische Organisation! Die Reise nach Cusco und Machu Picchu war perfekt geplant. Sehr empfehlenswert für alle Peru-Reisenden.",
          image: "/placeholder.svg?height=80&width=80",
          tour: "Cusco Completo",
        },
        {
          name: "Ana Silva",
          location: "São Paulo, Brasil",
          rating: 5,
          text: "Simplesmente perfeito! A equipe foi muito atenciosa e os passeios superaram minhas expectativas. Voltarei com certeza!",
          image: "/placeholder.svg?height=80&width=80",
          tour: "Tour Gastronómico",
        },
        {
          name: "Michael Chen",
          location: "Singapore",
          rating: 5,
          text: "Outstanding service and incredible sights. The Rainbow Mountain tour was the highlight of my South America trip. Highly recommended!",
          image: "/placeholder.svg?height=80&width=80",
          tour: "Montaña de Colores",
        },
        {
          name: "Isabella Rossi",
          location: "Roma, Italia",
          rating: 5,
          text: "Esperienza meravigliosa! La guida era molto preparata e il tour del Valle Sagrado è stato indimenticabile. Grazie mille!",
          image: "/placeholder.svg?height=80&width=80",
          tour: "Valle Sagrado Premium",
        },
      ],
    },
    en: {
      title: "What Our Travelers Say",
      subtitle: "Thousands of travelers have trusted us to create their unforgettable experiences in Peru",
      testimonials: [
        {
          name: "María González",
          location: "Madrid, Spain",
          rating: 5,
          text: "An incredible experience. The Machu Picchu tour exceeded all my expectations. The guides were exceptional and the transport very comfortable.",
          image: "https://res.cloudinary.com/dwvikvjrq/image/upload/v1750432254/machupicchu-turista-wta_itauck.jpg",
          tour: "Classic Machu Picchu",
        },
        {
          name: "John Smith",
          location: "New York, USA",
          rating: 5,
          text: "Perfect organization and amazing attention to detail. The Sacred Valley tour was breathtaking and our guide was incredibly knowledgeable.",
          image: "https://res.cloudinary.com/dwvikvjrq/image/upload/v1750188808/uploads/qjhgzjcohaz3jfzxku0o.jpg",
          tour: "Sacred Valley",
        },
        {
          name: "Sophie Dubois",
          location: "Paris, France",
          rating: 5,
          text: "An unforgettable trip to Peru. The Inka Travel team made our honeymoon perfect. Impeccable service from start to finish.",
          image:
            "https://res.cloudinary.com/dwvikvjrq/image/upload/v1748626604/vinincunca-mal-altura-full-scaled_ggnc9r.jpg",
          tour: "Rainbow Mountain",
        },
        {
          name: "Carlos Rodríguez",
          location: "Buenos Aires, Argentina",
          rating: 5,
          text: "Excellent service from booking to the end of the trip. The Lake Titicaca tour was magical and the guides very professional.",
          image: "/placeholder.svg?height=80&width=80",
          tour: "Lake Titicaca",
        },
        {
          name: "Emma Wilson",
          location: "London, UK",
          rating: 5,
          text: "Absolutely stunning experience! The Inca Trail trek was challenging but so rewarding. Our guide made sure everyone was safe and comfortable.",
          image: "/placeholder.svg?height=80&width=80",
          tour: "Inca Trail",
        },
        {
          name: "Hans Mueller",
          location: "Berlin, Germany",
          rating: 5,
          text: "Fantastic organization! The trip to Cusco and Machu Picchu was perfectly planned. Highly recommended for all Peru travelers.",
          image: "/placeholder.svg?height=80&width=80",
          tour: "Complete Cusco",
        },
        {
          name: "Ana Silva",
          location: "São Paulo, Brazil",
          rating: 5,
          text: "Simply perfect! The team was very attentive and the tours exceeded my expectations. I will definitely return!",
          image: "/placeholder.svg?height=80&width=80",
          tour: "Gastronomic Tour",
        },
        {
          name: "Michael Chen",
          location: "Singapore",
          rating: 5,
          text: "Outstanding service and incredible sights. The Rainbow Mountain tour was the highlight of my South America trip. Highly recommended!",
          image: "/placeholder.svg?height=80&width=80",
          tour: "Rainbow Mountain",
        },
        {
          name: "Isabella Rossi",
          location: "Roma, Italy",
          rating: 5,
          text: "Wonderful experience! The guide was very knowledgeable and the Sacred Valley tour was unforgettable. Thank you so much!",
          image: "/placeholder.svg?height=80&width=80",
          tour: "Premium Sacred Valley",
        },
      ],
    },
    fr: {
      title: "Ce que Disent Nos Voyageurs",
      subtitle: "Des milliers de voyageurs nous ont fait confiance pour créer leurs expériences inoubliables au Pérou",
      testimonials: [
        {
          name: "María González",
          location: "Madrid, Espagne",
          rating: 5,
          text: "Une expérience incroyable. Le tour du Machu Picchu a dépassé toutes mes attentes. Les guides étaient exceptionnels et le transport très confortable.",
          image: "https://res.cloudinary.com/dwvikvjrq/image/upload/v1750432254/machupicchu-turista-wta_itauck.jpg",
          tour: "Machu Picchu Classique",
        },
        {
          name: "John Smith",
          location: "New York, USA",
          rating: 5,
          text: "Organisation parfaite et attention aux détails incroyable. Le tour de la Vallée Sacrée était à couper le souffle et notre guide était incroyablement compétent.",
          image: "https://res.cloudinary.com/dwvikvjrq/image/upload/v1750188808/uploads/qjhgzjcohaz3jfzxku0o.jpg",
          tour: "Vallée Sacrée",
        },
        {
          name: "Sophie Dubois",
          location: "Paris, France",
          rating: 5,
          text: "Un voyage inoubliable au Pérou. L'équipe d'Inka Travel a rendu notre lune de miel parfaite. Service impeccable du début à la fin.",
          image:
            "https://res.cloudinary.com/dwvikvjrq/image/upload/v1748626604/vinincunca-mal-altura-full-scaled_ggnc9r.jpg",
          tour: "Montagne Arc-en-ciel",
        },
        {
          name: "Carlos Rodríguez",
          location: "Buenos Aires, Argentine",
          rating: 5,
          text: "Excellent service de la réservation à la fin du voyage. Le tour du lac Titicaca était magique et les guides très professionnels.",
          image: "/placeholder.svg?height=80&width=80",
          tour: "Lac Titicaca",
        },
        {
          name: "Emma Wilson",
          location: "Londres, UK",
          rating: 5,
          text: "Expérience absolument magnifique! Le trek du Chemin de l'Inca était difficile mais tellement gratifiant. Notre guide s'est assuré que tout le monde était en sécurité.",
          image: "/placeholder.svg?height=80&width=80",
          tour: "Chemin de l'Inca",
        },
        {
          name: "Hans Mueller",
          location: "Berlin, Allemagne",
          rating: 5,
          text: "Organisation fantastique! Le voyage à Cusco et Machu Picchu était parfaitement planifié. Hautement recommandé pour tous les voyageurs au Pérou.",
          image: "/placeholder.svg?height=80&width=80",
          tour: "Cusco Complet",
        },
        {
          name: "Ana Silva",
          location: "São Paulo, Brésil",
          rating: 5,
          text: "Simplement parfait! L'équipe était très attentive et les tours ont dépassé mes attentes. Je reviendrai certainement!",
          image: "/placeholder.svg?height=80&width=80",
          tour: "Tour Gastronomique",
        },
        {
          name: "Michael Chen",
          location: "Singapour",
          rating: 5,
          text: "Service exceptionnel et vues incroyables. Le tour de la Montagne Arc-en-ciel était le point culminant de mon voyage en Amérique du Sud!",
          image: "/placeholder.svg?height=80&width=80",
          tour: "Montagne Arc-en-ciel",
        },
        {
          name: "Isabella Rossi",
          location: "Rome, Italie",
          rating: 5,
          text: "Expérience merveilleuse! Le guide était très compétent et le tour de la Vallée Sacrée était inoubliable. Merci beaucoup!",
          image: "/placeholder.svg?height=80&width=80",
          tour: "Vallée Sacrée Premium",
        },
      ],
    },
    de: {
      title: "Was Unsere Reisenden Sagen",
      subtitle: "Tausende von Reisenden haben uns vertraut, ihre unvergesslichen Erlebnisse in Peru zu schaffen",
      testimonials: [
        {
          name: "María González",
          location: "Madrid, Spanien",
          rating: 5,
          text: "Eine unglaubliche Erfahrung. Die Machu-Picchu-Tour hat all meine Erwartungen übertroffen. Die Guides waren außergewöhnlich und der Transport sehr komfortabel.",
          image: "https://res.cloudinary.com/dwvikvjrq/image/upload/v1750432254/machupicchu-turista-wta_itauck.jpg",
          tour: "Klassisches Machu Picchu",
        },
        {
          name: "John Smith",
          location: "New York, USA",
          rating: 5,
          text: "Perfekte Organisation und erstaunliche Liebe zum Detail. Die Tour ins Heilige Tal war atemberaubend und unser Guide war unglaublich kompetent.",
          image: "https://res.cloudinary.com/dwvikvjrq/image/upload/v1750188808/uploads/qjhgzjcohaz3jfzxku0o.jpg",
          tour: "Heiliges Tal",
        },
        {
          name: "Sophie Dubois",
          location: "Paris, Frankreich",
          rating: 5,
          text: "Eine unvergessliche Reise nach Peru. Das Inka-Travel-Team machte unsere Flitterwochen perfekt. Tadelloser Service von Anfang bis Ende.",
          image:
            "https://res.cloudinary.com/dwvikvjrq/image/upload/v1748626604/vinincunca-mal-altura-full-scaled_ggnc9r.jpg",
          tour: "Regenbogenberg",
        },
        {
          name: "Carlos Rodríguez",
          location: "Buenos Aires, Argentinien",
          rating: 5,
          text: "Ausgezeichneter Service von der Buchung bis zum Ende der Reise. Die Titicacasee-Tour war magisch und die Guides sehr professionell.",
          image: "/placeholder.svg?height=80&width=80",
          tour: "Titicacasee",
        },
        {
          name: "Emma Wilson",
          location: "London, UK",
          rating: 5,
          text: "Absolut atemberaubendes Erlebnis! Die Inka-Trail-Wanderung war herausfordernd, aber so lohnend. Unser Guide sorgte dafür, dass alle sicher waren.",
          image: "/placeholder.svg?height=80&width=80",
          tour: "Inka-Trail",
        },
        {
          name: "Hans Mueller",
          location: "Berlin, Deutschland",
          rating: 5,
          text: "Fantastische Organisation! Die Reise nach Cusco und Machu Picchu war perfekt geplant. Sehr empfehlenswert für alle Peru-Reisenden.",
          image: "/placeholder.svg?height=80&width=80",
          tour: "Komplettes Cusco",
        },
        {
          name: "Ana Silva",
          location: "São Paulo, Brasilien",
          rating: 5,
          text: "Einfach perfekt! Das Team war sehr aufmerksam und die Touren übertrafen meine Erwartungen. Ich werde auf jeden Fall wiederkommen!",
          image: "/placeholder.svg?height=80&width=80",
          tour: "Gastronomische Tour",
        },
        {
          name: "Michael Chen",
          location: "Singapur",
          rating: 5,
          text: "Hervorragender Service und unglaubliche Sehenswürdigkeiten. Die Regenbogenberg-Tour war das Highlight meiner Südamerika-Reise!",
          image: "/placeholder.svg?height=80&width=80",
          tour: "Regenbogenberg",
        },
        {
          name: "Isabella Rossi",
          location: "Rom, Italien",
          rating: 5,
          text: "Wunderbare Erfahrung! Der Guide war sehr sachkundig und die Tour durch das Heilige Tal war unvergesslich. Vielen Dank!",
          image: "/placeholder.svg?height=80&width=80",
          tour: "Premium Heiliges Tal",
        },
      ],
    },
    it: {
      title: "Cosa Dicono i Nostri Viaggiatori",
      subtitle: "Migliaia di viaggiatori si sono affidati a noi per creare le loro esperienze indimenticabili in Perù",
      testimonials: [
        {
          name: "María González",
          location: "Madrid, Spagna",
          rating: 5,
          text: "Un'esperienza incredibile. Il tour a Machu Picchu ha superato tutte le mie aspettative. Le guide erano eccezionali e il trasporto molto comodo.",
          image: "https://res.cloudinary.com/dwvikvjrq/image/upload/v1750432254/machupicchu-turista-wta_itauck.jpg",
          tour: "Machu Picchu Classico",
        },
        {
          name: "John Smith",
          location: "New York, USA",
          rating: 5,
          text: "Organizzazione perfetta e straordinaria attenzione ai dettagli. Il tour della Valle Sacra è stato mozzafiato e la nostra guida era incredibilmente preparata.",
          image: "https://res.cloudinary.com/dwvikvjrq/image/upload/v1750188808/uploads/qjhgzjcohaz3jfzxku0o.jpg",
          tour: "Valle Sacra",
        },
        {
          name: "Sophie Dubois",
          location: "Parigi, Francia",
          rating: 5,
          text: "Un viaggio indimenticabile in Perù. Il team di Inka Travel ha reso perfetta la nostra luna di miele. Servizio impeccabile dall'inizio alla fine.",
          image:
            "https://res.cloudinary.com/dwvikvjrq/image/upload/v1748626604/vinincunca-mal-altura-full-scaled_ggnc9r.jpg",
          tour: "Montagna Arcobaleno",
        },
        {
          name: "Carlos Rodríguez",
          location: "Buenos Aires, Argentina",
          rating: 5,
          text: "Servizio eccellente dalla prenotazione alla fine del viaggio. Il tour del Lago Titicaca è stato magico e le guide molto professionali.",
          image: "/placeholder.svg?height=80&width=80",
          tour: "Lago Titicaca",
        },
        {
          name: "Emma Wilson",
          location: "Londra, UK",
          rating: 5,
          text: "Esperienza assolutamente stupenda! Il trekking del Sentiero Inca è stato impegnativo ma così gratificante. La nostra guida si è assicurata che tutti fossero al sicuro.",
          image: "/placeholder.svg?height=80&width=80",
          tour: "Sentiero Inca",
        },
        {
          name: "Hans Mueller",
          location: "Berlino, Germania",
          rating: 5,
          text: "Organizzazione fantastica! Il viaggio a Cusco e Machu Picchu è stato perfettamente pianificato. Altamente raccomandato per tutti i viaggiatori in Perù.",
          image: "/placeholder.svg?height=80&width=80",
          tour: "Cusco Completo",
        },
        {
          name: "Ana Silva",
          location: "São Paulo, Brasile",
          rating: 5,
          text: "Semplicemente perfetto! Il team è stato molto attento e i tour hanno superato le mie aspettative. Tornerò sicuramente!",
          image: "/placeholder.svg?height=80&width=80",
          tour: "Tour Gastronomico",
        },
        {
          name: "Michael Chen",
          location: "Singapore",
          rating: 5,
          text: "Servizio eccezionale e viste incredibili. Il tour della Montagna Arcobaleno è stato il momento clou del mio viaggio in Sud America!",
          image: "/placeholder.svg?height=80&width=80",
          tour: "Montagna Arcobaleno",
        },
        {
          name: "Isabella Rossi",
          location: "Roma, Italia",
          rating: 5,
          text: "Esperienza meravigliosa! La guida era molto preparata e il tour del Valle Sagrado è stato indimenticabile. Grazie mille!",
          image: "/placeholder.svg?height=80&width=80",
          tour: "Valle Sacra Premium",
        },
      ],
    },
  }

  const currentContent = content[language as keyof typeof content] || content.es

  return (
    <section className="bg-gradient-to-b from-slate-50 to-white py-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4 text-balance">{currentContent.title}</h2>
          <p className="text-slate-600 text-lg max-w-3xl mx-auto text-pretty">{currentContent.subtitle}</p>
        </div>

        {/* Testimonials Grid - Multi-column layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {currentContent.testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-6 flex flex-col border border-slate-100 hover:border-amber-200 group"
            >
              {/* Quote Icon */}
              <div className="mb-4">
                <Quote className="w-8 h-8 text-amber-400 opacity-50 group-hover:opacity-100 transition-opacity" />
              </div>

              {/* Rating Stars */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                ))}
              </div>

              {/* Review Text */}
              <blockquote className="text-slate-700 leading-relaxed mb-6 flex-grow text-pretty">
                {testimonial.text}
              </blockquote>

              {/* Tour Badge */}
              <div className="mb-4">
                <span className="inline-block bg-amber-50 text-amber-700 text-xs font-semibold px-3 py-1 rounded-full border border-amber-200">
                  {testimonial.tour}
                </span>
              </div>

              {/* Author Info */}
              <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                <Image
                  src={testimonial.image || "/placeholder.svg"}
                  alt={testimonial.name}
                  width={48}
                  height={48}
                  className="w-12 h-12 rounded-full object-cover ring-2 ring-amber-100"
                />
                <div>
                  <div className="font-semibold text-slate-900 text-sm">{testimonial.name}</div>
                  <div className="text-slate-500 text-xs">{testimonial.location}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Trust Indicators */}
        <div className="mt-16 flex flex-wrap justify-center items-center gap-8 text-center">
          <div className="flex flex-col items-center">
            <div className="text-4xl font-bold text-amber-600 mb-1">5,000+</div>
            <div className="text-slate-600 text-sm">Viajeros Felices</div>
          </div>
          <div className="hidden md:block w-px h-12 bg-slate-300"></div>
          <div className="flex flex-col items-center">
            <div className="text-4xl font-bold text-amber-600 mb-1">4.9/5</div>
            <div className="text-slate-600 text-sm">Calificación Promedio</div>
          </div>
          <div className="hidden md:block w-px h-12 bg-slate-300"></div>
          <div className="flex flex-col items-center">
            <div className="text-4xl font-bold text-amber-600 mb-1">98%</div>
            <div className="text-slate-600 text-sm">Recomendación</div>
          </div>
        </div>
      </div>
    </section>
  )
}
