import { auth, currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { headers } from 'next/headers'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { userId } = await auth()
  if (!userId) redirect('/connexion')

  const user = await currentUser()
  const email = user?.emailAddresses[0]?.emailAddress
  if (email !== process.env.ADMIN_EMAIL) redirect('/')

  const headersList = await headers()
  const pathname = headersList.get('x-pathname') ?? ''

  const navItems = [
    { label: 'Vue générale',  href: '/admin'           },
    { label: 'Annonces',      href: '/admin/annonces'  },
    { label: 'Demandes',      href: '/admin/demandes'  },
    { label: 'Membres',       href: '/admin/membres'   },
    { label: 'Blog',          href: '/admin/blog'      },
  ]

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Top bar */}
      <div className="bg-[#0D3B66] text-white px-4 sm:px-6 py-4 sm:py-5">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <div>
            <p className="text-xs text-white/60 mb-0.5">Moubadala</p>
            <h1 className="font-bold text-base sm:text-lg">Administration</h1>
          </div>
          <div className="text-xs text-white/60 truncate max-w-[160px] sm:max-w-none">
            {email}
          </div>
        </div>
      </div>

      {/* Nav tabs */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-2 sm:px-6 overflow-x-auto scrollbar-hide">
          <div className="flex items-center min-w-max sm:min-w-0">
            {navItems.map(item => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm font-medium px-4 sm:px-5 py-3.5 border-b-2 transition-colors whitespace-nowrap ${
                  pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href))
                    ? 'border-[#0D3B66] text-[#0D3B66]'
                    : 'border-transparent text-black hover:text-[#0D3B66]'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Page content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {children}
      </div>
    </div>
  )
}