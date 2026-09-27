/**
 * Engineering Systems Console — Aerospace Email Templates
 * Industrial theme: graphite #161D21, warm paper #E9E6DD, aerospace orange #D96C32
 */

interface ContactNotificationParams {
  name: string
  email: string
  subject: string
  message: string
  msgId: string
  timestamp?: string
}

export function contactNotificationEmailHtml({
  name,
  email,
  subject,
  message,
  msgId,
  timestamp = new Date().toISOString(),
}: ContactNotificationParams) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Transmission Received — ${msgId}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #12181B; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #E9E6DD;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #12181B; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width: 600px; background-color: #1A2226; border: 1px solid #2A363D; border-top: 3px solid #D96C32; padding: 0;">
          <!-- Header -->
          <tr>
            <td style="padding: 24px 30px; border-bottom: 1px solid #2A363D;">
              <table width="100%">
                <tr>
                  <td>
                    <div style="font-family: 'Courier New', Courier, monospace; font-size: 10px; color: #D96C32; letter-spacing: 2px;">SYSTEM TRANSMISSION // INBOUND</div>
                    <div style="font-size: 18px; font-weight: bold; color: #FFFFFF; margin-top: 4px; letter-spacing: 0.5px;">PRANJAL GIRI CONSOLE</div>
                  </td>
                  <td align="right">
                    <span style="font-family: 'Courier New', Courier, monospace; font-size: 11px; color: #6C7A72; border: 1px solid #2A363D; padding: 4px 8px;">${msgId}</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Meta Block -->
          <tr>
            <td style="padding: 24px 30px 10px 30px;">
              <table width="100%" style="background-color: #141B1F; border: 1px solid #242F35; padding: 14px; font-size: 13px;">
                <tr>
                  <td style="color: #6C7A72; font-family: 'Courier New', Courier, monospace; font-size: 11px; width: 80px;">SENDER:</td>
                  <td style="color: #FFFFFF; font-weight: 500;">${name} &lt;<a href="mailto:${email}" style="color: #D96C32; text-decoration: none;">${email}</a>&gt;</td>
                </tr>
                <tr>
                  <td style="color: #6C7A72; font-family: 'Courier New', Courier, monospace; font-size: 11px;">SUBJECT:</td>
                  <td style="color: #E9E6DD;">${subject}</td>
                </tr>
                <tr>
                  <td style="color: #6C7A72; font-family: 'Courier New', Courier, monospace; font-size: 11px;">TIME:</td>
                  <td style="color: #8C9BA5; font-family: 'Courier New', Courier, monospace; font-size: 11px;">${timestamp}</td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Message Body -->
          <tr>
            <td style="padding: 10px 30px 24px 30px;">
              <div style="font-family: 'Courier New', Courier, monospace; font-size: 10px; color: #D96C32; letter-spacing: 1px; margin-bottom: 8px;">PAYLOAD DATA:</div>
              <div style="background-color: #141B1F; border: 1px solid #242F35; padding: 18px; font-size: 14px; line-height: 1.6; color: #E9E6DD; white-space: pre-wrap;">${message}</div>
            </td>
          </tr>

          <!-- Actions -->
          <tr>
            <td style="padding: 0 30px 30px 30px;">
              <table width="100%">
                <tr>
                  <td>
                    <a href="mailto:${email}?subject=Re: ${encodeURIComponent(subject)}" style="display: inline-block; background-color: #D96C32; color: #FFFFFF; font-family: 'Courier New', Courier, monospace; font-size: 12px; font-weight: bold; text-decoration: none; padding: 12px 24px; letter-spacing: 1px;">
                      REPLY DIRECTLY →
                    </a>
                  </td>
                  <td align="right">
                    <span style="color: #8C9BA5; font-family: 'Courier New', Courier, monospace; font-size: 11px;">ADMIN TRANSMISSION</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 16px 30px; background-color: #141B1F; border-top: 1px solid #242F35; text-align: center;">
              <div style="font-family: 'Courier New', Courier, monospace; font-size: 10px; color: #526068; letter-spacing: 1px;">
                ENGINEERING SYSTEMS CONSOLE · PRANJAL GIRI · VIT CHENNAI
              </div>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`
}

interface ContactReceiptParams {
  name: string
  msgId: string
}

export function contactReceiptEmailHtml({ name, msgId }: ContactReceiptParams) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Transmission Acknowledged — ${msgId}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #12181B; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #E9E6DD;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #12181B; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width: 600px; background-color: #1A2226; border: 1px solid #2A363D; border-top: 3px solid #6C7A72; padding: 0;">
          <tr>
            <td style="padding: 24px 30px; border-bottom: 1px solid #2A363D;">
              <div style="font-family: 'Courier New', Courier, monospace; font-size: 10px; color: #6C7A72; letter-spacing: 2px;">AUTOMATED ACKNOWLEDGEMENT // RECVD</div>
              <div style="font-size: 18px; font-weight: bold; color: #FFFFFF; margin-top: 4px;">PRANJAL GIRI — SYSTEMS CONSOLE</div>
            </td>
          </tr>
          <tr>
            <td style="padding: 30px;">
              <h2 style="font-size: 20px; color: #FFFFFF; margin-top: 0;">Hello ${name},</h2>
              <p style="font-size: 14px; line-height: 1.6; color: #B0BEC5;">
                Your message has been successfully logged to the systems console with ID:
              </p>
              <div style="background-color: #141B1F; border: 1px solid #D96C32; padding: 14px 20px; margin: 20px 0; text-align: center;">
                <span style="font-family: 'Courier New', Courier, monospace; font-size: 16px; color: #D96C32; font-weight: bold; letter-spacing: 2px;">${msgId}</span>
              </div>
              <p style="font-size: 14px; line-height: 1.6; color: #B0BEC5;">
                I usually review incoming transmissions within 24 hours. If your inquiry is regarding rocketry, robotics, flight software, or collaborations, I look forward to connecting with you.
              </p>
              <div style="margin-top: 24px;">
                <a href="https://github.com/pranjalgiri" style="display: inline-block; border: 1px solid #2A363D; color: #E9E6DD; font-family: 'Courier New', Courier, monospace; font-size: 11px; text-decoration: none; padding: 8px 16px; margin-right: 8px;">GITHUB ↗</a>
                <a href="https://linkedin.com/in/pranjalgiri" style="display: inline-block; border: 1px solid #2A363D; color: #E9E6DD; font-family: 'Courier New', Courier, monospace; font-size: 11px; text-decoration: none; padding: 8px 16px;">LINKEDIN ↗</a>
              </div>
            </td>
          </tr>
          <tr>
            <td style="padding: 16px 30px; background-color: #141B1F; border-top: 1px solid #242F35; text-align: center;">
              <div style="font-family: 'Courier New', Courier, monospace; font-size: 10px; color: #526068;">
                AI & ROBOTICS ENGINEER · FLIGHT SOFTWARE BUILDER · VIT CHENNAI
              </div>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`
}

