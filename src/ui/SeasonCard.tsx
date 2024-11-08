import { Link } from 'react-router-dom'
// utils
import { Season } from '../api/requests'

export interface SeasonCardProps {
  showId: string
  data: Season
  className?: string
}

/**
 * SeasonCard Component
 *
 * A card that links to season and displays seasos number, total episodes and title
 */
export default function SeasonCard({
  showId,
  data,
  className = '',
}: SeasonCardProps) {
  const { image, title, season, episodes } = data

  return (
    <Link
      to={`/shows/${showId}/${season}`}
      state={data}
      className={`max-w-xs w-full cursor-pointer relative h-96 rounded-md shadow-xl text-white bg-[--bg-two] overflow-hidden ${className}`}
    >
      <div className="relative w-full h-[85%] top-0 left-0">
        <img className="w-full h-full" src={image} alt="season banner" />
        <div className="absolute top-0 left-0 m-1 p-0.5 px-2 bg-[--bg-two] rounded-md">
          <h5 className="text-[--ac-one]">Season: {season}</h5>
          <h6 className="text-sm text-purple-500">
            Eposodes: {episodes.length}
          </h6>
        </div>
      </div>
      <div className="flex justify-center items-center h-[15%]">
        <h4 className="text-xl p-1">{title}</h4>
      </div>
    </Link>
  )
}
