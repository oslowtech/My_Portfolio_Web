import { supabase } from './supabase'
import type { Profile } from '@/types'

export const ADMIN_EMAIL = 'pranjalgiri1122005@gmail.com'

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw error
  return data
}

export async function signUp(email: string, password: string, username: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { username } }
  })
  if (error) throw error
  return data
}

export async function signInWithGoogle(next: string = '/') {
  const origin = typeof window !== 'undefined'
    ? window.location.origin
    : (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000')

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${origin}/auth/callback?next=${encodeURIComponent(next)}`,
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
    },
  })
  if (error) throw error
  return data
}

export async function signInWithOtp(email: string, next: string = '/') {
  const origin = typeof window !== 'undefined'
    ? window.location.origin
    : (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000')

  const { data, error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${origin}/auth/callback?next=${encodeURIComponent(next)}`,
    },
  })
  if (error) throw error
  return data
}

export async function verifyEmailOtp(email: string, token: string) {
  const { data, error } = await supabase.auth.verifyOtp({
    email,
    token,
    type: 'email',
  })
  if (error) throw error
  return data
}

export async function updateEmail(newEmail: string) {
  const origin = typeof window !== 'undefined'
    ? window.location.origin
    : (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000')

  const { data, error } = await supabase.auth.updateUser(
    { email: newEmail },
    { emailRedirectTo: `${origin}/profile` }
  )
  if (error) throw error
  return data
}

export async function resetPassword(email: string) {
  const origin = typeof window !== 'undefined'
    ? window.location.origin
    : (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000')

  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?next=/update-password`,
  })
  if (error) throw error
  return data
}

export async function updatePassword(password: string) {
  const { data, error } = await supabase.auth.updateUser({ password })
  if (error) throw error
  return data
}

export async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

export async function getUser() {
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error) return null
  return user
}

export async function getProfile(userId: string): Promise<Profile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()
  if (error) return null
  return data
}

export async function requireAdmin(): Promise<Profile> {
  const user = await getUser()
  if (!user) throw new Error('Not authenticated')
  // Double-check: must be THE admin email
  if (user.email !== ADMIN_EMAIL) throw new Error('Not authorized')
  const profile = await getProfile(user.id)
  if (!profile || profile.role !== 'admin') throw new Error('Not authorized')
  return profile
}

export function generatePublicId(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let result = 'PG-'
  for (let i = 0; i < 5; i++) {
    result += chars[Math.floor(Math.random() * chars.length)]
  }
  return result
}

export function generateMsgId(): string {
  const num = Math.floor(Math.random() * 99999).toString().padStart(5, '0')
  return `MSG-ID: #PG-${num}`
}