interface PasswordResetParams {
  resetUrl: string
}

export function passwordResetEmailHtml({ resetUrl }: PasswordResetParams) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Reset Security Credentials</title>
</head>
<body style="margin: 0; padding: 0; background-color: #12181B; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #E9E6DD;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #12181B; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width: 600px; background-color: #1A2226; border: 1px solid #2A363D; border-top: 3px solid #D96C32; padding: 0;">
          <tr>
            <td style="padding: 24px 30px; border-bottom: 1px solid #2A363D;">
              <div style="font-family: 'Courier New', Courier, monospace; font-size: 10px; color: #D96C32; letter-spacing: 2px;">SECURITY PROTOCOL // AUTH</div>
              <div style="font-size: 18px; font-weight: bold; color: #FFFFFF; margin-top: 4px;">CREDENTIAL OVERRIDE REQUEST</div>
            </td>
          </tr>
          <tr>
            <td style="padding: 30px;">
              <p style="font-size: 14px; line-height: 1.6; color: #B0BEC5;">
                A request has been initiated to reset the access password for your operator account on the Pranjal Giri Engineering Console.
              </p>
              <div style="margin: 28px 0; text-align: center;">
                <a href="${resetUrl}" style="display: inline-block; background-color: #D96C32; color: #FFFFFF; font-family: 'Courier New', Courier, monospace; font-size: 13px; font-weight: bold; text-decoration: none; padding: 14px 28px; letter-spacing: 1px;">
                  RESET PASSWORD →
                </a>
              </div>
              <p style="font-size: 12px; line-height: 1.5; color: #6C7A72;">
                If you did not initiate this security request, you can safely ignore this transmission. Your current credentials will remain active.
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding: 16px 30px; background-color: #141B1F; border-top: 1px solid #242F35; text-align: center;">
              <div style="font-family: 'Courier New', Courier, monospace; font-size: 10px; color: #526068;">
                ENGINEERING SYSTEMS CONSOLE · SECURE LINK EXPIRES IN 1 HOUR
              </div>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`
}

// ============================================================================
// ADMIN REPLY TEMPLATES FOR DISPATCHING REPLIES VIA RESEND
// ============================================================================

export interface OperatorReplyParams {
  recipientName: string
  replyMessage: string
  msgId?: string
  subjectHeading?: string
  callToActionText?: string
  callToActionUrl?: string
}

/**
 * 1. Standard Operator Direct Response
 */
export function operatorDirectReplyEmailHtml({
  recipientName,
  replyMessage,
  msgId = '#PG-RESP',
  subjectHeading = 'TRANSMISSION RESPONSE',
  callToActionText,
  callToActionUrl,
}: OperatorReplyParams) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${subjectHeading}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #12181B; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #E9E6DD;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #12181B; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width: 600px; background-color: #1A2226; border: 1px solid #2A363D; border-top: 3px solid #D96C32; padding: 0;">
          <!-- Header -->
          <tr>
            <td style="padding: 24px 30px; border-bottom: 1px solid #2A363D;">
              <table width="100%">
                <tr>
                  <td>
                    <div style="font-family: 'Courier New', Courier, monospace; font-size: 10px; color: #D96C32; letter-spacing: 2px;">OPERATOR TRANSMISSION // PG-01</div>
                    <div style="font-size: 18px; font-weight: bold; color: #FFFFFF; margin-top: 4px;">PRANJAL GIRI</div>
                    <div style="font-family: 'Courier New', Courier, monospace; font-size: 11px; color: #6C7A72; margin-top: 2px;">AI & ROBOTICS ENGINEER · FLIGHT SOFTWARE BUILDER</div>
                  </td>
                  <td align="right" valign="top">
                    <span style="font-family: 'Courier New', Courier, monospace; font-size: 10px; color: #8A9A90; border: 1px solid #2A363D; padding: 3px 6px;">REF: ${msgId}</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Salutation & Body -->
          <tr>
            <td style="padding: 30px;">
              <div style="font-size: 15px; color: #FFFFFF; font-weight: 600; margin-bottom: 16px;">
                Hello ${recipientName},
              </div>
              <div style="background-color: #141B1F; border: 1px solid #242F35; padding: 20px; font-size: 14px; line-height: 1.7; color: #E9E6DD; white-space: pre-wrap;">${replyMessage}</div>

              ${callToActionUrl && callToActionText ? `
              <div style="margin-top: 24px; text-align: center;">
                <a href="${callToActionUrl}" style="display: inline-block; background-color: #D96C32; color: #FFFFFF; font-family: 'Courier New', Courier, monospace; font-size: 12px; font-weight: bold; text-decoration: none; padding: 12px 24px; letter-spacing: 1px;">
                  ${callToActionText} →
                </a>
              </div>
              ` : ''}

              <!-- Signoff -->
              <div style="margin-top: 28px; padding-top: 20px; border-top: 1px solid #242F35;">
                <div style="font-size: 13px; color: #E9E6DD; font-weight: 500;">Best regards,</div>
                <div style="font-size: 14px; font-weight: bold; color: #FFFFFF; margin-top: 4px;">Pranjal Giri</div>
                <div style="font-family: 'Courier New', Courier, monospace; font-size: 11px; color: #8C9BA5; margin-top: 2px;">
                  Team Ignition (SRAD Rocketry) · Robotics Club · VIT Chennai
                </div>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 16px 30px; background-color: #141B1F; border-top: 1px solid #242F35;">
              <table width="100%">
                <tr>
                  <td>
                    <span style="font-family: 'Courier New', Courier, monospace; font-size: 10px; color: #526068;">
                      SYSTEM CONSOLE: <a href="https://pranjalgiri.com" style="color: #D96C32; text-decoration: none;">pranjalgiri.com</a>
                    </span>
                  </td>
                  <td align="right">
                    <a href="https://github.com/pranjalgiri" style="font-family: 'Courier New', Courier, monospace; font-size: 10px; color: #8C9BA5; text-decoration: none; margin-left: 8px;">GITHUB</a>
                    <a href="https://linkedin.com/in/pranjalgiri" style="font-family: 'Courier New', Courier, monospace; font-size: 10px; color: #8C9BA5; text-decoration: none; margin-left: 8px;">LINKEDIN</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`
}

