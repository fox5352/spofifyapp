import { Link, useNavigate } from 'react-router-dom'
import { MdArrowCircleLeft } from 'react-icons/md'
import { type Show } from '../../../../api/requests'
import { formatDate } from '../../../../lib/utils'

/**
 * Props for the ShowHeader component
 */
interface ShowHeaderProps {
  /** Show data to display */
  show: Show
  /** Whether the description is currently expanded */
  isDescriptionExpanded: boolean
  /** Callback to toggle the description expansion state */
  onToggleDescription: () => void
}

/**
 * ShowHeader displays the main information about a TV show including its title,
 * seasons count, last updated date, description, and show image.
 * It includes navigation controls and an expandable description.
 */
export default function ShowHeader({
  show,
  isDescriptionExpanded,
  onToggleDescription,
}: ShowHeaderProps) {
  const navigate = useNavigate()
  const descriptionId = `show-description-${show.title.toLowerCase().replace(/\s+/g, '-')}`

  return (
    <header
      className="flex flex-col md:flex-row justify-center p-2 min-h-[320px] text-white bg-[--bg-two] md:rounded-md relative"
      aria-label={`Header for ${show.title}`}
    >
      {/* Content Section */}
      <div className="flex flex-col basis-1/2 w-full text-center md:text-start md:pt-4 md:pl-4">
        {/* Navigation and Title */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            className="w-10 h-10 text-[--text-two] rounded-full duration-200 ease-in-out bg-[--ac-one] hover:scale-90 transition-all"
            onClick={() => navigate(-1)}
            aria-label="Go back to previous page"
            type="button"
          >
            <MdArrowCircleLeft className="w-full h-full p-0.5" />
          </button>
          <Link
            to="./"
            className="hover:bg-gradient-to-r from-[--ac-one] via-[--ac-two] to-purple-500 hover:bg-clip-text hover:text-transparent duration-200 transition-all ease-linear"
            aria-label="Go to show's home page"
          >
            <h1 className="text-4xl font-bold">{show.title}</h1>
          </Link>
        </div>

        {/* Show Information */}
        <div className="p-1 pt-1.5">
          <p className="text-[--ac-one]">
            <span className="sr-only">Number of seasons: </span>
            Seasons {show.seasons.length}
          </p>
          <p className="text-purple-500">
            <span className="sr-only">Last updated: </span>
            Updated {formatDate(show.updated)}
          </p>
        </div>

        {/* Description Section */}
        <div
          className="content p-2 overflow-y-auto max-h-[140px] text-start"
          id={descriptionId}
          role="region"
          aria-label="Show description"
        >
          <p>
            {isDescriptionExpanded
              ? show.description
              : `${show.description.slice(0, 140)}...`}
          </p>
        </div>

        {/* Description Toggle Button */}
        <div className="mt-2">
          <button
            className="w-auto p-[3px] relative"
            onClick={onToggleDescription}
            aria-expanded={isDescriptionExpanded}
            aria-controls={descriptionId}
            type="button"
          >
            <div
              className="absolute inset-0 bg-gradient-to-r from-[--ac-one] to-purple-500 rounded-lg"
              aria-hidden="true"
            />
            <div className="px-2 py-0.5 bg-[--bg-two] rounded-[6px] relative group transition duration-200 text-white hover:bg-transparent">
              {isDescriptionExpanded ? 'Show Less' : 'Show More'}
            </div>
          </button>
        </div>
      </div>

      {/* Show Image */}
      <div
        className="overflow-hidden md:max-w-xs h-auto rounded-md"
        aria-hidden="true"
      >
        <img
          src={show.image}
          alt={`Cover image for ${show.title}`}
          className="w-full h-full object-cover"
          loading="eager"
        />
      </div>
    </header>
  )
}
