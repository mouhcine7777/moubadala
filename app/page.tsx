'use client'
import Link from "next/link";
import { DollarSign, BarChart2, Globe, FileText, Search, Mail, ArrowRight, Users } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { useState } from "react";

export default function HomePage() {
  const { isSignedIn } = useUser();
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const ctaHref = isSignedIn ? "/dashboard" : "/inscription";
  const ctaLabel = isSignedIn ? "Accéder à mon espace" : "Créer mon compte";
  const cta2Label = isSignedIn ? "Accéder à mon espace" : "Je rejoins Moubadala";

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubmitted(true);
      setEmail("");
    }
  };

  return (
    <>
      {/* ── HERO ── */}
      <section className="bg-[#2C4F72] text-white py-24 px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            Bienvenue sur moubadala.ma
          </h1>
          <p className="text-white/80 text-xl mb-3">La Plateforme Pour :</p>
          <ul className="text-white/90 text-lg space-y-1 mb-8 list-none">
            <li>• Echanger vos Biens et Services entre Professionnels.</li>
            <li>• Transformer vos ressources inutilisées en Opportunités.</li>
          </ul>
          <Link
            href={ctaHref}
            className="inline-block bg-[#F5A623] hover:bg-[#e09510] text-white font-semibold text-lg px-10 py-4 rounded transition-colors"
          >
            {ctaLabel}
          </Link>
        </div>
      </section>

      {/* ── 3 STEPS ── */}
      <section className="bg-gray-50 py-16 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-[#1B3A5C] mb-10 leading-snug">
            En Trois Etapes simples : <br />Développez une nouvelle forme<br />
            de Croissance pour votre Activité
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <FileText size={40} className="text-[#2C4F72]" />,
                step: "CRÉEZ VOTRE PROFIL COMPLET",
                desc: "Ajoutez vos coordonnées, logo, description d'activité, présentez vos produits et services.",
                objectif: "rendre votre activité visible, votre Profil complet renforce votre crédibilité auprès des clients et prospects.",
                avantage: "Une vitrine référencée sur le site moubadala.ma, accessible à tous les membres de la communauté.",
              },
              {
                icon: <Search size={40} className="text-[#2C4F72]" />,
                step: "DÉPOSEZ VOS FICHIERS MÉDIAS",
                desc: "Publiez vos photos, vidéos, fiches produits ou brochures, faites découvrir vos réalisations.",
                objectif: "Une communication à fort impact qui met en valeur votre savoir-faire à travers les contenus visuels.",
                avantage: "Renforcer votre visibilité parmi les membres et lors d'événements professionnels.",
              },
              {
                icon: <Users size={40} className="text-[#2C4F72]" />,
                step: "GAGNEZ UN RÉSEAU COMMUNAUTAIRE",
                desc: "Connectez-vous à d'autres entreprises, développez de nouvelles opportunités d'affaires.",
                objectif: "Interagir avec les autres acteurs et créer des synergies et des partenariats.",
                avantage: "Accéder à de nouvelles opportunités d'affaires, de co-développement et de visibilité partagée.",
              },
            ].map((item) => (
              <div
                key={item.step}
                className="bg-[#F7F9FC] border border-[#D0DCE8] rounded-2xl p-8 flex flex-col items-center text-center"
              >
                <div className="w-20 h-20 rounded-full border-2 border-[#2C4F72] flex items-center justify-center mb-5">
                  {item.icon}
                </div>
                <h3 className="font-bold text-black text-lg tracking-wide uppercase mb-4">
                  {item.step}
                </h3>
                <p className="text-black text-base leading-relaxed mb-4">
                  {item.desc}
                </p>
                <p className="text-black text-base leading-relaxed mb-3">
                  <span className="font-bold">Objectif : </span>
                  {item.objectif}
                </p>
                <p className="text-black text-base leading-relaxed">
                  <span className="font-bold">Avantage : </span>
                  {item.avantage}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── DIVIDER ── */}
      <div className="border-t border-gray-200" />

      {/* ── WHY ── */}
      <section className="bg-white py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-[#1B3A5C] text-center mb-10">
            Pourquoi Choisir Moubadala.ma ?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: <DollarSign size={32} className="text-[#1B3A5C]" />,
                title: "Optimisez votre Trésorerie",
                desc: "Acquérez des biens et services sans dépenser de liquidités, préservant ainsi vos capitaux pour d'autres dépenses.",
              },
              {
                icon: <BarChart2 size={32} className="text-[#1B3A5C]" />,
                title: "Acquérez de nouveaux clients",
                desc: "Touchez un nouveau marché d'entreprises prêtes à utiliser vos biens ou services en échange des leurs.",
              },
              {
                icon: <Globe size={32} className="text-[#1B3A5C]" />,
                title: "Assurez votre Croissance",
                desc: "Créez des Partenariats stratégiques et durables avec d'autres acteurs clés de l'économie marocaine.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="border border-gray-100 rounded-xl p-8 hover:shadow-md transition-shadow"
              >
                <div className="w-14 h-14 rounded-full bg-[#EEF3F8] flex items-center justify-center mb-4">
                  {item.icon}
                </div>
                <h3 className="font-bold text-[#1B3A5C] text-xl mb-3">{item.title}</h3>
                <p className="text-black text-base leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── VALUE ── */}
      <section className="bg-white py-12 px-6">
        <div className="max-w-3xl mx-auto text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-[#1B3A5C]">
            Avec moubadala.ma<br />
            Vos ressources ont toujours de la Valeur
          </h2>
        </div>
        <div className="max-w-2xl mx-auto">
          <div className="border-l-4 border-[#F5A623] pl-8 space-y-6">
            <div>
              <p className="font-bold text-[#1B3A5C] text-lg mb-2">Pour les Offreurs :</p>
              <ul className="text-black text-lg space-y-1">
                <li>• Valorisez vos stocks dormants, vos équipements sous utilisés.</li>
                <li>• Échangez les contre ce dont vous avez réellement besoin.</li>
              </ul>
            </div>
            <div className="border-t border-gray-100 pt-6">
              <p className="font-bold text-[#1B3A5C] text-lg mb-2">Pour les demandeurs :</p>
              <ul className="text-black text-lg space-y-1">
                <li>• Accédez à des ressources de qualité à moindre coût.</li>
                <li>• Trouvez des solutions à vos besoins sans toucher à votre Trésorerie.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="bg-[#1B3A5C] py-16 px-6 text-center text-white">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold uppercase tracking-wide mb-4">
            Prêt a Reinventer Votre Business
          </h2>
          <p className="text-white/80 text-xl mb-8">
            {isSignedIn
              ? "Accédez à votre espace et commencez à échanger dès maintenant."
              : <>L'inscription est rapide et vous ouvre les portes<br />à un monde d'opportunités</>
            }
          </p>
          <Link
            href={ctaHref}
            className="inline-block bg-[#F5A623] hover:bg-[#e09510] text-white font-semibold text-lg px-10 py-4 rounded transition-colors"
          >
            {cta2Label}
          </Link>
        </div>
      </section>

      {/* ── NEWSLETTER ── */}
      <section className="bg-[#EEF3F8] py-14 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <div className="w-16 h-16 rounded-full bg-[#2C4F72] flex items-center justify-center mx-auto mb-4">
            <Mail size={28} className="text-white" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-[#1B3A5C] mb-3">
            Restez informé des dernières opportunités
          </h2>
          <p className="text-black text-base mb-7 max-w-md mx-auto">
            Recevez nos actualités, les nouvelles offres d'échange pour développer votre réseau professionnel.
          </p>

          {submitted ? (
            <div className="inline-flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 px-6 py-4 rounded-lg text-base font-medium">
              <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Merci ! Vous êtes bien inscrit à notre newsletter.
            </div>
          ) : (
            <form onSubmit={handleNewsletter} className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Votre adresse e-mail professionnelle"
                required
                className="flex-1 px-5 py-4 rounded border border-gray-200 bg-white text-base text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2C4F72] focus:border-transparent transition"
              />
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 bg-[#F5A623] hover:bg-[#e09510] text-white font-semibold px-7 py-4 rounded transition-colors text-base whitespace-nowrap"
              >
                S'abonner
                <ArrowRight size={18} />
              </button>
            </form>
          )}

          <p className="text-black text-sm mt-4">
            Pas de spam. Désabonnement possible à tout moment.
          </p>
        </div>
      </section>
    </>
  );
}