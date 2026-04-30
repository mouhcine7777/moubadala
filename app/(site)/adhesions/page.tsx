import { Check } from "lucide-react";

const plans = [
  {
    name: "Essentiel",
    price: "500,00 DH",
    period: "HT/an",
    commission: "5% de commission par transaction",
    commissionColor: "text-[#F5A623]",
    features: [
      "Accès Total à la place de marché",
      "Publication jusqu'à 6 Annonces",
      "Accès au Centre de Ressources",
      "Support par e-mail",
    ],
    highlighted: false,
    border: "border border-gray-200",
  },
  {
    name: "Croissance",
    price: "1250,00 DH",
    period: "HT/an",
    commission: "4% de commission par transaction",
    commissionColor: "text-[#F5A623]",
    features: [
      "Accès Total à la place de marché",
      "Publication jusqu'à 12 Annonces",
      "Accès au Centre de Ressources",
      "Support prioritaire",
      "Statistiques de performance",
    ],
    highlighted: true,
    border: "border-2 border-[#F5A623]",
  },
  {
    name: "Partenaire",
    price: "2500,00 DH",
    period: "HT/an",
    commission: "2,5% de commission par transaction",
    commissionColor: "text-[#F5A623]",
    features: [
      "Tous les avantages du plan Croissance",
      "Publication Annonces Illimitée.",
      "Mise en avant de vos offres avec Offre à la une.",
      "Accès aux événements exclusifs",
      "Gestionnaire de compte dédié",
    ],
    highlighted: false,
    border: "border border-gray-200",
  },
];

const premiumServices = [
  {
    title: "Offre à la Une",
    description:
      "Placez votre offre en tête des résultats de recherche et sur la page d'accueil pendant une semaine. Visibilité maximale garantie.",
  },
  {
    title: "Article de Blog Dédié",
    description:
      "Notre équipe de rédaction écrit un article complet sur votre entreprise, votre savoir-faire ou un de vos produits phares, publié sur notre blog.",
  },
  {
    title: "Spotlight Newsletter",
    description:
      "Présentez votre entreprise à l'ensemble de notre communauté via un encart exclusif dans notre newsletter mensuelle.",
  },
];

export default function AdhesionsPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-white py-16 px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-[#0D3B66] mb-5">
            Un Investissement dans Votre Croissance
          </h1>
          <p className="text-gray-500 text-base leading-relaxed">
            Choisissez le plan qui correspond à votre ambition.<br />
            Une tarification claire pour accéder à un réseau d'opportunités unique au Maroc.
          </p>
        </div>
      </section>

      {/* Pricing cards */}
      <section className="bg-gray-50 py-10 px-6 pb-20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`bg-white rounded-xl p-8 flex flex-col gap-5 ${plan.border} ${
                plan.highlighted ? "shadow-xl scale-105" : "shadow-sm"
              }`}
            >
              <h2 className="text-2xl font-bold text-[#0D3B66] text-center">
                {plan.name}
              </h2>

              <div className="text-center">
                <span className="text-2xl font-bold text-[#0D3B66]">
                  {plan.price}
                </span>
                <span className="text-gray-400 text-sm ml-1">{plan.period}</span>
              </div>

              <p className={`text-sm font-semibold text-center ${plan.commissionColor}`}>
                {plan.commission}
              </p>

              <ul className="flex flex-col gap-3 flex-1">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm text-gray-600">
                    <Check size={15} className="text-green-500 shrink-0 mt-0.5" />
                    {feature}
                  </li>
                ))}
              </ul>


            </div>
          ))}
        </div>
      </section>

      {/* Virement Bancaire */}
      <section className="bg-[#0D3B66] py-16 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <span className="inline-block bg-[#F5A623] text-white text-xs font-bold tracking-widest uppercase px-4 py-1 rounded-full mb-6">
            Paiement par Virement
          </span>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
            Comment régler votre adhésion ?
          </h2>
          <p className="text-white/60 text-sm leading-relaxed mb-10">
            Le paiement en ligne n'est pas encore disponible.<br />
            Merci d'effectuer votre règlement par virement bancaire aux coordonnées ci-dessous.
          </p>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-8 text-left flex flex-col gap-5">
            <div className="flex flex-col gap-1">
              <span className="text-[#F5A623] text-xs font-bold uppercase tracking-widest">Bénéficiaire</span>
              <span className="text-white font-semibold text-base">MGH-CONSULTING</span>
            </div>
            <hr className="border-white/10" />
            <div className="flex flex-col gap-1">
              <span className="text-[#F5A623] text-xs font-bold uppercase tracking-widest">RIB</span>
              <span className="text-white font-mono font-semibold text-base tracking-widest bg-white/5 border border-white/10 px-4 py-3 rounded-lg">
                007 780 000638100000051675
              </span>
            </div>
            <hr className="border-white/10" />
            <div className="flex flex-col gap-1">
              <span className="text-[#F5A623] text-xs font-bold uppercase tracking-widest">Banque</span>
              <span className="text-white font-semibold text-base">Attijariwafa Bank</span>
            </div>
            <hr className="border-white/10" />
            <div className="flex flex-col gap-1">
              <span className="text-[#F5A623] text-xs font-bold uppercase tracking-widest">Agence</span>
              <span className="text-white font-semibold text-base">Alhamidia – Alqods – Bernoussi, Casablanca</span>
            </div>
          </div>

          <p className="text-white/40 text-xs mt-6">
            Après votre virement, merci de nous envoyer le justificatif par e-mail pour activer votre compte.
          </p>
        </div>
      </section>

      {/* Premium services */}
      <section className="bg-white py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#0D3B66] mb-4">
              Services Premium à la Carte
            </h2>
            <p className="text-gray-500 text-base leading-relaxed">
              Donnez à votre entreprise la visibilité qu'elle mérite.<br />
              Des prestations exclusives pour amplifier votre impact au sein du réseau Moubadala.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {premiumServices.map((service) => (
              <div
                key={service.title}
                className="border border-gray-200 rounded-xl p-8 flex flex-col gap-4 hover:shadow-md transition-shadow"
              >
                <h3 className="text-lg font-bold text-[#0D3B66] text-center">
                  {service.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed text-center flex-1">
                  {service.description}
                </p>
                <p className="text-[#F5A623] font-bold text-center text-base">
                  Sur devis
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}