/**
 * 2. Collaboration & Technical Discussion Template
 */
export function collaborationReplyEmailHtml({
  recipientName,
  replyMessage,
  msgId = '#PG-COLLAB',
}: OperatorReplyParams) {
  return operatorDirectReplyEmailHtml({
    recipientName,
    replyMessage,
    msgId,
    subjectHeading: 'PROJECT COLLABORATION RESPONSE',
    callToActionText: 'INSPECT ENGINEERING SYSTEMS',
    callToActionUrl: 'https://pranjalgiri.com/systems',
  })
}

/**
 * 3. Schedule Discussion / Meeting Template
 */
export function meetingInviteReplyEmailHtml({
  recipientName,
  replyMessage,
  msgId = '#PG-MEET',
  calendarLink,
}: OperatorReplyParams & { calendarLink?: string }) {
  return operatorDirectReplyEmailHtml({
    recipientName,
    replyMessage,
    msgId,
    subjectHeading: 'TECHNICAL COORDINATION // MEETING',
    callToActionText: calendarLink ? 'CONFIRM TIME SLOT' : 'REPLY WITH AVAILABILITY',
    callToActionUrl: calendarLink || 'mailto:pranjalgiri1122005@gmail.com',
  })
}

/**
 * Available template choices for the Admin Portal
 */
