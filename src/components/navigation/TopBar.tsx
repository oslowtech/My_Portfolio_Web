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
  const { user, isAdmin } = useAuth()
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
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-40 transition-all duration-300',
          scrolled
            ? 'bg-paper/95 backdrop-blur-sm border-b border-graphite/10 shadow-engineering'
            : 'bg-transparent'
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-14">
            {/* Logo */}
            <Link href="/" className="group flex items-center gap-3">
              <div className="relative">
                <div className="w-6 h-6 border border-orange-DEFAULT/60 rotate-45 group-hover:rotate-90 transition-transform duration-300" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-2 h-2 bg-orange-DEFAULT rotate-45" />
                </div>
              </div>
              <div>
                <div className="font-display font-bold text-sm text-ink tracking-tight leading-none">
                  PRANJAL GIRI
                </div>
                <div className="font-mono text-2xs text-steel tracking-widest leading-none mt-0.5">
                  AI & ROBOTICS / FLIGHT SOFTWARE
                </div>
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-1">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'font-mono text-2xs tracking-widest px-3 py-1.5 transition-colors border border-transparent',
                    pathname === item.href || pathname.startsWith(item.href + '/')
                      ? 'text-orange-DEFAULT border-orange/20 bg-orange/5'
                      : 'text-steel hover:text-graphite hover:border-graphite/10'
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Right side */}
            <div className="hidden lg:flex items-center gap-3">
              {/* System time */}
              <div className="font-mono text-2xs text-steel/60">{time}</div>

              {/* Status indicator */}
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-sage animate-pulse-slow" />
                <span className="font-mono text-2xs text-sage tracking-widest">SYSTEM: ONLINE</span>
              </div>

              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="font-mono text-2xs tracking-wider px-2 py-1 border border-graphite/20 hover:border-orange/50 text-steel hover:text-ink transition-colors flex items-center gap-1.5"
                title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
              >
                <span className={cn("w-1.5 h-1.5 rounded-full transition-colors", theme === 'dark' ? 'bg-orange-DEFAULT' : 'bg-steel')} />
                <span>{theme === 'dark' ? 'DARK' : 'LIGHT'}</span>
              </button>

              {/* Auth */}
              {user ? (
                <div className="flex items-center gap-2">
                  <Link
                    href="/profile"
                    className="font-mono text-2xs text-ink hover:text-orange-DEFAULT border border-graphite/20 px-2 py-1 transition-colors"
                  >
                    PROFILE
                  </Link>
                  {isAdmin && (
                    <Link
                      href="/admin"
                      className="font-mono text-2xs text-orange-DEFAULT border border-orange/30 px-2 py-1 hover:bg-orange/5 transition-colors"
                    >
                      ADMIN
                    </Link>
                  )}
                  <button
                    onClick={() => signOut()}
                    className="font-mono text-2xs text-steel hover:text-graphite transition-colors"
                  >
                    SIGN OUT
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  className="font-mono text-2xs text-orange-DEFAULT border border-orange/30 px-2 py-1 hover:bg-orange/5 transition-colors"
                >
                  LOGIN
                </Link>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="lg:hidden flex items-center gap-2">
              <button
                onClick={toggleTheme}
                className="font-mono text-2xs px-2 py-1 border border-graphite/20 text-steel"
              >
                {theme === 'dark' ? '🌙' : '☀️'}
              </button>
              <button
                className="flex flex-col gap-1 p-2"
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label="Toggle menu"
              >
                <span className={cn('w-5 h-px bg-graphite transition-transform duration-200', mobileOpen && 'rotate-45 translate-y-1')} />
                <span className={cn('w-5 h-px bg-graphite transition-opacity duration-200', mobileOpen && 'opacity-0')} />
                <span className={cn('w-5 h-px bg-graphite transition-transform duration-200', mobileOpen && '-rotate-45 -translate-y-1')} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile nav */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="fixed inset-0 z-30 bg-paper pt-14"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <div className="bg-engineering-grid bg-grid-40 absolute inset-0 opacity-30" />
            <nav className="relative flex flex-col p-6 gap-1">
              {NAV_ITEMS.map((item, i) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                >
                  <Link
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      'block font-mono text-sm tracking-widest py-3 px-4 border-b border-graphite/10',
                      pathname === item.href ? 'text-orange-DEFAULT' : 'text-ink'
                    )}
                  >
                    {`→ ${item.label}`}
                  </Link>
                </motion.div>
              ))}

              <div className="mt-6 flex items-center gap-2 px-4">
                <div className="w-1.5 h-1.5 rounded-full bg-sage animate-pulse" />
                <span className="font-mono text-2xs text-sage">SYSTEM: ONLINE</span>
              </div>

              {!user ? (
                <Link href="/login" onClick={() => setMobileOpen(false)}
                  className="mt-4 mx-4 font-mono text-xs text-orange-DEFAULT border border-orange/30 px-4 py-2 text-center"
                >
                  LOGIN
                </Link>
              ) : (
                <div className="flex flex-col gap-2 mt-4 mx-4">
                  <Link
                    href="/profile"
                    onClick={() => setMobileOpen(false)}
                    className="font-mono text-xs text-ink border border-graphite/20 px-4 py-2 text-center"
                  >
                    OPERATOR PROFILE
                  </Link>
                  {isAdmin && (
                    <Link
                      href="/admin"
                      onClick={() => setMobileOpen(false)}
                      className="font-mono text-xs text-orange-DEFAULT border border-orange/30 px-4 py-2 text-center"
                    >
                      ADMIN CONSOLE
                    </Link>
                  )}
                  <button onClick={() => { signOut(); setMobileOpen(false) }}
                    className="font-mono text-xs text-steel border border-graphite/20 px-4 py-2"
                  >
                    SIGN OUT
                  </button>
                </div>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
