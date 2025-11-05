import { type NextRequest, NextResponse } from "next/server"
import { getTrendingMovies } from "@/lib/tmdb"

// This endpoint is used for real-time updates via Socket.io
export async function GET(request: NextRequest) {
  try {
    const timeWindow = (request.nextUrl.searchParams.get("time") as "day" | "week") || "day"
    const data = await getTrendingMovies(timeWindow)

    return NextResponse.json({
      movies: data.results.slice(0, 10),
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Trending API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
