import { createServerSupabaseClient } from "@/lib/supabase-server"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get user's ratings
    const { data: userRatings } = await supabase
      .from("ratings")
      .select("movie_id, rating")
      .eq("user_id", user.id)
      .order("rating", { ascending: false })
      .limit(10)

    if (!userRatings || userRatings.length === 0) {
      return NextResponse.json({ recommendations: [], message: "No ratings yet. Rate movies to get recommendations!" })
    }

    // Simple collaborative filtering: find similar users and their highly rated movies
    const topMovieIds = userRatings.map((r) => r.movie_id)

    const { data: similarRatings } = await supabase
      .from("ratings")
      .select("user_id, movie_id, rating")
      .in("movie_id", topMovieIds)
      .neq("user_id", user.id)
      .order("rating", { ascending: false })

    if (!similarRatings || similarRatings.length === 0) {
      return NextResponse.json({ recommendations: [], message: "Not enough data for recommendations yet." })
    }

    // Get movies rated by similar users that current user hasn't rated
    const userMovieIds = new Set(userRatings.map((r) => r.movie_id))
    const recommendedMovieIds = new Set<number>()

    similarRatings.forEach((rating) => {
      if (!userMovieIds.has(rating.movie_id) && rating.rating >= 7) {
        recommendedMovieIds.add(rating.movie_id)
      }
    })

    // Get watchlist
    const { data: watchlist } = await supabase.from("watchlist").select("movie_id").eq("user_id", user.id)

    const watchlistIds = watchlist?.map((w) => w.movie_id) || []

    return NextResponse.json({
      recommendations: Array.from(recommendedMovieIds).slice(0, 20),
      watchlist: watchlistIds,
      ratingsCount: userRatings.length,
    })
  } catch (error) {
    console.error("Recommendations API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
