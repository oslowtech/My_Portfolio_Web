'use client'
import { useEffect, useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

interface DashStats {
  projects: number
  posts: number
  messages: number
}

export default function AdminPage() {
  const { isAdmin, loading } = useAuth()
  const router = useRouter()
  const [stats, setStats] = useState<DashStats>({ projects: 0, posts: 0, messages: 0 })

  useEffect(() => {
    if (!loading && !isAdmin) router.push('/')
  }, [isAdmin, loading, router])

  useEffect(() => {
    if (!isAdmin) return
    Promise.all([
      supabase.from('projects').select('id', { count: 'exact', head: true }),
      supabase.from('posts').select('id', { count: 'exact', head: true }),
      supabase.from('contact_messages').select('id', { count: 'exact', head: true }),
    ]).then(([p, b, m]) => {
      setStats({ projects: p.count ?? 0, posts: b.count ?? 0, messages: m.count ?? 0 })
    })
  }, [isAdmin])

  if (loading) return null

  return (
    <div className="min-h-screen bg-graphite text-paper pt-20">
      <div className="fixed inset-0 bg-engineering-grid bg-grid-40 opacity-5 pointer-events-none" />
      <div className="relative max-w-5xl mx-auto px-6 py-12">
        <div className="mb-10">
          <div className="font-mono text-2xs text-orange-DEFAULT tracking-widest mb-2">ADMINISTRATION</div>
          <h1 className="font-display font-bold text-4xl text-paper">ADMIN CONSOLE</h1>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-10">
          {[
            { label: 'PROJECTS', value: stats.projects },
            { label: 'BLOG POSTS', value: stats.posts },
            { label: 'MESSAGES', value: stats.messages },
          ].map(item => (
            <div key={item.label} className="border border-paper/10 p-5">
              <div className="font-mono text-2xs text-paper/40 tracking-widest">{item.label}</div>
              <div className="font-display font-bold text-4xl text-paper mt-2">{String(item.value).padStart(2, '0')}</div>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { label: '+ NEW PROJECT', href: '/admin/projects/new', color: 'border-orange/30 hover:bg-orange/10' },
            { label: 'MANAGE PROJECTS', href: '/admin/projects', color: 'border-paper/20 hover:bg-paper/5' },
            { label: '+ NEW BLOG NOTE', href: '/admin/blog/new', color: 'border-sage/30 hover:bg-sage/10' },
            { label: 'MANAGE BLOG NOTES', href: '/admin/blog', color: 'border-paper/20 hover:bg-paper/5' },
            { label: 'OPERATOR ROSTER & INVITES', href: '/admin/users', color: 'border-orange-DEFAULT/40 hover:bg-orange/10' },
            { label: 'RESEND REPLY PORTAL', href: '/admin/messages', color: 'border-paper/20 hover:bg-paper/5' },
            { label: 'EMAIL TEMPLATES', href: '/admin/templates', color: 'border-paper/20 hover:bg-paper/5' },
            { label: 'VISIT LIVE CONSOLE', href: '/', color: 'border-paper/20 hover:bg-paper/5' },
          ].map(action => (
            <Link key={action.label} href={action.href}>
              <div className={`border ${action.color} p-5 font-mono text-sm text-paper transition-colors cursor-pointer flex items-center justify-between`}>
                <span>{action.label}</span>
                <span className="text-orange-DEFAULT">→</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
