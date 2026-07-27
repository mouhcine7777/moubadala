/**
 * Conditions Contractuelles Générales — "constitution" applicable à tout contrat
 * d'échange conclu sur Moubadala (Chapitre I du cahier des charges DCFT-MBD-V1.0).
 *
 * Articles 4 à 15 reprennent le texte du modèle de contrat d'échange fourni par le
 * propriétaire de la plateforme (droit marocain — Code des Obligations et Contrats,
 * Tribunal de commerce de Casablanca), adapté sur deux points :
 *  - les clauses propres à un échange donné (objet précis, durée exacte) ne sont pas
 *    dupliquées ici : elles sont déjà générées dynamiquement dans les Conditions
 *    Particulières (Chapitres II, III et V du PDF) à partir des données du contrat ;
 *  - les références à un échange de bons de livraison papier envoyés à Moubadala ont
 *    été remplacées par le mécanisme réel de déclaration/validation numérique déjà
 *    en place (Chapitre VIII / suivi d'exécution).
 * Articles 1 à 3 sont propres au fonctionnement de la plateforme (rôle d'intermédiaire,
 * formation du contrat par signature électronique) et ne figuraient pas dans ce modèle.
 */
export const CGU_CONTRACT_VERSION = 'v1'

export const CGU_CONTRACT_ARTICLES: { title: string; body: string[] }[] = [
  {
    title: 'Article 1 — Objet des présentes Conditions Générales',
    body: [
      "Les présentes Conditions Contractuelles Générales (« CCG ») ont pour objet de définir le cadre juridique commun applicable à tout contrat d'échange (« Contrat ») conclu entre deux entreprises membres (les « Parties ») par l'intermédiaire de la plateforme Moubadala.",
      "Elles s'appliquent identiquement à tous les Contrats conclus sur la plateforme, indépendamment de leur objet, et sont complétées pour chaque Contrat par des Conditions Particulières propres à l'échange concerné.",
    ],
  },
  {
    title: 'Article 2 — Rôle de Moubadala',
    body: [
      "Moubadala agit exclusivement en qualité d'intermédiaire technique facilitant la rencontre, la négociation et la formalisation de l'échange entre les Parties.",
      "Moubadala n'est en aucun cas partie au Contrat d'échange conclu entre les Parties et n'assume aucune responsabilité quant à la bonne exécution des engagements réciproques des Parties.",
    ],
  },
  {
    title: 'Article 3 — Formation du Contrat',
    body: [
      "Le Contrat est réputé formé dès lors que les deux Parties ont, par voie électronique, signé la Fiche Contractuelle générée par l'Assistant Intelligent de Contractualisation de la plateforme.",
      "La date et l'heure de chaque signature électronique font foi entre les Parties et sont enregistrées automatiquement par la plateforme.",
    ],
  },
  {
    title: 'Article 4 — Équilibre économique et valorisation des prestations',
    body: [
      "Chaque prestation échangée dans le cadre du présent Contrat est évaluée à titre indicatif en dirhams marocains, pour des raisons comptables et fiscales.",
      "Les Parties reconnaissent que la valeur estimée de leurs prestations respectives, telle qu'indiquée dans les Conditions Particulières, est équitable et que la compensation s'effectue par échange de prestations, sans mouvement de fonds — sauf différence de valeur donnant lieu à la compensation monétaire éventuellement prévue par les Conditions Particulières.",
      "Les factures émises par chaque Partie au titre de sa prestation porteront obligatoirement la mention : « Valeur compensée par échange ».",
    ],
  },
  {
    title: 'Article 5 — Modalités de mise en œuvre',
    body: [
      "Les Parties conviennent des délais de réalisation ou de livraison des prestations, des lieux d'exécution et des standards de qualité applicables, tels que précisés dans les Conditions Particulières.",
      "Chaque prestation réalisée fait l'objet d'une déclaration par la Partie qui l'a exécutée puis d'une validation par l'autre Partie, directement sur la plateforme Moubadala, dans les conditions décrites au module de suivi d'exécution du Contrat.",
    ],
  },
  {
    title: 'Article 6 — Obligations des Parties',
    body: [
      "Chaque Partie s'engage à exécuter les prestations mises à sa charge conformément au présent Contrat, avec le soin et la vigilance requis dans sa profession, et à respecter les standards de qualité convenus.",
      "Les Parties s'engagent à coopérer activement, à se communiquer toute information utile à la bonne exécution de l'échange et à s'informer mutuellement de toute difficulté susceptible d'affecter cette exécution.",
    ],
  },
  {
    title: 'Article 7 — Durée',
    body: [
      "Le présent Contrat entre en vigueur à la date de la signature électronique de la seconde Partie et prend fin à la complète exécution des obligations réciproques des Parties, selon le calendrier fixé aux Conditions Particulières.",
    ],
  },
  {
    title: 'Article 8 — Facturation et aspects fiscaux',
    body: [
      "Conformément à la réglementation fiscale en vigueur, chaque Partie émet une facture correspondant à la prestation accomplie au profit de l'autre Partie, portant la mention « Valeur compensée par échange ».",
      "Chaque Partie demeure seule responsable de la déclaration fiscale de ses opérations, notamment au titre de la Taxe sur la Valeur Ajoutée (TVA), selon le régime qui lui est applicable.",
      "Aucune somme d'argent n'est échangée au titre de la compensation visée par le présent Contrat, sauf différence de valeur entre les prestations, laquelle donne lieu, le cas échéant, à un solde des comptes réciproques selon les modalités fixées aux Conditions Particulières.",
    ],
  },
  {
    title: 'Article 9 — Non-exclusivité',
    body: [
      "Le présent Contrat ne confère aucune exclusivité entre les Parties. Chacune demeure libre de conclure des accords similaires avec d'autres membres de Moubadala ou avec des tiers.",
    ],
  },
  {
    title: 'Article 10 — Responsabilité',
    body: [
      "Chaque Partie est responsable des dommages directs résultant d'un manquement à ses obligations au titre du présent Contrat.",
      "Aucune Partie ne pourra être tenue responsable des retards ou inexécutions dus à un cas de force majeure, au sens de l'article 269 du Code des Obligations et Contrats marocain.",
    ],
  },
  {
    title: 'Article 11 — Confidentialité',
    body: [
      "Sauf stipulation contraire des Conditions Particulières, les Parties s'engagent à maintenir confidentielle toute information technique, commerciale ou financière obtenue dans le cadre de l'exécution du présent Contrat, pendant sa durée et après son expiration.",
    ],
  },
  {
    title: 'Article 12 — Résiliation',
    body: [
      "En cas d'inexécution grave d'une obligation essentielle par l'une des Parties, le présent Contrat pourra être résilié de plein droit, après mise en demeure restée sans effet pendant huit (8) jours.",
      "La Partie non défaillante s'efforce, avant tout recours contentieux, de rechercher une réparation amiable du préjudice subi, y compris par l'intermédiaire de la messagerie contractuelle mise à disposition sur la plateforme.",
    ],
  },
  {
    title: 'Article 13 — Loi applicable et juridiction compétente',
    body: [
      "Le présent Contrat est régi par le droit marocain. Tout litige relatif à son interprétation ou à son exécution relève de la compétence exclusive du Tribunal de commerce de Casablanca, sauf accord contraire écrit entre les Parties.",
    ],
  },
  {
    title: 'Article 14 — Notifications',
    body: [
      "Toute notification entre les Parties devra être adressée par écrit, par courrier recommandé ou par tout moyen électronique donnant date certaine, aux coordonnées renseignées dans les Conditions Particulières du présent Contrat.",
    ],
  },
  {
    title: 'Article 15 — Intégralité du contrat',
    body: [
      "Le présent Contrat, comprenant les présentes Conditions Contractuelles Générales et les Conditions Particulières qui lui sont annexées, exprime l'intégralité de l'accord entre les Parties et remplace tout accord antérieur, verbal ou écrit, ayant le même objet.",
    ],
  },
]
