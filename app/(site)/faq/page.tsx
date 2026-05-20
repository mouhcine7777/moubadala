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
          'Pour créer un compte entreprise, cliquez sur "créer mon compte" et inscrivez votre adresse mail et mot de passe. Vous devez communiquer toutes les informations demandées et relatives à votre activité et votre entreprise.',
      },
      {
        question: "Quels documents sont nécessaires ?",
        answer:
          "Vous aurez besoin de :\n- Modèle J du Registre de commerce\n- Identifiant fiscal\n- Affiliation CNSS\n- Copie de patente Siège social",
      },
      {
        question: "Puis-je avoir plusieurs comptes pour ma société ?",
        answer:
          "Oui, vous pouvez créer des sous-comptes pour vos collaborateurs une fois votre compte principal validé. Chaque sous-compte aura des permissions configurables.",
      },
    ],
  },
  {
    title: "Les Transactions",
    items: [
      {
        question: "Comment fonctionnent les échanges ?",
        answer:
          "Notre Plateforme recommande d'évaluer les échanges en dirhams marocains pour faciliter l'accomplissement des transactions et aussi pour une conformité aux déclarations fiscales et réglementaires exigibles. Vous publiez vos offres, elles sont évaluées en dirhams. Lors d'un échange, les valeurs convenues sont transférées entre comptes. Si les valeurs ne sont pas équivalentes, la plus faible valeur compense en numéraire l'autre partie. Ainsi les transactions se trouvent soldées et complètement achevées.",
      },
      {
        question: "Comment sont évalués les biens/services ?",
        answer:
          "L'évaluation se base généralement sur :\n- Valeur du marché\n- État/qualité du bien/service\n- Le consentement des parties\n- La plateforme Moubadala n'intervient d'aucune manière ni à aucun stade dans la détermination des valeurs d'échange. Seules les parties contractantes ont pouvoirs de négociation.",
      },
      {
        question: "Que faire en cas de litige sur un échange ?",
        answer:
          "Nos services interviennent pour résoudre à l'amiable les litiges qui peuvent surgir. Les parties contractantes peuvent accepter des propositions de solutions ou recourir aux institutions judiciaires compétentes. Moubadala.ma n'est en aucune manière partie prenante dans les litiges.",
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
      "L'inscription et l'utilisation de Moubadala.ma sont sur Abonnement qui varie selon le pack choisi. Nous prélevons une commission sur les transactions entièrement réalisées. Votre abonnement vous ouvre sur un monde d'opportunités d'échange et de Partenariats dans la communauté Moubadala.",
  },
  {
    question: "Comment sécurisez-vous les transactions ?",
    answer:
      "Nous utilisons :\n- Chiffrement SSL 256-bit\n- Validation en 2 étapes\n- Audit régulier de sécurité\n- Protection contre les fraudes",
  },
  {
    question: "Comment contacter le support ?",
    answer:
      "Notre équipe est disponible :\n- Par email : contact@moubadala.ma\n- Par téléphone : +212 (0)601840707\n- Via le chat en ligne sur notre plateforme",
  },
  {
    question: "Puis-je annuler une transaction ?",
    answer:
      "Les annulations sont possibles :\n- Avant validation par les deux parties\n- Sous 48h après accord mutuel\n- En cas de force majeure dûment justifiée\n- Lorsque l'annulation est confirmée par les parties, tout est restitué aux parties. Les commissions restent dues.",
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
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-gray-50 transition-colors"
      >
        <span className="text-base font-semibold text-[#0D3B66]">
          {item.question}
        </span>
        <span
          className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ml-4 transition-colors ${
            isOpen ? "bg-[#F5A623] text-white" : "bg-gray-100 text-gray-400"
          }`}
        >
          {isOpen ? <ArrowUp size={16} /> : <ArrowLeft size={16} />}
        </span>
      </button>
      {isOpen && (
        <div className="px-6 pb-6 pt-2">
          <p className="text-base text-black leading-relaxed whitespace-pre-line">
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
      <section className="bg-gradient-to-r from-[#0D3B66] to-[#1a8a6e] py-16 px-6 text-center text-white">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Foire Aux Questions
        </h1>
        <p className="text-white/80 text-lg">
          Trouvez rapidement les réponses à vos questions sur notre plateforme
        </p>
      </section>

      {/* FAQ sections */}
      <section className="bg-white py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col gap-12">
            {faqSections.map((section, sIdx) => (
              <div key={section.title}>
                <h2 className="text-2xl font-bold text-[#0D3B66] mb-6">
                  {section.title}
                </h2>
                <div className="flex flex-col gap-4">
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
      <section className="bg-white py-4 px-6 pb-20">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col gap-4">
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