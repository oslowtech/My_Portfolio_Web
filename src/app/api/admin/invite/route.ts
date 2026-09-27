import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { resend, DEFAULT_FROM } from '@/lib/resend'

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

    // Verify Admin authorization (Strictly locked to pranjalgiri1122005@gmail.com)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user || user.email?.toLowerCase() !== 'pranjalgiri1122005@gmail.com') {
      return NextResponse.json({ error: 'Unauthorized. Admin access required.' }, { status: 403 })
    }

    const body = await request.json()
    const { email, role = 'user', note = '' } = body

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Valid recipient email address is required.' }, { status: 400 })
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
    const signupUrl = `${siteUrl}/login?signup=true&email=${encodeURIComponent(email)}&invited_by=${encodeURIComponent(user.email)}`

    let supabaseInviteAttempted = false
    let supabaseInviteSuccess = false

    // Attempt Supabase Admin Invite if SERVICE_ROLE_KEY is configured
    if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
      try {
        const { createClient } = await import('@supabase/supabase-js')
        const adminSupabase = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.SUPABASE_SERVICE_ROLE_KEY,
          { auth: { autoRefreshToken: false, persistSession: false } }
        )
        const { error: inviteErr } = await adminSupabase.auth.admin.inviteUserByEmail(email, {
          data: { role, invited_by: user.email },
          redirectTo: `${siteUrl}/update-password`,
        })
        supabaseInviteAttempted = true
        if (!inviteErr) supabaseInviteSuccess = true
      } catch (adminErr) {
        console.warn('Supabase Admin Invite failed:', adminErr)
      }
    }

    // Compose aerospace invitation email
    const invitationHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Operator Invitation // Pranjal Giri Console</title>
</head>
<body style="margin: 0; padding: 0; background-color: #12181B; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #E9E6DD;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #12181B; padding: 40px 15px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width: 580px; background-color: #1A2226; border: 1px solid #2A363D; border-top: 3px solid #D96C32; padding: 0;">
          <tr>
            <td style="padding: 24px 30px; border-bottom: 1px solid #242F35;">
              <table width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td>
                    <div style="font-family: 'Courier New', Courier, monospace; font-size: 10px; color: #D96C32; letter-spacing: 2px; text-transform: uppercase;">
                      OPERATOR INVITATION // CLEARANCE LEVEL: ${role.toUpperCase()}
                    </div>
                    <div style="font-size: 18px; font-weight: bold; color: #FFFFFF; margin-top: 4px; letter-spacing: 0.5px;">
                      PRANJAL GIRI — SYSTEMS CONSOLE
                    </div>
                  </td>
                  <td align="right" valign="top">
                    <span style="font-family: 'Courier New', Courier, monospace; font-size: 10px; color: #6C7A72; border: 1px solid #2A363D; padding: 3px 8px; text-transform: uppercase;">
                      INVITE-AUTH
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding: 24px 30px 20px 30px;">
              <h2 style="font-size: 18px; font-weight: 600; color: #FFFFFF; margin: 0 0 12px 0;">
                Operator Clearance Authorized
              </h2>
              <p style="font-size: 14px; line-height: 1.6; color: #A4B3BC; margin: 0 0 20px 0;">
                You have been authorized by <strong>Pranjal Giri</strong> to access the Engineering Systems Console as an <strong>${role.toUpperCase()}</strong>.
              </p>
              ${
                note
                  ? `<div style="background-color: #141B1F; border-left: 2px solid #D96C32; padding: 12px 16px; margin-bottom: 24px;">
                      <div style="font-family: 'Courier New', Courier, monospace; font-size: 10px; color: #6C7A72; letter-spacing: 1px; margin-bottom: 4px;">MESSAGE FROM PRANJAL:</div>
                      <div style="font-size: 13px; color: #E9E6DD; line-height: 1.5;">${note.replace(/\n/g, '<br>')}</div>
                    </div>`
                  : ''
              }
              <div style="text-align: center; margin: 28px 0;">
                <a href="${signupUrl}" style="display: inline-block; background-color: #D96C32; color: #FFFFFF; font-family: 'Courier New', Courier, monospace; font-size: 13px; font-weight: bold; text-decoration: none; padding: 14px 32px; letter-spacing: 1.5px; text-transform: uppercase;">
                  INITIALIZE OPERATOR PROFILE →
                </a>
              </div>
              <div style="background-color: #141B1F; border: 1px solid #242F35; padding: 12px 14px; margin-top: 24px;">
                <div style="font-family: 'Courier New', Courier, monospace; font-size: 10px; color: #6C7A72; letter-spacing: 1px; margin-bottom: 4px;">
                  DIRECT ACCESS LINK:
                </div>
                <div style="font-family: 'Courier New', Courier, monospace; font-size: 11px; color: #8A9A90; word-break: break-all; line-height: 1.4;">
                  ${signupUrl}
                </div>
              </div>
            </td>
          </tr>
          <tr>
            <td style="padding: 18px 30px; background-color: #141B1F; border-top: 1px solid #242F35;">
              <div style="font-family: 'Courier New', Courier, monospace; font-size: 10px; color: #526068;">
                ENGINEERING SYSTEMS CONSOLE · VIT CHENNAI · AI & ROBOTICS
              </div>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`

    // Dispatch via Resend
    let resendSent = false
    let resendNotice = ''

    try {
      const resendRes = await resend.emails.send({
        from: DEFAULT_FROM,
        to: email,
        subject: `[OPERATOR INVITATION] Access Engineering Systems Console`,
        html: invitationHtml,
      })

      if (resendRes.error) {
        resendNotice = `Resend note: ${resendRes.error.message}`
      } else {
        resendSent = true
      }
    } catch (resendErr: unknown) {
      resendNotice = `Resend note: ${resendErr instanceof Error ? resendErr.message : 'Sandbox domain constraint'}`
    }

    return NextResponse.json({
      success: true,
      message: resendSent
        ? `Invitation successfully dispatched to ${email}.`
        : `Invitation link generated. ${resendNotice}`,
      inviteUrl: signupUrl,
      supabaseInviteAttempted,
      supabaseInviteSuccess,
      resendSent,
    })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
