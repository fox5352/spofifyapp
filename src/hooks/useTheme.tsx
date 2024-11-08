import { useEffect, useState } from "react";
import { getfromLocal } from "../lib/utils"

export default function useTheme(): [string, () => void] {
  const [theme, setTheme] = useState(() => {
    const savedTheme = getfromLocal<string>('theme')
    if (savedTheme) return savedTheme
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  })

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);


  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'dark' ? 'light' : 'dark'));
  };

  return [theme, toggleTheme];
}
