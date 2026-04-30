"use client";
import { useState } from "react";
import { Mail, ArrowRight, Building2, Phone } from "lucide-react";

const categories = [
  "Problème technique",
  "Question sur une transaction",
  "Bug à signaler",
  "Suggestion d'amélioration",
  "Question sur mon compte",
  "Autre",
];

export default function FeedbackPage() {
  const [form, setForm] = useState({
    email: "",
    sujet: "",
    message: "",
  });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: connect to Resend API
    setSent(true);
  };

  return (
    <>
      {/* Main section */}
      <section className="bg-white py-14 px-6">
        <div className="max-w-7xl mx-auto">

          {/* Title */}
          <h1 className="text-4xl font-bold text-[#0D3B66] mb-4">
            Support & Feedback
          </h1>
          <p className="text-[#0D3B66] font-semibold text-base leading-relaxed mb-12">
            Votre feedback est une véritable contribution à la construction et l'amélioration de Moubadala.ma,<br />
            Nous serons ravis de vous lire.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">

            {/* Left — info */}
            <div className="flex flex-col justify-center gap-6 pt-4">
              <div>
                <h2 className="text-lg font-bold text-[#0D3B66] mb-2">
                  Demander au Support ?
                </h2>
                <p className="text-[#0D3B66] text-sm leading-relaxed">
                  Un problème technique, une question sur une transaction,<br />
                  un bug à signaler ? Notre équipe est là pour vous aider.
                </p>
              </div>

              {/* Social icons */}
              <div className="flex items-center gap-3">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:text-[#0D3B66] hover:border-[#0D3B66] transition-colors text-sm font-bold"
                >
                  f
                </a>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:text-[#0D3B66] hover:border-[#0D3B66] transition-colors text-sm font-bold"
                >
                  in
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:text-[#0D3B66] hover:border-[#0D3B66] transition-colors text-sm font-bold"
                >
                  ig
                </a>
              </div>
            </div>

            {/* Right — form */}
            <div className="border border-gray-200 rounded-xl p-8 shadow-sm">
              {sent ? (
                <div className="text-center py-10">
                  <div className="w-14 h-14 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-4">
                    <Mail size={24} className="text-green-600" />
                  </div>
                  <p className="text-green-700 font-semibold text-sm">
                    Demande envoyée avec succès !
                  </p>
                  <p className="text-gray-400 text-xs mt-1">
                    Notre équipe vous répondra rapidement.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-5">

                  {/* Email */}
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                      Votre adresse e-mail*
                    </label>
                    <div className="flex items-center gap-3 border border-gray-200 rounded-lg px-4 py-3 focus-within:border-[#0D3B66] transition-colors">
                      <Mail size={16} className="text-black-300 shrink-0" />
                      <input
                        type="email"
                        placeholder="Email *"
                        required
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        className="flex-1 text-sm text-black-700 placeholder-black-300 outline-none bg-transparent"
                      />
                    </div>
                  </div>

                  {/* Sujet */}
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                      Sujet de votre demande*
                    </label>
                    <select
                      required
                      value={form.sujet}
                      onChange={(e) => setForm({ ...form, sujet: e.target.value })}
                      className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-500 outline-none focus:border-[#0D3B66] transition-colors bg-white"
                    >
                      <option value="" disabled>
                        Veuillez choisir une catégorie...
                      </option>
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                      Votre message*
                    </label>
                    <textarea
                      placeholder="Décrivez votre problème le plus précisément possible..."
                      required
                      rows={6}
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm text-black-700 placeholder-black-300 outline-none focus:border-[#0D3B66] transition-colors resize-none"
                    />
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 bg-[#0D3B66] hover:bg-[#0a2f55] text-white font-semibold text-sm px-8 py-4 rounded-lg transition-colors"
                  >
                    Envoyer la demande
                    <ArrowRight size={16} />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Contact info cards */}
      <section className="bg-white py-14 px-6 border-t border-gray-100">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center">

          {/* Nos Bureaux */}
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
              <Building2 size={24} className="text-[#0D3B66]" />
            </div>
            <h3 className="font-bold text-[#0D3B66] text-lg">Nos Bureaux</h3>
            <p className="text-gray-500 text-sm">
              45 Rue Abdelkader Mouftakar, Casablanca
            </p>
          </div>

          {/* Ecrivez-nous */}
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
              <Mail size={24} className="text-[#0D3B66]" />
            </div>
            <h3 className="font-bold text-[#0D3B66] text-lg">Ecrivez-nous</h3>
            <div className="flex flex-col gap-1">
              <a href="mailto:mgh.plateformes@gmail.com" className="text-gray-500 text-sm hover:text-[#0D3B66] transition-colors">
                mgh.plateformes@gmail.com
              </a>
              <a href="mailto:contact@moubadala.ma" className="text-gray-500 text-sm hover:text-[#0D3B66] transition-colors">
                contact@moubadala.ma
              </a>
            </div>
          </div>

          {/* Appelez-Nous */}
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
              <Phone size={24} className="text-[#0D3B66]" />
            </div>
            <h3 className="font-bold text-[#0D3B66] text-lg">Appelez-Nous</h3>
            <div className="flex flex-col gap-1">
              <a href="tel:+212601840707" className="text-gray-500 text-sm hover:text-[#0D3B66] transition-colors">
                212 (0)601 840 707
              </a>
              <a href="tel:+212675882884" className="text-gray-500 text-sm hover:text-[#0D3B66] transition-colors">
                212 (0)675 882 884
              </a>
            </div>
          </div>

        </div>
      </section>
    </>
  );
}