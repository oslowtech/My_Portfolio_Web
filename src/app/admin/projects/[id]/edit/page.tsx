'use client'
import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/lib/supabase'

export default function EditProjectPage() {
  const { isAdmin, loading } = useAuth()
  const router = useRouter()
  const params = useParams()
  const projectId = params?.id as string

  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [category, setCategory] = useState<'flight' | 'robotics' | 'uav' | 'ai' | 'software' | 'embedded'>('flight')
  const [status, setStatus] = useState<'active' | 'completed' | 'archived' | 'simulation'>('active')
  const [featured, setFeatured] = useState(false)
  const [shortDesc, setShortDesc] = useState('')
  const [description, setDescription] = useState('')
  const [technologies, setTechnologies] = useState('')
  const [githubUrl, setGithubUrl] = useState('')
  const [demoUrl, setDemoUrl] = useState('')
  const [docUrl, setDocUrl] = useState('')
  const [coverImage, setCoverImage] = useState('')
  const [fetching, setFetching] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!loading && !isAdmin) router.push('/')
  }, [isAdmin, loading, router])

  useEffect(() => {
    if (!projectId || !isAdmin) return
    const load = async () => {
      setFetching(true)
      const { data, error } = await supabase.from('projects').select('*').eq('id', projectId).single()
      if (error) {
        setError(error.message)
      } else if (data) {
        setTitle(data.title)
        setSlug(data.slug)
        setCategory(data.category)
        setStatus(data.status)
        setFeatured(data.featured ?? false)
        setShortDesc(data.short_description || '')
        setDescription(data.description || '')
        setTechnologies(Array.isArray(data.technologies) ? data.technologies.join(', ') : '')
        setGithubUrl(data.github_url || '')
        setDemoUrl(data.demo_url || '')
        setDocUrl(data.documentation_url || '')
        setCoverImage(data.cover_image || '')
      }
      setFetching(false)
    }
    load()
  }, [projectId, isAdmin])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')

    const techArray = technologies
      .split(',')
      .map(t => t.trim())
      .filter(Boolean)

    const { error: updateError } = await supabase.from('projects').update({
      title,
      slug,
      category,
      status,
      featured,
      short_description: shortDesc,
      description,
      technologies: techArray,
      github_url: githubUrl || null,
      demo_url: demoUrl || null,
      documentation_url: docUrl || null,
      cover_image: coverImage || null,
    }).eq('id', projectId)

    if (updateError) {
      setError(updateError.message)
      setSaving(false)
    } else {
      router.push('/admin/projects')
    }
  }

  if (loading || fetching) {
    return (
      <div className="min-h-screen bg-graphite text-paper pt-24 text-center font-mono text-xs">
        LOADING PROJECT RECORD...
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-graphite text-paper pt-20 pb-16">
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <div className="font-mono text-2xs text-orange-DEFAULT tracking-widest mb-1">PROJECT CONSOLE</div>
            <h1 className="font-display font-bold text-3xl text-paper">EDIT PROJECT</h1>
          </div>
          <Link
            href="/admin/projects"
            className="font-mono text-2xs text-steel hover:text-paper border border-paper/10 px-3 py-1.5 transition-colors"
          >
            ← BACK TO LIST
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
              <label className="block font-mono text-2xs text-orange-DEFAULT tracking-widest mb-2">PROJECT TITLE *</label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
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
                required
                className="w-full bg-paper/5 border border-paper/20 px-4 py-2.5 font-mono text-sm text-paper focus:border-orange-DEFAULT outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div>
              <label className="block font-mono text-2xs text-orange-DEFAULT tracking-widest mb-2">CATEGORY</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value as typeof category)}
                className="w-full bg-graphite border border-paper/20 px-4 py-2.5 font-mono text-sm text-paper focus:border-orange-DEFAULT outline-none"
              >
                <option value="flight">FLIGHT (Rocketry)</option>
                <option value="robotics">ROBOTICS (UGV)</option>
                <option value="uav">UAV (Drones)</option>
                <option value="ai">AI / ML</option>
                <option value="embedded">EMBEDDED SYSTEMS</option>
                <option value="software">SOFTWARE</option>
              </select>
            </div>

            <div>
              <label className="block font-mono text-2xs text-orange-DEFAULT tracking-widest mb-2">STATUS</label>
              <select
                value={status}
                onChange={e => setStatus(e.target.value as typeof status)}
                className="w-full bg-graphite border border-paper/20 px-4 py-2.5 font-mono text-sm text-paper focus:border-orange-DEFAULT outline-none"
              >
                <option value="active">ACTIVE / IN DEV</option>
                <option value="completed">COMPLETED</option>
                <option value="simulation">SIMULATION</option>
                <option value="archived">ARCHIVED</option>
              </select>
            </div>

            <div className="flex items-center pt-6">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={featured}
                  onChange={e => setFeatured(e.target.checked)}
                  className="w-4 h-4 accent-orange-DEFAULT"
                />
                <span className="font-mono text-xs text-paper tracking-wider">FEATURED ON HOME</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block font-mono text-2xs text-orange-DEFAULT tracking-widest mb-2">SHORT DESCRIPTION *</label>
            <input
              type="text"
              value={shortDesc}
              onChange={e => setShortDesc(e.target.value)}
              required
              className="w-full bg-paper/5 border border-paper/20 px-4 py-2.5 font-mono text-sm text-paper focus:border-orange-DEFAULT outline-none"
            />
          </div>

          <div>
            <label className="block font-mono text-2xs text-orange-DEFAULT tracking-widest mb-2">FULL TECHNICAL DESCRIPTION</label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={6}
              className="w-full bg-paper/5 border border-paper/20 px-4 py-2.5 font-mono text-sm text-paper focus:border-orange-DEFAULT outline-none resize-y"
            />
          </div>

          <div>
            <label className="block font-mono text-2xs text-orange-DEFAULT tracking-widest mb-2">TECHNOLOGIES (comma-separated)</label>
            <input
              type="text"
              value={technologies}
              onChange={e => setTechnologies(e.target.value)}
              className="w-full bg-paper/5 border border-paper/20 px-4 py-2.5 font-mono text-sm text-paper focus:border-orange-DEFAULT outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block font-mono text-2xs text-orange-DEFAULT tracking-widest mb-2">GITHUB REPO URL</label>
              <input
                type="url"
                value={githubUrl}
                onChange={e => setGithubUrl(e.target.value)}
                className="w-full bg-paper/5 border border-paper/20 px-4 py-2.5 font-mono text-sm text-paper focus:border-orange-DEFAULT outline-none"
              />
            </div>

            <div>
              <label className="block font-mono text-2xs text-orange-DEFAULT tracking-widest mb-2">LIVE DEMO / SIMULATION URL</label>
              <input
                type="url"
                value={demoUrl}
                onChange={e => setDemoUrl(e.target.value)}
                className="w-full bg-paper/5 border border-paper/20 px-4 py-2.5 font-mono text-sm text-paper focus:border-orange-DEFAULT outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block font-mono text-2xs text-orange-DEFAULT tracking-widest mb-2">COVER IMAGE PATH OR URL</label>
              <input
                type="text"
                value={coverImage}
                onChange={e => setCoverImage(e.target.value)}
                className="w-full bg-paper/5 border border-paper/20 px-4 py-2.5 font-mono text-sm text-paper focus:border-orange-DEFAULT outline-none"
              />
            </div>

            <div>
              <label className="block font-mono text-2xs text-orange-DEFAULT tracking-widest mb-2">DOCUMENTATION URL</label>
              <input
                type="url"
                value={docUrl}
                onChange={e => setDocUrl(e.target.value)}
                className="w-full bg-paper/5 border border-paper/20 px-4 py-2.5 font-mono text-sm text-paper focus:border-orange-DEFAULT outline-none"
              />
            </div>
          </div>

          <div className="pt-4 flex items-center justify-end gap-4 border-t border-paper/10">
            <Link
              href="/admin/projects"
              className="font-mono text-xs text-steel hover:text-paper px-4 py-2 transition-colors"
            >
              CANCEL
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="bg-orange-DEFAULT hover:bg-orange-dark text-paper font-mono text-xs tracking-widest px-6 py-3 transition-colors disabled:opacity-50"
            >
              {saving ? 'UPDATING...' : 'SAVE CHANGES'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
