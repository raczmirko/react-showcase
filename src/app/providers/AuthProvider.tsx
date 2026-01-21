import React from 'react'

export type Role = 'ADMIN' | 'VIEWER'
export type User = { id: string; name: string; role: Role }

type AuthState = {
  user: User | null
  login: (name: string) => void
  logout: () => void
}

const STORAGE_KEY = 'session'

export const AuthContext = React.createContext<AuthState>({
  user: null,
  login: () => {},
  logout: () => {},
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<User | null>(() => {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as User) : null
  })

  const login = React.useCallback((name: string) => {
    const role: Role = name.toLowerCase() === 'admin' ? 'ADMIN' : 'VIEWER'
    const next: User = { id: crypto.randomUUID(), name, role }
    setUser(next)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  }, [])

  const logout = React.useCallback(() => {
    setUser(null)
    localStorage.removeItem(STORAGE_KEY)
  }, [])

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>
}