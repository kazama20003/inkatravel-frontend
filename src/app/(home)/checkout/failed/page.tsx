import Link from "next/link"
import { CheckCircle } from "lucide-react"

export default function SuccessPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-600 to-emerald-800 text-white p-4 text-center">
      <CheckCircle className="w-24 h-24 text-white mb-6 animate-bounce" />
      <h1 className="text-4xl md:text-5xl font-bold mb-4">Payment Successful!</h1>
      <p className="text-lg md:text-xl mb-8 max-w-md">
        Your payment has been processed successfully. A confirmation email has been sent to your inbox.
      </p>
      <Link
        href="/"
        className="px-8 py-3 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-white hover:bg-white/30 transition-all duration-300 font-medium"
      >
        Back to Home
      </Link>
    </div>
  )
}
