export default function PolitiqueConfidentialitePage() {
    return (
      <section className="bg-white py-14 px-6">
        <div className="max-w-7xl mx-auto">
  
          {/* Title */}
          <h1 className="text-3xl font-bold text-[#0D3B66] text-center mb-10">
            Politique de Confidentialité
          </h1>
  
          {/* Last update */}
          <div className="inline-block border border-gray-200 rounded px-3 py-1 text-xs text-gray-500 mb-6">
            Dernière mise à jour : 01 avril 2026
          </div>
  
          {/* Intro */}
          <p className="text-gray-700 text-sm leading-relaxed font-semibold mb-4">
            Chez Moubadala, nous prenons la protection de vos données personnelles très au sérieux.
            Cette politique de confidentialité explique comment nous collectons, utilisons, partageons
            et protégeons vos informations lorsque vous utilisez notre plateforme d'échange inter-entreprises.
          </p>
  
          {/* Notice box */}
          <div className="bg-amber-50 border border-amber-200 rounded px-4 py-3 text-xs text-amber-800 mb-10">
            En utilisant notre service, vous acceptez les pratiques décrites dans cette politique.
            Si vous n'êtes pas d'accord avec ces termes, merci de nous en informer lors de votre demande d'inscription.
          </div>
  
          {/* Sections */}
          <div className="flex flex-col gap-10">
  
            {/* 1 */}
            <div>
              <h2 className="text-lg font-bold text-[#0D3B66] pb-3 border-b border-gray-200 mb-4">
                1. Données que nous collectons
              </h2>
              <p className="text-gray-600 text-sm mb-3">
                Nous collectons plusieurs types d'informations pour fournir et améliorer notre service :
              </p>
              <ul className="flex flex-col gap-2 text-sm text-gray-600">
                <li>• <strong>Informations d'identification</strong> : Nom de votre entreprise, forme juridique, numéro d'immatriculation, ICE</li>
                <li>• <strong>Coordonnées</strong> : Adresse email, numéro de téléphone, adresse physique</li>
                <li>• <strong>Informations de compte</strong> : Nom d'utilisateur, mot de passe (stocké de manière sécurisée)</li>
                <li>• <strong>Données de transaction</strong> : Historique des échanges, offres publiées, demandes</li>
                <li>• <strong>Données techniques</strong> : Adresse IP, type de navigateur, pages visitées, durée de visite</li>
              </ul>
            </div>
  
            {/* 2 */}
            <div>
              <h2 className="text-lg font-bold text-[#0D3B66] pb-3 border-b border-gray-200 mb-4">
                2. Comment nous utilisons vos données
              </h2>
              <p className="text-gray-600 text-sm mb-3">Vos données sont utilisées pour :</p>
              <ul className="flex flex-col gap-2 text-sm text-gray-600">
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
              <h2 className="text-lg font-bold text-[#0D3B66] pb-3 border-b border-gray-200 mb-4">
                3. Partage des données
              </h2>
              <p className="text-gray-600 text-sm mb-3">
                Nous ne vendons pas vos données. Elles peuvent être partagées avec :
              </p>
              <ul className="flex flex-col gap-2 text-sm text-gray-600">
                <li>• Autres utilisateurs dans le cadre des échanges (avec votre consentement)</li>
                <li>• Prestataires de services qui nous aident à faire fonctionner la plateforme</li>
                <li>• Autorités légales si requis par la loi</li>
              </ul>
            </div>
  
            {/* 4 */}
            <div>
              <h2 className="text-lg font-bold text-[#0D3B66] pb-3 border-b border-gray-200 mb-4">
                4. Sécurité des données
              </h2>
              <p className="text-gray-600 text-sm mb-3">
                Nous mettons en œuvre des mesures de sécurité robustes incluant :
              </p>
              <ul className="flex flex-col gap-2 text-sm text-gray-600">
                <li>• Chiffrement des données (SSL/TLS)</li>
                <li>• Contrôles d'accès stricts</li>
                <li>• Audits de sécurité réguliers</li>
                <li>• Formation de notre personnel</li>
              </ul>
            </div>
  
            {/* 5 */}
            <div>
              <h2 className="text-lg font-bold text-[#0D3B66] pb-3 border-b border-gray-200 mb-4">
                5. Vos droits
              </h2>
              <p className="text-gray-600 text-sm mb-3">
                Conformément à la loi marocaine 09-08, vous avez le droit de :
              </p>
              <ul className="flex flex-col gap-2 text-sm text-gray-600">
                <li>• Accéder à vos données personnelles</li>
                <li>• Demander leur rectification</li>
                <li>• Vous opposer à leur traitement</li>
                <li>• Demander leur suppression</li>
                <li>• Limiter leur traitement</li>
                <li>• Demander la portabilité de vos données</li>
              </ul>
              <p className="text-gray-600 text-sm mt-4">
                Pour exercer ces droits, contactez-nous à{" "}
                <a href="mailto:contact@moubadala.ma" className="text-[#0D3B66] underline">
                  contact@moubadala.ma
                </a>
              </p>
            </div>
  
            {/* 6 */}
            <div>
              <h2 className="text-lg font-bold text-[#0D3B66] pb-3 border-b border-gray-200 mb-4">
                6. Conservation des données
              </h2>
              <p className="text-gray-600 text-sm mb-3">Nous conservons vos données :</p>
              <ul className="flex flex-col gap-2 text-sm text-gray-600">
                <li>• Tant que votre compte est actif</li>
                <li>• Pendant 3 ans après la désactivation du compte (sauf obligation légale nécessitant une durée plus longue)</li>
                <li>• Les données anonymisées peuvent être conservées indéfiniment à des fins statistiques</li>
              </ul>
            </div>
  
            {/* 7 */}
            <div>
              <h2 className="text-lg font-bold text-[#0D3B66] pb-3 border-b border-gray-200 mb-4">
                7. Cookies et technologies similaires
              </h2>
              <p className="text-gray-600 text-sm mb-3">Nous utilisons des cookies pour :</p>
              <ul className="flex flex-col gap-2 text-sm text-gray-600">
                <li>• Fonctionnement essentiel du site</li>
                <li>• Analyse d'audience</li>
                <li>• Amélioration de l'expérience utilisateur</li>
              </ul>
              <p className="text-gray-600 text-sm mt-4">
                Vous pouvez contrôler les cookies via les paramètres de votre navigateur.
              </p>
            </div>
  
            {/* 8 */}
            <div>
              <h2 className="text-lg font-bold text-[#0D3B66] pb-3 border-b border-gray-200 mb-4">
                8. Modifications de cette politique
              </h2>
              <p className="text-gray-600 text-sm">
                Nous pouvons mettre à jour cette politique occasionnellement. Nous vous informerons
                des changements significatifs par email ou via notre plateforme.
              </p>
            </div>
  
            {/* 9 */}
            <div>
              <h2 className="text-lg font-bold text-[#0D3B66] pb-3 border-b border-gray-200 mb-4">
                9. Nous contacter
              </h2>
              <p className="text-gray-600 text-sm mb-4">
                Pour toute question concernant cette politique :
              </p>
              <div className="flex flex-col gap-2 text-sm text-gray-600">
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