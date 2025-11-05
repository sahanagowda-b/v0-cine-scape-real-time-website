"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Header } from "@/components/header"
import { MovieDetailsHero } from "@/components/movie-details-hero"
import { MovieDetailsContent } from "@/components/movie-details-content"
import { getMovieDetails } from "@/lib/tmdb"
import { createClientSupabaseClient } from "@/lib/supabase-client"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function MovieDetailPage() {
  const params = useParams()
  const movieId = Number.parseInt(params.id as string)
  const [movie, setMovie] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [isInWatchlist, setIsInWatchlist] = useState(false)
  const [showTrailer, setShowTrailer] = useState(false)
  const supabase = createClientSupabaseClient()

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      const movieData = await getMovieDetails(movieId)
      setMovie(movieData)

      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user)

      if (user) {
        const { data: watchlist } = await supabase
          .from("watchlist")
          .select("*")
          .eq("user_id", user.id)
          .eq("movie_id", movieId)
          .single()

        setIsInWatchlist(!!watchlist)
      }

      setIsLoading(false)
    }

    fetchData()
  }, [movieId, supabase])

  const handleWatchlistToggle = async () => {
    if (!user) {
      window.location.href = "/auth/login"
      return
    }

    try {
      if (isInWatchlist) {
        await supabase.from("watchlist").delete().eq("user_id", user.id).eq("movie_id", movieId)
      } else {
        await supabase.from("watchlist").insert({
          user_id: user.id,
          movie_id: movieId,
        })
      }
      setIsInWatchlist(!isInWatchlist)
    } catch (error) {
      console.error("Error updating watchlist:", error)
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

  if (!movie) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <p className="text-muted-foreground mb-4">Movie not found</p>
          <Link href="/">
            <Button>Go Back</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <MovieDetailsHero
          movie={movie}
          isInWatchlist={isInWatchlist}
          onWatchlistToggle={handleWatchlistToggle}
          isLoading={isLoading}
        />
        <MovieDetailsContent movie={movie} genres={movie.genres || []} />
      </div>
    </div>
  )
}
