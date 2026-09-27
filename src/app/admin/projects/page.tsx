'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/lib/supabase'
import type { Project } from '@/types'

export default function AdminProjectsListPage() {
  const { isAdmin, loading } = useAuth()
  const router = useRouter()
  const [projects, setProjects] = useState<Project[]>([])
  const [fetching, setFetching] = useState(true)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  useEffect(() => {
    if (!loading && !isAdmin) router.push('/')
  }, [isAdmin, loading, router])

  const fetchProjects = async () => {
    setFetching(true)
    const { data } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false })
    if (data) setProjects(data)
    setFetching(false)
  }

  useEffect(() => {
    if (isAdmin) fetchProjects()
  }, [isAdmin])

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to decommission/delete project "${title}"?`)) return
    setDeletingId(id)
    const { error } = await supabase.from('projects').delete().eq('id', id)
    if (!error) {
      setProjects(prev => prev.filter(p => p.id !== id))
    } else {
      alert(`Delete failed: ${error.message}`)
    }
    setDeletingId(null)
  }

  if (loading) return null

  return (
    <div className="min-h-screen bg-graphite text-paper pt-20 pb-16">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="font-mono text-2xs text-orange-DEFAULT tracking-widest mb-1">SYSTEMS REPOSITORY</div>
            <h1 className="font-display font-bold text-3xl text-paper">PROJECT MANAGEMENT</h1>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/admin"
              className="font-mono text-2xs text-steel hover:text-paper border border-paper/10 px-3 py-2 transition-colors"
            >
              ← ADMIN CONSOLE
            </Link>
            <Link
              href="/admin/projects/new"
              className="bg-orange-DEFAULT hover:bg-orange-dark text-paper font-mono text-2xs tracking-widest px-4 py-2 transition-colors"
            >
              + ADD NEW PROJECT
            </Link>
          </div>
        </div>

        {fetching ? (
          <div className="border border-paper/10 p-12 text-center font-mono text-xs text-steel animate-pulse">
            LOADING TELEMETRY & PROJECT RECORDS...
          </div>
        ) : projects.length === 0 ? (
          <div className="border border-paper/10 p-12 text-center">
            <div className="font-mono text-xs text-steel mb-4">NO PROJECTS IN REPOSITORY</div>
            <Link
              href="/admin/projects/new"
              className="font-mono text-xs text-orange-DEFAULT hover:underline"
            >
              Deploy your first project →
            </Link>
          </div>
        ) : (
          <div className="border border-paper/10 overflow-x-auto">
            <table className="w-full text-left font-mono text-xs">
              <thead className="bg-paper/5 text-paper/60 border-b border-paper/10">
                <tr>
                  <th className="p-4">TITLE & DOMAIN</th>
                  <th className="p-4">SLUG</th>
                  <th className="p-4">STATUS</th>
                  <th className="p-4">FEATURED</th>
                  <th className="p-4 text-right">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-paper/5">
                {projects.map(p => (
                  <tr key={p.id} className="hover:bg-paper/[0.02] transition-colors">
                    <td className="p-4">
                      <div className="font-sans font-semibold text-paper text-sm">{p.title}</div>
                      <div className="text-2xs text-orange-DEFAULT mt-0.5">{p.category.toUpperCase()}</div>
                    </td>
                    <td className="p-4 text-steel">
                      <code className="text-2xs text-paper/70">/projects/{p.slug}</code>
                    </td>
                    <td className="p-4">
                      <span className={`inline-block px-2 py-0.5 text-2xs border ${
                        p.status === 'active' ? 'border-sage/40 text-sage bg-sage/5' :
                        p.status === 'completed' ? 'border-paper/20 text-paper/70' :
                        'border-yellow-DEFAULT/40 text-yellow-DEFAULT'
                      }`}>
                        {p.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="p-4">
                      {p.featured ? (
                        <span className="text-2xs text-orange-DEFAULT font-bold">YES</span>
                      ) : (
                        <span className="text-2xs text-steel/40">NO</span>
                      )}
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <Link
                        href={`/admin/projects/${p.id}/edit`}
                        className="font-mono text-2xs text-paper/70 hover:text-paper border border-paper/15 px-2.5 py-1"
                      >
                        EDIT
                      </Link>
                      <button
                        onClick={() => handleDelete(p.id, p.title)}
                        disabled={deletingId === p.id}
                        className="font-mono text-2xs text-red-400 hover:text-red-300 border border-red-500/20 px-2.5 py-1 disabled:opacity-50"
                      >
                        {deletingId === p.id ? 'DELETING...' : 'DELETE'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
