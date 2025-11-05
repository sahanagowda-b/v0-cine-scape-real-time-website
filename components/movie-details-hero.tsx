"use client"

import { getBackdropUrl, getPosterUrl } from "@/lib/tmdb"
import { Button } from "@/components/ui/button"
import { useState } from "react"

interface MovieDetailsHeroProps {
  movie: any
  isInWatchlist?: boolean
  onWatchlistToggle?: () => Promise<void>
  onPlayTrailer?: () => void
  isLoading?: boolean
}

export function MovieDetailsHero({
  movie,
  isInWatchlist,
  onWatchlistToggle,
  onPlayTrailer,
  isLoading,
}: MovieDetailsHeroProps) {
  const [isUpdating, setIsUpdating] = useState(false)

  const handleWatchlist = async () => {
    if (!onWatchlistToggle) return
    setIsUpdating(true)
    try {
      await onWatchlistToggle()
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <div className="relative -mx-4 sm:-mx-6 lg:-mx-8 mb-8">
      <div className="relative h-96 md:h-[500px] overflow-hidden">
        <img
          src={getBackdropUrl(movie.backdrop_path) || "/placeholder.svg"}
          alt={movie.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-background" />
      </div>

      <div className="absolute bottom-0 left-0 right-0 px-4 sm:px-6 lg:px-8 pb-8 flex gap-6">
        <div className="hidden sm:block">
          <img
            src={getPosterUrl(movie.poster_path, "w342") || "/placeholder.svg"}
            alt={movie.title}
            className="w-32 md:w-48 rounded-lg shadow-2xl border-4 border-card"
          />
        </div>

        <div className="flex-1 flex flex-col justify-end">
          <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-3 text-balance">{movie.title}</h1>
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-accent">★</span>
              <span className="text-foreground font-semibold">{movie.vote_average?.toFixed(1) || "N/A"}</span>
              <span className="text-muted-foreground text-sm">({movie.vote_count?.toLocaleString()})</span>
            </div>
            {movie.release_date && (
              <span className="text-muted-foreground">{new Date(movie.release_date).getFullYear()}</span>
            )}
            {movie.runtime && <span className="text-muted-foreground">{movie.runtime} min</span>}
          </div>

          <div className="flex flex-wrap gap-3">
            {onPlayTrailer && (
              <Button onClick={onPlayTrailer} size="lg" className="flex items-center gap-2">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
                Watch Trailer
              </Button>
            )}
            {onWatchlistToggle && (
              <Button
                onClick={handleWatchlist}
                disabled={isUpdating || isLoading}
                variant={isInWatchlist ? "default" : "outline"}
                size="lg"
                className="flex items-center gap-2"
              >
                <svg
                  className={`w-5 h-5 ${isInWatchlist ? "fill-current" : ""}`}
                  viewBox="0 0 24 24"
                  fill={isInWatchlist ? "currentColor" : "none"}
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
                {isInWatchlist ? "In Watchlist" : "Add to Watchlist"}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