export const REPLY_TEMPLATES = [
  {
    id: 'direct_response',
    name: 'Direct Operator Reply',
    description: 'Personalized response to general inquiries and contact submissions.',
    defaultSubject: 'Re: Transmission Received // Pranjal Giri',
    defaultMessage: `Thank you for reaching out via the Systems Console.\n\nI reviewed your transmission and would be happy to discuss further.\n\nLet me know your thoughts or if you need additional details.`,
  },
  {
    id: 'collaboration',
    name: 'Aerospace & Robotics Collaboration',
    description: 'Tailored for inquiries regarding rocketry, avionics, UGV, or AI projects.',
    defaultSubject: 'Re: Project Collaboration // Pranjal Giri Engineering',
    defaultMessage: `Thank you for your interest in collaborating on our systems.\n\nI am currently working on SRAD avionics at Team Ignition and autonomous ground robotics at VIT Chennai. Your proposal aligns well with our current objectives.\n\nCould you share more specifications regarding timeline and integration requirements?`,
  },
  {
    id: 'meeting_invite',
    name: 'Schedule Technical Discussion / Call',
    description: 'Coordinate a virtual meeting or call over Google Meet / Zoom.',
    defaultSubject: 'Re: Technical Discussion Coordination // Pranjal Giri',
    defaultMessage: `Thanks for connecting. I would be glad to set up a quick 15-20 minute discussion to walk through the details.\n\nWhat days and time slots work best for you this week?`,
  },
  {
    id: 'custom',
    name: 'Blank Aerospace Transmission',
    description: 'Write custom content from scratch within the aerospace HTML frame.',
    defaultSubject: 'Transmission from Pranjal Giri',
    defaultMessage: '',
  },
]

// ============================================================================
// SUPABASE AUTH EMAIL TEMPLATES (PASTE DIRECTLY IN SUPABASE DASHBOARD)
// ============================================================================

