"use client"

import { useEffect, useState } from "react"
import { Header } from "@/components/header"
import { useRouter } from "next/navigation"
import { createClientSupabaseClient } from "@/lib/supabase-client"
import { getMovieDetails, type Movie } from "@/lib/tmdb"
import { MovieCard } from "@/components/movie-card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function WatchlistPage() {
  const [movies, setMovies] = useState<Movie[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const router = useRouter()
  const supabase = createClientSupabaseClient()

  useEffect(() => {
    const fetchWatchlist = async () => {
      setIsLoading(true)
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push("/auth/login")
        return
      }

      setUser(user)

      const { data: watchlist, error } = await supabase
        .from("watchlist")
        .select("movie_id")
        .eq("user_id", user.id)
        .order("added_at", { ascending: false })

      if (error) {
        console.error("Error fetching watchlist:", error)
        setIsLoading(false)
        return
      }

      // Fetch movie details for each watchlist item
      const movieDetails = await Promise.all(
        watchlist.map(async (item) => {
          const details = await getMovieDetails(item.movie_id)
          return details
        }),
      )

      setMovies(movieDetails.filter(Boolean) as Movie[])
      setIsLoading(false)
    }

    fetchWatchlist()
  }, [supabase, router])

  const handleRemove = async (movieId: number) => {
    try {
      await supabase.from("watchlist").delete().eq("user_id", user.id).eq("movie_id", movieId)

      setMovies(movies.filter((m) => m.id !== movieId))
    } catch (error) {
      console.error("Error removing from watchlist:", error)
    }
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">My Watchlist</h1>
        <p className="text-muted-foreground mb-8">
          {movies.length} {movies.length === 1 ? "movie" : "movies"} saved
        </p>

        {movies.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {movies.map((movie) => (
              <div key={movie.id} className="group relative">
                <MovieCard movie={movie} onWatchlistToggle={() => handleRemove(movie.id)} isInWatchlist={true} />
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleRemove(movie.id)}
                  className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  Remove
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">Your watchlist is empty</p>
            <Link href="/">
              <Button>Browse Movies</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
