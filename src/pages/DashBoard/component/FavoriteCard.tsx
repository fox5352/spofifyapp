import { useEffect, useState } from "react"
import { formatDate } from "../../../lib/utils"
import { getPreview } from "../../../api/requests"
import SeasonCard, { SeasonCardProps } from "../../../ui/SeasonCard"

interface FavoriteCardProps extends SeasonCardProps {
  date: Date
}

export default function FavoriteCard({ data, date, className, showId }: FavoriteCardProps) {
  const [title, setTitle] = useState("loading...")
  const formatedDate = formatDate(date.toString(), {
    year: '2-digit',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })

  useEffect(() => {
    const fetchData = async () => {
      const res = await getPreview()
      if (!res) return

      const show = res.find((show) => `${show.id}` === showId)
      if (!show) return

      setTitle(show.title)
    }
    fetchData()
  }, [])

  return (
    <div className={`h-96 ${className} rounded-md overflow-hidden relative`}>
      <div className='absolute z-20 top-0 left-0 w-full p-2 px-4 text-white bg-zinc-950 rounded-md'>
        <h2 className='text-xl text-white'>{title}</h2>
        <h4 className=''>{formatedDate}</h4>
      </div>
      <SeasonCard key={`${showId}-season-${data.season}`}
        showId={showId}
        data={data}
      />
    </div>
  )
}
