'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Sun, Moon, Menu, X, LogOut, User } from 'lucide-react'
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
    const onScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      {/* Header with strictly fixed height (h-16) to completely eliminate vertical jumping/movement on scroll */}
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-40 h-16',
          'bg-paper/90 backdrop-blur-md border-b transition-colors duration-200',
          scrolled ? 'border-graphite/20 shadow-xs' : 'border-graphite/10'
        )}
      >
        <div className="w-full px-4 sm:px-6 lg:px-8 h-full">
          <div className="flex items-center justify-between h-full gap-4">
            
            {/* Logo / Brand */}
            <Link href="/" className="group flex items-center gap-3 flex-shrink-0">
              <div className="relative w-7 h-7 flex items-center justify-center">
                <div className="w-5 h-5 border border-orange-DEFAULT/80 rotate-45 group-hover:rotate-90 transition-transform duration-300" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-2 h-2 bg-orange-DEFAULT rotate-45" />
                </div>
              </div>
              <div className="flex flex-col justify-center">
                <span className="font-display font-bold text-sm sm:text-base text-ink tracking-tight leading-none">
                  PRANJAL GIRI
                </span>
                <span className="font-mono text-3xs text-steel tracking-widest leading-none mt-1 hidden sm:block">
                  AI & ROBOTICS / FLIGHT SOFTWARE
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links — Spacious, clean, no cramped box borders */}
            <nav className="hidden lg:flex items-center gap-6 xl:gap-8 flex-shrink-0">
              {NAV_ITEMS.map((item) => {
                const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href + '/'))
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'font-mono text-xs tracking-wider transition-colors relative py-1 whitespace-nowrap',
                      isActive
                        ? 'text-orange-DEFAULT font-bold'
                        : 'text-steel hover:text-ink'
                    )}
                  >
                    {item.label}
                    {isActive && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-DEFAULT rounded-full" />
                    )}
                  </Link>
                )
              })}
            </nav>

            {/* Right Side Utility & Auth Controls — Minimal, decluttered */}
            <div className="hidden lg:flex items-center gap-3 sm:gap-4 flex-shrink-0">
              {/* Theme Toggle Button — Clean modern icon button */}
              <button
                type="button"
                onClick={toggleTheme}
                aria-label={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
                title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
                className="p-2 rounded-md border border-graphite/15 hover:border-orange-DEFAULT text-steel hover:text-ink transition-colors bg-paper-dark/15 flex items-center justify-center cursor-pointer"
              >
                {theme === 'dark' ? (
                  <Sun className="w-4 h-4 text-orange-DEFAULT" />
                ) : (
                  <Moon className="w-4 h-4 text-steel" />
                )}
              </button>

              {/* Auth Controls */}
              {user ? (
                <div className="flex items-center gap-2 pl-2 border-l border-graphite/15">
                  {isAdmin && (
                    <Link
                      href="/admin"
                      className="font-mono text-2xs text-orange-DEFAULT border border-orange-DEFAULT/40 bg-orange-DEFAULT/10 px-2 py-0.5 rounded font-bold hover:bg-orange-DEFAULT/20 transition-colors whitespace-nowrap"
                    >
                      ADMIN
                    </Link>
                  )}
                  <Link
                    href="/profile"
                    className="font-mono text-xs text-ink hover:text-orange-DEFAULT flex items-center gap-1.5 px-2 py-1 rounded transition-colors whitespace-nowrap"
                  >
                    <User className="w-3.5 h-3.5 text-steel" />
                    <span>@{profile?.username || 'profile'}</span>
                  </Link>
                  <button
                    type="button"
                    onClick={() => signOut()}
                    title="Sign Out"
                    className="p-1.5 text-steel hover:text-red-500 rounded transition-colors cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  className="font-mono text-xs px-3.5 py-1.5 rounded bg-orange-DEFAULT hover:bg-orange-dark text-white font-medium tracking-wider transition-colors whitespace-nowrap"
                  style={{ backgroundColor: '#D96C32', color: '#FFFFFF' }}
                >
                  LOGIN →
                </Link>
              )}
            </div>

            {/* Mobile / Tablet Nav Trigger */}
            <div className="lg:hidden flex items-center gap-2">
              <button
                type="button"
                onClick={toggleTheme}
                aria-label="Toggle Theme"
                className="p-2 rounded border border-graphite/15 text-steel hover:text-ink transition-colors bg-paper-dark/15"
              >
                {theme === 'dark' ? (
                  <Sun className="w-4 h-4 text-orange-DEFAULT" />
                ) : (
                  <Moon className="w-4 h-4 text-steel" />
                )}
              </button>

              <button
                type="button"
                className="p-2 rounded border border-graphite/15 hover:border-orange-DEFAULT text-ink transition-colors cursor-pointer"
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label="Toggle menu"
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
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
              <div className="font-mono text-3xs text-orange-DEFAULT tracking-widest mb-3 px-4">
                NAVIGATION SYSTEMS
              </div>
              {NAV_ITEMS.map((item, i) => {
                const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href + '/'))
                return (
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
                        'block font-mono text-sm tracking-widest py-3 px-4 rounded transition-colors',
                        isActive
                          ? 'text-orange-DEFAULT bg-orange-DEFAULT/10 font-bold'
                          : 'text-ink hover:text-orange-DEFAULT hover:bg-graphite/5'
                      )}
                    >
                      {item.label}
                    </Link>
                  </motion.div>
                )
              })}

              <div className="mt-4 flex items-center justify-between px-4 py-2.5 border-t border-graphite/10 font-mono text-3xs text-steel">
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-sage animate-pulse" />
                  <span className="text-sage tracking-wider">SYS: ONLINE</span>
                </div>
                <div className="text-steel/70">{time}</div>
              </div>
            </nav>

            {/* Mobile Auth Footer */}
            <div className="relative z-10 pt-4 border-t border-graphite/10">
              {!user ? (
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="block w-full font-mono text-xs text-center py-3 bg-orange-DEFAULT text-white font-bold tracking-widest rounded transition-colors"
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
                      className="font-mono text-xs text-center py-2.5 border border-graphite/20 text-ink hover:border-orange-DEFAULT rounded transition-colors"
                    >
                      PROFILE
                    </Link>
                    {isAdmin && (
                      <Link
                        href="/admin"
                        onClick={() => setMobileOpen(false)}
                        className="font-mono text-xs text-center py-2.5 border border-orange-DEFAULT/40 bg-orange-DEFAULT/10 text-orange-DEFAULT font-bold rounded transition-colors"
                      >
                        ADMIN
                      </Link>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => { signOut(); setMobileOpen(false) }}
                    className="w-full font-mono text-xs py-2 text-steel hover:text-red-500 border border-graphite/10 rounded mt-1 transition-colors cursor-pointer"
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
