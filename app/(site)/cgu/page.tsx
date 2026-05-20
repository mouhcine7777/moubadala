export default function CguPage() {
  return (
    <section className="bg-white py-16 px-6">
      <div className="max-w-7xl mx-auto">

        {/* Title */}
        <h1 className="text-4xl font-bold text-[#0D3B66] text-center mb-12">
          Conditions Générales d'Utilisation
        </h1>

        {/* Last update */}
        <div className="inline-block border border-gray-200 rounded px-4 py-1.5 text-sm text-black mb-8">
          Dernière mise à jour : 01 avril 2026
        </div>

        {/* Intro */}
        <p className="text-black text-base leading-relaxed font-bold mb-12">
          Les présentes Conditions Générales d'Utilisation (ci-après "CGU") régissent l'accès et l'utilisation
          de la plateforme moubadala.ma (ci-après "la Plateforme"), accessible à l'adresse www.moubadala.ma
          <br /><br />
          L'inscription et l'utilisation de la Plateforme impliquent l'acceptation pleine et entière des
          présentes CGU par l'Utilisateur.
        </p>

        {/* Articles */}
        <div className="flex flex-col gap-12">

          {/* Article 1 */}
          <div>
            <h2 className="text-xl font-bold text-[#0D3B66] pb-3 border-b border-gray-200 mb-5">
              Article 1 : Définitions
            </h2>
            <ul className="flex flex-col gap-3 text-base text-black">
              <li>• <strong>Plateforme :</strong> Désigne le site web Moubadala.ma et l'ensemble de ses fonctionnalités.</li>
              <li>• <strong>Utilisateur :</strong> Toute personne morale ou physique agissant dans le cadre de son activité professionnelle, inscrite et utilisant les services de la Plateforme.</li>
              <li>• <strong>Service :</strong> L'ensemble des prestations de mise en relation proposées par la Plateforme en vue de faciliter l'échange de biens ou de services entre les Utilisateurs.</li>
              <li>• <strong>Offre :</strong> Annonce publiée par un Utilisateur sur la Plateforme en vue de proposer un bien ou un service à l'échange.</li>
              <li>• <strong>Échange :</strong> Accord d'échange conclu directement entre deux Utilisateurs.</li>
            </ul>
          </div>

          {/* Article 2 */}
          <div>
            <h2 className="text-xl font-bold text-[#0D3B66] pb-3 border-b border-gray-200 mb-5">
              Article 2 : Objet de la Plateforme
            </h2>
            <p className="text-black text-base leading-relaxed">
              Moubadala a pour objet de fournir un service de mise en relation entre des entreprises souhaitant
              échanger entre elles des biens et/ou des services. Moubadala agit en tant qu'intermédiaire technique
              et ne devient à aucun moment partie aux contrats d'échange conclus entre les Utilisateurs.
            </p>
          </div>

          {/* Article 3 */}
          <div>
            <h2 className="text-xl font-bold text-[#0D3B66] pb-3 border-b border-gray-200 mb-5">
              Article 3 : Inscription et Accès
            </h2>
            <div className="flex flex-col gap-4 text-base text-black leading-relaxed">
              <p>
                L'accès aux services de la Plateforme nécessite la création d'un compte. L'Utilisateur doit être
                une entité légale (société, auto-entrepreneur…) dûment enregistrée au Maroc.
              </p>
              <p>
                L'Utilisateur s'engage à fournir des informations exactes, complètes et à jour lors de son
                inscription et à les maintenir ainsi tout au long de son utilisation. La Plateforme se réserve
                le droit de suspendre ou de résilier un compte en cas de fourniture d'informations fausses ou trompeuses.
              </p>
            </div>
          </div>

          {/* Article 4 */}
          <div>
            <h2 className="text-xl font-bold text-[#0D3B66] pb-3 border-b border-gray-200 mb-5">
              Article 4 : Obligations des Utilisateurs
            </h2>
            <p className="text-black text-base mb-4">L'Utilisateur s'engage à :</p>
            <ul className="flex flex-col gap-3 text-base text-black">
              <li>• Utiliser la Plateforme de manière loyale et à des fins exclusivement professionnelles.</li>
              <li>• Ne pas publier d'Offres concernant des biens ou services illicites, contrefaits ou contraires aux bonnes mœurs.</li>
              <li>• Être le propriétaire légitime des biens ou le prestataire habilité des services qu'il propose.</li>
              <li>• Respecter les termes des accords d'échange conclus avec d'autres Utilisateurs.</li>
              <li>• Garder confidentiels ses identifiants de connexion.</li>
              <li>• Respecter ses engagements vis à vis de la plateforme notamment moraux et financiers.</li>
            </ul>
          </div>

          {/* Article 5 */}
          <div>
            <h2 className="text-xl font-bold text-[#0D3B66] pb-3 border-b border-gray-200 mb-5">
              Article 5 : Responsabilité
            </h2>
            <div className="flex flex-col gap-4 text-base text-black leading-relaxed">
              <p>
                Moubadala fournit un outil de mise en relation mais ne garantit en aucun cas la qualité, la conformité,
                la sécurité ou la légalité des Offres publiées. La responsabilité de Moubadala ne saurait être engagée
                en cas de litige survenant entre des Utilisateurs suite à un accord d'échange.
              </p>
              <p>
                Il incombe aux Utilisateurs de vérifier la qualité et la conformité des biens et services avant de
                conclure un échange. Moubadala n'est pas responsable des dommages directs ou indirects résultant
                de l'utilisation de la Plateforme.
              </p>
            </div>
          </div>

          {/* Article 6 */}
          <div>
            <h2 className="text-xl font-bold text-[#0D3B66] pb-3 border-b border-gray-200 mb-5">
              Article 6 : Propriété Intellectuelle
            </h2>
            <div className="flex flex-col gap-4 text-base text-black leading-relaxed">
              <p>
                L'ensemble des éléments constituant la Plateforme (textes, graphismes, logo, code…) est la propriété
                exclusive de Moubadala. Toute reproduction, même partielle, est strictement interdite.
              </p>
              <p>
                L'Utilisateur reste propriétaire du contenu (textes, images) qu'il publie dans ses Offres. Il concède
                cependant à Moubadala une licence non-exclusive, mondiale et gratuite pour utiliser, reproduire et
                afficher ce contenu dans le cadre du Service.
              </p>
            </div>
          </div>

          {/* Article 7 */}
          <div>
            <h2 className="text-xl font-bold text-[#0D3B66] pb-3 border-b border-gray-200 mb-5">
              Article 7 : Droit Applicable et Juridiction
            </h2>
            <p className="text-black text-base leading-relaxed">
              Les présentes CGU sont soumises au droit marocain. En cas de litige relatif à leur interprétation
              ou à leur exécution, et à défaut d'accord amiable, compétence exclusive est attribuée aux Tribunaux
              de Commerce de Casablanca.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}