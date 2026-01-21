import React from 'react'
import { ThemeProvider as MuiThemeProvider, createTheme, CssBaseline } from '@mui/material'

type ThemeMode = 'light' | 'dark'
const STORAGE_KEY = 'themeMode'

export const ThemeModeContext = React.createContext({
  mode: 'light' as ThemeMode,
  toggle: () => {},
})

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = React.useState<ThemeMode>(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved === 'dark' ? 'dark' : 'light'
  })

  const toggle = React.useCallback(() => {
    setMode((prev) => {
      const next = prev === 'light' ? 'dark' : 'light'
      localStorage.setItem(STORAGE_KEY, next)
      return next
    })
  }, [])

  const theme = React.useMemo(() => createTheme({ palette: { mode } }), [mode])

  return (
    <ThemeModeContext.Provider value={{ mode, toggle }}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeModeContext.Provider>
  )
}