import { MouseEvent, useEffect, useState } from 'react'
import { Season } from '../../../../../api/requests'
import { usePlaylist } from '../../../../../store/playlist'
import { useParams } from 'react-router-dom'
import { getFromListened } from '../../../../../lib/utils'
import { MdPlayCircle } from 'react-icons/md'
import FavButton from './FavButton'

export default function EpisodeButton({
  title,
  episode,
  season,
}: {
  title: string
  episode: number
  season: Season
}) {
  const { data, add, setTrack } = usePlaylist()
  const [isMarkedAsListened, setIsMarkedAsListened] = useState(false)
  const { id } = useParams()

  useEffect(() => {
    if (!id) return

    const listenedList = getFromListened()

    const isMarked = listenedList.find(
      (item) =>
        item.showId === id &&
        item.season === `${season.season}` &&
        item.episode === `${episode}`
    )
      ? true
      : false

    setIsMarkedAsListened(isMarked)
  }, [])

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    event.stopPropagation()

    if (!id) return

    if (!data) {
      add({ showId: id, ...season })
    }
    setTrack(episode - 1)
  }

  return (
    <li className="w-full" key={title}>
      <div className="flex items-center gap-1.5 w-full text-start">
        <button
          className={`flex flex-grow items-center p-1.5 border-2 rounded-md duration-200 transition-all ease-linear ${isMarkedAsListened ? 'border-zinc-400' : 'border-indigo-500'}`}
          onClick={handleClick}
        >
          <MdPlayCircle className="mr-0.5 text-xl text-zinc-950 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full duration-200 transition-all ease-linear" />
          {title}
        </button>
        <FavButton ep={episode} showId={id || '0'} season={season?.season} />
      </div>
    </li>
  )
}
