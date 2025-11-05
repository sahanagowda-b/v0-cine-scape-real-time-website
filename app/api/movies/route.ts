import { createServerSupabaseClient } from "@/lib/supabase-server"
import { getTrendingMovies } from "@/lib/tmdb"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const action = searchParams.get("action")

    if (action === "trending") {
      const timeWindow = (searchParams.get("time") as "day" | "week") || "day"
      const data = await getTrendingMovies(timeWindow)
      return NextResponse.json(data)
    }

    if (action === "watchlist") {
      const supabase = await createServerSupabaseClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
      }

      const { data: watchlist, error } = await supabase.from("watchlist").select("movie_id").eq("user_id", user.id)

      if (error) return NextResponse.json({ error: error.message }, { status: 400 })
      return NextResponse.json(watchlist)
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 })
  } catch (error) {
    console.error("Movies API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { action, movieId, rating, review } = body

    if (action === "rate") {
      const { error } = await supabase.from("ratings").upsert({
        user_id: user.id,
        movie_id: movieId,
        rating,
        review,
      })

      if (error) return NextResponse.json({ error: error.message }, { status: 400 })
      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 })
  } catch (error) {
    console.error("Movies API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
