"use client";
import { useState } from "react";
import Link from "next/link";
import { ChevronDown, Menu, X, User, LayoutDashboard, LogOut, ShieldCheck, Lock } from "lucide-react";
import Image from "next/image";
import { useAuth, useUser, SignOutButton } from "@clerk/nextjs";

const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL;

type NavItem = {
  label: string
  href: string
  protected?: boolean
  dropdown?: { label: string; href: string; protected?: boolean }[]
}

const navLinks: NavItem[] = [
  { label: "Accueil", href: "/" },
  {
    label: "Opportunités",
    href: "/moubaplace",
    dropdown: [
      { label: "Moubaplace", href: "/moubaplace" },
    ],
  },
  {
    label: "Ressources",
    href: "#",
    dropdown: [
      { label: "Ressources Professionnelles", href: "/ressources-professionnelles", protected: true },
      { label: "Comment ça marche ?", href: "/comment-ca-marche" },
      { label: "Guide utilisateur", href: "/guide-utilisateur" },
    ],
  },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
]

export default function Header({
  notificationBell,
}: {
  notificationBell?: React.ReactNode
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { isSignedIn } = useAuth();
  const { user } = useUser();

  const email = user?.emailAddresses[0]?.emailAddress;
  const isAdmin = email === ADMIN_EMAIL;

  return (
    <header className="bg-[#0D3B66] sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 flex items-center h-16 gap-8">

        {/* Logo */}
        <Link href="/" className="shrink-0">
          <Image src="/logo.png" alt="Moubadala" width={150} height={40} className="h-10 w-auto" />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1 flex-1">
          {navLinks.map((link) => (
            <div
              key={link.label}
              className="relative"
              onMouseEnter={() => link.dropdown && setOpenDropdown(link.label)}
              onMouseLeave={() => setOpenDropdown(null)}
            >
              {link.href === '#' ? (
                <button className="flex items-center gap-1 text-white/90 text-sm font-medium px-3 py-2 rounded hover:text-[#F5A623] hover:bg-white/10 transition-colors">
                  {link.label}
                  {link.dropdown && <ChevronDown size={14} className="opacity-60" />}
                </button>
              ) : (
                <Link
                  href={link.href}
                  className="flex items-center gap-1 text-white/90 text-sm font-medium px-3 py-2 rounded hover:text-[#F5A623] hover:bg-white/10 transition-colors"
                >
                  {link.label}
                  {link.dropdown && <ChevronDown size={14} className="opacity-60" />}
                </Link>
              )}

              {link.dropdown && openDropdown === link.label && (
                <div className="absolute top-full left-0 bg-white shadow-lg rounded-lg py-2 min-w-52 z-50 border border-gray-100">
                  {link.dropdown.map((item) => (
                    item.protected && !isSignedIn ? (
                      <div
                        key={item.label}
                        className="flex items-center justify-between px-5 py-2.5 text-sm text-gray-300 cursor-not-allowed select-none gap-3"
                      >
                        <span>{item.label}</span>
                        <span className="flex items-center gap-1 text-[10px] font-semibold bg-gray-100 text-gray-400 px-2 py-0.5 rounded-full shrink-0">
                          <Lock size={9}/> Membres
                        </span>
                      </div>
                    ) : (
                      <Link
                        key={item.label}
                        href={item.href}
                        className="block px-5 py-2.5 text-sm text-[#0D3B66] font-medium hover:bg-[#F5A623]/10 hover:text-[#F5A623] transition-colors"
                      >
                        {item.label}
                      </Link>
                    )
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* Auth buttons — desktop */}
        <div className="hidden md:flex items-center gap-3 shrink-0">
          {isSignedIn ? (
            <>
              {!isAdmin && notificationBell}

              <div
                className="relative"
                onMouseEnter={() => setUserMenuOpen(true)}
                onMouseLeave={() => setUserMenuOpen(false)}
              >
                <button className="flex items-center gap-2 text-white/90 hover:text-[#F5A623] transition-colors">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold uppercase ${isAdmin ? 'bg-red-500' : 'bg-[#F5A623]'}`}>
                    {isAdmin
                      ? <ShieldCheck size={15}/>
                      : (user?.firstName?.[0] ?? email?.[0])
                    }
                  </div>
                  <span className="text-sm font-medium">
                    {isAdmin ? 'Administration' : (user?.firstName ?? 'Mon compte')}
                  </span>
                  <ChevronDown size={14} className="opacity-60" />
                </button>

                {userMenuOpen && (
                  <div className="absolute top-full right-0 bg-white shadow-lg rounded-lg py-2 min-w-52 z-50 border border-gray-100">
                    <div className="px-5 py-3 border-b border-gray-100">
                      <p className="text-xs text-gray-400">Connecté en tant que</p>
                      <p className="text-sm font-semibold text-[#0D3B66] truncate">{email}</p>
                      {isAdmin && (
                        <span className="inline-flex items-center gap-1 mt-1 text-xs font-semibold text-red-600 bg-red-50 px-2 py-0.5 rounded-full">
                          <ShieldCheck size={11}/> Administrateur
                        </span>
                      )}
                    </div>

                    {isAdmin ? (
                      <Link
                        href="/admin"
                        className="flex items-center gap-2 px-5 py-2.5 text-sm text-[#0D3B66] hover:bg-[#F5A623]/10 hover:text-[#F5A623] transition-colors"
                      >
                        <ShieldCheck size={15}/>
                        Panel admin
                      </Link>
                    ) : (
                      <>
                        <Link
                          href="/dashboard"
                          className="flex items-center gap-2 px-5 py-2.5 text-sm text-[#0D3B66] hover:bg-[#F5A623]/10 hover:text-[#F5A623] transition-colors"
                        >
                          <LayoutDashboard size={15}/>
                          Espace client
                        </Link>
                        <Link
                          href="/publier"
                          className="flex items-center gap-2 px-5 py-2.5 text-sm text-[#0D3B66] hover:bg-[#F5A623]/10 hover:text-[#F5A623] transition-colors"
                        >
                          <span className="text-base leading-none">+</span>
                          Publier une annonce
                        </Link>
                      </>
                    )}

                    <div className="border-t border-gray-100 mt-1 pt-1">
                      <SignOutButton redirectUrl="/">
                        <button className="flex items-center gap-2 w-full px-5 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors">
                          <LogOut size={15}/>
                          Déconnexion
                        </button>
                      </SignOutButton>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <User size={16} className="text-white/40" />
              <Link
                href="/connexion"
                className="text-sm font-medium text-white/90 hover:text-[#F5A623] transition-colors"
              >
                Se connecter
              </Link>
              <span className="text-white/30">|</span>
              <Link
                href="/inscription"
                className="text-sm font-semibold bg-[#F5A623] hover:bg-[#e09510] text-white px-4 py-1.5 rounded transition-colors"
              >
                Inscription
              </Link>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden ml-auto text-white"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Menu"
        >
          {mobileOpen ? <X size={22}/> : <Menu size={22}/>}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-[#0D3B66] border-t border-white/10 px-6 pb-6 flex flex-col">

          {navLinks.map((link) => (
            <div key={link.label} className="flex flex-col border-b border-white/10">
              {link.href === '#' ? (
                <span className="py-3 text-white/80 text-sm font-medium">
                  {link.label}
                </span>
              ) : (
                <Link
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="py-3 text-white/80 text-sm font-medium hover:text-[#F5A623] transition-colors"
                >
                  {link.label}
                </Link>
              )}

              {link.dropdown && link.dropdown.map((item) => (
                item.protected && !isSignedIn ? (
                  <div
                    key={item.label}
                    className="flex items-center justify-between py-2 pl-4 text-xs text-white/30 cursor-not-allowed"
                  >
                    <span>{item.label}</span>
                    <span className="flex items-center gap-1 text-[10px] bg-white/10 text-white/30 px-2 py-0.5 rounded-full">
                      <Lock size={8}/> Membres
                    </span>
                  </div>
                ) : (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className="py-2 pl-4 text-xs text-white/60 hover:text-[#F5A623] transition-colors"
                  >
                    {item.label}
                  </Link>
                )
              ))}
            </div>
          ))}

          <div className="mt-5 flex flex-col gap-3">
            {isSignedIn ? (
              <>
                {isAdmin ? (
                  <Link
                    href="/admin"
                    className="flex items-center gap-2 text-sm font-medium text-white/80 hover:text-[#F5A623] transition-colors"
                    onClick={() => setMobileOpen(false)}
                  >
                    <ShieldCheck size={15}/>
                    Panel admin
                  </Link>
                ) : (
                  <>
                    <Link
                      href="/dashboard"
                      className="flex items-center gap-2 text-sm font-medium text-white/80 hover:text-[#F5A623] transition-colors"
                      onClick={() => setMobileOpen(false)}
                    >
                      <LayoutDashboard size={15}/>
                      Espace client
                    </Link>
                    <Link
                      href="/publier"
                      className="text-sm font-medium text-white/80 hover:text-[#F5A623] transition-colors"
                      onClick={() => setMobileOpen(false)}
                    >
                      + Publier une annonce
                    </Link>
                  </>
                )}
                <SignOutButton redirectUrl="/">
                  <button className="flex items-center gap-2 text-sm font-medium text-red-400 hover:text-red-300 transition-colors">
                    <LogOut size={15}/>
                    Déconnexion
                  </button>
                </SignOutButton>
              </>
            ) : (
              <>
                <Link
                  href="/connexion"
                  className="text-sm font-medium text-white/80 hover:text-[#F5A623] transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  Se connecter
                </Link>
                <Link
                  href="/inscription"
                  className="text-sm font-semibold bg-[#F5A623] hover:bg-[#e09510] text-white px-4 py-2 rounded text-center transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  Inscription
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}