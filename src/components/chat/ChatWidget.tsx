'use client'
import Image from 'next/image'
import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '@/hooks/useAuth'

interface ChatMessage {
  id: string
  role: 'user' | 'pranjal'
  content: string
  timestamp: string
}

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: '0',
    role: 'pranjal',
    content: "Greetings! I'm Pranjal Giri. Drop your question, collaboration inquiry, or message below. Leave your email so I can reply back directly to your inbox!",
    timestamp: new Date().toISOString(),
  },
]

export function ChatWidget() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES)
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)

  // Guest email capture state
  const [guestEmail, setGuestEmail] = useState('')
  const [guestName, setGuestName] = useState('')
  const [emailConfigured, setEmailConfigured] = useState(false)
  const [editingEmail, setEditingEmail] = useState(false)
  const [emailError, setEmailError] = useState('')

  const { user } = useAuth()
  const bottomRef = useRef<HTMLDivElement>(null)

  // Load guest info from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedEmail = localStorage.getItem('chat_guest_email')
      const savedName = localStorage.getItem('chat_guest_name')
      if (savedEmail) {
        setGuestEmail(savedEmail)
        setGuestName(savedName || '')
        setEmailConfigured(true)
      }
    }
  }, [])

  // If user is logged in, their email is automatically configured
  useEffect(() => {
    if (user?.email) {
      setGuestEmail(user.email)
      setEmailConfigured(true)
    }
  }, [user])

  useEffect(() => {
    if (open) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, open])

  const handleSaveGuestInfo = (e: React.FormEvent) => {
    e.preventDefault()
    if (!guestEmail || !guestEmail.includes('@')) {
      setEmailError('Please provide a valid transmission email.')
      return
    }
    setEmailError('')
    if (typeof window !== 'undefined') {
      localStorage.setItem('chat_guest_email', guestEmail.trim())
      localStorage.setItem('chat_guest_name', guestName.trim() || guestEmail.split('@')[0])
    }
    setEmailConfigured(true)
    setEditingEmail(false)
  }

  async function sendMessage() {
    if (!input.trim() || sending) return

    // If user is not logged in and hasn't configured an email, require email first
    if (!user && (!guestEmail || !guestEmail.includes('@') || !emailConfigured)) {
      setEditingEmail(true)
      return
    }

    const content = input.trim()
    setInput('')
    setSending(true)

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date().toISOString(),
    }
    setMessages(prev => [...prev, userMsg])

    const senderEmail = user?.email || guestEmail
    const senderName = user?.email?.split('@')[0] || guestName || guestEmail.split('@')[0] || 'Operator Guest'

    try {
      // Transmit to contact API to store in Supabase and notify Pranjal via Resend
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: senderName,
          email: senderEmail,
          subject: 'Live Console Chat Transmission',
          message: content,
        }),
      })

      const data = await res.json()
      const msgId = data.msgId || `#PG-${Math.floor(Math.random() * 90000 + 10000)}`

      // Automated acknowledgement reply
      setTimeout(() => {
        const reply: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: 'pranjal',
          content: `Transmission logged under [${msgId}]! I've received your payload and will reply back directly to ${senderEmail}.`,
          timestamp: new Date().toISOString(),
        }
        setMessages(prev => [...prev, reply])
        setSending(false)
      }, 900)
    } catch (err) {
      console.error('Chat transmission failed:', err)
      setTimeout(() => {
        const reply: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: 'pranjal',
          content: `Message received. If urgent, feel free to also reach me directly at pranjalgiri1122005@gmail.com.`,
          timestamp: new Date().toISOString(),
        }
        setMessages(prev => [...prev, reply])
        setSending(false)
      }, 900)
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="mb-4 w-88 sm:w-96 border border-graphite/20 bg-paper shadow-engineering overflow-hidden flex flex-col"
            style={{ maxHeight: '520px' }}
          >
            {/* Header */}
            <div className="bg-graphite px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative flex-shrink-0">
                  <Image
                    src="/character/avatar.jpg"
                    alt="Pranjal"
                    width={32}
                    height={32}
                    className="rounded-full w-8 h-8 object-cover border border-orange-DEFAULT/50"
                  />
                  <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-sage border border-graphite" />
                </div>
                <div>
                  <div className="font-display font-bold text-sm text-paper tracking-wide">
                    PRANJAL GIRI
                  </div>
                  <div className="font-mono text-3xs text-sage tracking-wider">
                    ● SYSTEMS COMMS // ONLINE
                  </div>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="text-paper/50 hover:text-paper text-xl leading-none px-1"
                aria-label="Close chat"
              >
                &times;
              </button>
            </div>

            {/* Email Identification Banner (if not logged in) */}
            {!user && (
              <div className="bg-paper-dark/30 border-b border-graphite/10 px-4 py-2 flex items-center justify-between text-3xs font-mono">
                {emailConfigured && !editingEmail ? (
                  <>
                    <span className="text-steel truncate">
                      REPLY-TO: <strong className="text-ink">{guestEmail}</strong>
                    </span>
                    <button
                      type="button"
                      onClick={() => setEditingEmail(true)}
                      className="text-orange-DEFAULT hover:underline ml-2 flex-shrink-0"
                    >
                      [EDIT]
                    </button>
                  </>
                ) : (
                  <span className="text-orange-DEFAULT font-bold tracking-wider">
                    ⚠ EMAIL REQUIRED FOR DISPATCH & REPLIES
                  </span>
                )}
              </div>
            )}

            {/* Messages Area or Email Input Form */}
            {(!user && (!emailConfigured || editingEmail)) ? (
              <div className="p-6 bg-paper space-y-4 my-auto">
                <div className="text-center">
                  <div className="font-mono text-3xs text-orange-DEFAULT tracking-widest mb-1">
                    OPERATOR RECOGNITION
                  </div>
                  <h3 className="font-display font-bold text-base text-ink">
                    ENTER TRANSMISSION EMAIL
                  </h3>
                  <p className="font-sans text-xs text-steel mt-1 leading-relaxed">
                    Provide your email address so Pranjal can review your message and reply directly to your inbox.
                  </p>
                </div>

                <form onSubmit={handleSaveGuestInfo} className="space-y-3">
                  <div>
                    <label className="block font-mono text-3xs text-steel tracking-wider mb-1">
                      YOUR EMAIL ADDRESS *
                    </label>
                    <input
                      type="email"
                      value={guestEmail}
                      onChange={e => setGuestEmail(e.target.value)}
                      placeholder="operator@domain.com"
                      required
                      className="w-full bg-transparent border border-graphite/20 px-3 py-2 font-mono text-xs text-ink placeholder:text-steel/40 focus:border-orange-DEFAULT outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block font-mono text-3xs text-steel tracking-wider mb-1">
                      NAME / CALLSIGN (OPTIONAL)
                    </label>
                    <input
                      type="text"
                      value={guestName}
                      onChange={e => setGuestName(e.target.value)}
                      placeholder="e.g. Flight Engineer"
                      className="w-full bg-transparent border border-graphite/20 px-3 py-2 font-mono text-xs text-ink placeholder:text-steel/40 focus:border-orange-DEFAULT outline-none transition-colors"
                    />
                  </div>

                  {emailError && (
                    <p className="font-mono text-3xs text-red-500">[ERROR] {emailError}</p>
                  )}

                  <div className="flex gap-2 pt-1">
                    {emailConfigured && (
                      <button
                        type="button"
                        onClick={() => setEditingEmail(false)}
                        className="w-1/3 border border-graphite/20 hover:bg-paper-dark text-ink font-mono text-3xs tracking-widest py-2 transition-colors"
                      >
                        CANCEL
                      </button>
                    )}
                    <button
                      type="submit"
                      className="flex-1 bg-graphite hover:bg-orange-DEFAULT text-paper font-mono text-3xs tracking-widest py-2.5 transition-colors"
                    >
                      CONNECT & PROCEED →
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <>
                {/* Messages List */}
                <div className="flex-1 h-64 overflow-y-auto p-4 space-y-3 bg-paper/50">
                  {messages.map(msg => (
                    <div
                      key={msg.id}
                      className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      {msg.role === 'pranjal' && (
                        <Image
                          src="/character/avatar.jpg"
                          alt=""
                          width={24}
                          height={24}
                          className="rounded-full w-6 h-6 object-cover flex-shrink-0 mt-0.5 border border-orange-DEFAULT/40"
                        />
                      )}
                      <div
                        className={`max-w-[82%] px-3.5 py-2.5 text-xs font-sans leading-relaxed ${
                          msg.role === 'user'
                            ? 'bg-graphite text-paper rounded-none'
                            : 'bg-paper border border-graphite/15 text-ink shadow-2xs'
                        }`}
                      >
                        {msg.content}
                      </div>
                    </div>
                  ))}
                  {sending && (
                    <div className="flex gap-2 justify-start items-center">
                      <Image
                        src="/character/avatar.jpg"
                        alt=""
                        width={24}
                        height={24}
                        className="rounded-full w-6 h-6 object-cover flex-shrink-0 opacity-60"
                      />
                      <span className="font-mono text-3xs text-steel animate-pulse">
                        ROUTING TRANSMISSION TO CONSOLE...
                      </span>
                    </div>
                  )}
                  <div ref={bottomRef} />
                </div>

                {/* Message Input */}
                <div className="border-t border-graphite/10 flex bg-paper">
                  <input
                    type="text"
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && sendMessage()}
                    placeholder="Transmit message to Pranjal..."
                    disabled={sending}
                    className="flex-1 bg-transparent px-4 py-3 font-mono text-xs text-ink placeholder:text-steel/50 outline-none"
                  />
                  <button
                    onClick={sendMessage}
                    disabled={sending || !input.trim()}
                    className="px-4 bg-graphite hover:bg-orange-DEFAULT text-paper transition-colors font-mono text-xs disabled:opacity-40"
                  >
                    SEND →
                  </button>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Comms Widget Trigger */}
      <motion.button
        onClick={() => setOpen(!open)}
        className="relative flex items-center gap-3 bg-graphite text-paper px-4 py-3 shadow-engineering hover:bg-orange-DEFAULT transition-colors duration-300"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        aria-label="Open Communications Console"
      >
        <Image
          src="/character/avatar.jpg"
          alt="Pranjal"
          width={28}
          height={28}
          className="rounded-full w-7 h-7 object-cover border border-orange-DEFAULT/40"
        />
        <div className="text-left">
          <div className="font-mono text-xs tracking-wider">TALK TO ME</div>
          <div className="flex items-center gap-1 mt-0.5">
            <div className="w-1.5 h-1.5 rounded-full bg-sage animate-pulse" />
            <span className="font-mono text-3xs text-sage">Console Comms</span>
          </div>
        </div>
      </motion.button>
    </div>
  )
}
