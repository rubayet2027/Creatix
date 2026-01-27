import React, { useEffect, useState } from 'react'

const ThemeContext = React.createContext({theme: 'light', toggle: () => {}})

function getInitialTheme() {
  try {
    const t = localStorage.getItem('creatix:theme')
    return t || 'light'
  } catch {
    return 'light'
  }
}

export default function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(getInitialTheme)

  useEffect(() => {
    const root = document.documentElement
    if (theme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
    try {
      localStorage.setItem('creatix:theme', theme)
    } catch {}
  }, [theme])

  const toggle = () => setTheme(prev => (prev === 'dark' ? 'light' : 'dark'))

  return (
    <ThemeContext.Provider value={{ theme, toggle }}>
      {children}
    </ThemeContext.Provider>
  )
}

export { ThemeContext }
