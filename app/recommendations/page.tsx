"use client"

import { useEffect, useState } from "react"
import { Header } from "@/components/header"
import { useRouter } from "next/navigation"
import { createClientSupabaseClient } from "@/lib/supabase-client"
import { getMovieDetails, type Movie } from "@/lib/tmdb"
import { MovieCard } from "@/components/movie-card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function RecommendationsPage() {
  const [movies, setMovies] = useState<Movie[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const router = useRouter()
  const supabase = createClientSupabaseClient()

  useEffect(() => {
    const fetchRecommendations = async () => {
      setIsLoading(true)
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push("/auth/login")
        return
      }

      setUser(user)

      try {
        const response = await fetch("/api/recommendations")
        const data = await response.json()

        if (!data.recommendations || data.recommendations.length === 0) {
          setMovies([])
          setIsLoading(false)
          return
        }

        // Fetch movie details for each recommendation
        const movieDetails = await Promise.all(
          data.recommendations.slice(0, 12).map(async (movieId: number) => {
            const details = await getMovieDetails(movieId)
            return details
          }),
        )

        setMovies(movieDetails.filter(Boolean) as Movie[])
      } catch (error) {
        console.error("Error fetching recommendations:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchRecommendations()
  }, [supabase, router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center h-96">
          <p className="text-muted-foreground">Loading recommendations...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Personalized Recommendations</h1>
        <p className="text-muted-foreground mb-8">Movies picked just for you based on your ratings and watchlist</p>

        {movies.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {movies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">Rate more movies to get personalized recommendations</p>
            <Link href="/">
              <Button>Explore Movies</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
