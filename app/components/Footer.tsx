import Link from "next/link";
import { Phone, MapPin, Mail, Lock } from "lucide-react";
import { auth } from "@clerk/nextjs/server";

const navigationPublic = [
  { label: "Accueil",    href: "/",           protected: false },
  { label: "Moubaplace", href: "/moubaplace",  protected: false },
  { label: "Blog",       href: "/blog",        protected: false },
  { label: "FAQ",        href: "/faq",         protected: false },
  { label: "Support",        href: "/support",         protected: false },
  { label: "Ressources Professionnelles", href: "/ressources-professionnelles", protected: true },
]

const entreprise = [
  { label: "Qui sommes-nous ?",            href: "/qui-sommes-nous"               },
  { label: "Adhésions",                    href: "/adhesions"                     },
  { label: "Contact",                      href: "/contact"                       },
  { label: "Politique de Confidentialité", href: "/politique-de-confidentialite"  },
  { label: "CGU",                          href: "/cgu"                           },
]

export default async function Footer() {
  const { userId } = await auth()
  const isSignedIn = !!userId

  return (
    <footer className="bg-[#2C2C2C] text-white border-t-4 border-[#F5A623]">
      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-4 gap-12">

        {/* Navigation */}
        <div>
          <h4 className="font-bold text-base mb-7 text-white">Navigation</h4>
          <ul className="flex flex-col gap-4">
            {navigationPublic.map((item) => (
              <li key={item.label}>
                {item.protected && !isSignedIn ? (
                  <div className="flex items-center gap-2 text-gray-500 text-base cursor-not-allowed select-none">
                    <span>{item.label}</span>
                    <span className="flex items-center gap-1 text-xs font-semibold bg-white/5 text-gray-500 px-2 py-0.5 rounded-full">
                      <Lock size={9}/> Membres
                    </span>
                  </div>
                ) : (
                  <Link
                    href={item.href}
                    className="text-white text-base hover:text-[#F5A623] transition-colors"
                  >
                    {item.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* Entreprise */}
        <div>
          <h4 className="font-bold text-base mb-7 text-white">Entreprise</h4>
          <ul className="flex flex-col gap-4">
            {entreprise.map((item) => (
              <li key={item.label}>
                <Link href={item.href} className="text-white text-base hover:text-[#F5A623] transition-colors">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="font-bold text-base mb-7 text-white">Nous contacter</h4>
          <ul className="flex flex-col gap-5">
            <li className="flex items-start gap-3 text-white text-base">
              <span className="w-8 h-8 rounded-md bg-[#F5A623] flex items-center justify-center shrink-0 mt-0.5">
                <Phone size={15} className="text-white" />
              </span>
              +212 601 840 707
            </li>
            <li className="flex items-start gap-3 text-white text-base">
              <span className="w-8 h-8 rounded-md bg-[#0D3B66] flex items-center justify-center shrink-0 mt-0.5">
                <MapPin size={15} className="text-white" />
              </span>
              45 Rue Abdelkader Moufaker,<br />Casablanca
            </li>
            <li className="flex items-start gap-3 text-white text-base">
              <span className="w-8 h-8 rounded-md bg-[#F5A623] flex items-center justify-center shrink-0 mt-0.5">
                <Mail size={15} className="text-white" />
              </span>
              contact@moubadala.ma
            </li>
          </ul>
        </div>

        {/* About + Social */}
        <div>
          <h4 className="font-bold text-base mb-7 text-white">Moubadala.ma</h4>
          <p className="text-white text-base leading-relaxed mb-7">
            La plateforme d'échange inter-entreprises pour une nouvelle forme de croissance.
          </p>
          <div className="flex items-center gap-3">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-11 h-11 rounded-full border border-[#F5A623] flex items-center justify-center text-white hover:text-white hover:bg-[#F5A623] transition-colors text-base font-bold"
            >
              f
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-11 h-11 rounded-full border border-[#F5A623] flex items-center justify-center text-white hover:text-white hover:bg-[#F5A623] transition-colors text-base font-bold"
            >
              in
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-11 h-11 rounded-full border border-[#F5A623] flex items-center justify-center text-white hover:text-white hover:bg-[#F5A623] transition-colors text-base font-bold"
            >
              ig
            </a>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="max-w-6xl mx-auto px-6 py-6 text-center text-white text-base">
          © 2025 Moubadala.ma - Tous droits réservés
        </div>
      </div>
    </footer>
  )
}