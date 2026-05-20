'use client'
import { useState } from 'react'
import TawkProvider from '../../components/TawkProvider'
import {
  ArrowRight, MessageCircle,
  FileText, User, AlertTriangle, Handshake,
  Wrench, Lightbulb, ArrowLeftRight
} from 'lucide-react'

declare global {
  interface Window { Tawk_API?: any }
}

const CATEGORIES = [
  {
    value: 'echange',
    label: 'Assistance échange',
    icon: <ArrowLeftRight size={24} className="text-blue-600" />,
    bg: 'bg-blue-50',
    description: "Problème lors d'une transaction ou d'un échange",
  },
  {
    value: 'facturation',
    label: 'Facturation',
    icon: <FileText size={24} className="text-amber-600" />,
    bg: 'bg-amber-50',
    description: 'Facture compensée, TVA, questions comptables',
  },
  {
    value: 'compte',
    label: 'Compte utilisateur',
    icon: <User size={24} className="text-purple-600" />,
    bg: 'bg-purple-50',
    description: 'Mot de passe, accès, paramètres du compte',
  },
  {
    value: 'litige',
    label: 'Litige',
    icon: <AlertTriangle size={24} className="text-red-600" />,
    bg: 'bg-red-50',
    description: "Partenaire ne respecte pas l'accord",
  },
  {
    value: 'commercial',
    label: 'Demande commerciale',
    icon: <Handshake size={24} className="text-green-600" />,
    bg: 'bg-green-50',
    description: 'Partenariat, publicité, offres spéciales',
  },
  {
    value: 'technique',
    label: 'Support technique',
    icon: <Wrench size={24} className="text-gray-600" />,
    bg: 'bg-gray-100',
    description: "Bug sur le site, problème d'affichage",
  },
  {
    value: 'suggestion',
    label: 'Suggestions',
    icon: <Lightbulb size={24} className="text-yellow-600" />,
    bg: 'bg-yellow-50',
    description: 'Amélioration de la plateforme',
  },
]

const PRIORITIES = [
  { value: 'low',    label: 'Faible',  color: 'text-green-600 bg-green-50 border-green-200' },
  { value: 'medium', label: 'Normale', color: 'text-amber-600 bg-amber-50 border-amber-200' },
  { value: 'high',   label: 'Urgente', color: 'text-red-600 bg-red-50 border-red-200'       },
]

