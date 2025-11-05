"use client"

import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"

interface MovieDetailsContentProps {
  movie: any
  genres: any[]
}

export function MovieDetailsContent({ movie, genres }: MovieDetailsContentProps) {
  const movieGenres = movie.genres || []

  const trailerVideo = movie.videos?.results?.find((video: any) => video.type === "Trailer" && video.site === "YouTube")

  return (
    <div className="space-y-8">
      {/* Overview */}
      {movie.overview && (
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-4">Overview</h2>
          <p className="text-muted-foreground leading-relaxed">{movie.overview}</p>
        </div>
      )}

      {/* Genres */}
      {movieGenres.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-4">Genres</h2>
          <div className="flex flex-wrap gap-2">
            {movieGenres.map((genre: any) => (
              <Badge key={genre.id} variant="secondary" className="text-base">
                {genre.name}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Cast */}
      {movie.credits?.cast && movie.credits.cast.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-4">Cast</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {movie.credits.cast.slice(0, 10).map((actor: any) => (
              <div key={actor.id} className="text-center">
                {actor.profile_path && (
                  <img
                    src={`https://image.tmdb.org/t/p/w185${actor.profile_path}`}
                    alt={actor.name}
                    className="w-full aspect-[2/3] object-cover rounded-lg mb-2"
                  />
                )}
                <p className="font-semibold text-foreground text-sm">{actor.name}</p>
                <p className="text-muted-foreground text-xs">{actor.character}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Trailer */}
      {trailerVideo && (
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-4">Trailer</h2>
          <div className="relative w-full pb-[56.25%] bg-black rounded-lg overflow-hidden">
            <iframe
              className="absolute top-0 left-0 w-full h-full"
              src={`https://www.youtube.com/embed/${trailerVideo.key}`}
              title="Movie Trailer"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}

      {/* Additional Info */}
      <Card className="p-6 grid grid-cols-2 md:grid-cols-4 gap-6">
        {movie.budget > 0 && (
          <div>
            <p className="text-muted-foreground text-sm mb-1">Budget</p>
            <p className="text-foreground font-semibold">${(movie.budget / 1000000).toFixed(1)}M</p>
          </div>
        )}
        {movie.revenue > 0 && (
          <div>
            <p className="text-muted-foreground text-sm mb-1">Revenue</p>
            <p className="text-foreground font-semibold">${(movie.revenue / 1000000).toFixed(1)}M</p>
          </div>
        )}
        {movie.status && (
          <div>
            <p className="text-muted-foreground text-sm mb-1">Status</p>
            <p className="text-foreground font-semibold">{movie.status}</p>
          </div>
        )}
        {movie.original_language && (
          <div>
            <p className="text-muted-foreground text-sm mb-1">Language</p>
            <p className="text-foreground font-semibold">{movie.original_language.toUpperCase()}</p>
          </div>
        )}
      </Card>
    </div>
  )
}
