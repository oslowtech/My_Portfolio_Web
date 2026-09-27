'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'
import {
  contactNotificationEmailHtml,
  contactReceiptEmailHtml,
  operatorDirectReplyEmailHtml,
  collaborationReplyEmailHtml,
  meetingInviteReplyEmailHtml,
  supabaseResetPasswordEmailHtml,
  supabaseConfirmSignupEmailHtml,
  supabaseMagicLinkEmailHtml,
} from '@/lib/email-templates'

interface TemplateItem {
  id: string
  title: string
  category: string
  description: string
  supabaseTab?: string
  subject?: string
  getHtml: () => string
}

const SUPABASE_TEMPLATES: TemplateItem[] = [
  {
    id: 'supabase_reset_password',
    title: 'Reset Password',
    category: 'AUTH // PASSWORD RECOVERY',
    supabaseTab: 'Authentication > Email Templates > Reset password',
    subject: '[SECURITY PROTOCOL] Reset Your Password // Pranjal Giri Console',
    description: 'Sent by Supabase when an operator clicks Forgot Password or requests a credential reset.',
    getHtml: supabaseResetPasswordEmailHtml,
  },
  {
    id: 'supabase_confirm_signup',
    title: 'Confirm Signup',
    category: 'AUTH // ACCOUNT VERIFICATION',
    supabaseTab: 'Authentication > Email Templates > Confirm signup',
    subject: '[OPERATOR VERIFICATION] Confirm Your Account // Pranjal Giri Console',
    description: 'Sent by Supabase when a new operator registers with email/password.',
    getHtml: supabaseConfirmSignupEmailHtml,
  },
  {
    id: 'supabase_magic_link',
    title: 'Magic Link',
    category: 'AUTH // DIRECT ACCESS',
    supabaseTab: 'Authentication > Email Templates > Magic Link',
    subject: '[DIRECT ACCESS] One-Time Login Link // Pranjal Giri Console',
    description: 'Sent by Supabase when an operator requests passwordless one-time login.',
    getHtml: supabaseMagicLinkEmailHtml,
  },
]

const RESEND_TEMPLATES: TemplateItem[] = [
  {
    id: 'contact_notification',
    title: 'Inbound Contact Transmission',
    category: 'ALERTS // INTERNAL',
    description: 'Email sent automatically to Pranjal whenever a visitor submits the contact form or initiates a chat.',
    getHtml: () =>
      contactNotificationEmailHtml({
        name: 'Dr. Sarah Connor',
        email: 'sarah.connor@aerotech.org',
        subject: 'Avionics Firmware Collaboration & Test Data',
        message: 'Hello Pranjal, We saw your SRAD flight computer work and would love to discuss test telemetry and sensor fusion.',
        msgId: 'MSG-ID: #PG-10492',
      }),
  },
  {
    id: 'contact_receipt',
    title: 'Visitor Transmission Receipt',
    category: 'CONFIRMATION // EXTERNAL',
    description: 'Automated receipt sent to the visitor confirming that their message was logged into the systems console.',
    getHtml: () =>
      contactReceiptEmailHtml({
        name: 'Sarah Connor',
        msgId: 'MSG-ID: #PG-10492',
      }),
  },
  {
    id: 'operator_reply',
    title: 'Direct Operator Reply',
    category: 'OUTBOUND // PERSONAL',
    description: 'General reply template from Pranjal with signature, VIT affiliation, and console links.',
    getHtml: () =>
      operatorDirectReplyEmailHtml({
        recipientName: 'Sarah',
        replyMessage: 'Thank you for reviewing our avionics architecture. We are currently testing the 100Hz telemetry loop on the bench and would be excited to share data.',
        msgId: '#PG-10492',
      }),
  },
  {
    id: 'collaboration',
    title: 'Aerospace & Robotics Collaboration',
    category: 'OUTBOUND // TECHNICAL',
    description: 'Structured response for discussing rocketry, UGV, or AI projects with a call-to-action to inspect systems.',
    getHtml: () =>
      collaborationReplyEmailHtml({
        recipientName: 'Research Team',
        replyMessage: 'Our rocketry team is preparing for the next flight campaign. We have integrated BMP390, MPU6050, and LoRa downlink into our latest flight computer.',
        msgId: '#PG-COLLAB-88',
      }),
  },
  {
    id: 'meeting_invite',
    title: 'Technical Coordination / Meeting',
    category: 'SCHEDULING // MEET',
    description: 'Call scheduling template with action link to coordinate timing.',
    getHtml: () =>
      meetingInviteReplyEmailHtml({
        recipientName: 'Sarah',
        replyMessage: 'I would be happy to jump on a quick 15-minute call to demonstrate our real-time telemetry dashboard and answer any questions.',
        msgId: '#PG-MEET-12',
        calendarLink: 'https://meet.google.com',
      }),
  },
]