export function supabaseResetPasswordEmailHtml() {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset Security Credentials // Pranjal Giri Console</title>
</head>
<body style="margin: 0; padding: 0; background-color: #12181B; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #E9E6DD; -webkit-font-smoothing: antialiased;">
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
                      SECURITY PROTOCOL // AUTH OVERRIDE
                    </div>
                    <div style="font-size: 18px; font-weight: bold; color: #FFFFFF; margin-top: 4px; letter-spacing: 0.5px;">
                      PRANJAL GIRI — SYSTEMS CONSOLE
                    </div>
                  </td>
                  <td align="right" valign="top">
                    <span style="font-family: 'Courier New', Courier, monospace; font-size: 10px; color: #6C7A72; border: 1px solid #2A363D; padding: 3px 8px; text-transform: uppercase;">
                      SEC-PASS-RESET
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding: 20px 30px 0 30px;">
              <div style="background-color: #141B1F; border-left: 2px solid #D96C32; padding: 12px 16px;">
                <span style="font-family: 'Courier New', Courier, monospace; font-size: 11px; color: #D96C32; font-weight: bold;">TARGET ACCOUNT:</span>
                <span style="font-family: 'Courier New', Courier, monospace; font-size: 12px; color: #FFFFFF; margin-left: 6px;">{{ .Email }}</span>
              </div>
            </td>
          </tr>
          <tr>
            <td style="padding: 24px 30px 20px 30px;">
              <h2 style="font-size: 18px; font-weight: 600; color: #FFFFFF; margin: 0 0 12px 0;">
                Password Reset Requested
              </h2>
              <p style="font-size: 14px; line-height: 1.6; color: #A4B3BC; margin: 0 0 20px 0;">
                A credential override request was logged for your operator profile on the Pranjal Giri Engineering Systems Console. Click the button below to authenticate and enter your new access password:
              </p>
              <div style="text-align: center; margin: 28px 0;">
                <a href="{{ .ConfirmationURL }}" style="display: inline-block; background-color: #D96C32; color: #FFFFFF; font-family: 'Courier New', Courier, monospace; font-size: 13px; font-weight: bold; text-decoration: none; padding: 14px 32px; letter-spacing: 1.5px; text-transform: uppercase;">
                  COMMIT NEW PASSWORD →
                </a>
              </div>
              <div style="background-color: #141B1F; border: 1px solid #242F35; padding: 12px 14px; margin-top: 24px;">
                <div style="font-family: 'Courier New', Courier, monospace; font-size: 10px; color: #6C7A72; letter-spacing: 1px; margin-bottom: 4px;">
                  MANUAL TRANSMISSION URL (IF BUTTON FAILS):
                </div>
                <div style="font-family: 'Courier New', Courier, monospace; font-size: 11px; color: #8A9A90; word-break: break-all; line-height: 1.4;">
                  {{ .ConfirmationURL }}
                </div>
              </div>
              <p style="font-size: 12px; line-height: 1.5; color: #6C7A72; margin: 24px 0 0 0;">
                ● This secure link will expire in 1 hour.<br>
                ● If you did not initiate this request, disregard this transmission. Your existing credentials remain secure.
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding: 18px 30px; background-color: #141B1F; border-top: 1px solid #242F35;">
              <table width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td>
                    <div style="font-family: 'Courier New', Courier, monospace; font-size: 10px; color: #526068;">
                      ENGINEERING SYSTEMS CONSOLE // SECURE AUTH GATEWAY
                    </div>
                    <div style="font-family: 'Courier New', Courier, monospace; font-size: 10px; color: #526068; margin-top: 2px;">
                      VIT CHENNAI · AI, ROBOTICS & FLIGHT SOFTWARE
                    </div>
                  </td>
                  <td align="right" valign="middle">
                    <span style="display: inline-block; width: 6px; height: 6px; background-color: #6C7A72; border-radius: 50%;"></span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}

export function supabaseConfirmSignupEmailHtml() {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Confirm Operator Profile // Pranjal Giri Console</title>
</head>
<body style="margin: 0; padding: 0; background-color: #12181B; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #E9E6DD; -webkit-font-smoothing: antialiased;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #12181B; padding: 40px 15px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width: 580px; background-color: #1A2226; border: 1px solid #2A363D; border-top: 3px solid #6C7A72; padding: 0;">
          <tr>
            <td style="padding: 24px 30px; border-bottom: 1px solid #242F35;">
              <table width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td>
                    <div style="font-family: 'Courier New', Courier, monospace; font-size: 10px; color: #6C7A72; letter-spacing: 2px; text-transform: uppercase;">
                      OPERATOR ONBOARDING // VERIFICATION
                    </div>
                    <div style="font-size: 18px; font-weight: bold; color: #FFFFFF; margin-top: 4px; letter-spacing: 0.5px;">
                      PRANJAL GIRI — SYSTEMS CONSOLE
                    </div>
                  </td>
                  <td align="right" valign="top">
                    <span style="font-family: 'Courier New', Courier, monospace; font-size: 10px; color: #D96C32; border: 1px solid #2A363D; padding: 3px 8px; text-transform: uppercase;">
                      NEW-OPERATOR
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding: 20px 30px 0 30px;">
              <div style="background-color: #141B1F; border-left: 2px solid #6C7A72; padding: 12px 16px;">
                <span style="font-family: 'Courier New', Courier, monospace; font-size: 11px; color: #8A9A90; font-weight: bold;">REGISTERED ID:</span>
                <span style="font-family: 'Courier New', Courier, monospace; font-size: 12px; color: #FFFFFF; margin-left: 6px;">{{ .Email }}</span>
              </div>
            </td>
          </tr>
          <tr>
            <td style="padding: 24px 30px 20px 30px;">
              <h2 style="font-size: 18px; font-weight: 600; color: #FFFFFF; margin: 0 0 12px 0;">
                Verify Your Account Credentials
              </h2>
              <p style="font-size: 14px; line-height: 1.6; color: #A4B3BC; margin: 0 0 20px 0;">
                Welcome to the Engineering Systems Console. To activate your operator profile, enable project telemetry bookmarking, and participate in discussion threads, please confirm your transmission address:
              </p>
              <div style="text-align: center; margin: 28px 0;">
                <a href="{{ .ConfirmationURL }}" style="display: inline-block; background-color: #D96C32; color: #FFFFFF; font-family: 'Courier New', Courier, monospace; font-size: 13px; font-weight: bold; text-decoration: none; padding: 14px 32px; letter-spacing: 1.5px; text-transform: uppercase;">
                  VERIFY & ACCESS CONSOLE →
                </a>
              </div>
              <div style="background-color: #141B1F; border: 1px solid #242F35; padding: 12px 14px; margin-top: 24px;">
                <div style="font-family: 'Courier New', Courier, monospace; font-size: 10px; color: #6C7A72; letter-spacing: 1px; margin-bottom: 4px;">
                  MANUAL ACTIVATION LINK:
                </div>
                <div style="font-family: 'Courier New', Courier, monospace; font-size: 11px; color: #8A9A90; word-break: break-all; line-height: 1.4;">
                  {{ .ConfirmationURL }}
                </div>
              </div>
            </td>
          </tr>
          <tr>
            <td style="padding: 18px 30px; background-color: #141B1F; border-top: 1px solid #242F35;">
              <table width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td>
                    <div style="font-family: 'Courier New', Courier, monospace; font-size: 10px; color: #526068;">
                      PRANJAL GIRI · VIT CHENNAI · FLIGHT SOFTWARE & ROBOTICS
                    </div>
                  </td>
                  <td align="right" valign="middle">
                    <span style="font-family: 'Courier New', Courier, monospace; font-size: 10px; color: #6C7A72;">SYS: ONLINE</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}

