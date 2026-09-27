import { Metadata } from 'next'
import Link from 'next/link'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import { formatDate } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'Notes — Pranjal Giri',
  description: 'Engineering notes, build logs, and technical write-ups.',
}

export default async function BlogPage() {
  const supabase = await createServerSupabaseClient()
  const { data: posts } = await supabase
    .from('posts')
    .select('*')
    .eq('published', true)
    .order('published_at', { ascending: false })

  return (
    <div className="min-h-screen bg-paper pt-20">
      <div className="fixed inset-0 bg-engineering-grid bg-grid-40 opacity-25 pointer-events-none" />
      <div className="relative max-w-4xl mx-auto px-6 py-12">
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-px w-8 bg-orange-DEFAULT" />
            <span className="font-mono text-2xs tracking-widest text-orange-DEFAULT">ENGINEERING NOTES</span>
          </div>
          <h1 className="font-display font-bold text-4xl text-ink">NOTES</h1>
          <p className="font-sans text-steel text-sm mt-2">Build logs, technical write-ups, and engineering lessons.</p>
        </div>

        {!posts || posts.length === 0 ? (
          <div className="border border-graphite/15 p-12 text-center">
            <div className="font-mono text-2xs text-steel tracking-widest mb-3">TRANSMISSION QUEUE EMPTY</div>
            <p className="font-sans text-sm text-steel">No posts published yet. Check back soon.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <Link key={post.id} href={`/blog/${post.slug}`}>
                <div className="relative border border-graphite/15 p-5 hover:border-orange/30 transition-colors group">
                  <span className="absolute top-2 left-2 w-2 h-2 border-t border-l border-orange/40" />
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="font-mono text-2xs text-orange-DEFAULT tracking-widest mb-1">
                        {post.category?.toUpperCase() || 'NOTES'}
                      </div>
                      <h2 className="font-display font-bold text-xl text-ink group-hover:text-orange-DEFAULT transition-colors">{post.title}</h2>
                      <p className="font-sans text-sm text-steel mt-2 leading-relaxed">{post.excerpt}</p>
                      <div className="flex flex-wrap gap-1 mt-3">
                        {post.tags?.map((tag: string) => (
                          <span key={tag} className="font-mono text-2xs border border-graphite/15 text-steel px-2 py-0.5">{tag}</span>
                        ))}
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="font-mono text-2xs text-steel">{post.published_at ? formatDate(post.published_at) : ''}</div>
                      <div className="font-mono text-2xs text-orange-DEFAULT mt-2 opacity-0 group-hover:opacity-100 transition-opacity">READ →</div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