export default function EmailTemplatesPage() {
  const { isAdmin, loading } = useAuth()
  const router = useRouter()

  const [activeTab, setActiveTab] = useState<'supabase' | 'resend'>('supabase')
  const [selectedSupabaseId, setSelectedSupabaseId] = useState(SUPABASE_TEMPLATES[0].id)
  const [selectedResendId, setSelectedResendId] = useState(RESEND_TEMPLATES[0].id)
  const [copied, setCopied] = useState(false)
  const [testSending, setTestSending] = useState(false)
  const [testResult, setTestResult] = useState<string | null>(null)

  useEffect(() => {
    if (!loading && !isAdmin) router.push('/')
  }, [isAdmin, loading, router])

  const selectedSupabaseTemplate =
    SUPABASE_TEMPLATES.find(t => t.id === selectedSupabaseId) || SUPABASE_TEMPLATES[0]
  const selectedResendTemplate =
    RESEND_TEMPLATES.find(t => t.id === selectedResendId) || RESEND_TEMPLATES[0]

  const currentTemplate: TemplateItem =
    activeTab === 'supabase' ? selectedSupabaseTemplate : selectedResendTemplate
  const currentHtml = currentTemplate.getHtml()

  // For visual rendering in iframe, replace Go template syntax with readable dummy values
  const previewHtml = currentHtml
    .replace(/\{\{\s*\.ConfirmationURL\s*\}\}/g, 'https://pranjalgiri.com/update-password?token=sample_verification_code')
    .replace(/\{\{\s*\.Email\s*\}\}/g, 'operator@domain.com')
    .replace(/\{\{\s*\.SiteURL\s*\}\}/g, 'https://pranjalgiri.com')

  const handleCopy = () => {
    navigator.clipboard.writeText(currentHtml)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleSendTest = async () => {
    setTestSending(true)
    setTestResult(null)
    try {
      const res = await fetch('/api/admin/reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: 'pranjal.giri2024@vitstudent.ac.in',
          recipientName: 'Pranjal Giri (Test)',
          subject: `[TEMPLATE TEST] ${currentTemplate.title}`,
          templateId: currentTemplate.id,
          replyMessage: 'This is an automated test transmission from your Engineering Systems Console.',
          msgId: 'MSG-ID: #PG-TEST',
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Test send failed')
      setTestResult(`Test email dispatched successfully via Resend! ID: ${data.id}`)
    } catch (err: unknown) {
      setTestResult(`Error: ${err instanceof Error ? err.message : 'Unknown'}`)
    } finally {
      setTestSending(false)
    }
  }

  if (loading) return null

  return (
    <div className="min-h-screen bg-graphite text-paper pt-20 pb-16">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="font-mono text-2xs text-orange-DEFAULT tracking-widest mb-1">
              AEROSPACE COMMUNICATIONS SUITE
            </div>
            <h1 className="font-display font-bold text-3xl text-paper">EMAIL TEMPLATES PORTAL</h1>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/admin/messages"
              className="font-mono text-2xs text-steel hover:text-paper border border-paper/10 px-3 py-2 transition-colors"
            >
              ← MESSAGES PORTAL
            </Link>
            <Link
              href="/admin"
              className="font-mono text-2xs text-steel hover:text-paper border border-paper/10 px-3 py-2 transition-colors"
            >
              ADMIN CONSOLE
            </Link>
          </div>
        </div>

        {/* Tab Switching Bar */}
        <div className="flex border-b border-paper/15 mb-8">
          <button
            onClick={() => { setActiveTab('supabase'); setTestResult(null) }}
            className={`font-mono text-xs tracking-wider px-6 py-3 border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'supabase'
                ? 'border-orange-DEFAULT text-orange-DEFAULT bg-orange-DEFAULT/5'
                : 'border-transparent text-steel hover:text-paper'
            }`}
          >
            <span>SUPABASE AUTH TEMPLATES</span>
            <span className="text-2xs bg-paper/10 px-1.5 py-0.5 rounded text-paper/70">DASHBOARD</span>
          </button>
          <button
            onClick={() => { setActiveTab('resend'); setTestResult(null) }}
            className={`font-mono text-xs tracking-wider px-6 py-3 border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'resend'
                ? 'border-orange-DEFAULT text-orange-DEFAULT bg-orange-DEFAULT/5'
                : 'border-transparent text-steel hover:text-paper'
            }`}
          >
            <span>RESEND OUTBOUND TEMPLATES</span>
            <span className="text-2xs bg-paper/10 px-1.5 py-0.5 rounded text-paper/70">REPLIES</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Template Selector List (4 cols) */}
          <div className="lg:col-span-4 space-y-3">
            <div className="font-mono text-2xs text-steel tracking-widest mb-2">
              {activeTab === 'supabase'
                ? `SUPABASE AUTH FORMATS (${SUPABASE_TEMPLATES.length})`
                : `RESEND DISPATCH FORMATS (${RESEND_TEMPLATES.length})`}
            </div>

            {activeTab === 'supabase' ? (
              SUPABASE_TEMPLATES.map(t => (
                <div
                  key={t.id}
                  onClick={() => { setSelectedSupabaseId(t.id); setTestResult(null) }}
                  className={`p-4 border cursor-pointer transition-colors ${
                    selectedSupabaseId === t.id
                      ? 'border-orange-DEFAULT bg-orange-DEFAULT/10'
                      : 'border-paper/10 hover:border-paper/30 bg-paper/[0.02]'
                  }`}
                >
                  <div className="font-mono text-2xs text-orange-DEFAULT tracking-widest mb-1">
                    {t.supabaseTab}
                  </div>
                  <div className="font-display font-bold text-base text-paper">{t.title}</div>
                  <p className="font-sans text-xs text-steel mt-1.5 leading-relaxed">{t.description}</p>
                </div>
              ))
            ) : (
              RESEND_TEMPLATES.map(t => (
                <div
                  key={t.id}
                  onClick={() => { setSelectedResendId(t.id); setTestResult(null) }}
                  className={`p-4 border cursor-pointer transition-colors ${
                    selectedResendId === t.id
                      ? 'border-orange-DEFAULT bg-orange-DEFAULT/10'
                      : 'border-paper/10 hover:border-paper/30 bg-paper/[0.02]'
                  }`}
                >
                  <div className="font-mono text-2xs text-orange-DEFAULT tracking-widest mb-1">{t.category}</div>
                  <div className="font-display font-bold text-base text-paper">{t.title}</div>
                  <p className="font-sans text-xs text-steel mt-1.5 leading-relaxed">{t.description}</p>
                </div>
              ))
            )}
          </div>

          {/* Live Preview & Actions (8 cols) */}
          <div className="lg:col-span-8 space-y-4">
            {activeTab === 'supabase' && (
              <div className="border border-paper/15 p-4 bg-paper/5 font-mono text-xs space-y-2">
                <div className="flex items-center gap-2 text-orange-DEFAULT">
                  <span>● INSTRUCTION FOR SUPABASE:</span>
                </div>
                <div className="text-paper/80 text-2xs">
                  Go to <span className="text-orange-DEFAULT font-bold">Supabase Dashboard → Authentication → Email Templates → {currentTemplate.title}</span>.
                </div>
                {currentTemplate.subject && (
                  <div className="text-paper/80 text-2xs">
                    Recommended Subject:{' '}
                    <code className="bg-graphite px-2 py-0.5 text-paper border border-paper/20">
                      {currentTemplate.subject}
                    </code>
                  </div>
                )}
              </div>
            )}

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border border-paper/10 p-4 bg-paper/[0.03]">
              <div>
                <div className="font-mono text-2xs text-orange-DEFAULT tracking-widest">
                  {activeTab === 'supabase' ? currentTemplate.supabaseTab : currentTemplate.category}
                </div>
                <div className="font-display font-bold text-lg text-paper">
                  {currentTemplate.title}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopy}
                  className="font-mono text-2xs bg-orange-DEFAULT hover:bg-orange-dark text-paper px-4 py-2 transition-colors font-bold tracking-wider"
                >
                  {copied ? '✓ COPIED TO CLIPBOARD' : activeTab === 'supabase' ? 'COPY SUPABASE HTML' : 'COPY HTML'}
                </button>
                {activeTab === 'resend' && (
                  <button
                    onClick={handleSendTest}
                    disabled={testSending}
                    className="font-mono text-2xs border border-paper/20 hover:border-orange-DEFAULT text-paper px-3 py-2 transition-colors disabled:opacity-50"
                  >
                    {testSending ? 'TRANSMITTING...' : 'SEND TEST TO VIT EMAIL'}
                  </button>
                )}
              </div>
            </div>

            {testResult && (
              <div className="p-3 border border-paper/20 bg-paper/5 font-mono text-xs text-orange-DEFAULT">
                {testResult}
              </div>
            )}

            {/* Rendered Template Frame */}
            <div className="border border-paper/10 overflow-hidden rounded bg-[#12181B]">
              <div className="p-2 border-b border-paper/10 bg-paper/5 flex items-center justify-between font-mono text-2xs text-steel">
                <span>PREVIEW RENDER (AEROSPACE HTML)</span>
                <span>{activeTab === 'supabase' ? 'SUPABASE GO-TEMPLATE SYNTAX' : 'RESEND COMPLIANT'}</span>
              </div>
              <div className="p-4 overflow-x-auto">
                <iframe
                  srcDoc={previewHtml}
                  title="Template Preview"
                  className="w-full min-h-[600px] border-0"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
