import FavoritesSection from './components/FavoritesSection'
import ListenHistorySection from './components/ListenHistorySection'

/**
 * Dashboard component that displays a user's favorite TV show seasons.
 * Fetches and displays favorite seasons data, handling loading and error states.
 */
export default function Dashboard() {
  return (
    <div className="flex flex-col items-center w-full">
      <FavoritesSection />
      <ListenHistorySection />
    </div>
  )
}
