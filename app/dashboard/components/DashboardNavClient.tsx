'use client'
import Link from 'next/link'
import clsx from 'clsx'
import { useState, useEffect } from 'react'
import { ChevronDown, Menu, X } from 'lucide-react'

type Link = { label: string; href: string }
type Badges = { messages: number; demandes: number }

export default function DashboardNavClient({
  active,
  mainLinks,
  moreLinks,
  badges,
}: {
  active: string
  mainLinks: Link[]
  moreLinks: Link[]
  badges: Badges
}) {
  const [moreOpen, setMoreOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const isMoreActive = moreLinks.some(l => l.href === active)
  const allLinks = [...mainLinks, ...moreLinks]

  useEffect(() => {
    function handleClick() { setMoreOpen(false) }
    if (moreOpen) document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [moreOpen])

  // Close mobile menu on resize to desktop
  useEffect(() => {
    function handleResize() { if (window.innerWidth >= 768) setMobileOpen(false) }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const badgeMap: Record<string, number> = {
    '/dashboard/messages': badges.messages,
    '/dashboard/demandes': badges.demandes,
  }

  return (
    <div className="bg-white border-b border-gray-100">
      {/* ── Desktop nav ── */}
      <div className="hidden md:flex max-w-7xl mx-auto px-6 items-center">
        {mainLinks.map(item => (
          <Link
            key={item.href}
            href={item.href}
            className={clsx(
              'flex items-center gap-1.5 text-sm font-medium px-4 py-3.5 border-b-2 transition-colors whitespace-nowrap',
              active === item.href
                ? 'border-[#0D3B66] text-[#0D3B66]'
                : 'border-transparent text-black hover:text-[#0D3B66]'
            )}
          >
            {item.label}
            {badgeMap[item.href] > 0 && (
              <span className={clsx(
                'text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center',
                active === item.href
                  ? 'bg-[#0D3B66] text-white'
                  : item.href === '/dashboard/messages'
                    ? 'bg-[#F5A623] text-white'
                    : 'bg-amber-100 text-amber-700'
              )}>
                {badgeMap[item.href]}
              </span>
            )}
          </Link>
        ))}

        {/* More dropdown */}
        <div className="relative ml-auto">
          <button
            onClick={e => { e.stopPropagation(); setMoreOpen(!moreOpen) }}
            className={clsx(
              'flex items-center gap-1 text-sm font-medium px-4 py-3.5 border-b-2 transition-colors whitespace-nowrap',
              isMoreActive
                ? 'border-[#0D3B66] text-[#0D3B66]'
                : 'border-transparent text-black hover:text-[#0D3B66]'
            )}
          >
            Plus
            <ChevronDown size={13} className={clsx('transition-transform', moreOpen && 'rotate-180')} />
          </button>

          {moreOpen && (
            <div className="absolute right-0 top-full bg-white border border-gray-100 rounded-xl shadow-lg py-2 min-w-44 z-50">
              {moreLinks.map(item => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={clsx(
                    'block px-4 py-2.5 text-sm transition-colors',
                    active === item.href
                      ? 'text-[#0D3B66] font-semibold bg-[#EEF3F8]'
                      : 'text-black hover:text-[#0D3B66] hover:bg-gray-50'
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Mobile nav ── */}
      <div className="md:hidden flex items-center justify-between px-4 py-2">
        {/* Active page label */}
        <span className="text-sm font-semibold text-[#0D3B66]">
          {allLinks.find(l => l.href === active)?.label ?? 'Menu'}
        </span>

        {/* Hamburger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 rounded-lg text-gray-400 hover:text-[#0D3B66] hover:bg-gray-50 transition-colors"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white">
          {allLinks.map(item => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={clsx(
                'flex items-center justify-between px-5 py-3.5 text-sm font-medium border-l-2 transition-colors',
                active === item.href
                  ? 'border-[#0D3B66] text-[#0D3B66] bg-[#EEF3F8]'
                  : 'border-transparent text-gray-500 hover:text-[#0D3B66] hover:bg-gray-50'
              )}
            >
              {item.label}
              {badgeMap[item.href] > 0 && (
                <span className={clsx(
                  'text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center',
                  active === item.href
                    ? 'bg-[#0D3B66] text-white'
                    : item.href === '/dashboard/messages'
                      ? 'bg-[#F5A623] text-white'
                      : 'bg-amber-100 text-amber-700'
                )}>
                  {badgeMap[item.href]}
                </span>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}