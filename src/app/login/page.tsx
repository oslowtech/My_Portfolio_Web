'use client'
import Image from 'next/image'
import { useState } from 'react'
import { signIn, signUp, signInWithGoogle, resetPassword } from '@/lib/auth'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [authMethod, setAuthMethod] = useState<'password' | 'otp'>('password')
  const [mode, setMode] = useState<'login' | 'signup' | 'forgot'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [otpToken, setOtpToken] = useState('')
  const [otpSent, setOtpSent] = useState(false)
  const [error, setError] = useState('')
  const [successMsg, setSuccessMsg] = useState('')
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const router = useRouter()

  async function handlePasswordSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccessMsg('')
    try {
      if (mode === 'login') {
        await signIn(email, password)
        if (email.toLowerCase() === 'pranjalgiri1122005@gmail.com') {
          router.push('/admin')
        } else {
          router.push('/')
        }
      } else if (mode === 'signup') {
        await signUp(email, password, username)
        setSuccessMsg('Operator account created. Check your email inbox to confirm credentials.')
      } else if (mode === 'forgot') {
        await resetPassword(email)
        setSuccessMsg('Password reset transmission dispatched. Check your email for the secure override link.')
      }
    } catch (err: unknown) {
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  async function handleSendOtp(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccessMsg('')
    try {
      const { signInWithOtp } = await import('@/lib/auth')
      await signInWithOtp(email, '/')
      setOtpSent(true)
      setSuccessMsg('One-Time Password (OTP) & Magic Link dispatched to your email. Enter 6-digit token below or click the link in your email.')
    } catch (err: unknown) {
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  async function handleVerifyOtp(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccessMsg('')
    try {
      const { verifyEmailOtp } = await import('@/lib/auth')
      await verifyEmailOtp(email, otpToken.trim())
      if (email.toLowerCase() === 'pranjalgiri1122005@gmail.com') {
        router.push('/admin')
      } else {
        router.push('/')
      }
    } catch (err: unknown) {
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  async function handleGoogleLogin() {
    setGoogleLoading(true)
    setError('')
    try {
      await signInWithGoogle('/')
    } catch (err: unknown) {
      setError((err as Error).message)
      setGoogleLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-paper flex items-center justify-center pt-16 pb-12">
      <div className="absolute inset-0 bg-engineering-grid bg-grid-40 opacity-40 pointer-events-none" />
      <div className="relative w-full max-w-md px-6">
        {/* Character avatar at top */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <Image
              src="/character/avatar.jpg"
              alt="Pranjal Giri"
              width={80}
              height={80}
              className="rounded-full w-16 h-16 object-cover border border-orange/40"
              priority
            />
          </div>
        </div>

        <div className="relative border border-graphite/15 bg-paper p-8">
          <span className="absolute top-2 left-2 w-3 h-3 border-t border-l border-orange/50" />
          <span className="absolute top-2 right-2 w-3 h-3 border-t border-r border-orange/50" />
          <span className="absolute bottom-2 left-2 w-3 h-3 border-b border-l border-orange/50" />
          <span className="absolute bottom-2 right-2 w-3 h-3 border-b border-r border-orange/50" />

          <div className="text-center mb-6">
            <div className="font-mono text-2xs text-orange-DEFAULT tracking-widest mb-1">
              SECURITY GATEWAY // ACCESS TERMINAL
            </div>
            <h1 className="font-display font-bold text-2xl text-ink">
              {mode === 'forgot'
                ? 'CREDENTIAL OVERRIDE'
                : mode === 'signup'
                ? 'NEW OPERATOR'
                : authMethod === 'otp'
                ? 'OTP // MAGIC LINK'
                : 'SYSTEM ACCESS'}
            </h1>
          </div>

          {/* Auth Method Tabs (Only for standard login) */}
          {mode === 'login' && (
            <div className="grid grid-cols-2 gap-2 mb-6 border-b border-graphite/10 pb-4">
              <button
                type="button"
                onClick={() => { setAuthMethod('password'); setError(''); setSuccessMsg('') }}
                className={`font-mono text-2xs tracking-widest py-2 px-3 border transition-colors ${
                  authMethod === 'password'
                    ? 'border-orange-DEFAULT text-orange-DEFAULT bg-orange/5 font-bold'
                    : 'border-graphite/15 text-steel hover:text-ink'
                }`}
              >
                PASSWORD
              </button>
              <button
                type="button"
                onClick={() => { setAuthMethod('otp'); setError(''); setSuccessMsg('') }}
                className={`font-mono text-2xs tracking-widest py-2 px-3 border transition-colors ${
                  authMethod === 'otp'
                    ? 'border-orange-DEFAULT text-orange-DEFAULT bg-orange/5 font-bold'
                    : 'border-graphite/15 text-steel hover:text-ink'
                }`}
              >
                OTP / MAGIC LINK
              </button>
            </div>
          )}

          {/* Google OAuth Button */}
          {mode !== 'forgot' && (
            <div className="mb-6">
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={googleLoading}
                className="w-full border border-graphite/20 hover:border-orange-DEFAULT bg-paper-dark/30 hover:bg-orange/5 text-ink font-mono text-xs tracking-wider py-3 px-4 flex items-center justify-center gap-3 transition-colors disabled:opacity-50"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#EA4335"
                    d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z"
                  />
                  <path
                    fill="#4285F4"
                    d="M23.5 12.3c0-.8-.1-1.7-.2-2.3H12v4.6h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.9z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.8s.2-2.1.4-2.8L1.9 6.3C.7 8.7 0 10.3 0 12s.7 3.3 1.9 5.7l3.7-2.9z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.4-6.4-5.2L1.9 16C3.7 19.7 7.5 23 12 23z"
                  />
                </svg>
                <span>{googleLoading ? 'INITIATING HANDSHAKE...' : 'CONTINUE WITH GOOGLE'}</span>
              </button>

              <div className="flex items-center gap-3 my-5">
                <div className="h-px flex-1 bg-graphite/10" />
                <span className="font-mono text-2xs text-steel/60">OR MANUAL AUTH</span>
                <div className="h-px flex-1 bg-graphite/10" />
              </div>
            </div>
          )}

          {/* OTP / Magic Link Flow */}
          {mode === 'login' && authMethod === 'otp' ? (
            <div className="space-y-4">
              {!otpSent ? (
                <form onSubmit={handleSendOtp} className="space-y-4">
                  <div>
                    <label className="block font-mono text-2xs text-orange-DEFAULT tracking-widest mb-1">
                      OPERATOR EMAIL
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="operator@domain.com"
                      required
                      className="w-full bg-transparent border border-graphite/20 px-3 py-2.5 font-mono text-sm text-ink placeholder:text-steel/50 focus:border-orange/50 outline-none transition-colors"
                    />
                  </div>

                  {error && <p className="font-mono text-2xs text-red-500">[ERROR] {error}</p>}
                  {successMsg && <p className="font-mono text-2xs text-sage">[CONFIRMED] {successMsg}</p>}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-graphite text-paper font-mono text-xs tracking-widest py-3 hover:bg-orange-DEFAULT transition-colors disabled:opacity-50"
                  >
                    {loading ? 'DISPATCHING TOKEN...' : 'TRANSMIT OTP & MAGIC LINK'}
                  </button>
                  <p className="font-mono text-2xs text-steel/70 text-center">
                    A 6-digit access code and one-click magic link will be transmitted to your email.
                  </p>
                </form>
              ) : (
                <form onSubmit={handleVerifyOtp} className="space-y-4">
                  <div className="bg-paper-dark/30 border border-graphite/15 p-3 font-mono text-2xs text-steel">
                    <div>TOKEN TRANSMITTED TO: <span className="text-ink font-bold">{email}</span></div>
                    <button
                      type="button"
                      onClick={() => setOtpSent(false)}
                      className="text-orange-DEFAULT hover:underline mt-1"
                    >
                      [CHANGE TRANSMISSION ADDRESS]
                    </button>
                  </div>

                  <div>
                    <label className="block font-mono text-2xs text-orange-DEFAULT tracking-widest mb-1">
                      6-DIGIT VERIFICATION CODE
                    </label>
                    <input
                      type="text"
                      value={otpToken}
                      onChange={e => setOtpToken(e.target.value)}
                      placeholder="123456"
                      maxLength={8}
                      required
                      className="w-full bg-transparent border border-graphite/20 px-3 py-2.5 font-mono text-lg tracking-widest text-center text-ink placeholder:text-steel/50 focus:border-orange/50 outline-none transition-colors"
                    />
                  </div>

                  {error && <p className="font-mono text-2xs text-red-500">[ERROR] {error}</p>}
                  {successMsg && <p className="font-mono text-2xs text-sage">[CONFIRMED] {successMsg}</p>}

                  <button
                    type="submit"
                    disabled={loading || !otpToken.trim()}
                    className="w-full bg-orange-DEFAULT text-paper font-mono text-xs tracking-widest py-3 hover:bg-orange-dark transition-colors disabled:opacity-50"
                  >
                    {loading ? 'VERIFYING TOKEN...' : 'VERIFY & ENTER CONSOLE'}
                  </button>

                  <div className="flex justify-between items-center pt-2">
                    <button
                      type="button"
                      onClick={handleSendOtp}
                      disabled={loading}
                      className="font-mono text-2xs text-steel hover:text-orange-DEFAULT transition-colors"
                    >
                      ↻ Resend Token
                    </button>
                    <span className="font-mono text-2xs text-steel/60">Or click direct email link</span>
                  </div>
                </form>
              )}
            </div>
          ) : (
            /* Password / Signup / Forgot Password Form */
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              {mode === 'signup' && (
                <div>
                  <label className="block font-mono text-2xs text-orange-DEFAULT tracking-widest mb-1">
                    CALLSIGN / USERNAME
                  </label>
                  <input
                    type="text"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    placeholder="e.g. flight_engineer"
                    required
                    className="w-full bg-transparent border border-graphite/20 px-3 py-2.5 font-mono text-sm text-ink placeholder:text-steel/50 focus:border-orange/50 outline-none transition-colors"
                  />
                </div>
              )}

              <div>
                <label className="block font-mono text-2xs text-orange-DEFAULT tracking-widest mb-1">EMAIL</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="operator@domain.com"
                  required
                  className="w-full bg-transparent border border-graphite/20 px-3 py-2.5 font-mono text-sm text-ink placeholder:text-steel/50 focus:border-orange/50 outline-none transition-colors"
                />
              </div>

              {mode !== 'forgot' && (
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-mono text-2xs text-orange-DEFAULT tracking-widest">PASSWORD</label>
                    {mode === 'login' && (
                      <button
                        type="button"
                        onClick={() => { setMode('forgot'); setError(''); setSuccessMsg('') }}
                        className="font-mono text-2xs text-steel hover:text-orange-DEFAULT transition-colors"
                      >
                        FORGOT CREDENTIALS?
                      </button>
                    )}
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    required
                    className="w-full bg-transparent border border-graphite/20 px-3 py-2.5 font-mono text-sm text-ink placeholder:text-steel/50 focus:border-orange/50 outline-none transition-colors"
                  />
                </div>
              )}

              {error && <p className="font-mono text-2xs text-red-500">[ERROR] {error}</p>}
              {successMsg && <p className="font-mono text-2xs text-sage">[CONFIRMED] {successMsg}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-graphite text-paper font-mono text-xs tracking-widest py-3 hover:bg-orange-DEFAULT transition-colors disabled:opacity-50"
              >
                {loading
                  ? 'AUTHENTICATING...'
                  : mode === 'login'
                  ? 'ACCESS SYSTEM'
                  : mode === 'signup'
                  ? 'REGISTER OPERATOR'
                  : 'DISPATCH RESET LINK'}
              </button>
            </form>
          )}

          {/* Mode Switchers */}
          <div className="mt-5 text-center space-y-2 border-t border-graphite/10 pt-4">
            {mode === 'login' && (
              <button
                type="button"
                onClick={() => { setMode('signup'); setError(''); setSuccessMsg('') }}
                className="font-mono text-2xs text-steel hover:text-orange-DEFAULT transition-colors block w-full text-center"
              >
                New operator? Register account →
              </button>
            )}

            {mode === 'signup' && (
              <button
                type="button"
                onClick={() => { setMode('login'); setError(''); setSuccessMsg('') }}
                className="font-mono text-2xs text-steel hover:text-orange-DEFAULT transition-colors block w-full text-center"
              >
                Already have credentials? Access system →
              </button>
            )}

            {mode === 'forgot' && (
              <button
                type="button"
                onClick={() => { setMode('login'); setError(''); setSuccessMsg('') }}
                className="font-mono text-2xs text-steel hover:text-orange-DEFAULT transition-colors block w-full text-center"
              >
                ← Return to system login
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