export function supabaseMagicLinkEmailHtml() {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Direct Access Link // Pranjal Giri Console</title>
</head>
<body style="margin: 0; padding: 0; background-color: #12181B; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #E9E6DD; -webkit-font-smoothing: antialiased;">
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
                      DIRECT ACCESS // PASSWORDLESS AUTH
                    </div>
                    <div style="font-size: 18px; font-weight: bold; color: #FFFFFF; margin-top: 4px; letter-spacing: 0.5px;">
                      PRANJAL GIRI — SYSTEMS CONSOLE
                    </div>
                  </td>
                  <td align="right" valign="top">
                    <span style="font-family: 'Courier New', Courier, monospace; font-size: 10px; color: #6C7A72; border: 1px solid #2A363D; padding: 3px 8px; text-transform: uppercase;">
                      MAGIC-LINK
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding: 20px 30px 0 30px;">
              <div style="background-color: #141B1F; border-left: 2px solid #D96C32; padding: 12px 16px;">
                <span style="font-family: 'Courier New', Courier, monospace; font-size: 11px; color: #D96C32; font-weight: bold;">DESTINATION:</span>
                <span style="font-family: 'Courier New', Courier, monospace; font-size: 12px; color: #FFFFFF; margin-left: 6px;">{{ .Email }}</span>
              </div>
            </td>
          </tr>
          <tr>
            <td style="padding: 24px 30px 20px 30px;">
              <h2 style="font-size: 18px; font-weight: 600; color: #FFFFFF; margin: 0 0 12px 0;">
                One-Time Login Handshake
              </h2>
              <p style="font-size: 14px; line-height: 1.6; color: #A4B3BC; margin: 0 0 20px 0;">
                Click below to complete a secure passwordless sign-in to the Engineering Systems Console:
              </p>
              <div style="text-align: center; margin: 28px 0;">
                <a href="{{ .ConfirmationURL }}" style="display: inline-block; background-color: #D96C32; color: #FFFFFF; font-family: 'Courier New', Courier, monospace; font-size: 13px; font-weight: bold; text-decoration: none; padding: 14px 32px; letter-spacing: 1.5px; text-transform: uppercase;">
                  ENTER CONSOLE NOW →
                </a>
              </div>
              <div style="background-color: #141B1F; border: 1px solid #242F35; padding: 12px 14px; margin-top: 24px;">
                <div style="font-family: 'Courier New', Courier, monospace; font-size: 10px; color: #6C7A72; letter-spacing: 1px; margin-bottom: 4px;">
                  MANUAL URL:
                </div>
                <div style="font-family: 'Courier New', Courier, monospace; font-size: 11px; color: #8A9A90; word-break: break-all; line-height: 1.4;">
                  {{ .ConfirmationURL }}
                </div>
              </div>
              <p style="font-size: 12px; line-height: 1.5; color: #6C7A72; margin: 24px 0 0 0;">
                ● This link can only be used once and expires shortly.<br>
                ● If you did not request this link, no action is required.
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding: 18px 30px; background-color: #141B1F; border-top: 1px solid #242F35;">
              <table width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td>
                    <div style="font-family: 'Courier New', Courier, monospace; font-size: 10px; color: #526068;">
                      PRANJAL GIRI · VIT CHENNAI · FLIGHT SOFTWARE & ROBOTICS
                    </div>
                  </td>
                  <td align="right" valign="middle">
                    <span style="font-family: 'Courier New', Courier, monospace; font-size: 10px; color: #6C7A72;">AUTH: READY</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}

