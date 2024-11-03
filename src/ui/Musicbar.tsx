import { useEffect, useRef, useState } from 'react'
import {
  MdArrowCircleLeft,
  MdArrowCircleRight,
  MdPauseCircle,
  MdPlayCircle,
} from 'react-icons/md'
import { usePlaylist } from '../store/playlist'
import { Listened, saveToListened } from '../lib/utils'

export default function Musicbar() {
  const [isPaused, setIsPaused] = useState(true)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const progressBarRef = useRef<HTMLDivElement | null>(null)
  // playlist store
  const { data, index, next, previous } = usePlaylist()

  // initial load
  useEffect(() => {
    const updateProgress = () => {
      if (
        audioRef.current &&
        audioRef.current.duration &&
        progressBarRef.current
      ) {
        const progress =
          (audioRef.current.currentTime / audioRef.current.duration) * 100
        progressBarRef.current.style.width = `${progress}%`

        const markAsListend = progress >= 95// TODO: to allow for adjustments later

        if (markAsListend && data) {
          // TODO: mark as listened
          const newSave: Listened = {
            showId: data.showId,
            season: `${data.season}`,
            episode: `${index + 1}`,
            url: data.episodes[index].file,
            date: new Date()
          }
          saveToListened(newSave)
        }
      }
    }

    const loadAudio = (data: string) => {
      if (audioRef.current) {
        audioRef.current.src = data
        audioRef.current.load()
        // --
        if (audioRef.current.canPlayType.length > 0) {
          audioRef.current.play()
          setIsPaused(false)
        }
      }
    }

    if (data) {
      loadAudio(data.episodes[index].file)
    }

    audioRef.current?.addEventListener('timeupdate', updateProgress)

    return () => {
      audioRef.current?.removeEventListener('timeupdate', updateProgress)
    }
  }, [data, index])

  // beforeuload when audio is playing
  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault()
      // TODO: add timstamp with auido path
    }

    if (audioRef.current && !audioRef.current.paused && !isPaused) {
      window.addEventListener('beforeunload', handleBeforeUnload)
    } else {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }

    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [isPaused, audioRef])

  const togglePlayPause = () => {
    if (audioRef.current && audioRef.current.paused) {
      audioRef.current.play()
      setIsPaused(false)
    } else if (audioRef.current && !audioRef.current.paused) {
      audioRef.current.pause()
      setIsPaused(true)
    }
  }

  return (
    <>
      <div
        className={`fixed z-50 bottom-1 left-1/2 -translate-x-1/2 w-[95%] max-w-3xl`}
      >
        <div className="p-[3px] relative">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg" />
          {/*  music bar container */}
          <div className="flex justify-between h-16 px-1 md:px-4 py-2 bg-black rounded-[6px] relative group transition duration-200 text-white">
            {/* TODO: track title */}
            <div className="flex h-full items-center min-w-20">
              <h3 className="text-md">Episode: {index + 1}</h3>
            </div>
            {/* controls block */}
            <div className="flex flex-col items-center max-w-32 md:max-w-none w-full">
              <audio ref={audioRef}>
                <source type="audio/mp3" />
              </audio>
              {/* controls */}
              <nav className="flex gap-2 mb-1">
                <button
                  className="text-4xl text-black rounded-full duration-200 ease-in-out bg-indigo-500 hover:scale-90 transition-all"
                  onClick={previous}
                >
                  <MdArrowCircleLeft />
                </button>
                <button
                  className="text-4xl text-black rounded-full duration-200 ease-in-out bg-gradient-to-r from-indigo-500 to-purple-500 hover:scale-90 transition-all"
                  onClick={togglePlayPause}
                >
                  {isPaused ? <MdPlayCircle /> : <MdPauseCircle />}
                </button>
                <button
                  className="text-4xl text-black rounded-full duration-200 ease-in-out bg-purple-500 hover:scale-90 transition-all"
                  onClick={next}
                >
                  <MdArrowCircleRight />
                </button>
              </nav>
              {/* progress bar */}
              <div className="h-1 max-w-96 w-full bg-stone-700 rounded-xl overflow-hidden">
                <div
                  ref={progressBarRef}
                  className={`h-full w-0 ${!isPaused ? 'bg-gradient-to-r from-indigo-500 to-purple-500' : 'bg-gradient-to-r from-red-500 to-rose-500'}`}
                ></div>
              </div>
            </div>
            {/* TODO: selection dropdown */}
            <div className="w-20"></div>
          </div>
        </div>
      </div>
    </>
  )
}
