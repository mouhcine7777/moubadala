import Image from "next/image";
import Link from "next/link";

export default function QuiSommesNousPage() {
  return (
    <>
      {/* Page title */}
      <section className="bg-white py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-[#0D3B66]">
            Qui sommes-nous ?
          </h1>
        </div>
      </section>

      {/* About section */}
      <section className="bg-white py-8 px-6">
        <div className="max-w-7xl mx-auto">

          {/* Two columns: image + text */}
          <div className="flex flex-col md:flex-row gap-10 mb-12">

            {/* Image */}
            <div className="md:w-2/5 shrink-0">
              <Image
                src="/about.jpg"
                alt="MGH Consulting bureau"
                width={480}
                height={320}
                className="w-full h-auto rounded-lg object-cover"
              />
            </div>

            {/* Text */}
            <div className="md:w-3/5 flex flex-col justify-center">
              <span className="inline-block border border-gray-300 text-gray-500 text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full mb-5 w-fit">
                A PROPOS DE MGH-CONSULTING
              </span>
              <h2 className="text-2xl md:text-3xl font-bold text-[#0D3B66] mb-5 leading-snug">
                L'ambition de contribuer<br />à votre croissance :
              </h2>
              <p className="text-gray-600 text-sm leading-relaxed">
                Bienvenue sur Moubadala.ma, La Plateforme des échanges inter-entreprises
                qui vous permet de réaliser des transactions de Troc sécurisées sans toucher
                à votre trésorerie. Avec Moubadala.ma, notre mission est de faciliter la
                connectivité et la visibilité des entreprises membres et travailler pour faire
                connaître leurs offres et demandes avec une mise en avant optimisée de leur
                Profil Entreprise
              </p>
            </div>
          </div>

          {/* Full width paragraphs */}
          <div className="flex flex-col gap-5">
            <p className="text-gray-700 text-sm leading-relaxed">
              MGH-Consulting éditrice de moubadala.ma a été fondée en 2021 avec une l'ambition
              de créer une plateforme qui simplifie la recherche des opportunités et la mise en
              relation avec les autres membres de la communauté Moubadala.
            </p>
            <p className="text-gray-700 text-sm leading-relaxed">
              Nous veillons à concrétiser cette vision en développant un site web complet et
              convivial, offrant des informations actualisées et pertinentes et encourageant le
              développement de relations basées sur le principe : gagnant – gagnant.
            </p>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="bg-white py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="border-l-4 border-[#0D3B66] pl-8 max-w-sm">
            <h3 className="text-2xl font-bold text-[#0D3B66] mb-4">
              Contactez-nous
            </h3>
            <p className="text-gray-500 text-sm leading-relaxed mb-6">
              Nous sommes toujours à votre disposition pour répondre
              à vos questions et recevoir vos suggestions et recommandations.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-[#0D3B66] hover:bg-[#0a2f55] text-white text-sm font-semibold px-5 py-3 rounded transition-colors"
            >
              Contact
              <span>→</span>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}