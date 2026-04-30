import { getPostBySlug, getPublishedPosts } from '@/lib/actions/blog'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Calendar } from 'lucide-react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { marked } from 'marked'

export async function generateStaticParams() {
  const posts = await getPublishedPosts()
  return posts.map(p => ({ slug: p.slug }))
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = await getPostBySlug(slug)
  if (!post) notFound()

  const html = marked(post.content)

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Cover */}
      {post.cover_url && (
        <div className="w-full h-64 md:h-80 overflow-hidden">
          <img src={post.cover_url} alt={post.title} className="w-full h-full object-cover"/>
        </div>
      )}

      <div className="max-w-3xl mx-auto px-6 py-10">

        {/* Breadcrumb */}
        <Link
          href="/blog"
          className="flex items-center gap-2 text-sm text-gray-400 hover:text-[#0D3B66] transition-colors mb-6 w-fit"
        >
          <ArrowLeft size={14}/> Retour au blog
        </Link>

        {/* Header */}
        <div className="flex flex-col gap-3 mb-8">
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <Calendar size={12}/>
            {format(new Date(post.created_at), 'dd MMMM yyyy', { locale: fr })}
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-[#0D3B66] leading-tight">
            {post.title}
          </h1>
          {post.excerpt && (
            <p className="text-base text-gray-500 leading-relaxed border-l-4 border-[#F5A623] pl-4">
              {post.excerpt}
            </p>
          )}
        </div>

        {/* Contenu Markdown */}
        <div
          className="prose prose-sm max-w-none prose-headings:text-[#0D3B66] prose-a:text-[#F5A623] prose-strong:text-[#0D3B66]"
          dangerouslySetInnerHTML={{ __html: html }}
        />

        {/* Footer article */}
        <div className="mt-12 pt-8 border-t border-gray-100 flex items-center justify-between">
          <Link href="/blog" className="text-sm text-[#0D3B66] font-semibold hover:underline flex items-center gap-2">
            <ArrowLeft size={14}/> Tous les articles
          </Link>
          <Link
            href="/inscription"
            className="text-sm font-semibold bg-[#F5A623] hover:bg-[#e09510] text-white px-4 py-2 rounded-lg transition-colors"
          >
            Rejoindre Moubadala
          </Link>
        </div>
      </div>
    </div>
  )
}