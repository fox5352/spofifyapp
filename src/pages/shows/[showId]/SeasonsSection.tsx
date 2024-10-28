import { useOutletContext } from 'react-router-dom'
import { Season } from '../../../api/requests'
import SeasonCard from './components/SeasonCard'

export default function SeasonsSection() {
  const data: Season[] = useOutletContext()

  return (
    <div className="flex flex-col justify-center items-center md: md:flex-row gap-2 md:gap-8 p-2">
      {data &&
        data.map((season) => <SeasonCard key={season.title} {...season} />)}
    </div>
  )
}
