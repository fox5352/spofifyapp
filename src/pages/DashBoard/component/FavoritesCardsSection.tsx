import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'

import { getShow, Season } from '../../../api/requests'

import { FavShow, useFavorite } from '../../../store/favorites'

import ErrorMessage from '../../../ui/ErrorMessage'
import Loading from '../../../ui/Loading'

import DashBoardFilterModal from './DashBoardFilterModal'
import FavoriteCard from './FavoriteCard'

/**
 * Extended Season type that includes the show ID for reference
 */
interface FavoriteSeason extends Season {
  showId: string
  date: Date
}

/**
 * gets favorite episodes and displays cards of them
 */
export default function FavoritesCardsSection() {
  // pages state
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  // page data
  const [favoriteSeasons, setFavoriteSeasons] = useState<
    FavoriteSeason[] | null
  >(null)

  // global state
  const { data: favoritesData } = useFavorite()
  // query params
  const [searchParams] = useSearchParams()
  const order = searchParams.get('order') || 'a-z'

  /**
   * Removes duplicate favorite entries based on show ID and season
   */
  const removeDuplicateFavorites = (favorites: FavShow[]): FavShow[] => {
    return favorites.reduce((unique: FavShow[], current: FavShow) => {
      const exists = unique.find(
        (fav) => fav.showId === current.showId && fav.season === current.season
      )
      if (!exists) {
        unique.push(current)
      }
      return unique
    }, [])
  }

  /**
   * Creates a promise to fetch and transform show data into season information
   */
  const createSeasonPromise = async (
    favorite: FavShow
  ): Promise<FavoriteSeason | null> => {
    try {
      const show = await getShow(favorite.showId)
      const season = show?.seasons[favorite.season - 1]

      if (!season) return null

      return {
        ...season,
        showId: favorite.showId,
        date: new Date(favorite.date),
      }
    } catch (err) {
      console.error(`Error fetching show ${favorite.showId}:`, err)
      return null
    }
  }

  const filterOrder = (
    order: string,
    preview: FavoriteSeason[]
  ): FavoriteSeason[] => {
    const copy = [...preview]

    switch (order) {
      case 'a-z':
        return [...copy].sort((a, b) => a.title.localeCompare(b.title))

      case 'z-a':
        return [...copy].sort((a, b) => b.title.localeCompare(a.title))

      case 'asc':
        return [...copy].sort((a, b) => {
          const aDate = a.date.getTime()
          const bDate = b.date.getTime()
          return bDate - aDate // Sort by updated date descending
        })

      case 'dsc':
        return [...copy].sort((a, b) => {
          const aDate = a.date.getTime()
          const bDate = b.date.getTime()
          return aDate - bDate // Sort by updated date ascending
        })

      default:
        return copy
    }
  }

  /**
   * Fetches favorite shows data and transforms it into season information
   */
  useEffect(() => {
    const fetchFavoriteSeasons = async () => {
      try {
        setIsLoading(true)
        setFavoriteSeasons(null)
        setError(null)

        // Remove duplicate favorites entries
        const uniqueFavorites = removeDuplicateFavorites(favoritesData)

        // Fetch detailed show information for each favorite
        const seasonPromises = uniqueFavorites.map(createSeasonPromise)
        const seasons = await Promise.all(seasonPromises)
        const validSeasons = seasons.filter(
          (season): season is FavoriteSeason => season !== null
        )

        // Handle empty states
        if (favoritesData.length === 0) {
          setError('No favorite shows found')
          return
        }

        if (validSeasons.length === 0) {
          setError('Unable to retrieve favorite seasons')
          return
        }

        setFavoriteSeasons(validSeasons)
      } catch (err) {
        setError('Error loading favorite seasons')
        console.error('Error fetching favorite seasons:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchFavoriteSeasons()
  }, [favoritesData])

  return (
    <section
      className="flex flex-col items-center max-w-screen-xl w-full min-h-[320px] mx-auto my-2 p-2 bg-zinc-950 rounded-md"
      aria-label="Favorite Shows Dashboard"
    >
      <DashBoardFilterModal />
      <h1 className="flex justify-start w-full md:max-w-[90%] text-4xl font-bold py-1 pl-2 bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500 bg-clip-text text-transparent">
        Favorites
      </h1>
      <div className="w-full max-w-[90%] h-1 mt-4 mx-auto bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500 rounded-full" />

      <div
        className="flex flex-row flex-wrap justify-center gap-3 w-full h-full min-h-96 mt-4 px-2"
        role="region"
        aria-label="Favorite Seasons List"
      >
        {error ? (
          <ErrorMessage message={error} size="text-2xl" />
        ) : isLoading || favoriteSeasons == null ? (
          <Loading
            className="flex h-full w-auto"
            aria-label="Loading favorite seasons"
          />
        ) : (
          filterOrder(order, favoriteSeasons).map((season) => (
            <FavoriteCard
              className="border-2 border-white"
              key={`${season.showId}-season-${season.season}`}
              showId={season.showId}
              data={season}
              date={season.date}
            />
          ))
        )}
      </div>
    </section>
  )
}
