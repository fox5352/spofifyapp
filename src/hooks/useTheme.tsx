import { useEffect, useState } from 'react'

export default function useTheme(): [string, () => void] {
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme')

    switch (savedTheme) {
      case 'light':
        return 'light'
      case 'dark':
        return 'dark'
      default:
        return window.matchMedia('(prefers-color-scheme: dark)').matches
          ? 'dark'
          : 'light'
    }
  })

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'dark' ? 'light' : 'dark'))
  }

  return [theme, toggleTheme]
}
