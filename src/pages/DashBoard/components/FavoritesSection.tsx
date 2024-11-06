import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
// utils
import { getShow } from '../../../api/requests'
import { FavShow, useFavorite } from '../../../store/favorites'
// components
import ErrorMessage from '../../../ui/ErrorMessage'
import Loading from '../../../ui/Loading'
import DashBoardFilterModal from './DashBoardFilterModal'
import FavoriteBlock, {
  FavoriteBlockProps,
  FavoriteEpisode,
} from './FavoriteBlock'

interface GroupedFavorites {
  showId: string
  date: Date
  episodes: FavShow[]
}

/**
 * gets favorite episodes and displays cards of them
 */
export default function FavoritesSection() {
  // pages state
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  // page data
  const [favoriteSeasons, setFavoriteSeasons] = useState<
    FavoriteBlockProps[] | null
  >(null)

  // global state
  const { data: favoritesData } = useFavorite()

  // Create's a deep copy of favoritesData
  const detachedFavoritesData = useMemo(() => {
    return JSON.parse(JSON.stringify(favoritesData))
  }, []) // and is left empty to avoid rerenders

  // query params
  const [searchParams] = useSearchParams()
  const order = searchParams.get('order') || 'a-z'

  /**
   * converts favorite entries into GroupedFavorites
   */
  const rebuildFavorites = (favorites: FavShow[]): GroupedFavorites[] => {
    return favorites.reduce(
      (collection: GroupedFavorites[], current: FavShow) => {
        // Find if a Fav with the current showId already exists
        const exists = collection.find((fav) => fav.showId === current.showId)

        if (exists) {
          // If it exists, push the current entry into the children array
          exists.episodes.push(current)
        } else {
          // If it doesn't exist, create a new Fav entry
          collection.push({
            showId: current.showId,
            date: current.date, // or set another default date as required
            episodes: [current],
          })
        }

        return collection
      },
      []
    )
  }

  /**
   * Creates a promise to fetch and transform GroupedFavorites data into FavoriteBlockProps information
   */
  const getFormattedFavoriteShow = async (
    favorite: GroupedFavorites
  ): Promise<FavoriteBlockProps | null> => {
    try {
      const show = await getShow(favorite.showId)

      if (!show) return null

      const mappedEpisodes: FavoriteEpisode[] = favorite.episodes.map(
        (episode) => ({
          ...episode,
          seasonTitle: show.seasons[episode.season - 1].title,
          episodeTitle:
            show.seasons[episode.season - 1].episodes[episode.episode - 1]
              .title,
        })
      )

      return {
        id: show.id,
        title: show.title,
        image: show.image,
        date: favorite.date,
        episodes: mappedEpisodes,
      }
    } catch (err) {
      console.error(`Error fetching show ${favorite.showId}:`, err)
      return null
    }
  }

  const filterOrder = (
    order: string,
    preview: FavoriteBlockProps[]
  ): FavoriteBlockProps[] => {
    const copy = [...preview]

    switch (order) {
      case 'a-z':
        return [...copy].sort((a, b) => a.title.localeCompare(b.title))

      case 'z-a':
        return [...copy].sort((a, b) => b.title.localeCompare(a.title))

      case 'asc':
        return [...copy].sort((a, b) => {
          const aDate = new Date(a.date).getTime()
          const bDate = new Date(b.date).getTime()
          return bDate - aDate // Sort by updated date descending
        })

      case 'dsc':
        return [...copy].sort((a, b) => {
          const aDate = new Date(a.date).getTime()
          const bDate = new Date(b.date).getTime()
          return aDate - bDate // Sort by updated date ascending
        })

      default:
        return copy
    }
  }

  /**
   * Uses detached favorite data and transforms it into FavoriteBlockProps information
   */
  useEffect(() => {
    const fetchFavoriteData = async () => {
      try {
        setIsLoading(true)
        setFavoriteSeasons(null)
        setError(null)

        // Handle empty states
        if (detachedFavoritesData.length === 0) {
          setError('No favorite shows found')
          return
        }

        // build a collection from favorites
        const collectionOfFavorites = rebuildFavorites(detachedFavoritesData)

        //  Fetch detailed show information for each favorite
        const populatedFavoriteShowDataPromises = collectionOfFavorites.map(
          getFormattedFavoriteShow
        )
        const populatedFavoriteShowData = await Promise.all(
          populatedFavoriteShowDataPromises
        )
        const validPopulatedFavoriteShowData = populatedFavoriteShowData.filter(
          (data) => data != null
        )

        if (validPopulatedFavoriteShowData.length === 0) {
          setError('Unable to retrieve favorite seasons')
          return
        }

        setFavoriteSeasons(validPopulatedFavoriteShowData)
      } catch (err) {
        setError('Error loading favorite seasons')
        console.error('Error fetching favorite seasons:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchFavoriteData()
  }, [detachedFavoritesData])

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
        className="flex flex-col w-full justify-center items-center my-2 space-y-2"
        aria-label="Favorite Seasons List"
      >
        {error ? (
          <ErrorMessage message={error} size="text-2xl" />
        ) : isLoading || favoriteSeasons == null ? (
          <Loading
            className="flex h-24 w-auto"
            aria-label="Loading favorite seasons"
          />
        ) : (
          filterOrder(order, favoriteSeasons).map((fav) => (
            <FavoriteBlock key={fav.id} {...fav} />
          ))
        )}
      </div>
    </section>
  )
}
