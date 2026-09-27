'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { Post } from '@/types'

export function usePosts(category?: string) {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let query = supabase
      .from('posts')
      .select('*')
      .eq('published', true)
      .order('published_at', { ascending: false })
    if (category) query = query.eq('category', category)
    query.then(({ data }) => { setPosts(data || []); setLoading(false) })
  }, [category])

  return { posts, loading }
}

export function usePost(slug: string) {
  const [post, setPost] = useState<Post | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.from('posts').select('*').eq('slug', slug).eq('published', true).single()
      .then(({ data }) => { setPost(data); setLoading(false) })
  }, [slug])

  return { post, loading }
}
