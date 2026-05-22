import Link from "next/link";
import { FileText, Truck, CheckSquare, DollarSign, BookOpen, MessageCircle, ChevronRight } from "lucide-react";

const resources = [
  {
    icon: <FileText size={28} className="text-[#0D3B66]" />,
    title: "Contrat type d'échange à valider",
    subtitle: "par votre Conseiller juridique",
    description: "Modèle complet de contrat pour formaliser un échange entre entreprises, incluant clauses spécifiques au troc professionnel.",
    tag: "Juridique",
    tagColor: "bg-blue-50 text-blue-600",
    files: [
      { label: ".PDF (FR)", href: "/ressources/contrat-echange-fr.pdf", ext: "PDF" },
      { label: ".PDF (AR)", href: "/ressources/contrat-echange-ar.pdf", ext: "PDF" },
    ],
  },
  {
    icon: <Truck size={28} className="text-[#0D3B66]" />,
    title: "Bon de Livraison Type",
    subtitle: "justifiant votre livraison",
    description: 'Modèle personnalisable de bon de livraison avec mention spécifique « Échange inter-entreprises ».',
    tag: "Logistique",
    tagColor: "bg-blue-50 text-blue-600",
    files: [
      { label: ".PDF", href: "/ressources/bon-livraison.pdf", ext: "PDF" },
    ],
  },
  {
    icon: <CheckSquare size={28} className="text-[#0D3B66]" />,
    title: "Bon de Réception Type",
    subtitle: "justifiant la reception",
    description: "Modèle de bon de réception adapté aux échanges, avec grille de contrôle qualité intégrée.",
    tag: "Logistique",
    tagColor: "bg-blue-50 text-blue-600",
    files: [
      { label: ".PDF", href: "/ressources/bon-reception.pdf", ext: "PDF" },
    ],
  },
  {
    icon: <DollarSign size={28} className="text-[#0D3B66]" />,
    title: "Facture avec Mention d'Échange",
    subtitle: "Document comptable",
    description: 'Modèle de facture avec mention « Compensé par échange » conforme à la réglementation marocaine.',
    tag: "Comptabilité",
    tagColor: "bg-blue-50 text-blue-600",
    files: [
      { label: ".PDF", href: "/ressources/facture-echange.pdf", ext: "PDF" },
    ],
  },
  {
    icon: <BookOpen size={28} className="text-[#0D3B66]" />,
    title: "Guide Espace Client",
    subtitle: "Document d'information",
    description: "Guide pratique pour naviguer dans votre espace client, gérer vos échanges et exploiter toutes les fonctionnalités disponibles.",
    tag: "Juridique",
    tagColor: "bg-blue-50 text-blue-600",
    files: [
      { label: ".PDF", href: "/ressources/guide-utilisateur.pdf", ext: "PDF" },
    ],
  },
  {
    icon: <BookOpen size={28} className="text-[#0D3B66]" />,
    title: "Comment Publier une Annonce",
    subtitle: "Document d'information",
    description: "Guide complet pour bien utiliser la plateforme et tirer le meilleur parti de vos échanges inter-entreprises.",
    tag: "Juridique",
    tagColor: "bg-blue-50 text-blue-600",
    files: [
      { label: "Consulter", href: "/guide-utilisateur", ext: "LINK" },
    ],
  },
];

const faqLinks = [
  {
    title: "Foire Aux Questions Juridiques",
    description: "Réponses aux questions courantes sur la légalité des échanges, aspects fiscaux et obligations comptables.",
    linkLabel: "Consulter la FAQ",
    href: "/faq",
    borderColor: "border-[#0D3B66]",
    linkColor: "text-[#0D3B66]",
  },
  {
    title: "Annuaire des Conseillers Agréés",
    description: "Liste de conseillers juridiques et comptables spécialisés dans les échanges inter-entreprises.",
    linkLabel: "Trouver un expert",
    href: "/contact",
    borderColor: "border-[#1a8a6e]",
    linkColor: "text-[#1a8a6e]",
  },
];

export default function RessourcesPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-[#0D3B66] py-16 px-6 text-center text-white">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          Ressources Professionnelles
        </h1>
        <p className="text-white text-lg leading-relaxed">
          Documents types et outils juridiques<br />
          pour sécuriser vos échanges inter-entreprises
        </p>
      </section>

      {/* Warning notice */}
      <section className="bg-white px-6 pt-10">
        <div className="page-container">
          <div className="bg-amber-50 border border-amber-200 rounded-lg px-6 py-5 flex items-start gap-4">
            <span className="w-7 h-7 rounded-full bg-[#F5A623] flex items-center justify-center shrink-0 text-white text-sm font-bold mt-0.5">
              !
            </span>
            <p className="text-base text-amber-800">
              Important : Ces documents sont fournis à titre indicatif. Nous vous recommandons de les faire valider par votre conseiller juridique avant utilisation.
            </p>
          </div>
        </div>
      </section>

      {/* Resources grid */}
      <section className="bg-white py-12 px-6">
        <div className="page-container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {resources.map((res) => (
              <div
                key={res.title}
                className="border border-gray-200 rounded-xl p-7 hover:shadow-md transition-shadow flex flex-col gap-4"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                    {res.icon}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-[#0D3B66] leading-snug">
                      {res.title}
                    </h3>
                    <p className="text-sm text-black mt-1">{res.subtitle}</p>
                  </div>
                </div>
                <p className="text-sm text-black leading-relaxed flex-1">
                  {res.description}
                </p>
                <div className="flex items-center justify-between flex-wrap gap-2 pt-2 border-t border-gray-100">
                  <span className={`flex items-center gap-1.5 text-sm px-3 py-1 rounded-full ${res.tagColor}`}>
                    <MessageCircle size={13} />
                    {res.tag}
                  </span>
                  <div className="flex items-center gap-2">
                    {res.files.map((file) =>
                      file.ext === "LINK" ? (
                        <Link
                          key={file.label}
                          href={file.href}
                          className="flex items-center gap-1.5 bg-green-50 hover:bg-green-100 text-green-700 text-sm font-semibold px-3 py-1.5 rounded transition-colors"
                        >
                          <FileText size={13} />
                          {file.label}
                        </Link>
                      ) : (
                        <a
                          key={file.label}
                          href={file.href}
                          download
                          className="flex items-center gap-1.5 bg-green-50 hover:bg-green-100 text-green-700 text-sm font-semibold px-3 py-1.5 rounded transition-colors"
                        >
                          <FileText size={13} />
                          {file.label}
                        </a>
                      )
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ section */}
      <section className="bg-white py-10 px-6 pb-16">
        <div className="page-container">
          <h2 className="text-2xl md:text-3xl font-bold text-[#0D3B66] text-center mb-10">
            Foire Aux Questions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {faqLinks.map((item) => (
              <div
                key={item.title}
                className={`border-l-4 ${item.borderColor} pl-6 py-3`}
              >
                <h3 className="font-bold text-[#0D3B66] text-xl mb-3">
                  {item.title}
                </h3>
                <p className="text-black text-base leading-relaxed mb-5">
                  {item.description}
                </p>
                <Link
                  href={item.href}
                  className={`flex items-center gap-1.5 text-base font-medium ${item.linkColor} hover:underline`}
                >
                  {item.linkLabel}
                  <ChevronRight size={16} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}