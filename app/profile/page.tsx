"use client"

import { useEffect, useState } from "react"
import { Header } from "@/components/header"
import { useRouter } from "next/navigation"
import { createClientSupabaseClient } from "@/lib/supabase-client"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [stats, setStats] = useState({ ratings: 0, watchlist: 0 })
  const router = useRouter()
  const supabase = createClientSupabaseClient()

  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true)
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push("/auth/login")
        return
      }

      setUser(user)

      // Fetch user profile
      const { data: profileData } = await supabase.from("users").select("*").eq("id", user.id).single()

      setProfile(profileData)

      // Fetch stats
      const { count: ratingsCount } = await supabase
        .from("ratings")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id)

      const { count: watchlistCount } = await supabase
        .from("watchlist")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id)

      setStats({
        ratings: ratingsCount || 0,
        watchlist: watchlistCount || 0,
      })

      setIsLoading(false)
    }

    fetchProfile()
  }, [supabase, router])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/")
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center h-96">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Card className="p-8">
          <h1 className="text-3xl font-bold text-foreground mb-8">My Profile</h1>

          <div className="space-y-6">
            <div>
              <p className="text-muted-foreground text-sm mb-2">Email</p>
              <p className="text-foreground font-medium">{user?.email}</p>
            </div>

            <div>
              <p className="text-muted-foreground text-sm mb-2">Username</p>
              <p className="text-foreground font-medium">{profile?.username || "Not set"}</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 py-6 border-y border-border">
              <div>
                <p className="text-muted-foreground text-sm mb-1">Movies Rated</p>
                <p className="text-3xl font-bold text-primary">{stats.ratings}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-sm mb-1">Watchlist</p>
                <p className="text-3xl font-bold text-accent">{stats.watchlist}</p>
              </div>
            </div>

            <div className="pt-6">
              <Button onClick={handleLogout} variant="outline" className="flex items-center gap-2 bg-transparent">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
                Logout
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
