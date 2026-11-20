import { useEffect, useState } from 'react'

const STORAGE_KEY = 'student-manager-theme'

/** Light/dark theme. index.html sets the first value before React starts. */
export function useTheme() {
  const [theme, setTheme] = useState(() => document.documentElement.getAttribute('data-theme') || 'light')

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    try {
      localStorage.setItem(STORAGE_KEY, theme)
    } catch {
      // storage blocked (private mode): the theme still works, it just isn't remembered
    }
  }, [theme])

  const toggleTheme = () => setTheme((current) => (current === 'dark' ? 'light' : 'dark'))
  return { theme, toggleTheme }
}
