"use client";
import { useState } from "react";
import { User, Mail, Phone, MessageSquare, ArrowRight, Building2 } from "lucide-react";

export default function ContactPage() {
  const [form, setForm] = useState({
    nom: "",
    email: "",
    telephone: "",
    sujet: "",
    message: "",
  });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        setError("Erreur lors de l'envoi. Veuillez réessayer.");
      } else {
        setSent(true);
      }
    } catch {
      setError("Impossible d'envoyer le message. Vérifiez votre connexion.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Main section */}
      <section className="bg-white py-20 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-14 items-start">

          {/* Left — info */}
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-[#0D3B66] mb-7">
              Contactez-nous
            </h1>
            <span className="inline-block border border-gray-200 rounded-full px-5 py-2 text-sm text-black mb-7">
              Comment pouvons-nous vous aider?
            </span>
            <p className="text-black text-base leading-relaxed mb-10">
              Une question, une demande d'information ou besoin d'assistance ?<br />
              Remplissez le formulaire ci-dessous et notre équipe vous répondra rapidement.
            </p>
            <div className="flex items-center gap-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"
                className="w-11 h-11 rounded-full border border-gray-200 flex items-center justify-center text-black hover:text-[#0D3B66] hover:border-[#0D3B66] transition-colors text-base font-bold">
                f
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer"
                className="w-11 h-11 rounded-full border border-gray-200 flex items-center justify-center text-black hover:text-[#0D3B66] hover:border-[#0D3B66] transition-colors text-base font-bold">
                in
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"
                className="w-11 h-11 rounded-full border border-gray-200 flex items-center justify-center text-black hover:text-[#0D3B66] hover:border-[#0D3B66] transition-colors text-base font-bold">
                ig
              </a>
            </div>
          </div>

          {/* Right — form */}
          <div className="border border-gray-200 rounded-xl p-10 shadow-sm">
            <h2 className="text-xl font-bold text-[#0D3B66] text-center mb-8">
              Envoyer un message
            </h2>

            {sent ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-5">
                  <Mail size={28} className="text-green-600" />
                </div>
                <p className="text-green-700 font-semibold text-base">
                  Message envoyé avec succès !
                </p>
                <p className="text-black text-sm mt-2">
                  Notre équipe vous répondra rapidement.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                {/* Nom */}
                <div className="flex items-center gap-3 border border-gray-200 rounded-lg px-4 py-4 focus-within:border-[#0D3B66] transition-colors">
                  <User size={18} className="text-gray-900 shrink-0" />
                  <input
                    type="text"
                    placeholder="Votre Nom*"
                    required
                    value={form.nom}
                    onChange={(e) => setForm({ ...form, nom: e.target.value })}
                    className="flex-1 text-base text-black placeholder-gray-400 outline-none bg-transparent"
                  />
                </div>

                {/* Email + Téléphone */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 border border-gray-200 rounded-lg px-4 py-4 focus-within:border-[#0D3B66] transition-colors">
                    <Mail size={18} className="text-gray-900 shrink-0" />
                    <input
                      type="email"
                      placeholder="Votre Email *"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="flex-1 text-base text-black placeholder-gray-400 outline-none bg-transparent min-w-0"
                    />
                  </div>
                  <div className="flex items-center gap-3 border border-gray-200 rounded-lg px-4 py-4 focus-within:border-[#0D3B66] transition-colors">
                    <Phone size={18} className="text-gray-900 shrink-0" />
                    <input
                      type="tel"
                      placeholder="Votre Téléphone"
                      value={form.telephone}
                      onChange={(e) => setForm({ ...form, telephone: e.target.value })}
                      className="flex-1 text-base text-black placeholder-gray-400 outline-none bg-transparent min-w-0"
                    />
                  </div>
                </div>

                {/* Sujet */}
                <div className="flex items-center gap-3 border border-gray-200 rounded-lg px-4 py-4 focus-within:border-[#0D3B66] transition-colors">
                  <MessageSquare size={18} className="text-gray-900 shrink-0" />
                  <input
                    type="text"
                    placeholder="Sujet *"
                    required
                    value={form.sujet}
                    onChange={(e) => setForm({ ...form, sujet: e.target.value })}
                    className="flex-1 text-base text-black placeholder-gray-400 outline-none bg-transparent"
                  />
                </div>

                {/* Message */}
                <div className="border border-gray-200 rounded-lg px-4 py-4 focus-within:border-[#0D3B66] transition-colors">
                  <textarea
                    placeholder="Message *"
                    required
                    rows={6}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="w-full text-base text-black placeholder-gray-400 outline-none bg-transparent resize-none"
                  />
                </div>

                {/* Error */}
                {error && (
                  <p className="text-red-500 text-sm text-center">{error}</p>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center justify-center gap-2 bg-[#F5A623] hover:bg-[#e09510] disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold text-base px-10 py-4 rounded-lg transition-colors mx-auto"
                >
                  {loading ? "Envoi en cours..." : "Envoyer"}
                  {!loading && <ArrowRight size={18} />}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Contact info cards */}
      <section className="bg-gray-50 py-16 px-6 border-t border-gray-100">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 text-center">

          <div className="flex flex-col items-center gap-5">
            <div className="w-18 h-18 rounded-full bg-gray-200 flex items-center justify-center p-5">
              <Building2 size={28} className="text-[#0D3B66]" />
            </div>
            <h3 className="font-bold text-[#0D3B66] text-xl">Nos Bureaux</h3>
            <p className="text-black text-base">45 Rue Abdelkader Mouftakar, Casablanca</p>
          </div>

          <div className="flex flex-col items-center gap-5">
            <div className="w-18 h-18 rounded-full bg-gray-200 flex items-center justify-center p-5">
              <Mail size={28} className="text-[#0D3B66]" />
            </div>
            <h3 className="font-bold text-[#0D3B66] text-xl">Ecrivez-nous</h3>
            <div className="flex flex-col gap-2">
              <a href="mailto:mgh.plateformes@gmail.com" className="text-black text-base hover:text-[#0D3B66] transition-colors">mgh.plateformes@gmail.com</a>
              <a href="mailto:contact@moubadala.ma" className="text-black text-base hover:text-[#0D3B66] transition-colors">contact@moubadala.ma</a>
            </div>
          </div>

          <div className="flex flex-col items-center gap-5">
            <div className="w-18 h-18 rounded-full bg-gray-200 flex items-center justify-center p-5">
              <Phone size={28} className="text-[#0D3B66]" />
            </div>
            <h3 className="font-bold text-[#0D3B66] text-xl">Appelez-Nous</h3>
            <div className="flex flex-col gap-2">
              <a href="tel:+212601840707" className="text-black text-base hover:text-[#0D3B66] transition-colors">212 (0)601 840 707</a>
              <a href="tel:+212675882884" className="text-black text-base hover:text-[#0D3B66] transition-colors">212 (0)675 882 884</a>
            </div>
          </div>

        </div>
      </section>
    </>
  );
}