import { useEffect, useRef, useState } from 'react'
import {
  MdArrowCircleLeft,
  MdArrowCircleRight,
  MdPauseCircle,
  MdPlayCircle,
} from 'react-icons/md'

export default function Musicbar() {
  const src = 'https://podcast-api.netlify.app/placeholder-audio.mp3' // TODO: replace with real data
  const [isPaused, setIsPaused] = useState(true)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const progressBarRef = useRef<HTMLDivElement | null>(null)

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
      }
    }

    const loadAudio = (data: string) => {
      if (audioRef.current) {
        audioRef.current.src = data
        audioRef.current.load()
      }
    }

    loadAudio(src)

    audioRef.current?.addEventListener('timeupdate', updateProgress)

    return () => {
      audioRef.current?.removeEventListener('timeupdate', updateProgress)
    }
  }, [])

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
      <div className="fixed z-50 bottom-1 left-1/2 -translate-x-1/2 w-[95%] max-w-3xl">
        <div className="p-[3px] relative">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg" />
          {/*  music bar container */}
          <div className="flex justify-center h-16 px-8 py-2 bg-black rounded-[6px] relative group transition duration-200 text-white">
            {/* controls block */}
            <div className="flex flex-col items-center max-w-96 w-full">
              <audio ref={audioRef}>
                <source type="audio/mp3" />
              </audio>
              {/* controls */}
              <nav className="flex gap-2 mb-1">
                <button className="text-4xl text-black rounded-full duration-200 ease-in-out bg-indigo-500 hover:scale-90 transition-all">
                  <MdArrowCircleLeft />
                </button>
                <button
                  className="text-4xl text-black rounded-full duration-200 ease-in-out bg-gradient-to-r from-indigo-500 to-purple-500 hover:scale-90 transition-all"
                  onClick={togglePlayPause}
                >
                  {isPaused ? <MdPlayCircle /> : <MdPauseCircle />}
                </button>
                <button className="text-4xl text-black rounded-full duration-200 ease-in-out bg-purple-500 hover:scale-90 transition-all">
                  <MdArrowCircleRight />
                </button>
              </nav>
              {/* progress bar */}
              <div className="h-1 w-full bg-stone-700 rounded-xl">
                <div
                  ref={progressBarRef}
                  className={`h-full w-0 ${!isPaused ? 'bg-gradient-to-r from-indigo-500 to-purple-500' : 'bg-gradient-to-r from-red-500 to-rose-500'}`}
                ></div>
              </div>
            </div>
            {/* TODO: */}
          </div>
        </div>
      </div>
    </>
  )
}
