import { searchMovies } from "@/lib/tmdb"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const q = searchParams.get("q") || ""

  if (!q) {
    return NextResponse.json({ results: [], demo: false })
  }

  const { results, demo } = await searchMovies(q)

  return NextResponse.json({ results, demo })
}
