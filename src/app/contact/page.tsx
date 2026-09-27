'use client'
import Image from 'next/image'
import { useState } from 'react'
import { generateMsgId } from '@/lib/auth'



interface FormData {
  name: string
  email: string
  subject: string
  message: string
}

export default function ContactPage() {
  const [form, setForm] = useState<FormData>({ name: '', email: '', subject: '', message: '' })
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [msgId, setMsgId] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('sending')
    const id = generateMsgId()
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, msg_id: id }),
      })
      const result = await res.json()
      if (!res.ok) throw new Error(result.error || 'Submission failed')
      setMsgId(result.msgId || id)
      setStatus('sent')
    } catch {
      setStatus('error')
    }
  }

  return (
    <div className="min-h-screen bg-paper pt-20 pb-12">
      <div className="bg-engineering-grid bg-grid-40 absolute inset-0 opacity-30 pointer-events-none" />

      <div className="relative max-w-4xl mx-auto px-6 pt-12">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          {/* Left: Character + status */}
          <div className="lg:col-span-2 flex flex-col items-center lg:items-start space-y-6">
            <div className="relative">
              <Image
                src="/character/avatar.jpg"
                alt="Pranjal Giri"
                width={160}
                height={160}
                className="rounded-full w-32 h-32 object-cover border border-orange/30"
              />
              <div className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-sage border-2 border-paper" />
            </div>
            <div>
              <div className="font-display font-bold text-xl text-ink">PRANJAL GIRI</div>
              <div className="font-mono text-2xs text-orange-DEFAULT tracking-widest mt-1">AI & ROBOTICS ENGINEER</div>
            </div>
            <div className="border border-graphite/15 p-4 w-full space-y-2">
              <span className="absolute top-1 left-1 w-2 h-2 border-t border-l border-orange/40" />
              <div className="font-mono text-2xs text-steel">● Usually responds within 24h</div>
              <div className="font-mono text-2xs text-steel">● Open to internship opportunities</div>
              <div className="font-mono text-2xs text-steel">● Available for collaboration</div>
            </div>
          </div>

          {/* Right: Form */}
          <div className="lg:col-span-3">
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-2">
                <div className="h-px w-8 bg-orange-DEFAULT" />
                <span className="font-mono text-2xs tracking-widest text-orange-DEFAULT">MSG-TERMINAL</span>
              </div>
              <h1 className="font-display font-bold text-3xl text-ink">TRANSMISSION TERMINAL</h1>
              <p className="font-mono text-xs text-steel mt-2">Establish a direct communication channel</p>
            </div>

            {status === 'sent' ? (
              <div className="relative border border-sage/40 bg-sage/5 p-8 text-center space-y-4">
                <span className="absolute top-2 left-2 w-3 h-3 border-t border-l border-sage/40" />
                <span className="absolute bottom-2 right-2 w-3 h-3 border-b border-r border-sage/40" />
                <div className="font-mono text-2xs text-sage tracking-widest">TRANSMISSION STATUS</div>
                <div className="font-display font-bold text-2xl text-ink">TRANSMISSION RECEIVED</div>
                <div className="font-mono text-sm text-steel">{msgId}</div>
                <div className="flex items-center justify-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-sage animate-pulse" />
                  <span className="font-mono text-xs text-sage">STATUS: DELIVERED</span>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-mono text-2xs text-orange-DEFAULT tracking-widest mb-1">IDENTITY</label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={e => setForm(p => ({...p, name: e.target.value}))}
                      placeholder="Your name"
                      required
                      className="w-full bg-transparent border border-graphite/20 px-3 py-2.5 font-mono text-sm text-ink placeholder:text-steel/50 focus:border-orange/50 outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-2xs text-orange-DEFAULT tracking-widest mb-1">EMAIL</label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={e => setForm(p => ({...p, email: e.target.value}))}
                      placeholder="someone@email.com"
                      required
                      className="w-full bg-transparent border border-graphite/20 px-3 py-2.5 font-mono text-sm text-ink placeholder:text-steel/50 focus:border-orange/50 outline-none transition-colors"
                    />
                  </div>
                </div>
                <div>
                  <label className="block font-mono text-2xs text-orange-DEFAULT tracking-widest mb-1">SUBJECT</label>
                  <input
                    type="text"
                    value={form.subject}
                    onChange={e => setForm(p => ({...p, subject: e.target.value}))}
                    placeholder="Internship Opportunity"
                    required
                    className="w-full bg-transparent border border-graphite/20 px-3 py-2.5 font-mono text-sm text-ink placeholder:text-steel/50 focus:border-orange/50 outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block font-mono text-2xs text-orange-DEFAULT tracking-widest mb-1">MESSAGE</label>
                  <textarea
                    value={form.message}
                    onChange={e => setForm(p => ({...p, message: e.target.value}))}
                    placeholder="Write your message here..."
                    required
                    rows={6}
                    className="w-full bg-transparent border border-graphite/20 px-3 py-2.5 font-mono text-sm text-ink placeholder:text-steel/50 focus:border-orange/50 outline-none transition-colors resize-none"
                  />
                </div>
                <button
                  type="submit"
                  disabled={status === 'sending'}
                  className="group flex items-center gap-2 bg-graphite text-paper font-mono text-xs tracking-widest px-6 py-3 hover:bg-orange-DEFAULT transition-colors duration-300 disabled:opacity-50"
                >
                  {status === 'sending' ? 'TRANSMITTING...' : 'TRANSMIT MESSAGE'}
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </button>
                {status === 'error' && (
                  <p className="font-mono text-xs text-red-500">TRANSMISSION FAILED. Please try again.</p>
                )}
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
