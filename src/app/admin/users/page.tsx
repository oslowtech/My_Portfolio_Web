'use client'
import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import type { Profile } from '@/types'
import Link from 'next/link'

export default function AdminUsersPage() {
  const { user, isAdmin, loading } = useAuth()
  const router = useRouter()

  const [profiles, setProfiles] = useState<Profile[]>([])
  const [fetchingProfiles, setFetchingProfiles] = useState(true)

  // Invite Form State
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteRole, setInviteRole] = useState<'user' | 'admin'>('user')
  const [inviteNote, setInviteNote] = useState('')
  const [inviteSending, setInviteSending] = useState(false)
  const [inviteFeedback, setInviteFeedback] = useState<{
    success: boolean
    message: string
    inviteUrl?: string
  } | null>(null)
  const [copiedLink, setCopiedLink] = useState(false)

  useEffect(() => {
    if (!loading && !isAdmin) {
      router.push('/')
    }
  }, [isAdmin, loading, router])

  const loadProfiles = async () => {
    setFetchingProfiles(true)
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })

      if (!error && data) {
        setProfiles(data)
      }
    } catch (err) {
      console.error('Failed to fetch profiles:', err)
    } finally {
      setFetchingProfiles(false)
    }
  }

  useEffect(() => {
    if (isAdmin) {
      loadProfiles()
    }
  }, [isAdmin])

  const handleSendInvite = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inviteEmail || !inviteEmail.includes('@')) return

    setInviteSending(true)
    setInviteFeedback(null)
    setCopiedLink(false)

    try {
      const res = await fetch('/api/admin/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: inviteEmail.trim(),
          role: inviteRole,
          note: inviteNote.trim(),
        }),
      })

      const data = await res.json()
      if (!res.ok) {
        setInviteFeedback({
          success: false,
          message: data.error || 'Failed to dispatch operator invitation.',
        })
      } else {
        setInviteFeedback({
          success: true,
          message: data.message || 'Invitation successfully generated.',
          inviteUrl: data.inviteUrl,
        })
        setInviteEmail('')
        setInviteNote('')
        loadProfiles()
      }
    } catch (err: unknown) {
      setInviteFeedback({
        success: false,
        message: err instanceof Error ? err.message : 'Network failure',
      })
    } finally {
      setInviteSending(false)
    }
  }

  const handleCopyLink = () => {
    if (inviteFeedback?.inviteUrl) {
      navigator.clipboard.writeText(inviteFeedback.inviteUrl)
      setCopiedLink(true)
      setTimeout(() => setCopiedLink(false), 2500)
    }
  }

  if (loading || !isAdmin) {
    return (
      <div className="min-h-screen bg-graphite flex items-center justify-center">
        <span className="font-mono text-2xs text-paper/40 animate-pulse">VERIFYING OPERATOR CLEARANCE...</span>
      </div>
    )
  }

  const adminCount = profiles.filter(p => p.role === 'admin').length
  const userCount = profiles.length

  return (
    <div className="min-h-screen bg-graphite text-paper pt-20 pb-16">
      <div className="fixed inset-0 bg-engineering-grid bg-grid-40 opacity-5 pointer-events-none" />
      <div className="relative max-w-6xl mx-auto px-6 py-10">
        
        {/* Top Navigation Breadcrumb */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-paper/10">
          <div className="flex items-center gap-3">
            <Link href="/admin" className="font-mono text-2xs text-orange-DEFAULT hover:underline">
              ← ADMIN CONSOLE
            </Link>
            <span className="text-paper/20">/</span>
            <span className="font-mono text-2xs text-paper/60">OPERATOR REGISTRY & INVITATIONS</span>
          </div>
          <div className="font-mono text-2xs text-sage flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-sage animate-pulse" />
            ADMIN: {user?.email}
          </div>
        </div>

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="font-mono text-2xs text-orange-DEFAULT tracking-widest mb-1">
              SECURITY CLEARANCE // ACCESS CONTROL
            </div>
            <h1 className="font-display font-bold text-3xl sm:text-4xl text-paper">
              OPERATORS & INVITATIONS
            </h1>
            <p className="font-sans text-sm text-paper/60 mt-1 max-w-xl">
              Invite collaborators to the Systems Console, provision credentials, and monitor registered engineering operators.
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-4">
            <div className="border border-paper/15 bg-graphite-dark/50 px-4 py-2">
              <div className="font-mono text-3xs text-paper/40 tracking-widest">TOTAL OPERATORS</div>
              <div className="font-mono font-bold text-xl text-paper">{String(userCount).padStart(2, '0')}</div>
            </div>
            <div className="border border-paper/15 bg-graphite-dark/50 px-4 py-2">
              <div className="font-mono text-3xs text-paper/40 tracking-widest">ADMINISTRATORS</div>
              <div className="font-mono font-bold text-xl text-orange-DEFAULT">{String(adminCount).padStart(2, '0')}</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Invite Form Panel */}
          <div className="lg:col-span-5">
            <div className="border border-paper/15 bg-graphite-dark/40 p-6 relative">
              <span className="absolute top-2 left-2 w-2.5 h-2.5 border-t border-l border-orange-DEFAULT" />
              <span className="absolute bottom-2 right-2 w-2.5 h-2.5 border-b border-r border-orange-DEFAULT" />

              <div className="font-mono text-2xs text-orange-DEFAULT tracking-widest mb-1">
                DISPATCH INVITATION PROTOCOL
              </div>
              <h2 className="font-display font-bold text-xl text-paper mb-4">
                INVITE NEW OPERATOR
              </h2>

              <form onSubmit={handleSendInvite} className="space-y-4">
                <div>
                  <label className="block font-mono text-2xs text-paper/60 tracking-wider mb-1">
                    TARGET RECIPIENT EMAIL
                  </label>
                  <input
                    type="email"
                    value={inviteEmail}
                    onChange={e => setInviteEmail(e.target.value)}
                    placeholder="collaborator@domain.com"
                    required
                    className="w-full bg-paper/5 border border-paper/20 px-3 py-2.5 font-mono text-xs text-paper placeholder:text-paper/30 focus:border-orange-DEFAULT outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block font-mono text-2xs text-paper/60 tracking-wider mb-1">
                    CLEARANCE LEVEL / ROLE
                  </label>
                  <select
                    value={inviteRole}
                    onChange={e => setInviteRole(e.target.value as 'user' | 'admin')}
                    className="w-full bg-graphite border border-paper/20 px-3 py-2.5 font-mono text-xs text-paper focus:border-orange-DEFAULT outline-none transition-colors"
                  >
                    <option value="user">OPERATOR (Standard Read / Interact / Bookmark)</option>
                    <option value="admin">ADMINISTRATOR (Full Console & Data Control)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-mono text-2xs text-paper/60 tracking-wider mb-1">
                    PERSONAL CLEARANCE NOTE (OPTIONAL)
                  </label>
                  <textarea
                    rows={3}
                    value={inviteNote}
                    onChange={e => setInviteNote(e.target.value)}
                    placeholder="e.g. Welcome to the propulsion telemetry subsystem. Review active rocket launch data."
                    className="w-full bg-paper/5 border border-paper/20 px-3 py-2 font-mono text-xs text-paper placeholder:text-paper/30 focus:border-orange-DEFAULT outline-none transition-colors resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={inviteSending || !inviteEmail}
                  className="w-full bg-orange-DEFAULT hover:bg-orange-dark text-paper font-mono text-xs tracking-widest py-3 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {inviteSending ? 'DISPATCHING TRANSMISSION...' : 'DISPATCH INVITATION →'}
                </button>
              </form>

              {/* Feedback box */}
              {inviteFeedback && (
                <div className={`mt-4 p-4 border font-mono text-xs ${
                  inviteFeedback.success
                    ? 'border-sage/40 bg-sage/10 text-sage'
                    : 'border-red-500/40 bg-red-500/10 text-red-400'
                }`}>
                  <div className="font-bold mb-1">
                    {inviteFeedback.success ? '✓ TRANSMISSION PROTOCOL INITIATED' : '✗ DISPATCH FAILURE'}
                  </div>
                  <div className="text-2xs opacity-90 leading-relaxed">
                    {inviteFeedback.message}
                  </div>

                  {inviteFeedback.inviteUrl && (
                    <div className="mt-3 pt-3 border-t border-paper/10">
                      <div className="text-3xs text-paper/60 mb-1">DIRECT INVITATION LINK:</div>
                      <div className="bg-graphite p-2 text-3xs break-all text-paper select-all border border-paper/10">
                        {inviteFeedback.inviteUrl}
                      </div>
                      <button
                        type="button"
                        onClick={handleCopyLink}
                        className="mt-2 text-2xs font-mono text-orange-DEFAULT hover:underline"
                      >
                        {copiedLink ? '✓ LINK COPIED TO CLIPBOARD' : 'COPY INVITATION LINK'}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Registered Operators Registry Table */}
          <div className="lg:col-span-7">
            <div className="border border-paper/15 bg-graphite-dark/40 p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="font-mono text-2xs text-orange-DEFAULT tracking-widest">
                    SYSTEM ROSTER
                  </div>
                  <h2 className="font-display font-bold text-xl text-paper">
                    REGISTERED OPERATORS
                  </h2>
                </div>
                <button
                  onClick={loadProfiles}
                  disabled={fetchingProfiles}
                  className="font-mono text-2xs text-paper/50 hover:text-paper border border-paper/10 px-3 py-1.5 transition-colors"
                >
                  {fetchingProfiles ? 'REFRESHING...' : '↻ REFRESH'}
                </button>
              </div>

              {fetchingProfiles && profiles.length === 0 ? (
                <div className="py-12 text-center font-mono text-2xs text-paper/40 animate-pulse">
                  FETCHING REGISTERED OPERATOR RECORDS...
                </div>
              ) : profiles.length === 0 ? (
                <div className="py-12 text-center font-mono text-2xs text-paper/40 border border-paper/10">
                  No registered profiles found in database. Run the migration SQL in Supabase.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left font-mono text-xs">
                    <thead>
                      <tr className="border-b border-paper/10 text-paper/40 text-3xs tracking-widest">
                        <th className="py-2.5">CALLSIGN</th>
                        <th className="py-2.5">PUBLIC ID</th>
                        <th className="py-2.5">CLEARANCE</th>
                        <th className="py-2.5">ONBOARDED</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-paper/5">
                      {profiles.map(p => (
                        <tr key={p.id} className="hover:bg-paper/5 transition-colors">
                          <td className="py-3 pr-2">
                            <div className="font-bold text-paper">@{p.username}</div>
                            {p.bio && <div className="text-3xs text-paper/40 truncate max-w-xs">{p.bio}</div>}
                          </td>
                          <td className="py-3 text-orange-DEFAULT text-2xs">
                            {p.public_id}
                          </td>
                          <td className="py-3">
                            <span className={`inline-block px-2 py-0.5 text-3xs border ${
                              p.role === 'admin'
                                ? 'border-orange-DEFAULT/60 text-orange-DEFAULT bg-orange/10'
                                : 'border-sage/40 text-sage bg-sage/10'
                            }`}>
                              {p.role.toUpperCase()}
                            </span>
                          </td>
                          <td className="py-3 text-2xs text-paper/50">
                            {p.created_at ? new Date(p.created_at).toLocaleDateString() : '—'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  )
}
