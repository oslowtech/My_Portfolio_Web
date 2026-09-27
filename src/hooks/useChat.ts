'use client'
import { useEffect, useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import type { Message } from '@/types'

export function useChat(conversationId: string | null) {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!conversationId) { setLoading(false); return }

    supabase
      .from('messages')
      .select('*, profile:profiles(*)')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true })
      .then(({ data }) => { setMessages(data || []); setLoading(false) })

    const channel = supabase
      .channel(`conversation:${conversationId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `conversation_id=eq.${conversationId}`,
      }, (payload) => {
        setMessages((prev) => [...prev, payload.new as Message])
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [conversationId])

  const sendMessage = useCallback(async (content: string, senderId: string) => {
    if (!conversationId) return
    await supabase.from('messages').insert({ conversation_id: conversationId, sender_id: senderId, content })
  }, [conversationId])

  return { messages, loading, sendMessage }
}
