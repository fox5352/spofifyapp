import { Outlet } from 'react-router-dom'
import MusicBar from './components/MusicBar'

export default function RootLayout() {
  return (
    <>
      {/* TODO: header */}
      <main>
        <Outlet />
      </main>
      {/* audio controls */}
      <MusicBar />
    </>
  )
}
