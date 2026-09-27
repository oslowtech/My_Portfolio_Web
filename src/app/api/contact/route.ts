import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { resend, NOTIFICATION_RECIPIENT, DEFAULT_FROM } from '@/lib/resend'
import { contactNotificationEmailHtml, contactReceiptEmailHtml } from '@/lib/email-templates'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, subject, message, msg_id } = body

    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const msgId = msg_id || `MSG-ID: #PG-${Math.floor(Math.random() * 99999).toString().padStart(5, '0')}`

    // 1. Store in Supabase
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

    await supabase.from('contact_messages').insert({
      name,
      email,
      subject,
      message,
      msg_id: msgId,
      read: false,
      replied: false,
    })

    // 2. Send email notification to Pranjal via Resend
    let emailSent = false
    try {
      await resend.emails.send({
        from: DEFAULT_FROM,
        to: NOTIFICATION_RECIPIENT,
        subject: `[SYSTEM TRANSMISSION] ${subject} (${name})`,
        html: contactNotificationEmailHtml({
          name,
          email,
          subject,
          message,
          msgId,
        }),
      })
      emailSent = true
    } catch (err) {
      console.error('Failed to dispatch notification to Pranjal via Resend:', err)
    }

    // 3. Send automated acknowledgement to visitor
    try {
      await resend.emails.send({
        from: DEFAULT_FROM,
        to: email,
        subject: `Transmission Acknowledged — ${msgId}`,
        html: contactReceiptEmailHtml({
          name,
          msgId,
        }),
      })
    } catch (err) {
      console.warn('Visitor receipt email note (might require verified domain in Resend):', err)
    }

    return NextResponse.json({
      success: true,
      msgId,
      emailSent,
    })
  } catch (error: unknown) {
    console.error('Contact API Error:', error)
    const message = error instanceof Error ? error.message : 'Server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
