'use client'
import { useState, useEffect } from 'react'
import { LoadingScreen } from '@/components/ui/LoadingScreen'
import { ThemeProvider } from '@/context/ThemeContext'

export function Providers({ children }: { children: React.ReactNode }) {
  const [loaded, setLoaded] = useState(false)
  const [showLoader, setShowLoader] = useState(false)

  useEffect(() => {
    const visited = sessionStorage.getItem('pg_visited')
    if (!visited) {
      setShowLoader(true)
    } else {
      setLoaded(true)
    }
  }, [])

  return (
    <ThemeProvider>
      {showLoader && !loaded ? (
        <LoadingScreen onComplete={() => { setLoaded(true); setShowLoader(false) }} />
      ) : (
        children
      )}
    </ThemeProvider>
  )
}
