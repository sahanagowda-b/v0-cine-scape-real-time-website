"use client"

import { useEffect, useState } from "react"
import type { Movie } from "@/lib/tmdb"
import { initSocket } from "@/lib/socket"
import { Card } from "@/components/ui/card"
import Link from "next/link"

interface TrendingUpdate {
  movie: Movie
  timestamp: string
}

export function TrendingUpdates() {
  const [updates, setUpdates] = useState<TrendingUpdate[]>([])
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    try {
      const socket = initSocket()

      if (!socket) {
        console.log("[v0] Socket not available in development")
        return
      }

      const handleTrendingUpdate = (data: { movies: Movie[]; timestamp: string }) => {
        console.log("[v0] Received trending update:", data)

        const newUpdates = data.movies.map((movie) => ({
          movie,
          timestamp: data.timestamp,
        }))

        setUpdates((prev) => [...newUpdates, ...prev].slice(0, 5))
        setIsVisible(true)

        setTimeout(() => setIsVisible(false), 10000)
      }

      socket.on("trending-update", handleTrendingUpdate)

      return () => {
        socket.off("trending-update", handleTrendingUpdate)
      }
    } catch (error) {
      console.log("[v0] Socket initialization skipped:", error)
    }
  }, [])

  if (!isVisible || updates.length === 0) return null

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-sm space-y-3">
      {updates.map((update, idx) => (
        <Card
          key={idx}
          className="p-4 bg-gradient-to-r from-primary/10 to-accent/10 border-primary/50 animate-in fade-in slide-in-from-right-4"
        >
          <div className="flex items-start gap-3">
            <div className="mt-1 flex-shrink-0">
              <svg className="w-5 h-5 text-primary fill-primary" viewBox="0 0 24 24">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-foreground text-sm">Trending Now</p>
              <Link href={`/movie/${update.movie.id}`}>
                <p className="text-muted-foreground text-xs hover:text-primary transition-colors line-clamp-1">
                  {update.movie.title}
                </p>
              </Link>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
