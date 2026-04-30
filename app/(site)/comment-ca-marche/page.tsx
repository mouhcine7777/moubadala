"use client";
import { useState } from "react";
import Link from "next/link";
import { ChevronUp, ChevronRight } from "lucide-react";

const steps = [
  {
    title: "Inscription gratuite",
    content: (
      <ul className="flex flex-col gap-2 text-sm text-gray-600">
        <li>* Chaque entreprise doit créer son <strong>compte membre</strong> sur{" "}
          <Link href="/" className="text-[#0D3B66] underline hover:text-[#F5A623] transition-colors">Moubadala.ma</Link>.
        </li>
        <li>* L'inscription est simple : informations de l'entreprise, secteur d'activité et coordonnées principales.</li>
        <li>* Une fois validé, vous accédez à votre <strong>espace membre sécurisé</strong>.</li>
      </ul>
    ),
  },
  {
    title: "Publier une annonce",
    content: (
      <ul className="flex flex-col gap-2 text-sm text-gray-600">
        <li>* Vous pouvez créer deux types d'annonces :</li>
        <li className="pl-4">- <strong>Offres</strong> → pour proposer vos produits ou services.</li>
        <li className="pl-4">- <strong>Demandes</strong> → pour rechercher un produit ou un service.</li>
        <li>* Les annonces sont classées par secteur d'activité et par localisation pour faciliter le ciblage.</li>
      </ul>
    ),
  },
  {
    title: "Explorer le marketplace",
    content: (
      <ul className="flex flex-col gap-2 text-sm text-gray-600">
        <li>* Naviguez dans le catalogue d'annonces pour découvrir des <strong>opportunités d'affaires</strong>.</li>
        <li>* Utilisez les filtres de recherche (secteur, localisation, type d'annonce) pour trouver exactement ce que vous cherchez.</li>
        <li>* Chaque annonce est étiquetée <strong>Offre</strong> ou <strong>Demande</strong> pour une lecture rapide.</li>
      </ul>
    ),
  },
  {
    title: "Correspondance intelligente",
    content: (
      <ul className="flex flex-col gap-2 text-sm text-gray-600">
        <li>* Le système de Moubadala.ma vous propose automatiquement les annonces compatibles avec les vôtres.</li>
        <li>* Exemple : si vous publiez une Demande en « Transport logistique », vous verrez immédiatement les Offres correspondantes.</li>
      </ul>
    ),
  },
  {
    title: "Prendre contact",
    content: (
      <ul className="flex flex-col gap-2 text-sm text-gray-600">
        <li>* Depuis une annonce, vous pouvez entrer en relation directement avec l'entreprise concernée.</li>
        <li>* La plateforme sécurise ce premier échange via la <strong>messagerie interne intégrée</strong>.</li>
        <li>* Vous gardez ainsi la maîtrise de vos informations, tout en échangeant facilement avec vos futurs partenaires.</li>
      </ul>
    ),
  },
  {
    title: "Évaluer la compatibilité et négocier",
    content: (
      <ul className="flex flex-col gap-2 text-sm text-gray-600">
        <li>* Après avoir établi le premier contact, discutez des détails : prix, conditions, délais...</li>
        <li>* Moubadala.ma n'intervient pas dans la négociation, mais facilite et encourage la <strong>mise en relation claire et transparente</strong>.</li>
      </ul>
    ),
  },
  {
    title: "Conclure votre transaction",
    content: (
      <ul className="flex flex-col gap-2 text-sm text-gray-600">
        <li>* Une fois l'accord trouvé, la transaction se concrétise directement entre entreprises.</li>
        <li>* Vous pouvez ensuite mettre à jour ou clôturer votre annonce sur la plateforme.</li>
      </ul>
    ),
  },
  {
    title: "Développez votre réseau",
    content: (
      <ul className="flex flex-col gap-2 text-sm text-gray-600">
        <li>* Chaque échange est aussi une opportunité de partenariat à long terme.</li>
        <li>* Plus vous utilisez Moubadala.ma, plus la plateforme apprend à vous proposer des partenaires et des opportunités pertinentes.</li>
      </ul>
    ),
  },
];

const timeline = [
  { label: "Inscription gratuite" },
  { label: "Publier une annonce" },
  { label: "Développez votre réseau" },
];

export default function CommentCaMarchePage() {
  const [openIndex, setOpenIndex] = useState<number>(0);

  return (
    <>
      {/* Page title */}
      <section className="bg-gray-50 py-12 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-[#0D3B66]">
            Comment ça marche ?
          </h1>
        </div>
      </section>

      {/* Accordion */}
      <section className="bg-white py-8 px-6">
        <div className="max-w-7xl mx-auto">
          {steps.map((step, index) => {
            const isOpen = openIndex === index;
            return (
              <div key={step.title} className="border-b border-gray-100">
                <button
                  className="w-full flex items-center justify-between py-5 text-left group"
                  onClick={() => setOpenIndex(isOpen ? -1 : index)}
                >
                  <span className="text-sm font-bold text-[#0D3B66] group-hover:text-[#F5A623] transition-colors">
                    {step.title}
                  </span>
                  <span className="w-9 h-9 rounded-full bg-[#0D3B66] flex items-center justify-center shrink-0">
                    {isOpen
                      ? <ChevronUp size={16} className="text-white" />
                      : <ChevronRight size={16} className="text-white" />
                    }
                  </span>
                </button>
                {isOpen && (
                  <div className="pb-6 pr-14">
                    {step.content}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Timeline */}
      <section className="bg-gray-50 py-16 px-6">
        <div className="max-w-3xl mx-auto">

          {/* Dots + lines row */}
          <div className="flex items-center justify-center mb-8">
            {timeline.map((item, i) => (
              <div key={item.label} className="flex items-center">
                <div className="w-5 h-5 rounded-full border-2 border-[#F5A623] bg-white" />
                {i < timeline.length - 1 && (
                  <div className="w-32 md:w-48 h-px bg-[#F5A623]" />
                )}
              </div>
            ))}
          </div>

          {/* Labels + arrows row */}
          <div className="flex items-start justify-between">
            {timeline.map((item, i) => (
              <div key={item.label} className="flex items-center gap-3">
                <p className="text-[#0D3B66] font-bold text-sm md:text-base text-center max-w-[120px]">
                  {item.label}
                </p>
                {i < timeline.length - 1 && (
                  <ChevronRight size={18} className="text-[#F5A623] shrink-0" />
                )}
              </div>
            ))}
          </div>

        </div>
      </section>
    </>
  );
}