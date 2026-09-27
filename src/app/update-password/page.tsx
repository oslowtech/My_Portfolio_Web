'use client'
import { useState } from 'react'
import { updatePassword } from '@/lib/auth'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function UpdatePasswordPage() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    setLoading(true)
    setError('')
    try {
      await updatePassword(password)
      setSuccess(true)
      setTimeout(() => {
        router.push('/')
      }, 2000)
    } catch (err: unknown) {
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-paper flex items-center justify-center pt-14 pb-12">
      <div className="absolute inset-0 bg-engineering-grid bg-grid-40 opacity-40 pointer-events-none" />
      <div className="relative w-full max-w-md px-6">
        <div className="relative border border-graphite/15 bg-paper p-8">
          <span className="absolute top-2 left-2 w-3 h-3 border-t border-l border-orange/50" />
          <span className="absolute top-2 right-2 w-3 h-3 border-t border-r border-orange/50" />
          <span className="absolute bottom-2 left-2 w-3 h-3 border-b border-l border-orange/50" />
          <span className="absolute bottom-2 right-2 w-3 h-3 border-b border-r border-orange/50" />

          <div className="text-center mb-6">
            <div className="font-mono text-2xs text-orange-DEFAULT tracking-widest mb-1">
              SECURITY PROTOCOL
            </div>
            <h1 className="font-display font-bold text-2xl text-ink">
              UPDATE PASSWORD
            </h1>
            <p className="font-mono text-2xs text-steel mt-1">Set new operator access credentials</p>
          </div>

          {success ? (
            <div className="text-center py-6 space-y-3">
              <div className="w-2 h-2 rounded-full bg-sage animate-pulse mx-auto" />
              <div className="font-mono text-xs text-sage tracking-wider">
                PASSWORD UPDATED SUCCESSFULLY
              </div>
              <p className="font-mono text-2xs text-steel">Redirecting to system console...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block font-mono text-2xs text-orange-DEFAULT tracking-widest mb-1">
                  NEW PASSWORD
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  className="w-full bg-transparent border border-graphite/20 px-3 py-2.5 font-mono text-sm text-ink placeholder:text-steel/50 focus:border-orange/50 outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block font-mono text-2xs text-orange-DEFAULT tracking-widest mb-1">
                  CONFIRM NEW PASSWORD
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  className="w-full bg-transparent border border-graphite/20 px-3 py-2.5 font-mono text-sm text-ink placeholder:text-steel/50 focus:border-orange/50 outline-none transition-colors"
                />
              </div>

              {error && <p className="font-mono text-2xs text-red-500">[ERROR] {error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-graphite text-paper font-mono text-xs tracking-widest py-3 hover:bg-orange-DEFAULT transition-colors disabled:opacity-50"
              >
                {loading ? 'APPLYING OVERRIDE...' : 'COMMIT NEW PASSWORD'}
              </button>
            </form>
          )}

          <div className="mt-5 text-center">
            <Link
              href="/login"
              className="font-mono text-2xs text-steel hover:text-orange-DEFAULT transition-colors"
            >
              ← Back to login
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
