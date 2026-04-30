import { supabase } from '@/lib/supabase'

export type BlogPost = {
  id: string
  title: string
  slug: string
  excerpt: string | null
  content: string
  cover_url: string | null
  published: boolean
  created_at: string
  updated_at: string
}

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

export async function getPublishedPosts(): Promise<BlogPost[]> {
  const { data } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('published', true)
    .order('created_at', { ascending: false })
  return data ?? []
}

export async function getAllPosts(): Promise<BlogPost[]> {
  const { data } = await supabase
    .from('blog_posts')
    .select('*')
    .order('created_at', { ascending: false })
  return data ?? []
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  const { data } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .single()
  return data ?? null
}

export async function createPost(data: {
  title: string
  excerpt: string
  content: string
  cover_url: string | null
  published: boolean
}): Promise<void> {
  const slug = generateSlug(data.title)
  const { error } = await supabase
    .from('blog_posts')
    .insert({ ...data, slug })
  if (error) throw new Error(error.message)
}

export async function updatePost(
  id: string,
  data: Partial<Omit<BlogPost, 'id' | 'slug' | 'created_at'>>
): Promise<void> {
  const { error } = await supabase
    .from('blog_posts')
    .update({ ...data, updated_at: new Date().toISOString() })
    .eq('id', id)
  if (error) throw new Error(error.message)
}

export async function deletePost(id: string): Promise<void> {
  const { error } = await supabase
    .from('blog_posts')
    .delete()
    .eq('id', id)
  if (error) throw new Error(error.message)
}

export async function togglePublished(id: string, published: boolean): Promise<void> {
  const { error } = await supabase
    .from('blog_posts')
    .update({ published, updated_at: new Date().toISOString() })
    .eq('id', id)
  if (error) throw new Error(error.message)
}