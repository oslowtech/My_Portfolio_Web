import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { resend, DEFAULT_FROM } from '@/lib/resend'
import {
  operatorDirectReplyEmailHtml,
  collaborationReplyEmailHtml,
  meetingInviteReplyEmailHtml,
} from '@/lib/email-templates'

export async function POST(request: Request) {
  try {
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

    // Verify Admin authorization
    const { data: { user } } = await supabase.auth.getUser()
    if (!user || user.email !== 'pranjalgiri1122005@gmail.com') {
      return NextResponse.json({ error: 'Unauthorized. Admin credentials required.' }, { status: 403 })
    }

    const body = await request.json()
    const {
      to,
      recipientName,
      subject,
      templateId = 'direct_response',
      replyMessage,
      msgId = '#PG-RESP',
      messageRecordId,
    } = body

    if (!to || !replyMessage || !subject) {
      return NextResponse.json({ error: 'Missing required parameters (to, subject, replyMessage)' }, { status: 400 })
    }

    // Generate HTML based on selected template
    let htmlContent: string
    if (templateId === 'collaboration') {
      htmlContent = collaborationReplyEmailHtml({
        recipientName: recipientName || 'Colleague',
        replyMessage,
        msgId,
      })
    } else if (templateId === 'meeting_invite') {
      htmlContent = meetingInviteReplyEmailHtml({
        recipientName: recipientName || 'Colleague',
        replyMessage,
        msgId,
      })
    } else {
      htmlContent = operatorDirectReplyEmailHtml({
        recipientName: recipientName || 'Colleague',
        replyMessage,
        msgId,
      })
    }

    // Send email via Resend
    const resendResponse = await resend.emails.send({
      from: DEFAULT_FROM,
      to,
      subject,
      html: htmlContent,
    })

    if (resendResponse.error) {
      console.error('Resend delivery error:', resendResponse.error)
      return NextResponse.json({ error: resendResponse.error.message }, { status: 500 })
    }

    // Mark as replied in database if message record ID was provided
    if (messageRecordId) {
      await supabase
        .from('contact_messages')
        .update({ replied: true, read: true })
        .eq('id', messageRecordId)
    }

    return NextResponse.json({
      success: true,
      id: resendResponse.data?.id,
      timestamp: new Date().toISOString(),
    })
  } catch (error: unknown) {
    console.error('Admin reply API error:', error)
    const message = error instanceof Error ? error.message : 'Server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
