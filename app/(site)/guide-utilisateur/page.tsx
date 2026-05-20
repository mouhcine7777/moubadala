import Link from "next/link";

const steps = [
  {
    number: 1,
    title: "Connexion à votre compte",
    items: [
      <>Cliquez sur <strong>« Connexion / S'inscrire »</strong> dans le menu supérieur.</>,
      <>Entrez vos identifiants ou créez un nouveau <strong>compte entreprise</strong>.</>,
      <>Accédez à votre <strong>Tableau de bord professionnel</strong>.</>,
    ],
  },
  {
    number: 2,
    title: "Accès au module « Publier une annonce »",
    items: [
      <>Dans le tableau de bord, cliquez sur <strong>« Publier une annonce »</strong>.</>,
      <>Le formulaire d'ajout Listivo s'ouvre automatiquement.</>,
    ],
  },
  {
    number: 3,
    title: "Informations principales de l'annonce",
    items: [
      <><strong>Titre</strong> : nom explicite de votre offre ou demande d'échange.</>,
      <><strong>Catégorie</strong> : sélectionnez le secteur approprié (IT, Marketing, Industrie…).</>,
      <><strong>Type d'annonce</strong> : Offre / Demande.</>,
      <><strong>Description</strong> : détaillez votre prestation, la valeur et le type d'échange souhaité.</>,
      <><strong>Valeur estimée</strong> : indiquez en dirhams (MAD) la valeur référentielle de l'échange.</>,
      <><strong>Images / logo</strong> : ajoutez de 1 à 5 visuels de qualité.</>,
      <><strong>Localisation</strong> (ville ou région).</>,
    ],
  },
  {
    number: 4,
    title: "Paramètres spécifiques « Echange »",
    items: [
      <><strong>Type d'échange</strong> : Service↔Service, Produit↔Service, Produit↔Produit.</>,
      <><strong>Équivalence souhaitée</strong> : par ex. 80 % barter + 20 % numéraire.</>,
      <><strong>Valeur barter</strong> : valeur globale estimée de l'opération.</>,
      <><strong>Conditions spéciales</strong> : mentions comme "Facture compensée — Valeur en échange".</>,
      <><strong>Disponibilité</strong> : période pendant laquelle l'offre est active.</>,
    ],
  },
  {
    number: 5,
    title: "Visibilité et publication",
    items: [
      <>Option <strong>Annonce standard</strong> : publiée dans la catégorie choisie.</>,
      <>Option <strong>Annonce mise en avant (Featured)</strong> : affichée sur la page d'accueil.</>,
      <>Définissez la <strong>durée de publication</strong> : 30, 60 ou 90 jours selon le plan.</>,
      <>Prévisualisez avant publication, puis cliquez sur <strong>« Soumettre »</strong>.</>,
    ],
  },
  {
    number: 6,
    title: "Validation et suivi",
    items: [
      <>L'annonce est soumise à <strong>validation</strong> par l'équipe Moubadala avant mise en ligne.</>,
      <>Vous pouvez consulter le <strong>statut</strong> : En attente / Validée / Publiée.</>,
      <>Depuis le tableau de bord, modifiez, mettez en pause ou supprimez votre annonce.</>,
      <>Suivez vos <strong>messages reçus</strong> grâce à la messagerie intégrée.</>,
    ],
  },
];

const errors = [
  { type: "error", text: "Images trop volumineuses ou format non supporté (préférez JPEG/PNG < 2 Mo)." },
  { type: "error", text: "Champs obligatoires laissés vides (titre, description, valeur, etc.)." },
  { type: "error", text: "Saisir du texte au lieu d'un chiffre pour la valeur en MAD." },
  { type: "error", text: "Doubles annonces identiques (risque de rejet automatique)." },
  { type: "warning", text: "Annonce non validée encore par l'administrateur : attendez l'email de confirmation." },
];

const bestPractices = [
  { practice: "Indiquer toujours la valeur en MAD", reason: "Facilite la facturation et la transparence fiscale." },
  { practice: "Des titres courts et précis", reason: "Améliore la visibilité et le référencement interne." },
  { practice: "Décrire à la fois l'offre et le besoin d'échange", reason: "Favorise le matching rapide entre entreprises." },
  { practice: "Ajouter un logo ou visuel professionnel", reason: "Renforce la crédibilité de votre annonce." },
  { practice: "Actualiser fréquemment vos annonces", reason: "Maintient la position en tête de la Marketplace." },
  { practice: "Préciser les conditions barter (pourcentage cash s'il y a lieu)", reason: "Évite les malentendus lors de la négociation." },
];

export default function GuideUtilisateurPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-[#0D3B66] py-10 px-6">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-white text-2xl md:text-3xl font-bold flex items-center gap-3">
            <span>📋</span>
            Guide complet — Publier une annonce sur Moubadala.ma
          </h1>
        </div>
      </section>

      {/* Content */}
      <section className="bg-gray-50 py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-xl shadow-sm p-8 md:p-12">

            {/* Steps */}
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
                      <p key={i} className="text-gray-600 text-sm leading-relaxed">
                        {item}
                      </p>
                    ))}
                  </div>
                </div>
              ))}

              {/* Errors section */}
              <div>
                <h2 className="flex items-center gap-3 text-[#0D3B66] font-bold text-lg mb-3">
                  <span className="bg-[#0D3B66] text-white w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold shrink-0">
                    7
                  </span>
                  Erreurs fréquentes à éviter
                </h2>
                <div className="border-l-2 border-[#0D3B66]/20 pl-6 flex flex-col gap-2">
                  {errors.map((err, i) => (
                    <p key={i} className="text-gray-600 text-sm leading-relaxed flex items-start gap-2">
                      <span>{err.type === "error" ? "❌" : "⚠️"}</span>
                      {err.text}
                    </p>
                  ))}
                </div>
              </div>

              {/* Best practices table */}
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
                <h3 className="flex items-center gap-2 text-amber-800 font-bold text-base mb-5">
                  <span>💡</span>
                  Bonnes pratiques Moubadala
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border-collapse">
                    <thead>
                      <tr className="bg-[#0D3B66] text-white">
                        <th className="px-4 py-3 text-left font-semibold rounded-tl-lg">
                          Bonne pratique
                        </th>
                        <th className="px-4 py-3 text-left font-semibold rounded-tr-lg">
                          Pourquoi c'est utile
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {bestPractices.map((row, i) => (
                        <tr
                          key={i}
                          className={i % 2 === 0 ? "bg-white" : "bg-amber-50/50"}
                        >
                          <td className="px-4 py-3 text-gray-700 border-b border-amber-100">
                            {row.practice}
                          </td>
                          <td className="px-4 py-3 text-gray-600 border-b border-amber-100">
                            {row.reason}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}