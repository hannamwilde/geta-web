'use client'
import { createContext, useContext, useState, type ReactNode } from 'react'

type NavTheme = 'default' | 'purple'
type Ctx = { theme: NavTheme; setTheme: (t: NavTheme) => void }

const NavThemeContext = createContext<Ctx>({ theme: 'default', setTheme: () => {} })

export function NavThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<NavTheme>('default')
  return <NavThemeContext.Provider value={{ theme, setTheme }}>{children}</NavThemeContext.Provider>
}

export function useNavTheme() {
  return useContext(NavThemeContext)
}
