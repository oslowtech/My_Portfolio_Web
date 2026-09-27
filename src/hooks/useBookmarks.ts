'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from './useAuth'

export function useBookmarks() {
  const { user } = useAuth()
  const [bookmarks, setBookmarks] = useState<string[]>([])

  useEffect(() => {
    if (!user) return
    supabase.from('bookmarks').select('project_id').eq('user_id', user.id)
      .then(({ data }) => setBookmarks(data?.map((b) => b.project_id) || []))
  }, [user])

  async function toggleBookmark(projectId: string) {
    if (!user) return
    if (bookmarks.includes(projectId)) {
      await supabase.from('bookmarks').delete().eq('user_id', user.id).eq('project_id', projectId)
      setBookmarks((prev) => prev.filter((id) => id !== projectId))
    } else {
      await supabase.from('bookmarks').insert({ user_id: user.id, project_id: projectId })
      setBookmarks((prev) => [...prev, projectId])
    }
  }

  return { bookmarks, toggleBookmark, isBookmarked: (id: string) => bookmarks.includes(id) }
}
