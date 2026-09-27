'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/lib/supabase'

export default function NewBlogPostPage() {
  const { user, isAdmin, loading } = useAuth()
  const router = useRouter()

  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [category, setCategory] = useState('ROCKETRY')
  const [excerpt, setExcerpt] = useState('')
  const [content, setContent] = useState('')
  const [tags, setTags] = useState('')
  const [published, setPublished] = useState(false)
  const [coverImage, setCoverImage] = useState('')
  const [readTime, setReadTime] = useState(5)
  const [preview, setPreview] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!loading && !isAdmin) router.push('/')
  }, [isAdmin, loading, router])

  const handleTitleChange = (val: string) => {
    setTitle(val)
    if (!slug || slug === title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')) {
      setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title || !slug || !excerpt || !content) {
      setError('Please provide Title, Slug, Excerpt, and Content')
      return
    }

    setSaving(true)
    setError('')

    const tagArray = tags
      .split(',')
      .map(t => t.trim())
      .filter(Boolean)

    const { error: insertError } = await supabase.from('posts').insert({
      title,
      slug,
      category,
      excerpt,
      content,
      tags: tagArray,
      cover_image: coverImage || null,
      read_time: readTime || 5,
      published,
      published_at: published ? new Date().toISOString() : null,
      author_id: user?.id,
    })

    if (insertError) {
      setError(insertError.message)
      setSaving(false)
    } else {
      router.push('/admin/blog')
    }
  }

  if (loading) return null

  return (
    <div className="min-h-screen bg-graphite text-paper pt-20 pb-16">
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <div className="font-mono text-2xs text-orange-DEFAULT tracking-widest mb-1">TRANSMISSION LOGS</div>
            <h1 className="font-display font-bold text-3xl text-paper">NEW NOTE / BLOG POST</h1>
          </div>
          <Link
            href="/admin/blog"
            className="font-mono text-2xs text-steel hover:text-paper border border-paper/10 px-3 py-1.5 transition-colors"
          >
            ← BACK TO NOTES
          </Link>
        </div>

        {error && (
          <div className="mb-6 p-4 border border-red-500/40 bg-red-500/10 font-mono text-xs text-red-400">
            [ERROR] {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 border border-paper/10 p-6 sm:p-8 bg-paper/[0.02]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block font-mono text-2xs text-orange-DEFAULT tracking-widest mb-2">TITLE *</label>
              <input
                type="text"
                value={title}
                onChange={e => handleTitleChange(e.target.value)}
                placeholder="e.g. Building an ESP32 Flight Computer from Scratch"
                required
                className="w-full bg-paper/5 border border-paper/20 px-4 py-2.5 font-mono text-sm text-paper focus:border-orange-DEFAULT outline-none"
              />
            </div>

            <div>
              <label className="block font-mono text-2xs text-orange-DEFAULT tracking-widest mb-2">SLUG (URL KEY) *</label>
              <input
                type="text"
                value={slug}
                onChange={e => setSlug(e.target.value)}
                placeholder="e.g. esp32-flight-computer"
                required
                className="w-full bg-paper/5 border border-paper/20 px-4 py-2.5 font-mono text-sm text-paper focus:border-orange-DEFAULT outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div>
              <label className="block font-mono text-2xs text-orange-DEFAULT tracking-widest mb-2">DOMAIN / CATEGORY</label>
              <input
                type="text"
                value={category}
                onChange={e => setCategory(e.target.value)}
                placeholder="ROCKETRY / EMBEDDED / AI / UAV"
                className="w-full bg-paper/5 border border-paper/20 px-4 py-2.5 font-mono text-sm text-paper focus:border-orange-DEFAULT outline-none"
              />
            </div>

            <div>
              <label className="block font-mono text-2xs text-orange-DEFAULT tracking-widest mb-2">ESTIMATED READ (MIN)</label>
              <input
                type="number"
                min="1"
                value={readTime}
                onChange={e => setReadTime(parseInt(e.target.value) || 5)}
                className="w-full bg-paper/5 border border-paper/20 px-4 py-2.5 font-mono text-sm text-paper focus:border-orange-DEFAULT outline-none"
              />
            </div>

            <div className="flex items-center pt-6">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={published}
                  onChange={e => setPublished(e.target.checked)}
                  className="w-4 h-4 accent-orange-DEFAULT"
                />
                <span className="font-mono text-xs text-orange-DEFAULT tracking-wider font-bold">
                  {published ? '● PUBLISH IMMEDIATELY' : 'SAVE AS DRAFT'}
                </span>
              </label>
            </div>
          </div>

          <div>
            <label className="block font-mono text-2xs text-orange-DEFAULT tracking-widest mb-2">EXCERPT / BRIEF *</label>
            <textarea
              value={excerpt}
              onChange={e => setExcerpt(e.target.value)}
              placeholder="Short intro that appears on the blog index cards..."
              rows={2}
              required
              className="w-full bg-paper/5 border border-paper/20 px-4 py-2.5 font-mono text-sm text-paper focus:border-orange-DEFAULT outline-none"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="font-mono text-2xs text-orange-DEFAULT tracking-widest">
                MARKDOWN CONTENT *
              </label>
              <button
                type="button"
                onClick={() => setPreview(!preview)}
                className="font-mono text-2xs text-steel hover:text-paper border border-paper/20 px-2 py-0.5"
              >
                {preview ? 'EDIT' : 'PREVIEW'}
              </button>
            </div>

            {preview ? (
              <div className="p-5 border border-paper/20 min-h-[300px] bg-paper/5 font-sans prose prose-invert max-w-none text-sm leading-relaxed whitespace-pre-wrap">
                {content || '*No content entered yet*'}
              </div>
            ) : (
              <textarea
                value={content}
                onChange={e => setContent(e.target.value)}
                placeholder="# Header&#10;&#10;Technical logs, equations, code snippets, lessons learned..."
                rows={14}
                required
                className="w-full bg-paper/5 border border-paper/20 p-4 font-mono text-xs text-paper focus:border-orange-DEFAULT outline-none font-sans"
              />
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block font-mono text-2xs text-orange-DEFAULT tracking-widest mb-2">TAGS (comma-separated)</label>
              <input
                type="text"
                value={tags}
                onChange={e => setTags(e.target.value)}
                placeholder="Avionics, ESP32, Rocketry, Sensors"
                className="w-full bg-paper/5 border border-paper/20 px-4 py-2.5 font-mono text-sm text-paper focus:border-orange-DEFAULT outline-none"
              />
            </div>

            <div>
              <label className="block font-mono text-2xs text-orange-DEFAULT tracking-widest mb-2">HEADER IMAGE URL</label>
              <input
                type="text"
                value={coverImage}
                onChange={e => setCoverImage(e.target.value)}
                placeholder="/character/scene-develop.jpg or https://..."
                className="w-full bg-paper/5 border border-paper/20 px-4 py-2.5 font-mono text-sm text-paper focus:border-orange-DEFAULT outline-none"
              />
            </div>
          </div>

          <div className="pt-4 flex items-center justify-end gap-4 border-t border-paper/10">
            <Link
              href="/admin/blog"
              className="font-mono text-xs text-steel hover:text-paper px-4 py-2 transition-colors"
            >
              CANCEL
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="bg-orange-DEFAULT hover:bg-orange-dark text-paper font-mono text-xs tracking-widest px-6 py-3 transition-colors disabled:opacity-50"
            >
              {saving ? 'RECORDING NOTE...' : published ? 'PUBLISH NOTE' : 'SAVE DRAFT'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
