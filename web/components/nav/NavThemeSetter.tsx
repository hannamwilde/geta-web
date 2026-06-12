'use client'
import { useEffect } from 'react'
import { useNavTheme } from '@/context/NavThemeContext'

export default function NavThemeSetter({ theme }: { theme: 'default' | 'purple' }) {
  const { setTheme } = useNavTheme()
  useEffect(() => {
    setTheme(theme)
    return () => setTheme('default')
  }, [theme, setTheme])
  return null
}
