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
      <section className="bg-white py-16 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-start">

          {/* Left — info */}
          <div>
            <h1 className="text-4xl font-bold text-[#0D3B66] mb-6">
              Contactez-nous
            </h1>
            <span className="inline-block border border-gray-200 rounded-full px-4 py-1.5 text-xs text-gray-500 mb-6">
              Comment pouvons-nous vous aider?
            </span>
            <p className="text-gray-500 text-sm leading-relaxed mb-8">
              Une question, une demande d'information ou besoin d'assistance ?<br />
              Remplissez le formulaire ci-dessous et notre équipe vous répondra rapidement.
            </p>
            <div className="flex items-center gap-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"
                className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:text-[#0D3B66] hover:border-[#0D3B66] transition-colors text-sm font-bold">
                f
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer"
                className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:text-[#0D3B66] hover:border-[#0D3B66] transition-colors text-sm font-bold">
                in
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"
                className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:text-[#0D3B66] hover:border-[#0D3B66] transition-colors text-sm font-bold">
                ig
              </a>
            </div>
          </div>

          {/* Right — form */}
          <div className="border border-gray-200 rounded-xl p-8 shadow-sm">
            <h2 className="text-lg font-bold text-[#0D3B66] text-center mb-6">
              Envoyer un message
            </h2>

            {sent ? (
              <div className="text-center py-10">
                <div className="w-14 h-14 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-4">
                  <Mail size={24} className="text-green-600" />
                </div>
                <p className="text-green-700 font-semibold text-sm">
                  Message envoyé avec succès !
                </p>
                <p className="text-gray-400 text-xs mt-1">
                  Notre équipe vous répondra rapidement.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                {/* Nom */}
                <div className="flex items-center gap-3 border border-gray-200 rounded-lg px-4 py-3 focus-within:border-[#0D3B66] transition-colors">
                  <User size={16} className="text-gray-900 shrink-0" />
                  <input
                    type="text"
                    placeholder="Votre Nom*"
                    required
                    value={form.nom}
                    onChange={(e) => setForm({ ...form, nom: e.target.value })}
                    className="flex-1 text-sm text-black placeholder-black-300 outline-none bg-transparent"
                  />
                </div>

                {/* Email + Téléphone */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-3 border border-gray-200 rounded-lg px-4 py-3 focus-within:border-[#0D3B66] transition-colors">
                    <Mail size={16} className="text-gray-900 shrink-0" />
                    <input
                      type="email"
                      placeholder="Votre Email *"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="flex-1 text-sm text-black placeholder-black-300 outline-none bg-transparent min-w-0"
                    />
                  </div>
                  <div className="flex items-center gap-3 border border-gray-200 rounded-lg px-4 py-3 focus-within:border-[#0D3B66] transition-colors">
                    <Phone size={16} className="text-gray-900 shrink-0" />
                    <input
                      type="tel"
                      placeholder="Votre Téléphone"
                      value={form.telephone}
                      onChange={(e) => setForm({ ...form, telephone: e.target.value })}
                      className="flex-1 text-sm text-black placeholder-black-300 outline-none bg-transparent min-w-0"
                    />
                  </div>
                </div>

                {/* Sujet */}
                <div className="flex items-center gap-3 border border-gray-200 rounded-lg px-4 py-3 focus-within:border-[#0D3B66] transition-colors">
                  <MessageSquare size={16} className="text-gray-900 shrink-0" />
                  <input
                    type="text"
                    placeholder="Sujet *"
                    required
                    value={form.sujet}
                    onChange={(e) => setForm({ ...form, sujet: e.target.value })}
                    className="flex-1 text-sm text-black placeholder-black-300 outline-none bg-transparent"
                  />
                </div>

                {/* Message */}
                <div className="border border-gray-200 rounded-lg px-4 py-3 focus-within:border-[#0D3B66] transition-colors">
                  <textarea
                    placeholder="Message *"
                    required
                    rows={5}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="w-full text-sm text-gray-700 placeholder-black-300 outline-none bg-transparent resize-none"
                  />
                </div>

                {/* Error */}
                {error && (
                  <p className="text-red-500 text-xs text-center">{error}</p>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center justify-center gap-2 bg-[#F5A623] hover:bg-[#e09510] disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold text-sm px-8 py-3 rounded-lg transition-colors mx-auto"
                >
                  {loading ? "Envoi en cours..." : "Envoyer"}
                  {!loading && <ArrowRight size={16} />}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Contact info cards */}
      <section className="bg-gray-50 py-14 px-6 border-t border-gray-100">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center">

          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
              <Building2 size={24} className="text-[#0D3B66]" />
            </div>
            <h3 className="font-bold text-[#0D3B66] text-lg">Nos Bureaux</h3>
            <p className="text-gray-500 text-sm">45 Rue Abdelkader Mouftakar, Casablanca</p>
          </div>

          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
              <Mail size={24} className="text-[#0D3B66]" />
            </div>
            <h3 className="font-bold text-[#0D3B66] text-lg">Ecrivez-nous</h3>
            <div className="flex flex-col gap-1">
              <a href="mailto:mgh.plateformes@gmail.com" className="text-gray-500 text-sm hover:text-[#0D3B66] transition-colors">mgh.plateformes@gmail.com</a>
              <a href="mailto:contact@moubadala.ma" className="text-gray-500 text-sm hover:text-[#0D3B66] transition-colors">contact@moubadala.ma</a>
            </div>
          </div>

          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
              <Phone size={24} className="text-[#0D3B66]" />
            </div>
            <h3 className="font-bold text-[#0D3B66] text-lg">Appelez-Nous</h3>
            <div className="flex flex-col gap-1">
              <a href="tel:+212601840707" className="text-gray-500 text-sm hover:text-[#0D3B66] transition-colors">212 (0)601 840 707</a>
              <a href="tel:+212675882884" className="text-gray-500 text-sm hover:text-[#0D3B66] transition-colors">212 (0)675 882 884</a>
            </div>
          </div>

        </div>
      </section>
    </>
  );
}