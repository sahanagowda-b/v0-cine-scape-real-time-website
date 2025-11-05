import { Button } from "@/components/ui/button"
import Link from "next/link"

const trendingMovies = [
  {
    id: 1,
    title: "The Cinematic Revolution",
    overview: "A groundbreaking film about cinema itself",
    poster_path: "/movie-poster.jpg",
    release_date: "2024-01-15",
    vote_average: 8.5,
  },
  {
    id: 2,
    title: "Digital Dreams",
    overview: "An exploration of virtual reality and human connection",
    poster_path: "/movie-poster.jpg",
    release_date: "2024-02-20",
    vote_average: 7.9,
  },
  {
    id: 3,
    title: "Beyond Horizons",
    overview: "Epic space adventure with stunning visuals",
    poster_path: "/movie-poster.jpg",
    release_date: "2024-03-10",
    vote_average: 8.2,
  },
  {
    id: 4,
    title: "Urban Legends",
    overview: "Mysterious tale set in a modern metropolis",
    poster_path: "/movie-poster.jpg",
    release_date: "2024-04-05",
    vote_average: 7.7,
  },
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center gap-2">
              <div className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                CineScape
              </div>
            </Link>

            <nav className="hidden md:flex items-center gap-6">
              <Link href="/" className="text-foreground hover:text-primary transition-colors">
                Discover
              </Link>
              <Link href="/search" className="text-foreground hover:text-primary transition-colors">
                Search
              </Link>
            </nav>

            <div className="flex items-center gap-4">
              <Link href="/auth/login">
                <Button variant="outline" size="sm">
                  Login
                </Button>
              </Link>
              <Link href="/auth/signup">
                <Button size="sm">Sign Up</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/20 to-accent/20 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 text-balance">
              Discover Your Next Favorite Movie
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Get personalized recommendations powered by real-time trending data. Sign in to build your watchlist.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/auth/signup">
                <Button size="lg" className="w-full sm:w-auto">
                  Get Started
                </Button>
              </Link>
              <Link href="#trending">
                <Button variant="outline" size="lg" className="w-full sm:w-auto bg-transparent">
                  Browse Movies
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Trending Movies Section */}
      <section id="trending" className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Trending This Week</h2>
          <p className="text-muted-foreground mb-12">Discover what everyone is watching right now</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {trendingMovies.map((movie) => (
              <Link key={movie.id} href={`/movie/${movie.id}`}>
                <div className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer h-full rounded-lg border border-border bg-card">
                  <div className="relative group">
                    <img
                      src={movie.poster_path || "/placeholder.svg"}
                      alt={movie.title}
                      className="w-full aspect-[2/3] object-cover group-hover:opacity-75 transition-opacity"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                      <p className="text-foreground text-sm line-clamp-3">{movie.overview}</p>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-foreground line-clamp-2">{movie.title}</h3>
                    <div className="flex justify-between items-center mt-2 text-sm text-muted-foreground">
                      <span>{movie.release_date?.split("-")[0]}</span>
                      <span>★ {movie.vote_average.toFixed(1)}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Section */}
      <section className="bg-card py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-12 text-center">Why Choose CineScape</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl mb-4">📽️</div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Real-Time Updates</h3>
              <p className="text-muted-foreground">Get instant notifications when new movies start trending</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">⭐</div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Smart Recommendations</h3>
              <p className="text-muted-foreground">Personalized suggestions based on your watchlist and ratings</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">❤️</div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Your Watchlist</h3>
              <p className="text-muted-foreground">Save movies you want to watch and track your favorites</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