export default function SupportPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [priority, setPriority] = useState('medium')
  const [form, setForm] = useState({ nom: '', email: '', sujet: '', message: '' })
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  const categoryObj = CATEGORIES.find(c => c.value === selectedCategory)

  function openChat() {
    window.Tawk_API?.maximize?.()
  }

  function prefillChat() {
    window.Tawk_API?.setAttributes?.({
      name:  form.nom,
      email: form.email,
    }, () => {})
    openChat()
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!selectedCategory) return
    setLoading(true)
    try {
      await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          sujet: `[${categoryObj?.label}] [${PRIORITIES.find(p => p.value === priority)?.label}] ${form.sujet}`,
          categorie: selectedCategory,
          priorite: priority,
        }),
      })
      setSent(true)
    } catch {
      alert("Erreur lors de l'envoi. Réessayez.")
    }
    setLoading(false)
  }

  return (
    <>
      {/* Tawk loaded ONLY on this page */}
      <TawkProvider />

      {/* Hero */}
      <section className="bg-[#0D3B66] py-20 px-4 sm:px-6 text-center text-white">
        <h1 className="text-4xl sm:text-5xl font-bold mb-4">Centre de Support</h1>
        <p className="text-white/80 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed">
          Notre équipe est disponible pour vous aider. Choisissez votre mode de contact.
        </p>
      </section>

      {/* Contact options */}
      <section className="bg-gray-50 py-12 px-4 sm:px-6 border-b border-gray-100">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-5">

          {/* Live chat */}
          <div className="bg-white rounded-xl border border-gray-200 p-8 flex flex-col gap-5">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-green-50 flex items-center justify-center shrink-0">
                <MessageCircle size={26} className="text-green-600" />
              </div>
              <div>
                <p className="font-bold text-[#0D3B66] text-lg">Chat en direct</p>
                <p className="text-base text-black">Réponse immédiate</p>
              </div>
              <span className="ml-auto flex items-center gap-2 text-sm font-semibold text-green-600 bg-green-50 px-3 py-1.5 rounded-full">
                <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
                En ligne
              </span>
            </div>
            <p className="text-base text-black leading-relaxed">
              Discutez en temps réel avec notre équipe. Idéal pour les questions rapides.
            </p>
            <button
              onClick={openChat}
              className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold text-base px-6 py-4 rounded-lg transition-colors"
            >
              <MessageCircle size={18} /> Démarrer le chat
            </button>
          </div>

          {/* Ticket */}
          <div className="bg-white rounded-xl border border-gray-200 p-8 flex flex-col gap-5">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                <FileText size={26} className="text-[#0D3B66]" />
              </div>
              <div>
                <p className="font-bold text-[#0D3B66] text-lg">Ticket de support</p>
                <p className="text-base text-black">Réponse sous 24h</p>
              </div>
            </div>
            <p className="text-base text-black leading-relaxed">
              Soumettez un ticket détaillé. Idéal pour les litiges, factures et demandes complexes.
            </p>
            <a
              href="#ticket-form"
              className="flex items-center justify-center gap-2 bg-[#0D3B66] hover:bg-[#0a2f52] text-white font-semibold text-base px-6 py-4 rounded-lg transition-colors"
            >
              <FileText size={18} /> Créer un ticket
            </a>
          </div>
        </div>
      </section>

      {/* Ticket form */}
      <section id="ticket-form" className="bg-white py-16 px-4 sm:px-6 pb-24">
        <div className="max-w-7xl mx-auto">

          <h2 className="text-3xl sm:text-4xl font-bold text-[#0D3B66] mb-3">Créer un ticket</h2>
          <p className="text-black text-lg mb-12">
            Décrivez votre problème en détail. Notre équipe vous répondra par email sous 24h.
          </p>

          {sent ? (
            <div className="bg-green-50 border border-green-200 rounded-xl p-12 text-center flex flex-col items-center gap-5">
              <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
                <FileText size={34} className="text-green-600" />
              </div>
              <p className="text-green-700 font-bold text-2xl">Ticket envoyé avec succès !</p>
              <p className="text-black text-lg">Notre équipe vous répondra dans les 24 heures.</p>
              <button
                onClick={() => {
                  setSent(false)
                  setSelectedCategory(null)
                  setForm({ nom: '', email: '', sujet: '', message: '' })
                }}
                className="text-base text-[#0D3B66] underline underline-offset-2 mt-2"
              >
                Créer un autre ticket
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-10">

              {/* Step 1 — Catégorie */}
              <div>
                <p className="text-lg font-bold text-[#0D3B66] mb-5">
                  1. Choisissez une catégorie *
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {CATEGORIES.map(cat => (
                    <button
                      key={cat.value}
                      type="button"
                      onClick={() => setSelectedCategory(cat.value)}
                      className={`flex items-start gap-4 p-5 rounded-xl border-2 text-left transition-all ${
                        selectedCategory === cat.value
                          ? 'border-[#0D3B66] bg-[#EEF3F8]'
                          : 'border-gray-100 hover:border-gray-200 bg-white'
                      }`}
                    >
                      <div className={`w-12 h-12 rounded-lg ${cat.bg} flex items-center justify-center shrink-0`}>
                        {cat.icon}
                      </div>
                      <div>
                        <p className="text-base font-bold text-[#0D3B66]">{cat.label}</p>
                        <p className="text-sm text-black mt-1 leading-relaxed">{cat.description}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 2 — Priorité */}
              <div>
                <p className="text-lg font-bold text-[#0D3B66] mb-5">2. Priorité *</p>
                <div className="flex flex-wrap gap-4">
                  {PRIORITIES.map(p => (
                    <button
                      key={p.value}
                      type="button"
                      onClick={() => setPriority(p.value)}
                      className={`px-7 py-3 rounded-lg border-2 text-base font-semibold transition-all ${
                        priority === p.value
                          ? p.color + ' border-current'
                          : 'border-gray-200 text-black bg-white hover:border-gray-300'
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 3 — Infos */}
              <div>
                <p className="text-lg font-bold text-[#0D3B66] mb-5">3. Vos informations *</p>
                <div className="flex flex-col gap-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="flex flex-col gap-2">
                      <label className="text-base font-semibold text-black">Nom complet *</label>
                      <input
                        type="text"
                        required
                        placeholder="Votre nom"
                        value={form.nom}
                        onChange={e => setForm({ ...form, nom: e.target.value })}
                        className="border border-gray-200 rounded-lg px-4 py-4 text-base text-black focus:outline-none focus:ring-2 focus:ring-[#0D3B66]/20 focus:border-[#0D3B66]"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-base font-semibold text-black">Email *</label>
                      <input
                        type="email"
                        required
                        placeholder="votre@email.com"
                        value={form.email}
                        onChange={e => setForm({ ...form, email: e.target.value })}
                        className="border border-gray-200 rounded-lg px-4 py-4 text-base text-black focus:outline-none focus:ring-2 focus:ring-[#0D3B66]/20 focus:border-[#0D3B66]"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-base font-semibold text-black">Sujet *</label>
                    <input
                      type="text"
                      required
                      placeholder="Résumez votre demande en une ligne"
                      value={form.sujet}
                      onChange={e => setForm({ ...form, sujet: e.target.value })}
                      className="border border-gray-200 rounded-lg px-4 py-4 text-base text-black focus:outline-none focus:ring-2 focus:ring-[#0D3B66]/20 focus:border-[#0D3B66]"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-base font-semibold text-black">Description *</label>
                    <textarea
                      required
                      rows={7}
                      placeholder="Décrivez votre problème en détail : contexte, étapes, ce que vous attendiez..."
                      value={form.message}
                      onChange={e => setForm({ ...form, message: e.target.value })}
                      className="border border-gray-200 rounded-lg px-4 py-4 text-base text-black focus:outline-none focus:ring-2 focus:ring-[#0D3B66]/20 focus:border-[#0D3B66] resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* Submit */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 pt-2">
                <button
                  type="submit"
                  disabled={loading || !selectedCategory}
                  className="flex items-center gap-2 bg-[#F5A623] hover:bg-[#e09510] disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-lg px-10 py-5 rounded-lg transition-colors"
                >
                  {loading ? 'Envoi en cours...' : 'Envoyer le ticket'}
                  {!loading && <ArrowRight size={20} />}
                </button>
                <button
                  type="button"
                  onClick={prefillChat}
                  className="flex items-center gap-2 text-lg text-[#0D3B66] font-medium hover:underline underline-offset-2"
                >
                  <MessageCircle size={18} />
                  Préférez-vous chatter en direct ?
                </button>
              </div>

              {!selectedCategory && (
                <p className="text-base text-red-500 -mt-4">
                  Veuillez sélectionner une catégorie avant d'envoyer.
                </p>
              )}

            </form>
          )}
        </div>
      </section>
    </>
  )
}