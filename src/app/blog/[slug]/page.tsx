import type { Metadata } from 'next'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { formatDate } from '@/lib/utils'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createServerSupabaseClient()
  const { data: post } = await supabase.from('posts').select('title, excerpt').eq('slug', slug).single()
  if (!post) return { title: 'Note Not Found — Pranjal Giri' }
  return { title: `${post.title} — Pranjal Giri`, description: post.excerpt }
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params
  const supabase = await createServerSupabaseClient()
  const { data: post } = await supabase.from('posts').select('*').eq('slug', slug).single()

  if (!post) notFound()

  return (
    <div className="min-h-screen bg-paper pt-20 pb-16">
      <div className="fixed inset-0 bg-engineering-grid bg-grid-40 opacity-25 pointer-events-none" />

      {/* Header Banner */}
      <div className="relative border-b border-graphite/10 bg-paper-dark/30 py-12">
        <div className="max-w-4xl mx-auto px-6">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 font-mono text-2xs text-steel hover:text-orange-DEFAULT transition-colors mb-6"
          >
            ← BACK TO NOTES
          </Link>

          <div className="flex items-center gap-2 mb-3">
            <span className="font-mono text-2xs text-orange-DEFAULT tracking-widest uppercase">
              {post.category || 'ENGINEERING LOG'}
            </span>
            <span className="text-steel/40 text-xs">/</span>
            <span className="font-mono text-2xs text-steel">
              {formatDate(post.published_at || post.created_at)}
            </span>
            {post.read_time && (
              <>
                <span className="text-steel/40 text-xs">/</span>
                <span className="font-mono text-2xs text-steel">{post.read_time} MIN READ</span>
              </>
            )}
          </div>

          <h1 className="font-display font-bold text-3xl sm:text-4xl text-ink leading-tight">
            {post.title}
          </h1>

          <p className="font-sans text-sm text-steel mt-4 max-w-2xl leading-relaxed">
            {post.excerpt}
          </p>

          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-5">
              {post.tags.map((tag: string) => (
                <span key={tag} className="font-mono text-2xs border border-graphite/15 text-steel px-2 py-0.5">
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Cover Image if present */}
      {post.cover_image && (
        <div className="max-w-4xl mx-auto px-6 mt-8">
          <div className="relative aspect-video w-full overflow-hidden border border-graphite/15">
            <Image
              src={post.cover_image}
              alt={post.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>
      )}

      {/* Body Content */}
      <div className="max-w-4xl mx-auto px-6 py-10">
        <article className="prose prose-neutral dark:prose-invert max-w-none font-sans text-ink leading-relaxed whitespace-pre-wrap">
          {post.content}
        </article>

        <div className="mt-12 pt-6 border-t border-graphite/15 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image
              src="/character/avatar.jpg"
              alt="Pranjal Giri"
              width={40}
              height={40}
              className="rounded-full border border-orange/40 object-cover"
            />
            <div>
              <div className="font-display font-bold text-xs text-ink">PRANJAL GIRI</div>
              <div className="font-mono text-2xs text-steel">OPERATOR / FLIGHT SOFTWARE BUILDER</div>
            </div>
          </div>
          <Link
            href="/blog"
            className="font-mono text-xs text-orange-DEFAULT hover:underline"
          >
            ← ALL NOTES
          </Link>
        </div>
      </div>
    </div>
  )
}
