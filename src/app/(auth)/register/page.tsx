import { Suspense } from "react"
import RegisterPageContent from "@/components/login/register/register-page-content"

// Loading component for the suspense boundary
function RegisterPageLoading() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 border-4 border-peru-orange border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-peru-dark body-text">Cargando...</p>
      </div>
    </div>
  )
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<RegisterPageLoading />}>
      <RegisterPageContent />
    </Suspense>
  )
}
