import { Suspense } from "react"
import { ResetPasswordForm } from "@/components/account/ResetPasswordForm"

export default function ReinitialiserMotDePassePage() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordForm />
    </Suspense>
  )
}
