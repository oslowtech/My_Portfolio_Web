'use client'
import { useState, useEffect } from 'react'
import { LoadingScreen } from '@/components/ui/LoadingScreen'
import { ThemeProvider } from '@/context/ThemeContext'

export function Providers({ children }: { children: React.ReactNode }) {
  const [showLoader, setShowLoader] = useState(false)

  useEffect(() => {
    try {
      const visited = sessionStorage.getItem('pg_visited')
      if (!visited) {
        setShowLoader(true)
      }
    } catch {}
  }, [])

  const handleComplete = () => {
    try {
      sessionStorage.setItem('pg_visited', '1')
    } catch {}
    setShowLoader(false)
  }

  return (
    <ThemeProvider>
      {children}
      {showLoader && <LoadingScreen onComplete={handleComplete} />}
    </ThemeProvider>
  )
}
