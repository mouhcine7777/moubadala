"use client";
import { useState } from "react";
import { ArrowUp, ArrowLeft } from "lucide-react";

type FaqItem = {
  question: string;
  answer: string;
};

type FaqSection = {
  title: string;
  items: FaqItem[];
};

const faqSections: FaqSection[] = [
  {
    title: "Inscription & Compte",
    items: [
      {
        question: "Comment créer un compte entreprise ?",
        answer:
          'Pour créer un compte entreprise, cliquez sur "Inscription" et sélectionnez "Compte Professionnel". Vous devrez fournir les informations de votre entreprise et des documents justificatifs. Notre équipe validera votre compte sous 24h.',
      },
      {
        question: "Quels documents sont nécessaires ?",
        answer:
          "Vous aurez besoin de :\n- Registre de commerce\n- Identifiant fiscal\n- CNIE du représentant légal\n- Justificatif de domicile",
      },
      {
        question: "Puis-je avoir plusieurs comptes pour ma société ?",
        answer:
          "Oui, vous pouvez créer des sous-comptes pour vos collaborateurs une fois votre compte principal validé. Chaque sous-compte aura des permissions configurables.",
      },
    ],
  },
  {
    title: "Transactions",
    items: [
      {
        question: "Comment fonctionnent les échanges ?",
        answer:
          "Notre système utilise des crédits d'échange. Vous publiez vos offres, elles sont évaluées en crédits. Lors d'un échange, les crédits sont transférés entre comptes. Vous pouvez ensuite utiliser ces crédits pour acquérir d'autres biens/services.",
      },
      {
        question: "Comment sont évalués les biens/services ?",
        answer:
          "L'évaluation se base sur :\n- Valeur marchande\n- Demande sur la plateforme\n- État/qualité du bien/service\n- Durée de validité\nNotre algorithme vous propose une fourchette de crédits.",
      },
      {
        question: "Que faire en cas de litige sur un échange ?",
        answer:
          "Notre service de médiation intervient dans les 48h pour résoudre les litiges. Vous pouvez ouvrir un ticket depuis votre espace client. Nous conservons toutes les preuves d'échange pour faciliter la résolution.",
      },
    ],
  },
];

const generalFaqs: FaqItem[] = [
  {
    question: "Qui peut utiliser Moubadala ?",
    answer:
      "Toutes les entreprises marocaines légalement enregistrées peuvent utiliser notre plateforme. Nous acceptons les TPE, PME, grandes entreprises et professionnels indépendants de tous secteurs.",
  },
  {
    question: "Y a-t-il des frais d'utilisation ?",
    answer:
      "L'inscription et l'utilisation de base sont gratuites. Nous prélevons une commission de 5% seulement lors de la finalisation d'un échange réussi.",
  },
  {
    question: "Comment sécurisez-vous les transactions ?",
    answer:
      "Nous utilisons :\n- Chiffrement SSL 256-bit\n- Validation en 2 étapes\n- Audit régulier de sécurité\n- Protection contre les fraudes",
  },
  {
    question: "Comment contacter le support ?",
    answer:
      "Vous pouvez nous contacter via le formulaire de contact sur notre site, par email à contact@moubadala.ma ou par téléphone au +212 601 840 707.",
  },
  {
    question: "Puis-je annuler une transaction ?",
    answer:
      "Les annulations sont possibles :\n- Avant validation par les deux parties\n- Sous 24h après accord mutuel\n- En cas de force majeure dûment justifiée\nLes crédits sont alors restitués intégralement.",
  },
  {
    question: "Comment sont traités mes données ?",
    answer:
      "Nous respectons strictement la réglementation RGPD. Vos données sont :\n- Stockées de manière sécurisée\n- Utilisées uniquement pour le service\n- Supprimées à votre demande\n- Jamais vendues à des tiers",
  },
];

function AccordionItem({
  item,
  isOpen,
  onToggle,
}: {
  item: FaqItem;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50 transition-colors"
      >
        <span className="text-sm font-semibold text-[#0D3B66]">
          {item.question}
        </span>
        <span
          className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ml-4 transition-colors ${
            isOpen ? "bg-[#F5A623] text-white" : "bg-gray-100 text-gray-400"
          }`}
        >
          {isOpen ? <ArrowUp size={14} /> : <ArrowLeft size={14} />}
        </span>
      </button>
      {isOpen && (
        <div className="px-5 pb-5 pt-1">
          <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
            {item.answer}
          </p>
        </div>
      )}
    </div>
  );
}

export default function FaqPage() {
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({
    "section-0-0": true,
    "section-1-0": true,
    "general-0": true,
  });

  const toggle = (key: string) => {
    setOpenItems((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-r from-[#0D3B66] to-[#1a8a6e] py-14 px-6 text-center text-white">
        <h1 className="text-3xl md:text-4xl font-bold mb-3">
          Foire Aux Questions
        </h1>
        <p className="text-white/80 text-base">
          Trouvez rapidement les réponses à vos questions sur notre plateforme
        </p>
      </section>

      {/* Two column sections */}
      <section className="bg-white py-14 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {faqSections.map((section, sIdx) => (
              <div key={section.title}>
                <h2 className="text-lg font-bold text-[#0D3B66] mb-5">
                  {section.title}
                </h2>
                <div className="flex flex-col gap-3">
                  {section.items.map((item, iIdx) => (
                    <AccordionItem
                      key={iIdx}
                      item={item}
                      isOpen={!!openItems[`section-${sIdx}-${iIdx}`]}
                      onToggle={() => toggle(`section-${sIdx}-${iIdx}`)}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* General FAQs */}
      <section className="bg-white py-4 px-6 pb-16">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-lg font-bold text-[#0D3B66] mb-5">
            Questions les plus fréquentes
          </h2>
          <div className="flex flex-col gap-3">
            {generalFaqs.map((item, idx) => (
              <AccordionItem
                key={idx}
                item={item}
                isOpen={!!openItems[`general-${idx}`]}
                onToggle={() => toggle(`general-${idx}`)}
              />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}