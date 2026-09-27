'use client'
import Image from 'next/image'
import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/lib/supabase'

interface ChatMessage {
  id: string
  role: 'user' | 'pranjal'
  content: string
  timestamp: string
}

const INITIAL_MESSAGE: ChatMessage = {
  id: '0',
  role: 'pranjal',
  content: "Hey! I'm Pranjal. Ask me about my projects, tech stack, or if you want to collaborate. I'll get back to you as soon as I can!",
  timestamp: new Date().toISOString(),
}

export function ChatWidget() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_MESSAGE])
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const { user } = useAuth()
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function sendMessage() {
    if (!input.trim() || sending) return
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

    // Store in Supabase if logged in
    if (user) {
      await supabase.from('contact_messages').insert({
        name: user.email?.split('@')[0] || 'Anonymous',
        email: user.email || '',
        subject: 'Chat Message',
        message: content,
        msg_id: `CHAT-${Date.now()}`,
      })
    }

    // Auto-reply
    setTimeout(() => {
      const reply: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'pranjal',
        content: "Thanks for reaching out! I'll get back to you soon. In the meantime, check out my projects or drop me an email.",
        timestamp: new Date().toISOString(),
      }
      setMessages(prev => [...prev, reply])
      setSending(false)
    }, 1200)
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
            className="mb-4 w-80 border border-graphite/20 bg-paper shadow-engineering overflow-hidden"
          >
            {/* Header */}
            <div className="bg-graphite px-4 py-3 flex items-center gap-3">
              <div className="relative flex-shrink-0">
                <Image src="/character/avatar.jpg" alt="Pranjal" width={32} height={32} className="rounded-full w-8 h-8 object-cover" />
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-sage border border-graphite" />
              </div>
              <div className="flex-1">
                <div className="font-display font-bold text-sm text-paper">PRANJAL</div>
                <div className="font-mono text-2xs text-sage">● Usually replies here</div>
              </div>
              <button onClick={() => setOpen(false)} className="text-paper/50 hover:text-paper text-lg leading-none">&times;</button>
            </div>

            {/* Messages */}
            <div className="h-64 overflow-y-auto p-4 space-y-3">
              {messages.map(msg => (
                <div key={msg.id} className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {msg.role === 'pranjal' && (
                    <Image src="/character/avatar.jpg" alt="" width={24} height={24} className="rounded-full w-6 h-6 object-cover flex-shrink-0 mt-0.5" />
                  )}
                  <div className={`max-w-[80%] px-3 py-2 text-xs font-sans leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-graphite text-paper'
                      : 'bg-paper border border-graphite/10 text-ink'
                  }`}>
                    {msg.content}
                  </div>
                </div>
              ))}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="border-t border-graphite/10 flex">
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && sendMessage()}
                placeholder="Write a message..."
                className="flex-1 bg-transparent px-4 py-3 font-mono text-xs text-ink placeholder:text-steel/50 outline-none"
              />
              <button
                onClick={sendMessage}
                className="px-4 text-orange-DEFAULT hover:text-orange-dark transition-colors font-mono text-sm"
              >
                →
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle button */}
      <motion.button
        onClick={() => setOpen(!open)}
        className="relative flex items-center gap-3 bg-graphite text-paper px-4 py-3 shadow-engineering hover:bg-orange-DEFAULT transition-colors duration-300"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Image src="/character/avatar.jpg" alt="" width={28} height={28} className="rounded-full w-7 h-7 object-cover" />
        <div className="text-left">
          <div className="font-mono text-xs tracking-wider">TALK TO ME</div>
          <div className="flex items-center gap-1 mt-0.5">
            <div className="w-1 h-1 rounded-full bg-sage animate-pulse" />
            <span className="font-mono text-2xs text-sage">Online</span>
          </div>
        </div>
      </motion.button>
    </div>
  )
}
