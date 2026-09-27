import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date))
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str
  return str.slice(0, length) + '...'
}

export const SYSTEM_CATEGORIES = [
  { id: 'flight', label: 'FLIGHT', color: '#D96C32' },
  { id: 'robotics', label: 'ROBOTICS', color: '#6C7A72' },
  { id: 'uav', label: 'UAV', color: '#D8A629' },
  { id: 'ai', label: 'AI / ML', color: '#263238' },
  { id: 'software', label: 'SOFTWARE', color: '#455A64' },
  { id: 'embedded', label: 'EMBEDDED', color: '#37474F' },
] as const

export const STATUS_LABELS = {
  active: '● ACTIVE',
  completed: '● COMPLETED',
  archived: '○ ARCHIVED',
  simulation: '● SIMULATION',
} as const

export const STATUS_COLORS = {
  active: 'text-orange-DEFAULT',
  completed: 'text-sage',
  archived: 'text-steel-light',
  simulation: 'text-yellow-DEFAULT',
} as const
