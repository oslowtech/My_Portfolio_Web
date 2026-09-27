'use client'
import { useState, useEffect } from 'react'
import { updatePassword } from '@/lib/auth'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function UpdatePasswordPage() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [checkingSession, setCheckingSession] = useState(true)
  const [hasSession, setHasSession] = useState(false)
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Check if user has an active session or recovery token
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        setHasSession(true)
        setUserEmail(session.user.email || null)
      } else {
        // In case of implicit hash tokens or delayed exchange
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          setHasSession(true)
          setUserEmail(user.email || null)
        }
      }
      setCheckingSession(false)
    }

    checkAuth()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setHasSession(true)
        setUserEmail(session.user.email || null)
        setCheckingSession(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (password.length < 6) {
      setError('Password must contain at least 6 characters.')
      return
    }

    if (password !== confirmPassword) {
      setError('Password confirmation does not match.')
      return
    }

    setLoading(true)
    try {
      await updatePassword(password)
      setSuccess(true)
      setTimeout(() => {
        router.push(userEmail?.toLowerCase() === 'pranjalgiri1122005@gmail.com' ? '/admin' : '/')
      }, 2500)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to commit new password.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-paper flex items-center justify-center pt-20 pb-16 px-6">
      <div className="absolute inset-0 bg-engineering-grid bg-grid-40 opacity-30 pointer-events-none" />

      <div className="relative w-full max-w-md">
        <div className="relative border border-graphite/15 bg-paper p-8 shadow-engineering">
          {/* Aerospace corner brackets */}
          <span className="absolute top-2 left-2 w-3 h-3 border-t border-l border-orange-DEFAULT" />
          <span className="absolute top-2 right-2 w-3 h-3 border-t border-r border-orange-DEFAULT" />
          <span className="absolute bottom-2 left-2 w-3 h-3 border-b border-l border-orange-DEFAULT" />
          <span className="absolute bottom-2 right-2 w-3 h-3 border-b border-r border-orange-DEFAULT" />

          {/* Header */}
          <div className="text-center mb-6">
            <div className="font-mono text-2xs text-orange-DEFAULT tracking-widest mb-1">
              SECURITY PROTOCOL // CREDENTIAL REASSIGNMENT
            </div>
            <h1 className="font-display font-bold text-2xl text-ink">
              SET NEW PASSWORD
            </h1>
            {userEmail && (
              <div className="font-mono text-2xs text-steel mt-1 bg-paper-dark/30 py-1 px-2 border border-graphite/10 inline-block">
                ACCOUNT: <span className="text-ink font-semibold">{userEmail}</span>
              </div>
            )}
          </div>

          {checkingSession ? (
            <div className="text-center py-10">
              <span className="font-mono text-2xs text-steel animate-pulse">
                INITIALIZING SECURE SESSION HANDSHAKE...
              </span>
            </div>
          ) : !hasSession && !success ? (
            <div className="space-y-5 text-center py-4">
              <div className="border border-red-500/30 bg-red-500/10 p-4 font-mono text-xs text-red-500">
                [NO ACTIVE RECOVERY SESSION DETECTED]
                <p className="mt-2 text-2xs text-steel leading-relaxed">
                  Your password reset link may have expired or has already been used. Please initiate a new password reset transmission from the login gateway.
                </p>
              </div>

              <Link
                href="/login"
                className="inline-block w-full bg-graphite hover:bg-orange-DEFAULT text-paper font-mono text-xs tracking-widest py-3 transition-colors text-center"
              >
                REQUEST NEW RESET TRANSMISSION →
              </Link>
            </div>
          ) : success ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-3 h-3 rounded-full bg-sage animate-ping mx-auto" />
              <div className="font-mono text-xs text-sage font-bold tracking-widest">
                [SUCCESS] PASSWORD COMMITTED
              </div>
              <p className="font-mono text-2xs text-steel leading-relaxed">
                Your new security credentials have been registered in the database. Redirecting to system console...
              </p>
              <Link
                href={userEmail?.toLowerCase() === 'pranjalgiri1122005@gmail.com' ? '/admin' : '/'}
                className="inline-block bg-orange-DEFAULT text-paper font-mono text-xs tracking-widest px-4 py-2 hover:bg-orange-dark transition-colors"
              >
                ENTER CONSOLE NOW →
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="font-mono text-2xs text-orange-DEFAULT tracking-widest">
                    NEW SECURE PASSWORD
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="font-mono text-3xs text-steel hover:text-ink transition-colors"
                  >
                    {showPassword ? 'HIDE' : 'SHOW'}
                  </button>
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Min. 6 alphanumeric characters"
                  required
                  minLength={6}
                  className="w-full bg-transparent border border-graphite/20 px-3 py-2.5 font-mono text-sm text-ink placeholder:text-steel/40 focus:border-orange-DEFAULT outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block font-mono text-2xs text-orange-DEFAULT tracking-widest mb-1">
                  CONFIRM NEW PASSWORD
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter password to confirm"
                  required
                  minLength={6}
                  className="w-full bg-transparent border border-graphite/20 px-3 py-2.5 font-mono text-sm text-ink placeholder:text-steel/40 focus:border-orange-DEFAULT outline-none transition-colors"
                />
              </div>

              {/* Validation helper */}
              <div className="font-mono text-3xs space-y-1 pt-1">
                <div className={password.length >= 6 ? 'text-sage' : 'text-steel/60'}>
                  {password.length >= 6 ? '✓' : '○'} At least 6 characters
                </div>
                <div className={password && confirmPassword && password === confirmPassword ? 'text-sage' : 'text-steel/60'}>
                  {password && confirmPassword && password === confirmPassword ? '✓' : '○'} Passwords match
                </div>
              </div>

              {error && (
                <div className="p-3 border border-red-500/30 bg-red-500/10 font-mono text-2xs text-red-500">
                  [ERROR] {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading || password.length < 6 || password !== confirmPassword}
                className="w-full bg-orange-DEFAULT hover:bg-orange-dark text-paper font-mono text-xs tracking-widest py-3 transition-colors disabled:opacity-40"
              >
                {loading ? 'COMMITTING CREDENTIALS...' : 'COMMIT NEW PASSWORD →'}
              </button>
            </form>
          )}

          <div className="mt-6 pt-4 border-t border-graphite/10 text-center">
            <Link
              href="/login"
              className="font-mono text-2xs text-steel hover:text-orange-DEFAULT transition-colors"
            >
              ← Return to Security Gateway
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
