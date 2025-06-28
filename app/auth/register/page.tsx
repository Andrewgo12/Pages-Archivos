import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import RegisterForm from "@/components/auth/register-form"

export default async function RegisterPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) {
    redirect("/dashboard")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <RegisterForm />
    </div>
  )
}
