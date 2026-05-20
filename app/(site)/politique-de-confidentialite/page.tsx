export default function PolitiqueConfidentialitePage() {
  return (
    <section className="bg-white py-16 px-6">
      <div className="max-w-7xl mx-auto">

        {/* Title */}
        <h1 className="text-4xl font-bold text-[#0D3B66] text-center mb-12">
          Politique de Confidentialité
        </h1>

        {/* Last update */}
        <div className="inline-block border border-gray-200 rounded px-4 py-1.5 text-sm text-black mb-8">
          Dernière mise à jour : 01 avril 2026
        </div>

        {/* Intro */}
        <p className="text-black text-base leading-relaxed font-bold mb-5">
          Chez Moubadala, nous prenons la protection de vos données personnelles très au sérieux.
          Cette politique de confidentialité explique comment nous collectons, utilisons, partageons
          et protégeons vos informations lorsque vous utilisez notre plateforme d'échange inter-entreprises.
        </p>

        {/* Notice box */}
        <div className="bg-amber-50 border border-amber-200 rounded px-5 py-4 text-base text-amber-900 mb-12">
          En utilisant notre service, vous acceptez les pratiques décrites dans cette politique.
          Si vous n'êtes pas d'accord avec ces termes, merci de nous en informer lors de votre demande d'inscription.
        </div>

        {/* Sections */}
        <div className="flex flex-col gap-12">

          {/* 1 */}
          <div>
            <h2 className="text-xl font-bold text-[#0D3B66] pb-3 border-b border-gray-200 mb-5">
              1. Données que nous collectons
            </h2>
            <p className="text-black text-base mb-4">
              Nous collectons plusieurs types d'informations pour fournir et améliorer notre service :
            </p>
            <ul className="flex flex-col gap-3 text-base text-black">
              <li>• <strong>Informations d'identification</strong> : Nom de votre entreprise, forme juridique, numéro d'immatriculation, ICE</li>
              <li>• <strong>Coordonnées</strong> : Adresse email, numéro de téléphone, adresse physique</li>
              <li>• <strong>Informations de compte</strong> : Nom d'utilisateur, mot de passe (stocké de manière sécurisée)</li>
              <li>• <strong>Données de transaction</strong> : Historique des échanges, offres publiées, demandes</li>
              <li>• <strong>Données techniques</strong> : Adresse IP, type de navigateur, pages visitées, durée de visite</li>
            </ul>
          </div>

          {/* 2 */}
          <div>
            <h2 className="text-xl font-bold text-[#0D3B66] pb-3 border-b border-gray-200 mb-5">
              2. Comment nous utilisons vos données
            </h2>
            <p className="text-black text-base mb-4">Vos données sont utilisées pour :</p>
            <ul className="flex flex-col gap-3 text-base text-black">
              <li>• Fournir et maintenir notre service</li>
              <li>• Faciliter les échanges entre entreprises</li>
              <li>• Améliorer et personnaliser votre expérience</li>
              <li>• Communiquer avec vous (support, mises à jour)</li>
              <li>• Détecter et prévenir les fraudes</li>
              <li>• Respecter nos obligations légales</li>
            </ul>
          </div>

          {/* 3 */}
          <div>
            <h2 className="text-xl font-bold text-[#0D3B66] pb-3 border-b border-gray-200 mb-5">
              3. Partage des données
            </h2>
            <p className="text-black text-base mb-4">
              Nous ne vendons pas vos données. Elles peuvent être partagées avec :
            </p>
            <ul className="flex flex-col gap-3 text-base text-black">
              <li>• Autres utilisateurs dans le cadre des échanges (avec votre consentement)</li>
              <li>• Prestataires de services qui nous aident à faire fonctionner la plateforme</li>
              <li>• Autorités légales si requis par la loi</li>
            </ul>
          </div>

          {/* 4 */}
          <div>
            <h2 className="text-xl font-bold text-[#0D3B66] pb-3 border-b border-gray-200 mb-5">
              4. Sécurité des données
            </h2>
            <p className="text-black text-base mb-4">
              Nous mettons en œuvre des mesures de sécurité robustes incluant :
            </p>
            <ul className="flex flex-col gap-3 text-base text-black">
              <li>• Chiffrement des données (SSL/TLS)</li>
              <li>• Contrôles d'accès stricts</li>
              <li>• Audits de sécurité réguliers</li>
              <li>• Formation de notre personnel</li>
            </ul>
          </div>

          {/* 5 */}
          <div>
            <h2 className="text-xl font-bold text-[#0D3B66] pb-3 border-b border-gray-200 mb-5">
              5. Vos droits
            </h2>
            <p className="text-black text-base mb-4">
              Conformément à la loi marocaine 09-08, vous avez le droit de :
            </p>
            <ul className="flex flex-col gap-3 text-base text-black">
              <li>• Accéder à vos données personnelles</li>
              <li>• Demander leur rectification</li>
              <li>• Vous opposer à leur traitement</li>
              <li>• Demander leur suppression</li>
              <li>• Limiter leur traitement</li>
              <li>• Demander la portabilité de vos données</li>
            </ul>
            <p className="text-black text-base mt-5">
              Pour exercer ces droits, contactez-nous à{" "}
              <a href="mailto:contact@moubadala.ma" className="text-[#0D3B66] underline">
                contact@moubadala.ma
              </a>
            </p>
          </div>

          {/* 6 */}
          <div>
            <h2 className="text-xl font-bold text-[#0D3B66] pb-3 border-b border-gray-200 mb-5">
              6. Conservation des données
            </h2>
            <p className="text-black text-base mb-4">Nous conservons vos données :</p>
            <ul className="flex flex-col gap-3 text-base text-black">
              <li>• Tant que votre compte est actif</li>
              <li>• Pendant 3 ans après la désactivation du compte (sauf obligation légale nécessitant une durée plus longue)</li>
              <li>• Les données anonymisées peuvent être conservées indéfiniment à des fins statistiques</li>
            </ul>
          </div>

          {/* 7 */}
          <div>
            <h2 className="text-xl font-bold text-[#0D3B66] pb-3 border-b border-gray-200 mb-5">
              7. Cookies et technologies similaires
            </h2>
            <p className="text-black text-base mb-4">Nous utilisons des cookies pour :</p>
            <ul className="flex flex-col gap-3 text-base text-black">
              <li>• Fonctionnement essentiel du site</li>
              <li>• Analyse d'audience</li>
              <li>• Amélioration de l'expérience utilisateur</li>
            </ul>
            <p className="text-black text-base mt-5">
              Vous pouvez contrôler les cookies via les paramètres de votre navigateur.
            </p>
          </div>

          {/* 8 */}
          <div>
            <h2 className="text-xl font-bold text-[#0D3B66] pb-3 border-b border-gray-200 mb-5">
              8. Modifications de cette politique
            </h2>
            <p className="text-black text-base leading-relaxed">
              Nous pouvons mettre à jour cette politique occasionnellement. Nous vous informerons
              des changements significatifs par email ou via notre plateforme.
            </p>
          </div>

          {/* 9 */}
          <div>
            <h2 className="text-xl font-bold text-[#0D3B66] pb-3 border-b border-gray-200 mb-5">
              9. Nous contacter
            </h2>
            <p className="text-black text-base mb-5">
              Pour toute question concernant cette politique :
            </p>
            <div className="flex flex-col gap-3 text-base text-black">
              <p>
                Email :{" "}
                <a href="mailto:contact@moubadala.ma" className="text-[#0D3B66] underline">
                  contact@moubadala.ma
                </a>
              </p>
              <p>Gsm : +212(6)601 840 707</p>
              <p>Adresse : 45 Rue Abdelkader Mouftakar, 2ème étage Appart 4, Centre Ville, Casablanca, Maroc</p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}