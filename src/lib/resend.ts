import { Resend } from 'resend'

const apiKey = process.env.RESEND_API_KEY || ''

export const resend = new Resend(apiKey)

export const NOTIFICATION_RECIPIENTS = [
  'pranjal.giri2024@vitstudent.ac.in',
  'pranjalgiri1122005@gmail.com'
]

export const NOTIFICATION_RECIPIENT = 'pranjal.giri2024@vitstudent.ac.in'

export const DEFAULT_FROM = process.env.RESEND_FROM || 'Pranjal Giri <onboarding@resend.dev>'
