import { MouseEvent, useMemo, useState } from 'react'
import { MdArrowDownward } from 'react-icons/md'
import { Link } from 'react-router-dom'
//utils
import { FavShow, useFavorite } from '../../../store/favorites'
import { formatDate } from '../../../lib/utils'

/**
 * Represents a favorite episode with additional season and episode title information
 */
export type FavoriteEpisode = FavShow & {
  seasonTitle: string
  episodeTitle: string
}

/**
 * Props for the FavoriteBlock component
 */
export interface FavoriteBlockProps {
  id: string
  title: string
  image: string
  date: Date
  episodes: FavoriteEpisode[]
}

/**
 * Component that displays a collapsible block containing favorite episodes grouped by season
 */
export default function FavoriteBlock({
  title,
  date,
  // image, // TODO: add a image display on hove if i have time
  episodes,
}: FavoriteBlockProps) {
  const [isActive, setIsActive] = useState(false)

  // Format the date for display
  const formattedDate = formatDate(date.toString(), {
    year: '2-digit',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })

  const FavoriteSeasonBlocks: FavoriteSeasonBlockProps[] = useMemo(
    () =>
      episodes.reduce(
        (collection: FavoriteSeasonBlockProps[], current: FavoriteEpisode) => {
          const exists = collection.find(
            (item) => item.seasonTitle == current.seasonTitle
          )

          if (exists) {
            exists.episodes.push(current)
          } else {
            collection.push({
              seasonTitle: current.seasonTitle,
              episodes: [current],
            })
          }
          return collection
        },
        []
      ),
    [episodes]
  )

  const toggleActive = () => setIsActive((prev) => !prev)

  return (
    <div
      className={`flex flex-col items-center w-full max-w-screen-lg text-white border-2 border-[--ac-one] rounded-md overflow-hidden duration-200 transition-all ease-linear ${isActive ? 'h-auto' : 'h-[44px]'}`}
    >
      <button
        className="flex justify-between w-full p-1.5 text-xl"
        onClick={toggleActive}
      >
        <h3>{title}</h3>
        <h4>{formattedDate}</h4>
        <div className="h-full w-auto">
          <MdArrowDownward
            className={`h-6 w-auto duration-200 transition-all ease-linear ${isActive ? 'rotate-180' : ''}`}
          />
        </div>
      </button>
      {/* TODO:content eps */}
      <div className={`flex flex-col w-full mt-1 p-1.5 space-y-2`}>
        {FavoriteSeasonBlocks.map((data) => (
          <FavoriteSeasonBlock key={data.seasonTitle} {...data} />
        ))}
      </div>
    </div>
  )
}

/**
 * Props for the FavoriteSeasonBlock component
 */
interface FavoriteSeasonBlockProps {
  seasonTitle: string
  episodes: FavoriteEpisode[]
}

/**
 * Component that displays a season block containing episodes and a link to the season
 */
function FavoriteSeasonBlock({
  seasonTitle,
  episodes,
}: FavoriteSeasonBlockProps) {
  const link = `/shows/${episodes[0].showId}/${episodes[0].season}`
  return (
    <div className="p-1.5 border-2 border-violet-500 rounded-md">
      <Link
        className="flex w-full border-b-2 text-xl border-white hover:text-purple-500 hover:border-purple-500 duration-200 transition-all ease-linear"
        to={link}
      >
        {seasonTitle}
      </Link>
      <div className="flex flex-col w-full space-y-2 mt-2">
        {episodes.map((data) => (
          <FavoriteButton
            key={`${data.showId}${data.season}${data.episode}`}
            {...data}
          />
        ))}
      </div>
    </div>
  )
}

/**
 * Component that displays a button for removing a favorite episode
 */
function FavoriteButton(data: FavoriteEpisode) {
  const [isRemoved, setIsRemoved] = useState(false)
  const { remove } = useFavorite()

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation()
    remove(data)
    setIsRemoved(true)
  }

  return (
    <button
      className={`flex w-full justify-start p-1.5 border-2 border-rose-500 rounded-md ${isRemoved ? 'hidden' : ''}`}
      onClick={handleClick}
    >
      {data.episodeTitle}
    </button>
  )
}