export function supabaseChangeEmailEmailHtml() {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Confirm Transmission Address Change // Pranjal Giri Console</title>
</head>
<body style="margin: 0; padding: 0; background-color: #12181B; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #E9E6DD; -webkit-font-smoothing: antialiased;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #12181B; padding: 40px 15px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width: 580px; background-color: #1A2226; border: 1px solid #2A363D; border-top: 3px solid #D8A629; padding: 0;">
          <tr>
            <td style="padding: 24px 30px; border-bottom: 1px solid #242F35;">
              <table width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td>
                    <div style="font-family: 'Courier New', Courier, monospace; font-size: 10px; color: #D8A629; letter-spacing: 2px; text-transform: uppercase;">
                      COMMUNICATIONS PROTOCOL // ADDRESS UPDATE
                    </div>
                    <div style="font-size: 18px; font-weight: bold; color: #FFFFFF; margin-top: 4px; letter-spacing: 0.5px;">
                      PRANJAL GIRI — SYSTEMS CONSOLE
                    </div>
                  </td>
                  <td align="right" valign="top">
                    <span style="font-family: 'Courier New', Courier, monospace; font-size: 10px; color: #D8A629; border: 1px solid #2A363D; padding: 3px 8px; text-transform: uppercase;">
                      EMAIL-UPDATE
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding: 24px 30px 20px 30px;">
              <h2 style="font-size: 18px; font-weight: 600; color: #FFFFFF; margin: 0 0 12px 0;">
                Confirm Transmission Address Update
              </h2>
              <p style="font-size: 14px; line-height: 1.6; color: #A4B3BC; margin: 0 0 20px 0;">
                A request has been initiated to reassign the primary transmission address associated with your operator profile. Please confirm this change by authenticating below:
              </p>
              <div style="text-align: center; margin: 28px 0;">
                <a href="{{ .ConfirmationURL }}" style="display: inline-block; background-color: #D8A629; color: #12181B; font-family: 'Courier New', Courier, monospace; font-size: 13px; font-weight: bold; text-decoration: none; padding: 14px 32px; letter-spacing: 1.5px; text-transform: uppercase;">
                  CONFIRM NEW ADDRESS →
                </a>
              </div>
              <div style="background-color: #141B1F; border: 1px solid #242F35; padding: 12px 14px; margin-top: 24px;">
                <div style="font-family: 'Courier New', Courier, monospace; font-size: 10px; color: #6C7A72; letter-spacing: 1px; margin-bottom: 4px;">
                  MANUAL CONFIRMATION LINK:
                </div>
                <div style="font-family: 'Courier New', Courier, monospace; font-size: 11px; color: #8A9A90; word-break: break-all; line-height: 1.4;">
                  {{ .ConfirmationURL }}
                </div>
              </div>
            </td>
          </tr>
          <tr>
            <td style="padding: 18px 30px; background-color: #141B1F; border-top: 1px solid #242F35;">
              <table width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td>
                    <div style="font-family: 'Courier New', Courier, monospace; font-size: 10px; color: #526068;">
                      PRANJAL GIRI · VIT CHENNAI · FLIGHT SOFTWARE & ROBOTICS
                    </div>
                  </td>
                  <td align="right" valign="middle">
                    <span style="font-family: 'Courier New', Courier, monospace; font-size: 10px; color: #6C7A72;">SYS: PROTECTED</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}

