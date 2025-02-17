import { useOutletContext, useParams } from 'react-router-dom'
import { Season } from '../../../api/requests'
import SeasonCard from '../../../ui/SeasonCard'

export default function SeasonsSection() {
  const { id } = useParams()
  const data: Season[] = useOutletContext()

  return (
    <div className="flex flex-col flex-wrap justify-center items-center md: md:flex-row gap-2 md:gap-8 p-2">
      {data &&
        data.map((season) => (
          <SeasonCard key={season.title} showId={id || '0'} data={season} />
        ))}
    </div>
  )
}
