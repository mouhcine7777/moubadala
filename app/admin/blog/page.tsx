import { getAllPosts } from '@/lib/actions/blog'
import AdminBlogClient from './AdminBlogClient'

export default async function AdminBlogPage() {
  const posts = await getAllPosts()

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-bold text-[#0D3B66]">Gestion du blog</h2>
        <p className="text-sm text-gray-500">
          <span className="font-semibold text-[#0D3B66]">{posts.length}</span> article{posts.length !== 1 ? 's' : ''}
        </p>
      </div>
      <AdminBlogClient posts={posts} />
    </div>
  )
}