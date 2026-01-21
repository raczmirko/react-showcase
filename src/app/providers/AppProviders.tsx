import React from 'react'
import { QueryProvider } from './QueryProvider'
import { ThemeProvider } from './ThemeProvider'
import { I18nProvider } from './I18nProvider'
import { AuthProvider } from './AuthProvider'

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <I18nProvider>
      <QueryProvider>
        <ThemeProvider>
          <AuthProvider>{children}</AuthProvider>
        </ThemeProvider>
      </QueryProvider>
    </I18nProvider>
  )
}