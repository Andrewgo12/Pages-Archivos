import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import DashboardContent from "@/components/dashboard/dashboard-content"

export default async function DashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Get user profile
  const { data: profile } = await supabase.from("user_profiles").select("*").eq("id", user.id).single()

  return <DashboardContent user={user} profile={profile} />
}
