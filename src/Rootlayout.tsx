import { Outlet } from 'react-router-dom'
import MusicBar from './components/MusicBar'

export default function RootLayout() {
  return (
    <>
      {/* TODO: header */}
      <main className="w-full h-screen bg-zinc-950 text-white pb-[5.5rem] overflow-y-auto">
        <Outlet />
      </main>
      {/* audio controls */}
      <MusicBar />
    </>
  )
}
