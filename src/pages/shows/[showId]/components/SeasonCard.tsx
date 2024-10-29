import { Link } from 'react-router-dom'
import { Season } from '../../../../api/requests'

export default function SeasonCard(data: Season) {
  const { image, title, season } = data

  return (
    <Link
      to="season"
      state={data}
      className="max-w-xs w-full cursor-pointer relative h-96 rounded-md shadow-xl text-white bg-zinc-950 overflow-hidden"
    >
      <div className="relative w-full h-[85%] top-0 left-0">
        <img className="w-full h-full" src={image} alt="season banner" />
        <h5 className="absolute top-0 left-0 m-1 p-0.5 px-2 bg-zinc-950 rounded-full">
          {season}
        </h5>
      </div>
      <div className="flex justify-center items-center h-[15%]">
        <h4 className="text-xl p-1">{title}</h4>
      </div>
    </Link>
  )
}
