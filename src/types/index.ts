// Project types
export interface Project {
  id: string
  slug: string
  title: string
  short_description: string
  description: string
  category: 'flight' | 'robotics' | 'uav' | 'ai' | 'software' | 'embedded'
  status: 'active' | 'completed' | 'archived' | 'simulation'
  featured: boolean
  github_url?: string
  demo_url?: string
  documentation_url?: string
  cover_image?: string
  model_url?: string
  technologies: string[]
  created_at: string
  updated_at: string
}

export interface ProjectLink {
  id: string
  project_id: string
  github_url?: string
  demo_url?: string
  documentation_url?: string
  youtube_url?: string
}

export interface Post {
  id: string
  slug: string
  title: string
  excerpt: string
  content: string
  cover_image?: string
  category: string
  tags: string[]
  published: boolean
  published_at?: string
  read_time?: number
  created_at: string
  updated_at: string
  author_id: string
}

export interface Profile {
  id: string
  public_id: string
  username: string
  role: 'user' | 'admin'
  avatar_url?: string
  bio?: string
  created_at: string
}

export interface Comment {
  id: string
  content: string
  author_id: string
  project_id?: string
  post_id?: string
  created_at: string
  profile?: Profile
}

export interface Message {
  id: string
  conversation_id: string
  sender_id: string
  content: string
  created_at: string
  profile?: Profile
}

export interface Conversation {
  id: string
  created_at: string
  updated_at: string
  members?: Profile[]
  last_message?: Message
}

export interface ContactMessage {
  id: string
  name: string
  email: string
  subject: string
  message: string
  msg_id: string
  read?: boolean
  replied?: boolean
  created_at: string
}

export interface SiteStats {
  id: string
  active_projects: number
  completed_projects: number
  blog_posts: number
  total_users: number
  updated_at: string
}

export type SystemCategory = 'flight' | 'robotics' | 'uav' | 'ai' | 'software' | 'embedded'

export interface SystemConfig {
  id: SystemCategory
  label: string
  description: string
  color: string
  modelPath?: string
  projects?: Project[]
}