export function supabaseInviteUserEmailHtml() {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Operator Invitation // Pranjal Giri Console</title>
</head>
<body style="margin: 0; padding: 0; background-color: #12181B; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #E9E6DD; -webkit-font-smoothing: antialiased;">
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
                      OPERATOR INVITATION // ACCESS GRANTED
                    </div>
                    <div style="font-size: 18px; font-weight: bold; color: #FFFFFF; margin-top: 4px; letter-spacing: 0.5px;">
                      PRANJAL GIRI — SYSTEMS CONSOLE
                    </div>
                  </td>
                  <td align="right" valign="top">
                    <span style="font-family: 'Courier New', Courier, monospace; font-size: 10px; color: #D96C32; border: 1px solid #2A363D; padding: 3px 8px; text-transform: uppercase;">
                      INVITE
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding: 24px 30px 20px 30px;">
              <h2 style="font-size: 18px; font-weight: 600; color: #FFFFFF; margin: 0 0 12px 0;">
                You Have Been Invited
              </h2>
              <p style="font-size: 14px; line-height: 1.6; color: #A4B3BC; margin: 0 0 20px 0;">
                You have received an authorization invitation to join the Pranjal Giri Engineering Systems Console as an operator. Click below to accept the invitation and set up your security credentials:
              </p>
              <div style="text-align: center; margin: 28px 0;">
                <a href="{{ .ConfirmationURL }}" style="display: inline-block; background-color: #D96C32; color: #FFFFFF; font-family: 'Courier New', Courier, monospace; font-size: 13px; font-weight: bold; text-decoration: none; padding: 14px 32px; letter-spacing: 1.5px; text-transform: uppercase;">
                  ACCEPT INVITATION & INITIALIZE →
                </a>
              </div>
              <div style="background-color: #141B1F; border: 1px solid #242F35; padding: 12px 14px; margin-top: 24px;">
                <div style="font-family: 'Courier New', Courier, monospace; font-size: 10px; color: #6C7A72; letter-spacing: 1px; margin-bottom: 4px;">
                  MANUAL INVITATION LINK:
                </div>
                <div style="font-family: 'Courier New', Courier, monospace; font-size: 11px; color: #8A9A90; word-break: break-all; line-height: 1.4;">
                  {{ .ConfirmationURL }}
                </div>
              </div>
            </td>
          </tr>
          <tr>
            <td style="padding: 18px 30px; background-color: #141B1F; border-top: 1px solid #242F35;">
              <table width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td>
                    <div style="font-family: 'Courier New', Courier, monospace; font-size: 10px; color: #526068;">
                      PRANJAL GIRI · VIT CHENNAI · FLIGHT SOFTWARE & ROBOTICS
                    </div>
                  </td>
                  <td align="right" valign="middle">
                    <span style="font-family: 'Courier New', Courier, monospace; font-size: 10px; color: #6C7A72;">INVITE VALID 24H</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}

export const SUPABASE_AUTH_TEMPLATES = [
  {
    id: 'supabase_reset_password',
    name: 'Reset Password',
    supabaseTab: 'Authentication > Email Templates > Reset password',
    subject: '[SECURITY PROTOCOL] Reset Your Password // Pranjal Giri Console',
    description: 'Sent when an operator clicks Forgot Password on the login page or triggers a password recovery.',
    getHtml: supabaseResetPasswordEmailHtml,
  },
  {
    id: 'supabase_confirm_signup',
    name: 'Confirm Signup',
    supabaseTab: 'Authentication > Email Templates > Confirm signup',
    subject: '[OPERATOR VERIFICATION] Confirm Your Account // Pranjal Giri Console',
    description: 'Sent when a new user signs up with email/password to verify their address.',
    getHtml: supabaseConfirmSignupEmailHtml,
  },
  {
    id: 'supabase_magic_link',
    name: 'Magic Link',
    supabaseTab: 'Authentication > Email Templates > Magic Link',
    subject: '[DIRECT ACCESS] One-Time Login Link // Pranjal Giri Console',
    description: 'Sent when a user requests passwordless authentication.',
    getHtml: supabaseMagicLinkEmailHtml,
  },
  {
    id: 'supabase_change_email',
    name: 'Change Email Address',
    supabaseTab: 'Authentication > Email Templates > Change email address',
    subject: '[ACCOUNT MODIFICATION] Confirm New Address // Pranjal Giri Console',
    description: 'Sent when an operator updates their transmission address in Profile settings.',
    getHtml: supabaseChangeEmailEmailHtml,
  },
  {
    id: 'supabase_invite_user',
    name: 'Invite User',
    supabaseTab: 'Authentication > Email Templates > Invite user',
    subject: '[OPERATOR INVITATION] Access Engineering Systems Console',
    description: 'Sent when an admin invites a new user or operator to the platform.',
    getHtml: supabaseInviteUserEmailHtml,
  },
]
