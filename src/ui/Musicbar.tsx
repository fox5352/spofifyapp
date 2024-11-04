import { useEffect, useRef, useState } from 'react'
import {
  MdArrowCircleLeft,
  MdArrowCircleRight,
  MdPauseCircle,
  MdPlayCircle,
} from 'react-icons/md'
import { PlayListData, usePlaylist } from '../store/playlist'
import { Listened, saveToListened } from '../lib/utils'


/**
 * AudioPlayer - A fixed-position audio player component with playback controls
 * and progress tracking.
 *
 * Features:
 * - Play/pause controls
 * - Next/previous track navigation
 * - Progress bar with visual feedback
 * - Automatic progress tracking and listened status
 * - Responsive design with gradient styling
 *
 * @returns {JSX.Element} The AudioPlayer component
 */
export default function AudioPlayer() {
  // Refs
  const audioElementRef = useRef<HTMLAudioElement | null>(null)
  const progressBarElementRef = useRef<HTMLDivElement | null>(null)

  // Local state
  const [isPlaying, setIsPlaying] = useState(false)

  // Playlist state
  const { data, index, next, previous } = usePlaylist()

  /**
   * Updates the progress bar and handles episode completion tracking
   */
  const handleProgressUpdate = () => {
    if (!audioElementRef.current?.duration || !progressBarElementRef.current) return

    const currentProgress = (audioElementRef.current.currentTime / audioElementRef.current.duration) * 100
    progressBarElementRef.current.style.width = `${currentProgress}%`

    const COMPLETION_THRESHOLD = 95 // Mark as listened when 95% complete
    if (currentProgress >= COMPLETION_THRESHOLD && data) {
      const listenedRecord: Listened = {
        showId: data.showId,
        season: `${data.season}`,
        episode: `${index + 1}`,
        url: data.episodes[index].file,
        date: new Date()
      }
      saveToListened(listenedRecord)
    }
  }

  /**
   * Loads and auto-plays a new audio file
   */
  const loadAudioFile = (audioUrl: string) => {
    if (!audioElementRef.current) return

    audioElementRef.current.src = audioUrl
    audioElementRef.current.load()

    if (audioElementRef.current.canPlayType.length > 0) {
      audioElementRef.current.play()
      setIsPlaying(true)
    }
  }

  // Handle audio loading and progress tracking
  useEffect(() => {
    if (data) {
      loadAudioFile(data.episodes[index].file)
    }

    audioElementRef.current?.addEventListener('timeupdate', handleProgressUpdate)
    return () => {
      audioElementRef.current?.removeEventListener('timeupdate', handleProgressUpdate)
    }
  }, [data, index])

  // Handle page unload warning when audio is playing
  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault()
      // TODO: Save current timestamp and audio path for resume functionality
    }

    if (audioElementRef.current && !audioElementRef.current.paused && !isPlaying) {
      window.addEventListener('beforeunload', handleBeforeUnload)
    } else {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }

    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [isPlaying])

  /**
   * Toggles play/pause state of the audio
   */
  const togglePlayback = () => {
    if (!audioElementRef.current || !data) return

    if (audioElementRef.current.paused) {
      audioElementRef.current.play()
      setIsPlaying(true)
    } else {
      audioElementRef.current.pause()
      setIsPlaying(false)
    }
  }

  return (
    <div className="fixed z-50 bottom-1 left-1/2 -translate-x-1/2 w-[95%] max-w-3xl">
      <div className="p-[3px] relative">
        {/* Gradient border */}
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg" />

        {/* Player container */}
        <div className="flex justify-between h-16 px-1 md:px-4 py-2 bg-black rounded-[6px] relative group transition duration-200 text-white">
          {/* Episode info */}
          <div className="flex h-full items-center min-w-20">
            {data &&
              (<h3 className="text-md">Episode: {index + 1}</h3>
              )}
          </div>

          {/* Playback controls */}
          <div className="flex flex-col items-center max-w-32 md:max-w-none w-full">
            <audio ref={audioElementRef}>
              <source type="audio/mp3" />
            </audio>

            {/* Control buttons */}
            <nav className="flex gap-2 mb-1">
              <button
                className="text-4xl text-black rounded-full duration-200 ease-in-out bg-indigo-500 hover:scale-90 transition-all"
                onClick={previous}
                aria-label="Previous episode"
              >
                <MdArrowCircleLeft />
              </button>
              <button
                className="text-4xl text-black rounded-full duration-200 ease-in-out bg-gradient-to-r from-indigo-500 to-purple-500 hover:scale-90 transition-all"
                onClick={togglePlayback}
                aria-label={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? <MdPauseCircle /> : <MdPlayCircle />}
              </button>
              <button
                className="text-4xl text-black rounded-full duration-200 ease-in-out bg-purple-500 hover:scale-90 transition-all"
                onClick={next}
                aria-label="Next episode"
              >
                <MdArrowCircleRight />
              </button>
            </nav>

            {/* Progress bar */}
            <div className="h-1 max-w-96 w-full bg-stone-700 rounded-xl overflow-hidden">
              <div
                ref={progressBarElementRef}
                className={`h-full w-0 ${isPlaying
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-500'
                  : 'bg-gradient-to-r from-red-500 to-rose-500'
                  }`}
              />
            </div>
          </div>

          {/* Reserved space for future episode selection dropdown */}
          <div className="w-20" />
        </div>
      </div>
    </div>
  )
}
