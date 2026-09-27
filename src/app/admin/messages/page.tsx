'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/lib/supabase'
import type { ContactMessage } from '@/types'
import { formatDate } from '@/lib/utils'
import { REPLY_TEMPLATES } from '@/lib/email-templates'

export default function AdminMessagesPage() {
  const { isAdmin, loading } = useAuth()
  const router = useRouter()
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [fetching, setFetching] = useState(true)
  const [selectedMsg, setSelectedMsg] = useState<ContactMessage | null>(null)

  // Reply Portal state
  const [selectedTemplate, setSelectedTemplate] = useState(REPLY_TEMPLATES[0].id)
  const [replySubject, setReplySubject] = useState('')
  const [replyBody, setReplyBody] = useState('')
  const [sendingReply, setSendingReply] = useState(false)
  const [replyResult, setReplyResult] = useState<{ success?: boolean; id?: string; error?: string } | null>(null)
  const [showPreview, setShowPreview] = useState(false)

  useEffect(() => {
    if (!loading && !isAdmin) router.push('/')
  }, [isAdmin, loading, router])

  const fetchMessages = async () => {
    setFetching(true)
    const { data } = await supabase
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false })
    if (data) setMessages(data)
    setFetching(false)
  }

  useEffect(() => {
    if (isAdmin) fetchMessages()
  }, [isAdmin])

  // Sync template values when selected message changes
  useEffect(() => {
    if (selectedMsg) {
      const template = REPLY_TEMPLATES.find(t => t.id === selectedTemplate) || REPLY_TEMPLATES[0]
      setReplySubject(`Re: ${selectedMsg.subject} // Pranjal Giri`)
      setReplyBody(template.defaultMessage)
      setReplyResult(null)
    }
  }, [selectedMsg, selectedTemplate])

  const handleTemplateChange = (templateId: string) => {
    setSelectedTemplate(templateId)
    const template = REPLY_TEMPLATES.find(t => t.id === templateId) || REPLY_TEMPLATES[0]
    setReplyBody(template.defaultMessage)
  }

  const handleSendReply = async () => {
    if (!selectedMsg || !replyBody.trim()) return

    setSendingReply(true)
    setReplyResult(null)

    try {
      const res = await fetch('/api/admin/reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: selectedMsg.email,
          recipientName: selectedMsg.name,
          subject: replySubject,
          templateId: selectedTemplate,
          replyMessage: replyBody,
          msgId: selectedMsg.msg_id,
          messageRecordId: selectedMsg.id,
        }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to dispatch email')

      setReplyResult({ success: true, id: data.id })
      setMessages(prev => prev.map(m => m.id === selectedMsg.id ? { ...m, replied: true, read: true } : m))
      setSelectedMsg(prev => prev ? { ...prev, replied: true, read: true } : null)
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown transmission error'
      setReplyResult({ error: errorMsg })
    } finally {
      setSendingReply(false)
    }
  }

  const toggleRead = async (msg: ContactMessage) => {
    const nextRead = !msg.read
    const { error } = await supabase
      .from('contact_messages')
      .update({ read: nextRead })
      .eq('id', msg.id)
    if (!error) {
      setMessages(prev => prev.map(m => m.id === msg.id ? { ...m, read: nextRead } : m))
      if (selectedMsg?.id === msg.id) {
        setSelectedMsg(prev => prev ? { ...prev, read: nextRead } : null)
      }
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this message transmission?')) return
    const { error } = await supabase.from('contact_messages').delete().eq('id', id)
    if (!error) {
      setMessages(prev => prev.filter(m => m.id !== id))
      if (selectedMsg?.id === id) setSelectedMsg(null)
    }
  }

  if (loading) return null

  return (
    <div className="min-h-screen bg-graphite text-paper pt-20 pb-16">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="font-mono text-2xs text-orange-DEFAULT tracking-widest mb-1">
              INCOMING TRANSMISSIONS & RESEND DISPATCH PORTAL
            </div>
            <h1 className="font-display font-bold text-3xl text-paper">CONTACT & MESSAGES</h1>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/admin"
              className="font-mono text-2xs text-steel hover:text-paper border border-paper/10 px-3 py-2 transition-colors"
            >
              ← ADMIN CONSOLE
            </Link>
            <Link
              href="/admin/templates"
              className="font-mono text-2xs text-orange-DEFAULT hover:text-paper border border-orange-DEFAULT/30 px-3 py-2 transition-colors"
            >
              VIEW EMAIL TEMPLATES ↗
            </Link>
          </div>
        </div>

        {fetching ? (
          <div className="border border-paper/10 p-12 text-center font-mono text-xs text-steel animate-pulse">
            SCANNING TRANSMISSION FREQUENCIES...
          </div>
        ) : messages.length === 0 ? (
          <div className="border border-paper/10 p-12 text-center font-mono text-xs text-steel">
            NO TRANSMISSIONS RECEIVED YET
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Feed List (4 cols) */}
            <div className="lg:col-span-4 border border-paper/10 divide-y divide-paper/10 max-h-[820px] overflow-y-auto">
              <div className="p-3 bg-paper/5 border-b border-paper/10 font-mono text-2xs text-paper/60 tracking-wider">
                TRANSMISSION FEED ({messages.length})
              </div>
              {messages.map(msg => (
                <div
                  key={msg.id}
                  onClick={() => setSelectedMsg(msg)}
                  className={`p-4 cursor-pointer transition-colors ${
                    selectedMsg?.id === msg.id
                      ? 'bg-paper/10 border-l-2 border-orange-DEFAULT'
                      : !msg.read
                      ? 'bg-orange/5 hover:bg-paper/5'
                      : 'hover:bg-paper/5 opacity-85'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="font-sans font-semibold text-xs text-paper truncate">{msg.name}</span>
                    <span className="font-mono text-2xs text-steel flex-shrink-0">{formatDate(msg.created_at)}</span>
                  </div>
                  <div className="font-mono text-xs text-paper/80 truncate mb-2">{msg.subject}</div>
                  <div className="flex items-center justify-between text-2xs">
                    <span className="font-mono text-orange-DEFAULT">{msg.msg_id}</span>
                    <div className="flex items-center gap-1.5">
                      {msg.replied && (
                        <span className="font-mono text-2xs text-sage border border-sage/30 px-1 py-0.5">
                          ✓ REPLIED
                        </span>
                      )}
                      {!msg.read && (
                        <span className="font-mono text-2xs text-yellow-DEFAULT border border-yellow-DEFAULT/30 px-1 py-0.5">
                          ● NEW
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Message Detail & Reply Console (8 cols) */}
            <div className="lg:col-span-8 space-y-6">
              {selectedMsg ? (
                <>
                  {/* Incoming Payload Card */}
                  <div className="border border-paper/10 p-6 bg-paper/[0.02]">
                    <div className="flex items-start justify-between border-b border-paper/10 pb-4 mb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-mono text-2xs text-orange-DEFAULT tracking-widest">{selectedMsg.msg_id}</span>
                          {selectedMsg.replied && (
                            <span className="font-mono text-2xs text-sage border border-sage/30 px-1.5 py-0.2">
                              ✓ REPLIED VIA RESEND
                            </span>
                          )}
                        </div>
                        <h2 className="font-display font-bold text-2xl text-paper">{selectedMsg.subject}</h2>
                        <div className="font-mono text-xs text-steel mt-1">
                          FROM: <span className="text-paper">{selectedMsg.name}</span> &lt;
                          <a href={`mailto:${selectedMsg.email}`} className="text-orange-DEFAULT underline">{selectedMsg.email}</a>&gt;
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => toggleRead(selectedMsg)}
                          className="font-mono text-2xs border border-paper/20 px-3 py-1 hover:border-orange/50 transition-colors"
                        >
                          {selectedMsg.read ? 'MARK UNREAD' : 'MARK READ'}
                        </button>
                        <button
                          onClick={() => handleDelete(selectedMsg.id)}
                          className="font-mono text-2xs border border-red-500/20 text-red-400 px-3 py-1 hover:bg-red-500/10 transition-colors"
                        >
                          DELETE
                        </button>
                      </div>
                    </div>

                    <div>
                      <div className="font-mono text-2xs text-steel/60 tracking-widest mb-2">ORIGINAL TRANSMISSION:</div>
                      <div className="font-sans text-sm text-paper/90 whitespace-pre-wrap leading-relaxed p-4 bg-paper/5 border border-paper/10">
                        {selectedMsg.message}
                      </div>
                    </div>
                  </div>

                  {/* Resend Reply Dispatch Portal */}
                  <div className="border border-orange-DEFAULT/30 p-6 bg-paper/[0.03] relative">
                    <span className="absolute top-1 left-1 w-3 h-3 border-t border-l border-orange-DEFAULT" />
                    <span className="absolute bottom-1 right-1 w-3 h-3 border-b border-r border-orange-DEFAULT" />

                    <div className="flex items-center justify-between mb-4 pb-3 border-b border-paper/10">
                      <div>
                        <div className="font-mono text-2xs text-orange-DEFAULT tracking-widest">
                          RESEND DISPATCH PORTAL // OUTBOUND
                        </div>
                        <h3 className="font-display font-bold text-xl text-paper">
                          DISPATCH REPLY TO {selectedMsg.name.toUpperCase()}
                        </h3>
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowPreview(!showPreview)}
                        className="font-mono text-2xs border border-paper/20 px-3 py-1 hover:border-orange/50 transition-colors"
                      >
                        {showPreview ? 'EDIT TEXT' : 'PREVIEW EMAIL'}
                      </button>
                    </div>

                    {replyResult?.success && (
                      <div className="mb-4 p-4 border border-sage/40 bg-sage/10 font-mono text-xs text-sage">
                        [CONFIRMED] Transmission delivered via Resend. Message ID: {replyResult.id}
                      </div>
                    )}

                    {replyResult?.error && (
                      <div className="mb-4 p-4 border border-red-500/40 bg-red-500/10 font-mono text-xs text-red-400">
                        [ERROR] {replyResult.error}
                      </div>
                    )}

                    {showPreview ? (
                      /* Live Preview */
                      <div className="border border-paper/20 p-6 bg-[#12181B] rounded space-y-4">
                        <div className="font-mono text-2xs text-steel tracking-widest border-b border-paper/10 pb-2">
                          PREVIEW: {replySubject}
                        </div>
                        <div className="border-l-2 border-orange-DEFAULT pl-4 py-1 font-sans text-sm text-paper whitespace-pre-wrap leading-relaxed">
                          {replyBody}
                        </div>
                        <div className="font-mono text-2xs text-steel/60 pt-4 border-t border-paper/10">
                          Template Frame: Industrial Aerospace (from: onboarding@resend.dev)
                        </div>
                      </div>
                    ) : (
                      /* Form */
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block font-mono text-2xs text-orange-DEFAULT tracking-widest mb-1">
                              EMAIL TEMPLATE FORMAT
                            </label>
                            <select
                              value={selectedTemplate}
                              onChange={e => handleTemplateChange(e.target.value)}
                              className="w-full bg-graphite border border-paper/20 px-3 py-2 font-mono text-xs text-paper focus:border-orange-DEFAULT outline-none"
                            >
                              {REPLY_TEMPLATES.map(t => (
                                <option key={t.id} value={t.id}>
                                  {t.name}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <label className="block font-mono text-2xs text-orange-DEFAULT tracking-widest mb-1">
                              RECIPIENT DESTINATION
                            </label>
                            <input
                              type="text"
                              value={`${selectedMsg.name} <${selectedMsg.email}>`}
                              disabled
                              className="w-full bg-paper/5 border border-paper/10 px-3 py-2 font-mono text-xs text-paper/70 outline-none cursor-not-allowed"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block font-mono text-2xs text-orange-DEFAULT tracking-widest mb-1">
                            TRANSMISSION SUBJECT
                          </label>
                          <input
                            type="text"
                            value={replySubject}
                            onChange={e => setReplySubject(e.target.value)}
                            className="w-full bg-paper/5 border border-paper/20 px-3 py-2 font-mono text-xs text-paper focus:border-orange-DEFAULT outline-none"
                          />
                        </div>

                        <div>
                          <label className="block font-mono text-2xs text-orange-DEFAULT tracking-widest mb-1">
                            MESSAGE BODY (CUSTOMIZE FREELY)
                          </label>
                          <textarea
                            value={replyBody}
                            onChange={e => setReplyBody(e.target.value)}
                            rows={6}
                            className="w-full bg-paper/5 border border-paper/20 p-3 font-mono text-xs text-paper focus:border-orange-DEFAULT outline-none leading-relaxed"
                          />
                        </div>

                        <div className="pt-2 flex items-center justify-between">
                          <span className="font-mono text-2xs text-steel">
                            Dispatched from: <code className="text-orange-DEFAULT">onboarding@resend.dev</code>
                          </span>
                          <button
                            type="button"
                            onClick={handleSendReply}
                            disabled={sendingReply || !replyBody.trim()}
                            className="bg-orange-DEFAULT hover:bg-orange-dark text-paper font-mono text-xs tracking-widest px-6 py-2.5 transition-colors disabled:opacity-50 flex items-center gap-2"
                          >
                            <span>{sendingReply ? 'TRANSMITTING VIA RESEND...' : 'DISPATCH VIA RESEND'}</span>
                            <span>→</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="h-96 border border-paper/10 flex flex-col items-center justify-center p-8 text-center bg-paper/[0.01]">
                  <div className="w-8 h-8 border border-orange-DEFAULT/40 rotate-45 flex items-center justify-center mb-4">
                    <div className="w-2 h-2 bg-orange-DEFAULT rotate-45" />
                  </div>
                  <div className="font-mono text-xs text-paper mb-1">COMMUNICATIONS CONSOLE READY</div>
                  <div className="font-mono text-2xs text-steel max-w-sm">
                    Select any inbound transmission on the left to inspect its payload, review details, and send an aerospace reply via Resend.
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
