import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/'

  if (code) {
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[]) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options as Parameters<typeof cookieStore.set>[2])
              )
            } catch {}
          },
        },
      }
    )

    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      const { data: { user } } = await supabase.auth.getUser()

      // If specifically requesting password update, route directly to /update-password
      if (next === '/update-password' || next.startsWith('/update-password')) {
        return NextResponse.redirect(`${origin}/update-password`)
      }

      // If Pranjal logs in, redirect directly to /admin
      if (user?.email?.toLowerCase() === 'pranjalgiri1122005@gmail.com') {
        return NextResponse.redirect(`${origin}/admin`)
      }

      const isRelativeUrl = next.startsWith('/') && !next.startsWith('//')
      const targetUrl = isRelativeUrl ? `${origin}${next}` : `${origin}/`
      return NextResponse.redirect(targetUrl)
    }
  }

  return NextResponse.redirect(`${origin}/login?error=authentication_failed`)
}
