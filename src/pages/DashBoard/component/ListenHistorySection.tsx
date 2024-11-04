import { useEffect, useState } from "react"

import { getFromListened, Listened, resetlisted } from '../../../lib/utils.tsx'
import { getShow } from "../../../api/requests.ts"
import ErrorMessage from "../../../ui/ErrorMessage.tsx"
import Loading from "../../../ui/Loading.tsx"
import { Link } from "react-router-dom"


interface MarkedEpisode extends Listened {
  title: string
}

export default function ListenHistorySection() {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<{ message: string, color: string } | null>(null)
  const [markedEpisodes, setMarkedEpisodes] = useState<MarkedEpisode[] | null>(null)

  useEffect(() => {
    const fetchDate = async (list: Listened[]) => {
      setIsLoading(true)
      setError(null)

      const buffer: MarkedEpisode[] = []

      for (const item of list) {
        const show = await getShow(item.showId)

        if (!show) continue;

        buffer.push({
          ...item,
          title: show?.title,
        })
      }

      if (buffer.length === 0) {
        setError({ message: 'No listen history found', color: 'text-white' })
        setIsLoading(false)
        return
      }


      setError(null)
      setIsLoading(false)
      setMarkedEpisodes(buffer)
    }

    fetchDate(getFromListened())
  }, [])

  const handleReset = () => {
    resetlisted()
    setMarkedEpisodes(null)
    setError({ message: 'No listen history found', color: 'text-white' })

  }

  return (
    <section className="flex flex-col items-center max-w-screen-xl w-full min-h-[384px] mx-auto my-2 p-2 bg-zinc-950 rounded-md  "
      aria-label="Favorite Shows Dashboard"
    >
      <div className="flex items-center justify-between w-full md:max-w-[90%] md:px-6">
        <h3 className="flex justify-start w-full text-4xl font-bold py-1 pl-2 bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500 bg-clip-text text-transparent">History</h3>

        {/**/}
        <div>
          <button className="p-[3px] text-nowrap relative duration-200 transition hover:scale-x-95" onClick={handleReset}>
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg" />
            <div className="px-3 py-1  bg-black rounded-[6px]  relative group transition duration-200 text-white active:bg-transparent">
              Reset History
            </div>
          </button>
        </div>
      </div>
      <div className="w-full max-w-[90%] h-1 mt-4 mx-auto bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500 rounded-full" />
      {/**/}
      <div className="flex flex-col w-full text-white min-h-96">
        {error ? (
          <div className={`${error.color} w-full mt my-8`}>
            <ErrorMessage className={error.color} message={error.message} size="text-2xl" />
          </div>
        ) : (
          (isLoading || markedEpisodes === null) ? (
            <div className="flex justify-center w-full h-56">
              <Loading className="h-full w-auto" />
            </div>
          ) : (
            <div className="flex flex-col my-2 space-y-2">
              {markedEpisodes.map(epi => (
                <MarkedEpisodeButton key={`${epi.showId}${epi.season}${epi.episode}`} {...epi} />
              ))}
            </div>
          )
        )}      </div>
    </section>
  )
}

function MarkedEpisodeButton({ showId, title, season, episode }: MarkedEpisode) {
  return (
    <Link to={`/shows/${showId}/${season}`}
      className={`flex flex-grow items-center p-1.5 border-2 rounded-md duration-200 transition-all ease-linear`}
    >
      <div className="">
        <h3 className="md:text-lg space-x-2">
          <span className="text-indigo-500 font-bold">{title}</span>
          <span className="text-violet-500">Season{season}</span>
          <span className="text-purple-500">Episode{episode}</span>
        </h3>
      </div>
    </Link>
  )
}
