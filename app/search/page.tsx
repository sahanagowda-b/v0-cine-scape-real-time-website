"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { MovieCard } from "@/components/movie-card"
import { SearchBar } from "@/components/search-bar"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useSearchParams } from "next/navigation"

export default function SearchPage() {
  const searchParams = useSearchParams()
  const q = searchParams.get("q") || ""
  const [results, setResults] = useState<any[]>([])
  const [demo, setDemo] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const fetchResults = async () => {
      if (!q) {
        setResults([])
        return
      }

      setIsLoading(true)
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(q)}`)
        const data = await response.json()
        setResults(data.results || [])
        setDemo(data.demo || false)
      } catch (error) {
        console.error("Search error:", error)
        setResults([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchResults()
  }, [q])

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <SearchBar />
        </div>

        {demo && (
          <div className="mb-6 p-4 bg-accent/20 border border-accent rounded-lg">
            <p className="text-sm text-foreground">
              <strong>Demo Mode:</strong> TMDB API key not configured. Showing demo movies. Add your API key to unlock
              live data.
            </p>
          </div>
        )}

        {q && (
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              {isLoading ? "Searching..." : `Search Results for "${q}"`}
            </h1>
            <p className="text-muted-foreground">
              {isLoading ? "Loading..." : `Found ${results.length} ${results.length === 1 ? "movie" : "movies"}`}
            </p>
          </div>
        )}

        {results.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {results.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            {q ? (
              <>
                <p className="text-muted-foreground mb-4">
                  {isLoading ? "Searching..." : `No movies found matching "${q}"`}
                </p>
                <Link href="/">
                  <Button>Browse Trending</Button>
                </Link>
              </>
            ) : (
              <p className="text-muted-foreground">Use the search bar to find movies</p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
