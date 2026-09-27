'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/lib/supabase'
import type { Post } from '@/types'
import { formatDate } from '@/lib/utils'

export default function AdminBlogListPage() {
  const { isAdmin, loading } = useAuth()
  const router = useRouter()
  const [posts, setPosts] = useState<Post[]>([])
  const [fetching, setFetching] = useState(true)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  useEffect(() => {
    if (!loading && !isAdmin) router.push('/')
  }, [isAdmin, loading, router])

  const fetchPosts = async () => {
    setFetching(true)
    const { data } = await supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false })
    if (data) setPosts(data)
    setFetching(false)
  }

  useEffect(() => {
    if (isAdmin) fetchPosts()
  }, [isAdmin])

  const togglePublish = async (post: Post) => {
    const nextState = !post.published
    const { error } = await supabase.from('posts').update({
      published: nextState,
      published_at: nextState ? new Date().toISOString() : null
    }).eq('id', post.id)

    if (!error) {
      setPosts(prev => prev.map(p => p.id === post.id ? { ...p, published: nextState } : p))
    }
  }

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete note "${title}"?`)) return
    setDeletingId(id)
    const { error } = await supabase.from('posts').delete().eq('id', id)
    if (!error) {
      setPosts(prev => prev.filter(p => p.id !== id))
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
            <div className="font-mono text-2xs text-orange-DEFAULT tracking-widest mb-1">TRANSMISSIONS LOG</div>
            <h1 className="font-display font-bold text-3xl text-paper">NOTES & BLOG MANAGEMENT</h1>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/admin"
              className="font-mono text-2xs text-steel hover:text-paper border border-paper/10 px-3 py-2 transition-colors"
            >
              ← ADMIN CONSOLE
            </Link>
            <Link
              href="/admin/blog/new"
              className="bg-orange-DEFAULT hover:bg-orange-dark text-paper font-mono text-2xs tracking-widest px-4 py-2 transition-colors"
            >
              + COMPOSE NEW NOTE
            </Link>
          </div>
        </div>

        {fetching ? (
          <div className="border border-paper/10 p-12 text-center font-mono text-xs text-steel animate-pulse">
            RETRIEVING LOGS...
          </div>
        ) : posts.length === 0 ? (
          <div className="border border-paper/10 p-12 text-center">
            <div className="font-mono text-xs text-steel mb-4">NO NOTES WRITTEN YET</div>
            <Link
              href="/admin/blog/new"
              className="font-mono text-xs text-orange-DEFAULT hover:underline"
            >
              Write your first engineering note →
            </Link>
          </div>
        ) : (
          <div className="border border-paper/10 overflow-x-auto">
            <table className="w-full text-left font-mono text-xs">
              <thead className="bg-paper/5 text-paper/60 border-b border-paper/10">
                <tr>
                  <th className="p-4">TITLE & DOMAIN</th>
                  <th className="p-4">STATUS</th>
                  <th className="p-4">DATE</th>
                  <th className="p-4 text-right">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-paper/5">
                {posts.map(post => (
                  <tr key={post.id} className="hover:bg-paper/[0.02] transition-colors">
                    <td className="p-4">
                      <div className="font-sans font-semibold text-paper text-sm">{post.title}</div>
                      <div className="text-2xs text-steel mt-0.5">{post.category || 'NOTES'} · {post.slug}</div>
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => togglePublish(post)}
                        className={`inline-flex items-center gap-1.5 px-2 py-0.5 text-2xs border transition-colors ${
                          post.published
                            ? 'border-sage/40 text-sage bg-sage/5 hover:border-red-400/40'
                            : 'border-yellow-DEFAULT/40 text-yellow-DEFAULT bg-yellow-DEFAULT/5 hover:border-sage/40'
                        }`}
                        title="Click to toggle publish status"
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${post.published ? 'bg-sage' : 'bg-yellow-DEFAULT'}`} />
                        <span>{post.published ? 'PUBLISHED' : 'DRAFT'}</span>
                      </button>
                    </td>
                    <td className="p-4 text-steel text-2xs">
                      {formatDate(post.created_at)}
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <Link
                        href={`/admin/blog/${post.id}/edit`}
                        className="font-mono text-2xs text-paper/70 hover:text-paper border border-paper/15 px-2.5 py-1"
                      >
                        EDIT
                      </Link>
                      <button
                        onClick={() => handleDelete(post.id, post.title)}
                        disabled={deletingId === post.id}
                        className="font-mono text-2xs text-red-400 hover:text-red-300 border border-red-500/20 px-2.5 py-1 disabled:opacity-50"
                      >
                        {deletingId === post.id ? '...' : 'DELETE'}
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
