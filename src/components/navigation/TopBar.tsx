'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { useAuth } from '@/hooks/useAuth'
import { signOut } from '@/lib/auth'
import { useTheme } from '@/context/ThemeContext'

const NAV_ITEMS = [
  { href: '/systems', label: 'SYSTEMS' },
  { href: '/projects', label: 'PROJECTS' },
  { href: '/blog', label: 'NOTES' },
  { href: '/about', label: 'ABOUT' },
  { href: '/mission-control', label: 'MISSION CTRL' },
  { href: '/contact', label: 'CONTACT' },
]

export function TopBar() {
  const pathname = usePathname()
  const { user, profile, isAdmin } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [time, setTime] = useState('')

  useEffect(() => {
    const update = () => {
      const now = new Date()
      setTime(now.toISOString().slice(11, 19) + ' UTC')
    }
    update()
    const id = setInterval(update, 1000)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 15)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-40 transition-all duration-300',
          'bg-paper/95 backdrop-blur-md border-b border-graphite/10',
          scrolled ? 'shadow-engineering py-0' : 'py-0.5'
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16 gap-4">
            
            {/* Logo */}
            <Link href="/" className="group flex items-center gap-3 flex-shrink-0">
              <div className="relative w-6 h-6 flex items-center justify-center">
                <div className="w-5 h-5 border border-orange-DEFAULT/70 rotate-45 group-hover:rotate-90 transition-transform duration-300" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-2 h-2 bg-orange-DEFAULT rotate-45" />
                </div>
              </div>
              <div className="flex flex-col justify-center">
                <span className="font-display font-bold text-sm sm:text-base text-ink tracking-tight leading-tight">
                  PRANJAL GIRI
                </span>
                <span className="font-mono text-3xs text-steel tracking-widest leading-tight hidden sm:block">
                  AI & ROBOTICS / FLIGHT SOFTWARE
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden xl:flex items-center gap-1 flex-shrink-0">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'font-mono text-2xs tracking-widest px-3 py-1.5 transition-colors border border-transparent whitespace-nowrap',
                    pathname === item.href || pathname.startsWith(item.href + '/')
                      ? 'text-orange-DEFAULT border-orange/20 bg-orange/5 font-semibold'
                      : 'text-steel hover:text-ink hover:border-graphite/15'
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Right Side Utility & Auth Controls */}
            <div className="hidden lg:flex items-center gap-3 flex-shrink-0">
              {/* UTC System Time (Only on wide screens to prevent clustering) */}
              <div className="hidden 2xl:block font-mono text-3xs text-steel/60 whitespace-nowrap">
                {time}
              </div>

              {/* Status Indicator */}
              <div className="hidden xl:flex items-center gap-1.5 whitespace-nowrap border-l border-graphite/10 pl-3">
                <div className="w-1.5 h-1.5 rounded-full bg-sage animate-pulse-slow" />
                <span className="font-mono text-3xs text-sage tracking-widest">SYS: ONLINE</span>
              </div>

              {/* Theme Toggle Button */}
              <button
                type="button"
                onClick={toggleTheme}
                className="font-mono text-2xs tracking-wider px-2.5 py-1 border border-graphite/20 hover:border-orange-DEFAULT text-steel hover:text-ink transition-colors flex items-center gap-1.5 whitespace-nowrap bg-paper-dark/20"
                title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
              >
                <span className={cn('w-1.5 h-1.5 rounded-full transition-colors', theme === 'dark' ? 'bg-orange-DEFAULT' : 'bg-steel')} />
                <span>{theme === 'dark' ? 'DARK' : 'LIGHT'}</span>
              </button>

              {/* Auth Controls */}
              {user ? (
                <div className="flex items-center gap-2 border-l border-graphite/10 pl-3">
                  {isAdmin && (
                    <Link
                      href="/admin"
                      className="font-mono text-2xs text-orange-DEFAULT border border-orange-DEFAULT/40 bg-orange/5 px-2.5 py-1 hover:bg-orange/15 transition-colors whitespace-nowrap font-bold"
                    >
                      ADMIN
                    </Link>
                  )}
                  <Link
                    href="/profile"
                    className="font-mono text-2xs text-ink hover:text-orange-DEFAULT border border-graphite/20 px-2.5 py-1 transition-colors whitespace-nowrap bg-paper-dark/20"
                  >
                    @{profile?.username || 'PROFILE'}
                  </Link>
                  <button
                    type="button"
                    onClick={() => signOut()}
                    className="font-mono text-2xs text-steel hover:text-red-500 transition-colors whitespace-nowrap px-1"
                  >
                    SIGN OUT
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  className="font-mono text-2xs text-paper bg-graphite hover:bg-orange-DEFAULT px-3 py-1.5 transition-colors whitespace-nowrap font-bold tracking-wider"
                  style={{ backgroundColor: '#263238', color: '#FFFFFF' }}
                >
                  LOGIN →
                </Link>
              )}
            </div>

            {/* Mobile / Tablet Nav Trigger */}
            <div className="xl:hidden flex items-center gap-2">
              <button
                type="button"
                onClick={toggleTheme}
                className="font-mono text-xs px-2 py-1 border border-graphite/20 text-steel hover:text-ink"
                title="Toggle Theme"
              >
                {theme === 'dark' ? '🌙' : '☀️'}
              </button>

              <button
                type="button"
                className="flex flex-col justify-center items-center gap-1.5 p-2 border border-graphite/15 hover:border-orange-DEFAULT text-ink transition-colors"
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label="Toggle menu"
              >
                <span className={cn('w-5 h-0.5 bg-ink transition-transform duration-200', mobileOpen && 'rotate-45 translate-y-2')} />
                <span className={cn('w-5 h-0.5 bg-ink transition-opacity duration-200', mobileOpen && 'opacity-0')} />
                <span className={cn('w-5 h-0.5 bg-ink transition-transform duration-200', mobileOpen && '-rotate-45 -translate-y-2')} />
              </button>
            </div>

          </div>
        </div>
      </header>

      {/* Mobile Drawer Navigation */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="fixed inset-0 z-30 bg-paper pt-20 px-6 pb-8 flex flex-col justify-between"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <div className="bg-engineering-grid bg-grid-40 absolute inset-0 opacity-30 pointer-events-none" />
            
            <nav className="relative flex flex-col gap-1 z-10">
              <div className="font-mono text-3xs text-orange-DEFAULT tracking-widest mb-2 px-4">
                SYSTEM NAVIGATION
              </div>
              {NAV_ITEMS.map((item, i) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.03 }}
                >
                  <Link
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      'block font-mono text-sm tracking-widest py-3 px-4 border-b border-graphite/10 transition-colors',
                      pathname === item.href ? 'text-orange-DEFAULT bg-orange/5 font-bold' : 'text-ink hover:text-orange-DEFAULT'
                    )}
                  >
                    {`→ ${item.label}`}
                  </Link>
                </motion.div>
              ))}

              <div className="mt-4 flex items-center justify-between px-4 py-2 border-t border-graphite/10 font-mono text-3xs text-steel">
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-sage animate-pulse" />
                  <span className="text-sage">ONLINE</span>
                </div>
                <div>{time}</div>
              </div>
            </nav>

            {/* Mobile Auth Footer */}
            <div className="relative z-10 pt-4 border-t border-graphite/10">
              {!user ? (
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="block w-full font-mono text-xs text-center py-3 bg-orange-DEFAULT text-white font-bold tracking-widest shadow-md"
                  style={{ backgroundColor: '#D96C32', color: '#FFFFFF' }}
                >
                  ACCESS SYSTEM // LOGIN →
                </Link>
              ) : (
                <div className="flex flex-col gap-2">
                  <div className="font-mono text-3xs text-steel tracking-wider px-1">
                    OPERATOR: <span className="text-ink font-bold">{user.email}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      href="/profile"
                      onClick={() => setMobileOpen(false)}
                      className="font-mono text-xs text-center py-2.5 border border-graphite/20 text-ink hover:border-orange-DEFAULT"
                    >
                      PROFILE
                    </Link>
                    {isAdmin && (
                      <Link
                        href="/admin"
                        onClick={() => setMobileOpen(false)}
                        className="font-mono text-xs text-center py-2.5 border border-orange-DEFAULT/40 bg-orange/10 text-orange-DEFAULT font-bold"
                      >
                        ADMIN
                      </Link>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => { signOut(); setMobileOpen(false) }}
                    className="w-full font-mono text-xs py-2 text-steel hover:text-red-500 border border-graphite/10 mt-1"
                  >
                    SIGN OUT
                  </button>
                </div>
              )}
            </div>

          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
