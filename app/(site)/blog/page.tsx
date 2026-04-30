import { getPublishedPosts } from '@/lib/actions/blog'
import Link from 'next/link'
import { Calendar, ArrowRight } from 'lucide-react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

export default async function BlogPage() {
  const posts = await getPublishedPosts()

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Hero */}
      <div className="bg-[#0D3B66] text-white px-6 py-14 text-center">
        <h1 className="text-3xl font-bold mb-3">Blog Moubadala</h1>
        <p className="text-white/70 text-base max-w-xl mx-auto">
          Actualités, conseils et ressources pour les entreprises marocaines.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {posts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400 text-sm">Aucun article publié pour le moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {posts.map(post => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col"
              >
                {/* Cover */}
                {post.cover_url ? (
                  <div className="h-48 overflow-hidden">
                    <img src={post.cover_url} alt={post.title} className="w-full h-full object-cover"/>
                  </div>
                ) : (
                  <div className="h-48 bg-gradient-to-br from-[#EEF3F8] to-[#dce8f5] flex items-center justify-center">
                    <span className="text-4xl font-bold text-[#0D3B66]/10">M</span>
                  </div>
                )}

                <div className="p-5 flex flex-col gap-3 flex-1">
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <Calendar size={11}/>
                    {format(new Date(post.created_at), 'dd MMMM yyyy', { locale: fr })}
                  </div>
                  <h2 className="font-bold text-[#0D3B66] text-base leading-snug line-clamp-2">
                    {post.title}
                  </h2>
                  {post.excerpt && (
                    <p className="text-sm text-gray-400 leading-relaxed line-clamp-3">
                      {post.excerpt}
                    </p>
                  )}
                  <div className="mt-auto pt-3 border-t border-gray-100 flex items-center gap-1 text-xs font-semibold text-[#F5A623]">
                    Lire l'article <ArrowRight size={12}/>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}