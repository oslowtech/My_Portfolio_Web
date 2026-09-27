'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { Project } from '@/types'

export function useProjects(category?: string) {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let query = supabase.from('projects').select('*').order('created_at', { ascending: false })
    if (category) query = query.eq('category', category)
    query.then(({ data, error }) => {
      if (error) setError(error.message)
      else setProjects(data || [])
      setLoading(false)
    })
  }, [category])

  return { projects, loading, error }
}

export function useFeaturedProjects() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('projects')
      .select('*')
      .eq('featured', true)
      .limit(6)
      .then(({ data }) => { setProjects(data || []); setLoading(false) })
  }, [])

  return { projects, loading }
}

export function useProject(slug: string) {
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.from('projects').select('*').eq('slug', slug).single()
      .then(({ data }) => { setProject(data); setLoading(false) })
  }, [slug])

  return { project, loading }
}
