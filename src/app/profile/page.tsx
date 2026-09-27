'use client'
import Image from 'next/image'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useBookmarks } from '@/hooks/useBookmarks'
import { useProjects } from '@/hooks/useProjects'
import { updatePassword } from '@/lib/auth'
import Link from 'next/link'

export default function ProfilePage() {
  const { user, profile, loading } = useAuth()
  const router = useRouter()
  const { bookmarks } = useBookmarks()
  const { projects } = useProjects()

  const [newPassword, setNewPassword] = useState('')
  const [pwdLoading, setPwdLoading] = useState(false)
  const [pwdMsg, setPwdMsg] = useState('')
  const [pwdError, setPwdError] = useState('')

  const [newEmail, setNewEmail] = useState('')
  const [emailLoading, setEmailLoading] = useState(false)
  const [emailMsg, setEmailMsg] = useState('')
  const [emailError, setEmailError] = useState('')

  useEffect(() => {
    if (!loading && !user) router.push('/login')
  }, [user, loading, router])

  const savedProjects = projects.filter(p => bookmarks.includes(p.id))

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (newPassword.length < 6) {
      setPwdError('Password must be at least 6 characters')
      return
    }
    setPwdLoading(true)
    setPwdMsg('')
    setPwdError('')
    try {
      await updatePassword(newPassword)
      setPwdMsg('Password updated successfully')
      setNewPassword('')
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to update password'
      setPwdError(msg)
    } finally {
      setPwdLoading(false)
    }
  }

  const handleEmailUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newEmail || !newEmail.includes('@')) {
      setEmailError('Please provide a valid transmission email address')
      return
    }
    setEmailLoading(true)
    setEmailMsg('')
    setEmailError('')
    try {
      const { updateEmail } = await import('@/lib/auth')
      await updateEmail(newEmail.trim())
      setEmailMsg(`Confirmation transmission sent to ${newEmail}. Check your inbox and follow the link to confirm address change.`)
      setNewEmail('')
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to update transmission address'
      setEmailError(msg)
    } finally {
      setEmailLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-paper flex items-center justify-center pt-14">
        <span className="font-mono text-2xs text-steel animate-pulse">LOADING PROFILE...</span>
      </div>
    )
  }

  if (!profile) return null

  return (
    <div className="min-h-screen bg-paper pt-20 pb-16">
      <div className="fixed inset-0 bg-engineering-grid bg-grid-40 opacity-25 pointer-events-none" />
      <div className="relative max-w-4xl mx-auto px-6 py-12">
        {/* Profile header */}
        <div className="relative border border-graphite/15 p-6 mb-8 bg-paper">
          <span className="absolute top-2 left-2 w-3 h-3 border-t border-l border-orange/50" />
          <span className="absolute bottom-2 right-2 w-3 h-3 border-b border-r border-orange/50" />
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <div className="relative">
                {profile.avatar_url ? (
                  <Image src={profile.avatar_url} alt={profile.username} width={80} height={80} className="rounded-full w-20 h-20 object-cover" />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-graphite/10 flex items-center justify-center border border-graphite/20">
                    <span className="font-display font-bold text-2xl text-graphite">
                      {profile.username[0]?.toUpperCase() || 'P'}
                    </span>
                  </div>
                )}
              </div>
              <div>
                <div className="font-mono text-2xs text-orange-DEFAULT tracking-widest mb-1">{profile.public_id}</div>
                <div className="font-display font-bold text-2xl text-ink">@{profile.username}</div>
                <div className="font-mono text-2xs text-steel mt-1">{user?.email}</div>
                {profile.role === 'admin' && (
                  <span className="inline-block mt-2 font-mono text-2xs text-orange-DEFAULT border border-orange/30 px-2 py-0.5">
                    ● SYSTEM ADMINISTRATOR
                  </span>
                )}
              </div>
            </div>

            {profile.role === 'admin' && (
              <div>
                <Link
                  href="/admin"
                  className="bg-orange-DEFAULT hover:bg-orange-dark text-paper font-mono text-xs tracking-widest px-4 py-2.5 transition-colors inline-block"
                >
                  OPEN ADMIN CONSOLE →
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Security / Password & Email Change */}
        <div className="relative border border-graphite/15 p-6 mb-8 bg-paper">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-px w-8 bg-orange-DEFAULT" />
            <span className="font-mono text-2xs tracking-widest text-orange-DEFAULT">SECURITY & CREDENTIALS</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Change Password */}
            <div>
              <div className="font-mono text-2xs text-ink font-bold tracking-widest mb-3">
                [PROTOCOL 01] UPDATE ACCESS PASSWORD
              </div>
              <form onSubmit={handlePasswordUpdate} className="space-y-3">
                <div>
                  <label className="block font-mono text-2xs text-steel tracking-widest mb-1">
                    NEW SECURE PASSWORD
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    placeholder="Min. 6 alphanumeric chars"
                    className="w-full bg-transparent border border-graphite/20 px-3 py-2 font-mono text-xs text-ink placeholder:text-steel/50 focus:border-orange/50 outline-none"
                  />
                </div>
                {pwdMsg && <p className="font-mono text-2xs text-sage">[CONFIRMED] {pwdMsg}</p>}
                {pwdError && <p className="font-mono text-2xs text-red-500">[ERROR] {pwdError}</p>}
                <button
                  type="submit"
                  disabled={pwdLoading || !newPassword}
                  className="bg-graphite hover:bg-orange-DEFAULT text-paper font-mono text-2xs tracking-widest px-4 py-2 transition-colors disabled:opacity-40"
                >
                  {pwdLoading ? 'UPDATING...' : 'UPDATE PASSWORD'}
                </button>
              </form>
            </div>

            {/* Change Email */}
            <div className="border-t md:border-t-0 md:border-l border-graphite/10 pt-6 md:pt-0 md:pl-8">
              <div className="font-mono text-2xs text-ink font-bold tracking-widest mb-3">
                [PROTOCOL 02] UPDATE TRANSMISSION ADDRESS
              </div>
              <form onSubmit={handleEmailUpdate} className="space-y-3">
                <div>
                  <label className="block font-mono text-2xs text-steel tracking-widest mb-1">
                    CURRENT ADDRESS: <span className="text-ink">{user?.email}</span>
                  </label>
                  <input
                    type="email"
                    value={newEmail}
                    onChange={e => setNewEmail(e.target.value)}
                    placeholder="new.address@domain.com"
                    className="w-full bg-transparent border border-graphite/20 px-3 py-2 font-mono text-xs text-ink placeholder:text-steel/50 focus:border-orange/50 outline-none"
                  />
                </div>
                {emailMsg && <p className="font-mono text-2xs text-sage">[CONFIRMED] {emailMsg}</p>}
                {emailError && <p className="font-mono text-2xs text-red-500">[ERROR] {emailError}</p>}
                <button
                  type="submit"
                  disabled={emailLoading || !newEmail}
                  className="bg-graphite hover:bg-orange-DEFAULT text-paper font-mono text-2xs tracking-widest px-4 py-2 transition-colors disabled:opacity-40"
                >
                  {emailLoading ? 'TRANSMITTING...' : 'DISPATCH CONFIRMATION LINK'}
                </button>
                <p className="font-mono text-2xs text-steel/60 leading-relaxed">
                  Supabase will dispatch a verification link to your new address. Both current and new addresses will receive confirmation notices.
                </p>
              </form>
            </div>
          </div>
        </div>

        {/* Bookmarks */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="h-px w-8 bg-orange-DEFAULT" />
            <span className="font-mono text-2xs tracking-widest text-orange-DEFAULT">SAVED SYSTEMS</span>
          </div>
          {savedProjects.length === 0 ? (
            <div className="border border-graphite/15 p-8 text-center bg-paper">
              <div className="font-mono text-2xs text-steel">No saved projects yet.</div>
              <Link href="/projects" className="font-mono text-2xs text-orange-DEFAULT mt-2 block">Browse Systems →</Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {savedProjects.map(p => (
                <Link key={p.id} href={`/projects/${p.slug}`}>
                  <div className="border border-graphite/15 p-4 hover:border-orange/30 transition-colors bg-paper">
                    <div className="font-mono text-2xs text-orange-DEFAULT mb-1">{p.category.toUpperCase()}</div>
                    <div className="font-display font-bold text-ink">{p.title}</div>
                    <div className="font-sans text-xs text-steel mt-1">{p.short_description}</div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
