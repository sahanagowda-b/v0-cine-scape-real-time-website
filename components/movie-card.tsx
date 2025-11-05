"use client"

import type React from "react"

import Link from "next/link"
import { Card } from "@/components/ui/card"
import { type Movie, getPosterUrl } from "@/lib/tmdb"
import { useState } from "react"

interface MovieCardProps {
  movie: Movie
  onWatchlistToggle?: (movieId: number) => Promise<void>
  isInWatchlist?: boolean
}

export function MovieCard({ movie, onWatchlistToggle, isInWatchlist }: MovieCardProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleWatchlistToggle = async (e: React.MouseEvent) => {
    e.preventDefault()
    if (!onWatchlistToggle) return

    setIsLoading(true)
    try {
      await onWatchlistToggle(movie.id)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Link href={`/movie/${movie.id}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer h-full">
        <div className="relative group">
          <img
            src={getPosterUrl(movie.poster_path, "w342") || "/placeholder.svg"}
            alt={movie.title}
            className="w-full aspect-[2/3] object-cover group-hover:opacity-75 transition-opacity"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
            <p className="text-foreground text-sm line-clamp-3">{movie.overview}</p>
          </div>
          {onWatchlistToggle && (
            <button
              onClick={handleWatchlistToggle}
              disabled={isLoading}
              className="absolute top-2 right-2 bg-black/50 hover:bg-black/75 p-2 rounded-full transition-colors"
            >
              <svg
                className={`w-5 h-5 ${isInWatchlist ? "fill-red-500 text-red-500" : "text-white"}`}
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </button>
          )}
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-foreground line-clamp-2">{movie.title}</h3>
          <div className="flex justify-between items-center mt-2 text-sm text-muted-foreground">
            <span>{movie.release_date?.split("-")[0] || "N/A"}</span>
            <span>★ {movie.vote_average.toFixed(1)}</span>
          </div>
        </div>
      </Card>
    </Link>
  )
}
