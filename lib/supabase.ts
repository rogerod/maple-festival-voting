import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Category = 'art' | 'poem' | 'window_display' | 'photography'

export interface Entry {
  id: string
  category: Category
  title: string
  contestant_name: string
  description?: string
  image_url?: string
  poem_text?: string
  display_order: number
  created_at: string
  vote_count?: number
}

export const CATEGORIES: { id: Category; label: string; icon: string; hasImage: boolean }[] = [
  { id: 'window_display', label: 'Best Window Display', icon: '🪟', hasImage: true },
  { id: 'art', label: 'Best Art', icon: '🎨', hasImage: true },
  { id: 'poem', label: 'Best Poem', icon: '📜', hasImage: false },
  { id: 'photography', label: 'Best Photography', icon: '📷', hasImage: true },
]
