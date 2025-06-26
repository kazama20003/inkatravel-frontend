import { Suspense } from "react"
import LoginSuccessContent from "@/components/login/login/login-success-content"

function LoginSuccessLoading() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-peru-orange border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-peru-dark body-text">Cargando...</p>
      </div>
    </div>
  )
}

export default function LoginSuccessPage() {
  return (
    <Suspense fallback={<LoginSuccessLoading />}>
      <LoginSuccessContent />
    </Suspense>
  )
}
