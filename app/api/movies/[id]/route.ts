import { type NextRequest, NextResponse } from "next/server"
import { getMovieDetails } from "@/lib/tmdb"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const movieId = Number.parseInt(params.id)

    if (isNaN(movieId)) {
      return NextResponse.json({ error: "Invalid movie ID" }, { status: 400 })
    }

    console.log("[v0] API Route: Fetching movie details for ID:", movieId)

    const movie = await getMovieDetails(movieId)

    if (!movie) {
      return NextResponse.json({ error: "Movie not found" }, { status: 404 })
    }

    console.log("[v0] API Route: Successfully fetched movie:", movie.title)

    return NextResponse.json(movie)
  } catch (error) {
    console.error("[v0] API Route: Error fetching movie:", error)
    return NextResponse.json({ error: "Failed to fetch movie details" }, { status: 500 })
  }
}
