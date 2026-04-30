'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import clsx from 'clsx'

const navItems = [
    { label: 'Vue générale', href: '/admin'          },
    { label: 'Annonces',     href: '/admin/annonces' },
    { label: 'Demandes',     href: '/admin/demandes' },
    { label: 'Membres',      href: '/admin/membres'  },
    { label: 'Blog',         href: '/admin/blog'     },
  ]

export default function AdminNav() {
  const pathname = usePathname()

  return (
    <div className="bg-white border-b border-gray-100 sticky top-0 z-10">
      <div className="max-w-6xl mx-auto px-6 flex items-center gap-1">
        {navItems.map(item => (
          <Link
            key={item.href}
            href={item.href}
            className={clsx(
              'text-sm font-medium px-5 py-3.5 border-b-2 transition-colors whitespace-nowrap',
              pathname === item.href
                ? 'border-[#0D3B66] text-[#0D3B66]'
                : 'border-transparent text-gray-400 hover:text-[#0D3B66]'
            )}
          >
            {item.label}
          </Link>
        ))}
      </div>
    </div>
  )
}