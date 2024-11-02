import { useLocation, useParams } from 'react-router-dom'
import { MdPlayCircle } from 'react-icons/md'
import { useEffect, useState } from 'react'

import { getShow, type Season } from '../../../../api/requests'
import { usePlaylist } from '../../../../store/playlist'

import ErrorMessage from '../../../../ui/ErrorMessage'
import Loading from '../../../../ui/Loading'

import EpisodeButton from './components/EpisodeButton'

export default function SeasonDetail() {
  // params
  const { id, season: seasonId } = useParams()
  // store
  const { add, setTrack } = usePlaylist()
  // page states
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  // page data
  const [season, setSeason] = useState<Season | null>(null)
  const { state }: { state: Season } = useLocation()

  useEffect(() => {
    const manageData = async () => {
      setIsLoading(true)

      if (!state && id && seasonId) {
        const show = await getShow(id)

        if (!show) {
          setError('Failed to fetch show')
          setIsLoading(false)
          return
        }

        const season = show.seasons[Number(seasonId) - 1]

        setError(null)
        setIsLoading(false)
        setSeason(season)
        return
      }
      setError(null)
      setSeason(state)
      setIsLoading(false)
    }
    manageData()
  }, [])

  const addAndPlay = () => {
    if (!season || !id) return
    add({ showId: id, ...season })
    setTrack(0)
  }

  if (isLoading) {
    return <Loading className="h-60 w-auto mx-auto mt-10" />
  }

  if (error) {
    return (
      <div className="w-full h-full text-red-500">
        <ErrorMessage message={error} size="text-2xl" />
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center w-full mt-2 text-white bg-zinc-950 rounded-md">
      <div className="max-w-4xl w-full px-1 py-2">
        <h2 className="text-2xl">{season?.title}</h2>
        <div className="p-1 pt-1.5">
          <h4 className="text-xl text-indigo-500">Season: {season?.season}</h4>
          <h5 className="text-xl text-purple-500">
            Episodes: {season?.episodes.length}
          </h5>
        </div>
        <nav>
          <button
            className="w-auto p-[3px] relative"
            aria-controls="show-description"
            onClick={addAndPlay}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg" />
            <div className="flex items-center gap-1 px-2 py-0.5 bg-black rounded-[6px] relative group transition duration-200 text-white hover:bg-transparent">
              Play <MdPlayCircle />
            </div>
          </button>
        </nav>
      </div>
      <ul className="flex flex-col max-w-5xl w-full space-y-1 py-2">
        {season?.episodes.map((episode, index) => (
          <EpisodeButton key={index} {...episode} season={state} />
        ))}
      </ul>
    </div>
  )
}
