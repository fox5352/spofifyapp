import { ChangeEvent, useCallback, useEffect, useRef, useState } from 'react'
import {
  MdArrowCircleLeft,
  MdArrowCircleRight,
  MdPauseCircle,
  MdPlayCircle,
} from 'react-icons/md'
// utils
import { Listened, saveToListened } from '../lib/utils'
import { usePlaylist } from '../store/playlist'
// Component
import SelectMenu from './SelectMenu'

type SelectOption = {
  text: string
  value: string
}

/**
 * AudioPlayer - A fixed-position audio player component with playback controls
 * and progress tracking.
 *
 * This component provides a full-featured audio player interface with:
 * - Play/pause toggle
 * - Next/previous track navigation
 * - Click-to-seek progress bar
 * - Episode selection dropdown
 * - Responsive design with gradient styling
 * - Page leave warning when audio is playing
 *
 * The player maintains its state through the usePlaylist hook and automatically
 * saves listening progress to local storage when episodes are completed.
 *
 * @example
 * ```tsx
 * <AudioPlayer />
 * ```
 */
export default function AudioPlayer() {
  // Refs for DOM elements
  const audioElementRef = useRef<HTMLAudioElement | null>(null)
  const progressBarContainerRef = useRef<HTMLDivElement | null>(null)
  const progressBarElementRef = useRef<HTMLDivElement | null>(null)

  // Local state
  const [isPlaying, setIsPlaying] = useState(false)
  const [selectOptions, setSelectOptions] = useState<SelectOption[] | null>(
    null
  )

  // Global playlist state
  const { data, index, next, previous, setTrack } = usePlaylist()

  /**
   * Updates the progress bar and handles episode completion tracking.
   */
  const handleProgressUpdate = useCallback(() => {
    const audio = audioElementRef.current
    const progressBar = progressBarElementRef.current

    if (!audio?.duration || !progressBar) return

    const COMPLETION_THRESHOLD = 95 // Percentage threshold to mark as listened
    const currentProgress = (audio.currentTime / audio.duration) * 100

    // Update progress bar width based on completion percentage
    progressBar.style.width = `${currentProgress}%`

    // Track completion status and save data to local storage
    if (currentProgress >= COMPLETION_THRESHOLD && data) {
      const listenedRecord: Listened = {
        showId: data.showId,
        season: `${data.season}`,
        episode: `${index + 1}`,
        url: data.episodes[index].file,
        date: new Date(),
      }
      saveToListened(listenedRecord)
    }
  }, [data, index])

  /**
   * Handles click events on the progress bar to seek to a specific position.
   */
  const handleSeekOnProgressBar = (event: MouseEvent) => {
    event.stopPropagation()
    const container = progressBarContainerRef.current
    const audio = audioElementRef.current

    if (!container || !audio) return

    // Get the position and dimensions of the container relative to the viewport
    const rect = container.getBoundingClientRect()

    // Calculate the container's width based on its left and right coordinates
    const containerWidth = rect.right - rect.left

    // Calculate the horizontal position of the click within the container
    // by subtracting the left edge of the container from the click's x-coordinate
    const clickPosition = event.clientX - rect.left

    // Calculate the click position as a percentage of the container's width
    const clickPercentage = (clickPosition / containerWidth) * 100

    // Update the audio's current time based on the click percentage
    // The time is set by multiplying the audio's total duration by the click percentage
    audio.currentTime = (clickPercentage / 100) * audio.duration
  }

  /**
   * Loads and auto-plays a new audio file.
   */
  const loadAudioFile = (audioUrl: string) => {
    const audio = audioElementRef.current
    if (!audio) return

    audio.src = audioUrl
    audio.load()
    audio.play().then(() => setIsPlaying(true))
  }

  /**
   * loads audio  and sets up select options and listener
   */
  useEffect(() => {
    if (!data) return

    // Set up episode selection options
    setSelectOptions(
      data.episodes.map((ep, idx) => ({
        text: ep.title,
        value: `${idx}`,
      }))
    )

    // Load current episode
    loadAudioFile(data.episodes[index].file)

    // Set up event listeners
    const audio = audioElementRef.current
    const progressContainer = progressBarContainerRef.current

    audio?.addEventListener('timeupdate', handleProgressUpdate)

    progressContainer?.addEventListener('click', handleSeekOnProgressBar)

    // Cleanup
    return () => {
      audio?.removeEventListener('timeupdate', handleProgressUpdate)

      progressContainer?.removeEventListener('click', handleSeekOnProgressBar)
    }
  }, [data, index, handleProgressUpdate])

  // Handle page unload warning
  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault()
      return (event.returnValue =
        'Audio is still playing. Are you sure you want to leave?')
    }

    if (
      audioElementRef.current &&
      !audioElementRef.current.paused &&
      !isPlaying
    ) {
      window.addEventListener('beforeunload', handleBeforeUnload)
    }

    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [isPlaying])

  /**
   * Handles episode selection from the dropdown menu
   */
  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    event.preventDefault()
    setTrack(parseInt(event.target.value, 10))
  }

  /**
   * Toggles play/pause state of the audio player
   */
  const togglePlayback = () => {
    const audio = audioElementRef.current
    if (!audio || !data) return

    if (audio.paused) {
      audio.play()
      setIsPlaying(true)
    } else {
      audio.pause()
      setIsPlaying(false)
    }
  }

  /**
   * handle playing next audio file
   */
  const playNext = () => {
    if (data?.episodes && index >= data.episodes.length - 1) {
      setTrack(0)
    } else {
      next()
    }
  }

  /**
   * handle playing previous audio file
   */
  const playPrev = () => {
    if (data && index === 0) {
      setTrack(data.episodes.length - 1)
    } else {
      previous()
    }
  }

  return (
    <div className="fixed z-50 bottom-1 left-1/2 -translate-x-1/2 w-[95%] max-w-3xl">
      <div className="p-[3px] relative">
        {/* Gradient border */}
        <div className="absolute inset-0 bg-gradient-to-r from-[--ac-one] to-[--ac-three] rounded-lg" />

        {/* Player container */}
        <div className="flex justify-between h-16 px-1 md:px-4 py-2 bg-[--bg-two] rounded-[6px] relative group transition duration-200 text-white">
          {/* Reserved space for future episode selection dropdown */}
          <div className="flex justify-center items-center min-w-16 max-w-28">
            {selectOptions ? (
              <SelectMenu
                className="flex items-center"
                title=""
                onChange={handleChange}
                name="ep"
                defaultIdx={index}
                options={selectOptions}
              />
            ) : (
              'Empty'
            )}
          </div>

          {/* Playback controls */}
          <div className="flex flex-col items-center max-w-32 md:max-w-none w-full">
            <audio ref={audioElementRef}>
              <source type="audio/mp3" />
            </audio>

            <div className="flex flex-col items-center max-w-96 min-w-44 w-full">
              {/* Control buttons */}
              <nav className="flex gap-2 mb-1">
                <button
                  className="text-3xl md:text-4xl text-[--text-two] rounded-full duration-200 ease-in-out bg-[--ac-one] hover:scale-90 transition-all"
                  onClick={playPrev}
                  aria-label="Previous episode"
                >
                  <MdArrowCircleLeft />
                </button>
                <button
                  className="text-3xl md:text-4xl text-[--text-two] rounded-full duration-200 ease-in-out bg-gradient-to-r from-[--ac-one] to-[--ac-three] hover:scale-90 transition-all"
                  onClick={togglePlayback}
                  aria-label={isPlaying ? 'Pause' : 'Play'}
                >
                  {isPlaying ? <MdPauseCircle /> : <MdPlayCircle />}
                </button>
                <button
                  className="text-3xl md:text-4xl text-[--text-two] rounded-full duration-200 ease-in-out bg-[--ac-three] hover:scale-90 transition-all"
                  onClick={playNext}
                  aria-label="Next episode"
                >
                  <MdArrowCircleRight />
                </button>
              </nav>

              {/* Progress bar */}
              <div
                ref={progressBarContainerRef}
                className="h-4 max-w-96 w-full mt-1 md:mt-1"
              >
                <div className="h-1  max-w-96 w-full bg-stone-700 rounded-xl overflow-hidden">
                  <div
                    ref={progressBarElementRef}
                    className={`h-full w-0 ${
                      isPlaying
                        ? 'bg-gradient-to-r from-[--ac-one] to-[--ac-three]'
                        : 'bg-gradient-to-r from-red-500 to-rose-500'
                    }`}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-center items-center md:min-w-16 max-w-28"></div>
        </div>
      </div>
    </div>
  )
}
