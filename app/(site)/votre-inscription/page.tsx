import Link from "next/link";

const steps = [
  {
    number: 1,
    title: "Accéder au site",
    items: [
      <>Rendez-vous sur <Link href="https://www.moubadala.ma" className="text-[#0D3B66] underline hover:text-[#F5A623] transition-colors">www.moubadala.ma</Link>.</>,
    ],
  },
  {
    number: 2,
    title: "Créer votre compte",
    items: [
      <>Cliquez sur <strong>« Créer mon compte »</strong> dans le menu supérieur, ou sur <strong>« Je rejoins Moubadala »</strong> en bas de page.</>,
    ],
  },
  {
    number: 3,
    title: "Saisir vos informations",
    items: [
      <>Entrez votre <strong>adresse e-mail</strong>.</>,
      <>Choisissez votre <strong>mot de passe</strong>.</>,
    ],
  },
  {
    number: 4,
    title: "Valider votre inscription",
    items: [
      <>Confirmez votre inscription en cliquant sur le lien dans l'<strong>e-mail automatique</strong> envoyé à votre adresse.</>,
    ],
  },
  {
    number: 5,
    title: "Accéder à votre espace membre",
    items: [
      <>Accédez maintenant à votre <strong>Espace Membre sécurisé</strong> pour renseigner vos informations d'entreprise.</>,
    ],
  },
  {
    number: 6,
    title: "Compléter votre profil",
    items: [
      <>Renseignez votre <strong>logo</strong> et votre <strong>description d'activité</strong>.</>,
      <>Précisez votre <strong>secteur</strong>, vos <strong>contacts</strong> et vos <strong>identifiants légaux</strong> de la société.</>,
      <>Déposez vos <strong>fichiers Média</strong>.</>,
    ],
  },
  {
    number: 7,
    title: "Publier votre première annonce",
    items: [
      <>Une fois votre profil complété, vous êtes prêt à publier votre première annonce dès réception de la <strong>validation de votre compte</strong> par l'équipe Moubadala.</>,
    ],
  },
];

const timeline = [
  { label: "Créer votre compte" },
  { label: "Compléter votre profil" },
  { label: "Publier une annonce" },
];

export default function VotreInscriptionPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-[#0D3B66] py-10 px-6">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-white text-2xl md:text-3xl font-bold flex items-center gap-3">
            <span>📝</span>
            S'inscrire sur Moubadala.ma
          </h1>
        </div>
      </section>

      {/* Steps */}
      <section className="bg-gray-50 py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-xl shadow-sm p-8 md:p-12">
            <div className="flex flex-col gap-10">
              {steps.map((step) => (
                <div key={step.number}>
                  <h2 className="flex items-center gap-3 text-[#0D3B66] font-bold text-lg mb-3">
                    <span className="bg-[#0D3B66] text-white w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold shrink-0">
                      {step.number}
                    </span>
                    {step.title}
                  </h2>
                  <div className="border-l-2 border-[#0D3B66]/20 pl-6 flex flex-col gap-1.5">
                    {step.items.map((item, i) => (
                      <p key={i} className="text-black text-sm leading-relaxed">
                        {item}
                      </p>
                    ))}
                  </div>
                </div>
              ))}

              {/* CTA box */}
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <p className="text-amber-800 font-bold text-base flex items-center gap-2">
                    <span>🚀</span>
                    Prêt à rejoindre Moubadala ?
                  </p>
                  <p className="text-amber-700 text-sm mt-1">
                    L'inscription est gratuite et prend moins de 2 minutes.
                  </p>
                </div>
                <Link
                  href="/inscription"
                  className="shrink-0 bg-[#F5A623] hover:bg-[#e09510] text-white font-semibold px-6 py-2.5 rounded transition-colors text-sm"
                >
                  Créer mon compte
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}