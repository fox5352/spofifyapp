import { useNavigate } from 'react-router-dom'
import { type Show } from '../../../../api/requests'
import { MdArrowCircleLeft } from 'react-icons/md'
import { formatDate } from '../../../../lib/utils'

interface ShowHeaderProps {
  show: Show
  isDescriptionExpanded: boolean
  onToggleDescription: () => void
}

export default function ShowHeader({
  show,
  isDescriptionExpanded,
  onToggleDescription,
}: ShowHeaderProps) {
  const navigate = useNavigate()

  return (
    <div
      className="head flex flex-col md:flex-row justify-center p-2 min-h-[320px] text-white bg-zinc-950 md:rounded-md relative"
      role="banner"
    >
      <div className="flex flex-col basis-1/2 w-full text-center md:text-start md:pt-4 md:pl-4">
        <div className="flex gap-2">
          <button
            className="w-10 h-auto text-black rounded-full duration-200 ease-in-out bg-indigo-500 hover:scale-90 transition-all"
            onClick={() => navigate(-1)}
          >
            <MdArrowCircleLeft className="w-full h-full p-0.5" />
          </button>
          <h1 className=" text-4xl font-bold">Show: {show.title}</h1>
        </div>
        {/* TODO:added fav button */}
        <div className="p-1 pt-1.5">
          <p className="text-indigo-500">
            <span className="sr-only">Number of seasons:</span>
            Seasons {show.seasons.length}
          </p>
          <p className="text-purple-500">
            <span className="sr-only">Last updated:</span>
            Updated {formatDate(show.updated)}
          </p>
        </div>
        <div className="content p-2 overflow-y-auto max-h-[140px] text-start">
          <p>
            {isDescriptionExpanded
              ? show.description
              : `${show.description.slice(0, 140)}...`}
          </p>
        </div>
        <div className="mt-2">
          <button
            className="w-auto p-[3px] relative"
            onClick={onToggleDescription}
            aria-expanded={isDescriptionExpanded}
            aria-controls="show-description"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg" />
            <div className="px-2 py-0.5 bg-black rounded-[6px] relative group transition duration-200 text-white hover:bg-transparent">
              {isDescriptionExpanded ? 'Show Less' : 'Show More'}
            </div>
          </button>
        </div>
      </div>
      <div className="overflow-hidden md:max-w-xs h-auto rounded-md">
        <img
          src={show.image}
          alt={`${show.title} banner`}
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  )
}
